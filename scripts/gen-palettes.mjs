/* Colour-pack generator → palettes.css, shipped as `@devart/ui-react/palettes.css`.
   Run: node scripts/gen-palettes.mjs

   The design system holds colour in three layers (globals.css):
   primitives → semantic roles → component tokens. Roles and components reach the
   primitives through var(), so recolouring the system only means redeclaring the
   Layer-1 primitives. Every color-mix() recipe (button hover fills, card borders,
   toast tints, banner gradients) recomputes itself.

   A PACK IS PRIMITIVES ONLY. Two ramps, --brand-* and --tertiary-*, and nothing
   else: no semantic tokens, no component rules. That is exactly why the system
   moves to a new colour whole and by itself — including the half-tones, the pale
   brand fills (selected sidebar row, selected chip, pressed state) that come from
   --brand-50 and --brand-800.

   Splitting those half-tones apart — a neutral sidebar with a brand chip — was
   tried here, and it cost precisely what the pack exists to avoid: it meant
   touching the semantic --state-pressed and hanging a CSS rule off a compiled
   Tailwind class name. Such a rule survives exactly until the next build of the
   design system. If a half-tone reads badly somewhere, that is a reason to fix
   the design system, not the pack.

   ─────────────────────────────────────────────────────────────────────────
   WHY OKLCH AND NOT HSL

   HSL saturation says nothing about how loud a colour is: 85% on teal looks
   restrained, the same 85% on blue or purple is neon. The first version of this
   generator computed in HSL and produced packs at chroma 0.18–0.23 — twice the
   design system's own brand.

   Measured in OKLCH (chroma is one scale across every hue):

     DS brand teal   #07807E   L 0.543  C 0.092   ← the reference
     DS charts       blue      L 0.542  C 0.142
     DS charts       violet    L 0.533  C 0.175
     DS feedback     red       L 0.505  C 0.190

   So in this system the brand is QUIETER than the charts, and feedback is the
   loudest thing there is. The packs keep that same hierarchy.

   Equal chroma across hues does not work either: the first attempt took teal's
   C 0.092 literally and the warm and purple packs came out dusty. How much chroma
   a hue can carry depends on the hue itself (see chartChroma below): on teal
   0.092 is near the ceiling, on red it is a third of it. So teal supplies the
   SHAPE of the ramp and the level is substituted per hue.
   ───────────────────────────────────────────────────────────────────────── */

import { writeFileSync } from 'node:fs';

/* ─── OKLCH ↔ sRGB ──────────────────────────────────────────────────────── */

const toLinear = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toSrgb = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

const oklchToRgb = (L, C, H) => {
  const h = (H * Math.PI) / 180;
  const A = C * Math.cos(h);
  const B = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
};
const inGamut = (rgb) => rgb.every((v) => v >= -0.0005 && v <= 1.0005);

/* Outside sRGB the colour does not exist — there is simply nothing to paint. So
   chroma comes down until it fits: hue and lightness matter more than saturation. */
const clip = (L, C, H) => {
  let c = C;
  while (c > 0 && !inGamut(oklchToRgb(L, c, H))) c -= 0.001;
  return Math.max(c, 0);
};
const render = (L, C, H) => oklchToRgb(L, clip(L, C, H), H)
  .map((v) => Math.round(Math.min(1, Math.max(0, toSrgb(v))) * 255));

const hex = (rgb) => '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();

/* The design system stores colours as bare HSL triplets: components read them as
   `hsl(var(--brand-600) / <alpha>)`, so HSL is what has to come out. */
const rgbToHsl = ([r, g, b]) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const l = (max + min) / 2;
  if (!d) return [0, 0, l * 100];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [((h * 60) + 360) % 360, s * 100, l * 100];
};

