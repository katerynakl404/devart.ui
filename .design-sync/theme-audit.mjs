/**
 * Resolves globals.css's token graph in BOTH themes and checks two things the
 * build cannot: that state ladders stay monotonic with no two states collapsing
 * onto one value, and that contrast holds. "Good colours" is only checkable as
 * contrast - WCAG 2.1 asks 4.5:1 for body text and 3:1 for large text and for
 * UI boundaries that carry meaning.
 *
 * Run after any token edit:  node .design-sync/theme-audit.mjs
 */
import fs from 'node:fs';

const css = fs.readFileSync('globals.css', 'utf8');
const block = (sel) => {
  const i = css.indexOf(sel + ' {');
  const body = css.slice(i, css.indexOf('\n}', i));
  const map = new Map();
  for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) map.set(m[1], m[2].trim());
  return map;
};
const ROOT = block(':root'), DARK = block('.dark');

const hsl2rgb = (h, s, l) => {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const t = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][Math.floor(h / 60) % 6];
  return t.map((v) => (v + m) * 255);
};

function resolve(name, theme, depth = 0) {
  if (depth > 12) return null;
  const raw = (theme === 'dark' && DARK.get(name)) || ROOT.get(name);
  if (!raw) return null;
  const v = raw.replace(/\s+/g, ' ').trim();
  let c = raw.replace(/\s+/g, '');
  // A wash carries its strength as a token, not a literal, and since the state
  // overlays there are TWO hops: --step-* (per theme — dark needs a larger
  // percentage to move the same distance against a darker base) which in turn
  // names a --tint-* step (theme-independent). Substitute repeatedly until the
  // strength is a literal, or the whole color-mix reads as unresolved — which
  // on this report looks exactly like a missing token.
  for (let i = 0; i < 4 && /var\((--(?:tint|step)-[\w-]+)\)/.test(c); i++) {
    c = c.replace(/var\((--(?:tint|step)-[\w-]+)\)/g, (_, t) =>
      ((theme === 'dark' && DARK.get(t)) || ROOT.get(t) || '').replace(/\s+/g, '')
    );
  }
  let m;
  if ((m = /^var\((--[\w-]+)\)$/.exec(c))) return resolve(m[1], theme, depth + 1);
  if ((m = /^color-mix\(insrgb,hsl\(var\((--[\w-]+)\)\)([\d.]+)%,transparent\)$/.exec(c))) {
    const base = resolve(m[1], theme, depth + 1);
    return base && { rgb: base.rgb, a: (+m[2] / 100) * base.a };
  }
  if ((m = /^color-mix\(insrgb,hsl\(var\((--[\w-]+)\)\)([\d.]+)%,hsl\(var\((--[\w-]+)\)\)\)$/.exec(c))) {
    const A = resolve(m[1], theme, depth + 1), B = resolve(m[3], theme, depth + 1), p = +m[2] / 100;
    return A && B && { rgb: A.rgb.map((x, i) => p * x + (1 - p) * B.rgb[i]), a: 1 };
  }
  if ((m = /^([\d.]+) ([\d.]+)% ([\d.]+)%$/.exec(v))) return { rgb: hsl2rgb(+m[1], +m[2], +m[3]), a: 1 };
  return null;
}

const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const Y = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const Lstar = (y) => (y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y);
const flat = (c, bg) => (c.a >= 1 ? c.rgb : c.rgb.map((v, i) => c.a * v + (1 - c.a) * bg[i]));
const step = (c, bg) => +Math.abs(Lstar(Y(flat(c, bg))) - Lstar(Y(bg))).toFixed(2);
// Full colour difference (CIE76 over Lab). Lightness alone under-reads a red: a
// red wash moves the ground mostly in hue, so dL* called 4% enough on light
// while the eye saw it faint (2026-11-10).
const lab = (rgb) => {
  const [r, g, b] = rgb.map(lin);
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const X = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047), Yl = f(0.2126 * r + 0.7152 * g + 0.0722 * b), Z = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
  return [116 * Yl - 16, 500 * (X - Yl), 200 * (Yl - Z)];
};
const dE = (c, bg) => { const p = lab(flat(c, bg)), q = lab(bg); return +Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]).toFixed(2); };
const ratio = (fg, bgRgb) => {
  const a = Y(flat(fg, bgRgb)), b = Y(bgRgb);
  const hi = Math.max(a, b), lo = Math.min(a, b);
  return +((hi + 0.05) / (lo + 0.05)).toFixed(2);
};

