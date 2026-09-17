/**
 * Emits ds-bundle/tokens/colors.css — the same palette as globals.css, but as
 * REAL CSS colours.
 *
 * globals.css stores every colour as a bare HSL triplet (`--surface-card:
 * var(--white)` -> `0 0% 100%`) because that is what makes
 * `hsl(var(--x) / <alpha-value>)` work, and with it the whole swappable colour
 * pack. The cost is that an external tool parsing the stylesheet for colours
 * finds none: a triplet is not a colour until something wraps it in `hsl()`.
 * That is why Claude Design's palette came up empty.
 *
 * So this resolves the graph and writes each colour out under a DISTINCT
 * `--color-*` name. The names must not collide with the originals: redefining
 * `--surface-card` as `hsl(...)` would turn every component's
 * `hsl(var(--surface-card))` into `hsl(hsl(...))` and drop the declaration.
 *
 * Non-colour tokens (radius, shadow, font size, width) are skipped for free —
 * they do not parse as a triplet or a colour-mix.
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
  const c0 = raw.replace(/\s+/g, '');
  // A tint carries its strength as `var(--tint-N)`, not a literal, so inline the
  // step before the color-mix matchers run — they only know plain percentages,
  // and without this every tint token silently drops out of the palette.
  const c = c0.replace(/var\((--tint-[\w-]+)\)/g, (whole, t) => {
    const step = ROOT.get(t);
    if (!step) throw new Error(`unknown tint step ${t} (used by ${name})`);
    return step.replace(/\s+/g, '');
  });
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

const hex = ({ rgb, a }) => {
  const h = rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  return a >= 1 ? `#${h}` : `#${h}${Math.round(a * 255).toString(16).padStart(2, '0')}`;
};

// Layer 1 ramps stay out: they are deliberately not part of the public
// surface, and flooding the palette with 90 shades buries the 40 role names a
// designer actually picks from.
const PRIMITIVE = /^--(brand|tertiary|slate|grey|red|orange|green|chart-(teal|orange|violet|blue))-\d+$|^--(white|black)$/;

function emit(theme) {
  const lines = [];
  for (const name of ROOT.keys()) {
    if (PRIMITIVE.test(name)) continue;
    const c = resolve(name, theme);
    if (!c) continue;
    lines.push(`  --color${name.slice(1)}: ${hex(c)};`);
  }
  return lines;
}

const light = emit('light'), dark = emit('dark');
const out = [
  '/*',
  ' * Resolved colour palette — generated from globals.css by',
  ' * .design-sync/gen-color-tokens.mjs. Do not edit.',
  ' *',
  ' * globals.css stores colours as bare HSL triplets so that',
  ' * `hsl(var(--x) / <alpha-value>)` works and a colour pack stays swappable.',
  ' * A triplet is not a valid CSS colour on its own, so this file restates the',
  ' * same palette as real colours for tools that read the stylesheet.',
  ' *',
  ' * The `--color-` prefix is load-bearing: redefining the original names as',
  ' * `hsl(...)` would make every `hsl(var(--x))` in the system nest and break.',
  ' * These are for reading, not for components to consume.',
  ' */',
  ':root {',
  ...light,
  '}',
  '',
  '.dark {',
  ...dark,
  '}',
  '',
].join('\n');

fs.mkdirSync('ds-bundle/tokens', { recursive: true });
fs.writeFileSync('ds-bundle/tokens/colors.css', out);

// The product's manifest scans _ds_bundle.css and ONLY _ds_bundle.css: every one
// of the 1797 tokens it indexed came from there, and a separate
// tokens/colors.css was never read at all. It also stores the raw declaration
// text without resolving var(), so `--surface-card: var(--white)` cannot become
// a swatch. Appending the resolved palette to that same file is what actually
// puts real colours where the product looks. package-build.mjs rewrites the
// bundle, so this step has to run after it.
const BUNDLE = 'ds-bundle/_ds_bundle.css';
const MARK = '/* @ds-resolved-palette */';
let bundle = fs.readFileSync(BUNDLE, 'utf8');
const at = bundle.indexOf(MARK);
if (at >= 0) bundle = bundle.slice(0, at);
fs.writeFileSync(BUNDLE, [bundle, MARK, out].join('\n'));

console.log(
  `resolved palette -> tokens/colors.css + _ds_bundle.css: ${light.length} light / ${dark.length} dark`
);