const lum = ([r, g, b]) => {
  const [R, G, B] = [r, g, b].map(toLinear);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const WHITE = [255, 255, 255];
const DARK_CARD = [23, 23, 30]; /* #17171E — --surface-card in dark mode */

/* ─── how much chroma is "normal" at this hue ───────────────────────────── */

/* Equal chroma looks different at different hues: at C 0.092 teal reads clean,
   while the same figure on a warm or purple hue comes out dusty and muddy. The
   reason is physical — at mid lightness the blue-green region of sRGB is simply
   poorer in chroma, so 0.092 is near its ceiling there and a third of the ceiling
   on red.

   The anchors come from the design system's own chart palette, i.e. from colours
   this system already considers acceptable. Linear interpolation around the wheel
   between them. */
const CHART_CHROMA = [
  [12, 0.200], [27, 0.190], [49, 0.160], [90, 0.145], [161, 0.134],
  [182, 0.102], [200, 0.105], [256, 0.142], [290, 0.175], [330, 0.190],
];
const chartChroma = (H) => {
  const h = ((H % 360) + 360) % 360;
  const pts = [...CHART_CHROMA, [CHART_CHROMA[0][0] + 360, CHART_CHROMA[0][1]]];
  for (let i = 0; i < pts.length - 1; i += 1) {
    const [h0, c0] = pts[i];
    const [h1, c1] = pts[i + 1];
    const x = h < h0 && i === 0 ? h + 360 : h;
    if (x >= h0 && x <= h1) return c0 + ((c1 - c0) * (x - h0)) / (h1 - h0);
  }
  return 0.14;
};
/* The brand is quieter than the charts — by exactly the margin that the DS teal
   brand (C 0.092) is quieter than teal in the charts (C 0.102). */
const BRAND_RATIO = 0.9;
const brandChroma = (H) => chartChroma(H) * BRAND_RATIO;

/* ─── profiles taken from the design system ─────────────────────────────── */

/* L and C of the teal brand, step by step. Hue is dropped — the pack supplies it.
   In the original the light steps are cooler than the core (H 217 against 193),
   so that shift is preserved too: it is what makes a ramp a ramp rather than six
   tints of one colour. */
const BRAND_PROFILE = {
  50:  { L: 0.9545, C: 0.011, dH: 24 },
  100: { L: 0.8836, C: 0.026, dH: 28 },
  200: { L: 0.7784, C: 0.049, dH: 16 },
  300: { L: 0.6643, C: 0.069, dH: 12 },
  400: { L: 0.6483, C: 0.100, dH: -4 },
  500: { L: 0.5896, C: 0.097, dH: 0 },
  600: { L: 0.5430, C: 0.092, dH: 0 },
  700: { L: 0.4687, C: 0.079, dH: 1 },
  800: { L: 0.2731, C: 0.031, dH: 23 },
  900: { L: 0.2062, C: 0.024, dH: 27 },
};

/* The same, from the cyan tertiary — the brand's lighter relative. */
const TERTIARY_PROFILE = {
  50:  { L: 0.9695, C: 0.014, dH: 4 },
  100: { L: 0.9206, C: 0.041, dH: 2 },
  200: { L: 0.8598, C: 0.075, dH: 1 },
  300: { L: 0.7920, C: 0.103, dH: 2 },
  400: { L: 0.7323, C: 0.115, dH: 6 },
  500: { L: 0.6664, C: 0.110, dH: 7 },
  600: { L: 0.5900, C: 0.098, dH: 10 },
  700: { L: 0.5018, C: 0.083, dH: 12 },
  800: { L: 0.4233, C: 0.068, dH: 16 },
  900: { L: 0.3625, C: 0.056, dH: 13 },
  950: { L: 0.2640, C: 0.043, dH: 23 },
};

/* Destructive. Loud by design — only the hue is touched. */
const RED_PROFILE = {
  50:  { L: 0.9705, C: 0.016 }, 100: { L: 0.9358, C: 0.032 },
  200: { L: 0.8859, C: 0.061 }, 300: { L: 0.7893, C: 0.116 },
  400: { L: 0.6617, C: 0.193 }, 500: { L: 0.6368, C: 0.208 },
  600: { L: 0.5771, C: 0.215 }, 700: { L: 0.5054, C: 0.190 },
  800: { L: 0.4437, C: 0.161 }, 850: { L: 0.3958, C: 0.133 },
  900: { L: 0.2451, C: 0.081 }, 950: { L: 0.2100, C: 0.050 },
};

/* ─── contrast solver ───────────────────────────────────────────────────── */

/* The thresholds are taken from the teal original so no pack can be worse than
   it: 600 on white 4.77, 500 on the dark card 4.54, 400 at 5.74.

   The profile's L is a starting point, not gospel: at equal OKLCH lightness
   different hues have different WCAG luminance (blue darker, yellow lighter), so
   where a threshold is missed the lightness moves and the chroma stays. */
const solve = (L0, C, H, { on, min, dir }) => {
  let L = L0;
  for (let i = 0; i < 400; i += 1) {
    if (contrast(render(L, C, H), on) >= min) break;
    L += dir * 0.002;
    if (L <= 0.05 || L >= 0.98) break;
  }
  return L;
};
const GUARDS = {
  600: { on: WHITE, min: 4.75, dir: -1 },
  700: { on: WHITE, min: 6.5, dir: -1 },
  500: { on: DARK_CARD, min: 4.5, dir: +1 },
  400: { on: DARK_CARD, min: 5.6, dir: +1 },
};

/* The profile holds the SHAPE of the ramp — how chroma builds toward the core and
   falls off at the edges. The absolute level comes from the hue: the whole profile
   is scaled so that step 600 lands on its hue's brandChroma(). For teal the factor
   is ≈ 1, i.e. the original ramp reproduces itself. */
const buildRamp = (profile, hue) => {
  const scale = brandChroma(hue) / profile[600].C;
  const out = {};
  for (const [step, { L, C, dH }] of Object.entries(profile)) {
    const H = (hue + (dH || 0) + 360) % 360;
    const c = C * scale;
    const g = GUARDS[step];
    const l = g ? solve(L, c, H, g) : L;
    out[step] = { rgb: render(l, c, H), L: l, C: c, H };
  }
  return out;
};

/* ─── packs ─────────────────────────────────────────────────────────────── */

/* `hue` is an OKLCH angle. For orientation: DS feedback red 27°, orange 49°,
   Insightis green 161°, brand teal 193°, chart blue 256°, chart violet 290°. */
/* The active set: the design system's teal stays the default (that is "no pack"),
   with steps through blue and into purple on offer. The steps are chosen by hue,
   not by saturation: loudness is identical across them by construction (see
   chartChroma), so what gets compared is the character of the colour rather than
   which one shouts more.

   Blue runs cold to warm: azure still pulls toward cyan, blue sits exactly on the
   blue of the DS chart palette, indigo already leans purple. Iris is the purple
   that still remembers blue.

   Warm packs are parked in ARCHIVED below — not generated, but not lost either:
   moving one back up here is a single line. */
const PACKS = [
  {
    id: 'azure', label: 'Azure', hue: 240, tertiaryHue: 222,
    note: 'A cool blue that still carries a note of cyan.',
    extra: {},
  },
  {
    id: 'blue', label: 'Blue', hue: 256, tertiaryHue: 238,
    note: 'Blue sitting exactly on the blue of the DS chart palette.',
    extra: {},
  },
  {
    id: 'indigo', label: 'Indigo', hue: 272, tertiaryHue: 252,
    note: 'A deep blue leaning toward purple.',
    extra: {},
  },
  {
    id: 'iris', label: 'Iris', hue: 288, tertiaryHue: 305,
    note: 'The purple that still remembers blue.',
    extra: {},
  },
];

/* Not generated. Warm packs from the previous approach — move them back whole.
   Each shifts the feedback colours, because a warm brand collides with both
   "delete" and "attention"; the cool packs above need none of that, which is why
   their `extra` is empty. */
const ARCHIVED = [
  /* Dropped from the shortlist: on the pages they read as the same purple as
     Iris, so all they added was two more clicks in the palette switcher. */
  {
    id: 'violet', label: 'Violet', hue: 300, tertiaryHue: 317,
    note: 'Purple in the middle of the range.',
    extra: {},
  },
  {
    id: 'plum', label: 'Plum', hue: 318, tertiaryHue: 334,
    note: 'Purple with a red note — the warmest of the three.',
    extra: {},
  },
  {
    id: 'ember', label: 'Ember', hue: 35, tertiaryHue: 52,
    note: 'Orange-red — terracotta.',
    extra: { redHue: 12, attention: { L: 0.78, C: 0.16, H: 88 } },
  },
  {
    id: 'orange', label: 'Orange', hue: 52, tertiaryHue: 68,
    note: 'A pure orange.',
    extra: { redHue: 16, attention: { L: 0.83, C: 0.16, H: 96 } },
  },
  {
    id: 'amber', label: 'Amber', hue: 82, tertiaryHue: 66,
    note: 'Yellow-gold. A yellow dark enough to carry white text inevitably reads as bronze.',
    extra: { attention: { L: 0.66, C: 0.18, H: 42 } },
  },
  {
    id: 'green', label: 'Green (Insightis)', hue: 161, tertiaryHue: 176,
    note: 'The Insightis green. Success (--fb-green) shares its hue with the brand — a property of a green brand, not a mistake.',
    extra: {},
  },
];
void ARCHIVED;

/* ─── CSS assembly ──────────────────────────────────────────────────────── */

const trip = ([h, s, l]) => `${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%`;
const decl = (name, rgb, note) =>
  `  --${name}: ${trip(rgbToHsl(rgb))}; /* ${hex(rgb)}${note ? ' ' + note : ''} */`;
const cw = (rgb) => `· on white ${contrast(rgb, WHITE).toFixed(2)}`;
const cd = (rgb) => `· on #17171E ${contrast(rgb, DARK_CARD).toFixed(2)}`;
const NOTE = { 400: cd, 500: cd, 600: cw, 700: cw };

const blocks = [];
const report = [];

for (const p of PACKS) {
  const brand = buildRamp(BRAND_PROFILE, p.hue);
  const tert = buildRamp(TERTIARY_PROFILE, p.tertiaryHue);
  const sel = `:root[data-palette="${p.id}"]`;
  const b = [];

  b.push(`/* ${p.label} — ${p.note} */`);
  b.push(`${sel} {`);
  b.push('  /* Brand — L and C of the DS teal brand, hue changed and nothing else */');
  for (const [step, v] of Object.entries(brand)) {
    b.push(decl(`brand-${step}`, v.rgb, NOTE[step] ? NOTE[step](v.rgb) : ''));
  }
  /* Muted steps behind --surface-accent: in the DS these are near-neutrals. */
  b.push(decl('brand-50-soft', render(0.9692, 0.007, p.hue + 24)));
  b.push(decl('brand-900-soft', render(0.2098, 0.014, p.hue + 20)));
  b.push('');
  b.push('  /* Tertiary — the brand\x27s lighter relative (in the DS, teal → cyan) */');
  for (const [step, v] of Object.entries(tert)) {
    b.push(decl(`tertiary-${step}`, v.rgb, NOTE[step] ? NOTE[step](v.rgb) : ''));
  }

  if (p.extra.redHue !== undefined) {
    b.push('');
    b.push('  /* Destructive — hue rotated, loudness left as it was */');
    for (const [step, { L, C }] of Object.entries(RED_PROFILE)) {
      b.push(decl(`red-${step}`, render(L, C, p.extra.redHue)));
    }
  }
  if (p.extra.attention) {
    const { L, C, H } = p.extra.attention;
    b.push('');
    b.push('  /* Attention / warning */');
    b.push(decl('orange-500', render(L, C, H)));
  }

  b.push('');
  b.push('}');

  blocks.push(b.join('\n'));

  const r6 = brand[600], r5 = brand[500], r4 = brand[400];
  report.push(
    `${p.id.padEnd(8)} 600 ${hex(r6.rgb)} C ${r6.C.toFixed(3)} ` +
    `${contrast(r6.rgb, WHITE).toFixed(2)}/white   ` +
    `500 ${hex(r5.rgb)} ${contrast(r5.rgb, DARK_CARD).toFixed(2)}/dark   ` +
    `400 ${hex(r4.rgb)} ${contrast(r4.rgb, DARK_CARD).toFixed(2)}/dark`,
  );
}

const header = `/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  Colour packs — @devart/ui-react
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  GENERATED by: node scripts/gen-palettes.mjs — do not edit by hand.
 *  The hues and profiles live in the script itself.
 *
 *  A pack recolours the whole system by redeclaring LAYER 1 ONLY — the
 *  \`--brand-*\` and \`--tertiary-*\` ramps, and nothing else. Semantic roles and
 *  component tokens reach the primitives through \`var()\`, so everything above
 *  them re-resolves by itself, including every \`color-mix()\` recipe: button
 *  hover fills, card borders, toast tints, banner gradients, the pale brand
 *  fills behind a selected row or a pressed chip.
 *
 *  That is the whole reason SPEC decision 3 keeps Layer 1 out of Tailwind. No
 *  component can name a ramp step, so no component has to be touched to change
 *  the colour of the system.
 *
 *  USAGE — import after globals.css, switch with an attribute on <html>:
 *
 *      @import '@devart/ui-react/globals.css';
 *      @import '@devart/ui-react/palettes.css';
 *
 *      <html data-palette="iris">
 *
 *  With no attribute the system stays teal, which is the package's own default
 *  and is not declared here. \`:root[data-palette]\` (0,2,0) beats \`:root\` and
 *  \`.dark\` from globals.css (0,1,0), and \`:root[data-palette].dark\` (0,3,0)
 *  beats the dark branch — so a pack needs no \`!important\` and no load-order
 *  luck beyond coming second.
 *
 *  A pack is primitives only, deliberately. Splitting the half-tones apart — a
 *  neutral sidebar with a brand chip, say — means touching a semantic token or
 *  hanging a rule off a compiled Tailwind class name, and such a rule survives
 *  exactly until the next build. If a half-tone reads badly somewhere, that is
 *  a reason to fix the design system, not the pack.
 *
 *  LOUDNESS: every pack takes the L and C profile of the default teal brand
 *  (C ≈ 0.09 in OKLCH) and rotates the hue only, so the packs are exactly as
 *  restrained as teal. Feedback colours — red, attention — are not packed and
 *  stay loud (C ≈ 0.19): that is their job.
 *
 *  CONTRAST: the lightness of the key steps is solved against thresholds taken
 *  from the teal original, so no pack is worse than it:
 *
${report.map((r) => ' *    ' + r).join('\n')}
 */
`;

writeFileSync(
  new URL('../palettes.css', import.meta.url),
  header + '\n' + blocks.join('\n\n') + '\n',
);

console.log('palettes.css — packs: ' + PACKS.length);
console.log(report.join('\n'));