const LADDERS = [
  // 'selected + hover' is gone with its token: a selected row now keeps its own
  // surface under the pointer, and the control on it composites on top.
  { name: 'Table row states', bg: '--surface-card',
    steps: [['hover', '--tbl-row-hover'], ['selected / pressed', '--tbl-row-pressed']] },
  { name: 'Neutral control states', bg: '--surface-card',
    steps: [['hover', '--state-hover'], ['pressed', '--state-pressed']] },
  { name: 'Destructive tertiary', bg: '--surface-card',
    steps: [['hover', '--btn-destructive-tertiary-bg-hover'], ['press', '--btn-destructive-tertiary-bg-press']] },
];
const PARITY = [
  // A neutral button and a red one are SIBLINGS — in a row of actions, in a
  // dialog footer — so the red one's hover and press may not be fainter than the
  // neutral one's, measured as full colour difference (dE), not lightness. The
  // ceiling is the red label: it has to hold 4.5:1 on its own wash, which is
  // what stops a red from going heavy (dark 30% fell to 4.35:1). Strengths were
  // set by eye beside the neutral pair (designer, 2026-11-10); this holds them.
  //
  // The row action is measured on the hovered row too, where the pair is seen.
  { name: 'row action, neutral vs destructive (on a hovered row)', bg: '--tbl-row-hover',
    over: '--surface-card', a: '--state-pressed', b: '--btn-destructive-tertiary-bg-press', ink: '--fb-red-text' },
  { name: 'neutral vs destructive hover', bg: '--surface-card', a: '--state-hover', b: '--btn-destructive-tertiary-bg-hover', ink: '--fb-red-text' },
  { name: 'neutral vs destructive press', bg: '--surface-card', a: '--state-pressed', b: '--btn-destructive-tertiary-bg-press', ink: '--fb-red-text' },
  { name: 'neutral vs destructive hover, on the page', bg: '--surface-page', a: '--state-hover', b: '--btn-destructive-tertiary-bg-hover', ink: '--fb-red-text' },
  { name: 'neutral vs destructive press, on the page', bg: '--surface-page', a: '--state-pressed', b: '--btn-destructive-tertiary-bg-press', ink: '--fb-red-text' },
];
const SURFACES = ['--surface-page', '--surface-card', '--surface-card2', '--surface-chips'];
const INK = [
  ['--ink-primary', 4.5], ['--ink-body', 4.5], ['--ink-secondary', 4.5],
  ['--ink-inactive', 2.5], ['--ink-highlight', 3],
];
// Thresholds follow what the pair actually carries. 4.5:1 where the content
// on the fill is TEXT; 3:1 where it is a glyph or a shape, which is all WCAG
// asks of non-text content. Pairs that never occur are not listed: nothing
// prints text on a solid --fb-green (ProgressBar paints a bar, not a label).
const ON_SOLID = [
  // text
  ['--content-on-solid', '--avatar-bg', 4.5],
  ['--btn-primary-text', '--btn-primary-bg', 4.5],
  ['--btn-primary-text', '--btn-primary-bg-hover', 4.5],
  ['--content-on-solid', '--fb-red', 4.5],
  // glyphs: the Banner icon well, the Checkbox tick, the Switch thumb
  ['--content-on-solid', '--brand-primary', 3],

];
const ACCENT_ON_CARD = [
  ['--fb-red-text', 4.5], ['--brand-secondary', 4.5],
  ['--badge-brand-text', 4.5], ['--badge-green-text', 4.5],
];
// WCAG does not govern decorative borders, so the border floor here is a
// sanity check against a hairline vanishing entirely, not an accessibility
// rule. A 1.2:1 divider is normal and deliberate.
const EDGES = [
  ['--stroke-border', '--surface-card', 1.15],
  ['--stroke-border', '--surface-page', 1.15],
  ['--focus-ring-brand', '--surface-card', 3],
  ['--focus-ring-brand', '--surface-page', 3],
];

let fail = 0;
const note = (s) => { console.log(s); fail++; };
const pair = (fgTok, bgTok, min, theme) => {
  const fg = resolve(fgTok, theme), bg = resolve(bgTok, theme);
  if (!fg || !bg) { note('    ?  ' + fgTok + ' on ' + bgTok + ': unresolved'); return; }
  const r = ratio(fg, bg.rgb);
  const line = '    ' + String(r).padStart(6) + ':1  ' + (fgTok + ' on ' + bgTok).padEnd(48) + 'min ' + min;
  if (r < min) note(line + '   FAILS'); else console.log(line);
};

for (const theme of ['light', 'dark']) {
  console.log('\n==============  ' + theme.toUpperCase() + '  ==============');
  console.log('\n-- state ladders --');
  for (const L of LADDERS) {
    const bgc = resolve(L.bg, theme);
    if (!bgc) { note('  ?  ' + L.name + ': ' + L.bg + ' unresolved'); continue; }
    // Since the state tokens became relative overlays, a ladder's own ground can
    // be translucent — `--tbl-row-hover` is a 3% wash, not a colour. Measuring a
    // step against it raw compares an overlay with an overlay and yields
    // nonsense (it read 0). Flatten it onto the surface it actually sits on
    // first, which `L.over` names; without one the ground is taken as opaque.
    const under = L.over ? resolve(L.over, theme) : null;
    const ground = under ? flat(bgc, under.rgb) : bgc.rgb;
    const vals = L.steps.map(([label, tok]) => {
      const c = resolve(tok, theme);
      return { label, tok, d: c ? step(c, ground) : null, rgb: c ? flat(c, ground).map(Math.round) : null };
    });
    console.log('  ' + L.name + '  over ' + L.bg);
    for (const v of vals) console.log('    ' + String(v.d).padStart(6) + '  ' + v.label.padEnd(20) + v.tok);
    if (vals.some((v) => v.d === null)) { note('     unresolved'); continue; }
    if (L.expectEqual) {
      if (String(vals[0].rgb) !== String(vals[1].rgb)) note('     expected identical, got ' + vals[0].rgb + ' vs ' + vals[1].rgb);
      continue;
    }
    for (let i = 1; i < vals.length; i++) {
      const p = vals[i - 1], c = vals[i];
      if (Math.abs(c.d - p.d) < 0.5) note('     COLLISION: ' + p.label + ' and ' + c.label + ' are ' + Math.abs(c.d - p.d).toFixed(2) + ' dLstar apart');
      else if (c.d < p.d) note('     INVERTED: ' + c.label + ' is weaker than ' + p.label);
    }
  }
  for (const P of PARITY) {
    const bg = resolve(P.bg, theme), A = resolve(P.a, theme), B = resolve(P.b, theme);
    if (!bg || !A || !B) { note('  ?  ' + P.name + ': unresolved'); continue; }
    // Same flattening as the ladders: a translucent ground has to be composited
    // onto the surface it sits on before anything is measured against it.
    const pUnder = P.over ? resolve(P.over, theme) : null;
    const pGround = pUnder ? flat(bg, pUnder.rgb) : bg.rgb;
    const da = dE(A, pGround), db = dE(B, pGround);
    const ink = resolve(P.ink, theme), wash = flat(B, pGround);
    const label = ink ? ratio(ink, wash) : null;
    const line = '  parity: ' + P.name.padEnd(48) + 'dE ' + da + ' vs ' + db + '  label ' + label + ':1';
    if (db < da) note(line + '   the red is fainter than the neutral');
    else if (label === null || label < 4.5) note(line + '   the red label falls under 4.5:1');
    else console.log(line);
  }
  console.log('\n-- text contrast --');
  for (const [ink, min] of INK) for (const surf of SURFACES) pair(ink, surf, min, theme);
  console.log('\n-- text on solid fills --');
  for (const [fg, bg, min] of ON_SOLID) pair(fg, bg, min, theme);
  console.log('\n-- accent ink on card --');
  for (const [fg, min] of ACCENT_ON_CARD) pair(fg, '--surface-card', min, theme);
  console.log('\n-- edges --');
  for (const [fg, bg, min] of EDGES) pair(fg, bg, min, theme);
}

console.log('\n' + (fail ? fail + ' problem(s)' : 'clean in BOTH themes - ladders and contrast'));
process.exit(fail ? 1 : 0);
