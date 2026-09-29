/**
 * The token graph, read back out of the stylesheet at runtime.
 *
 * Nothing here is a hand-written list. `globals.css` is the only source: the
 * docs walk its `:root` and `.dark` rules, so a token added there shows up on
 * the Foundations pages without a second edit, and one deleted there stops
 * being documented. A curated array would have been a third copy of the token
 * set to keep in sync (there are already two — see SPEC, Cross-Feature
 * Dependencies) and it would drift silently, which is the exact failure mode
 * the token system is built to avoid.
 */

/** `221.2 83.2% 53.3%` — the shape SPEC gives every Layer-1 value. */
const TRIPLET = /^-?[\d.]+ [\d.]+% [\d.]+%$/;

/** A plain alias: `var(--blue-600)` and nothing else. */
const ALIAS = /^var\(\s*(--[\w-]+)\s*\)$/;

/** The same alias wrapped for an alpha: `hsl(var(--slate-950) / 60%)`. */
const ALPHA_ALIAS = /^hsl\(\s*var\(\s*(--[\w-]+)\s*\)\s*\/\s*([^)]+)\)$/;

export type Decls = Record<string, string>;

/**
 * Raw declarations under one top-level selector.
 *
 * Matched on the exact selector text rather than `matches()`, because
 * `palettes.css` also declares Layer 1 under `:root[data-palette="blue"]`.
 * A pack is an override of these values, not a second set of tokens, so the
 * names and the aliases come from `:root`; the *resolved* colour comes from
 * the cascade (see `swatch`), which is what makes the Palette toolbar switch
 * move these swatches at all.
 */
function declarationsFor(selector: string): Decls {
  const out: Decls = {};
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRule[];
    try {
      rules = Array.from(sheet.cssRules);
    } catch {
      continue; // cross-origin sheet; none of ours
    }
    for (const rule of rules) {
      if (!(rule instanceof CSSStyleRule) || rule.selectorText !== selector) {
        continue;
      }
      for (const prop of Array.from(rule.style)) {
        if (prop.startsWith('--')) {
          out[prop] = rule.style.getPropertyValue(prop).trim();
        }
      }
    }
  }
  return out;
}

export const lightDecls = (): Decls => declarationsFor(':root');
export const darkDecls = (): Decls => declarationsFor('.dark');

/** Is this declaration a Layer-1 primitive? */
export const isPrimitive = (value: string): boolean => TRIPLET.test(value);

/**
 * What a declaration aliases, as a label: `var(--blue-600)` → `blue-600`,
 * `hsl(var(--slate-950) / 60%)` → `slate-950 / 60%`. Anything that is not an
 * alias — a `color-mix()` recipe, a bare triplet, a shadow list — returns null,
 * because those are answered elsewhere and a half-parsed one would read as a
 * lineage the token does not have.
 */
export function aliasOf(value: string): string | null {
  const plain = ALIAS.exec(value)?.[1];
  if (plain) return plain.replace(/^--/, '');
  const alpha = ALPHA_ALIAS.exec(value);
  if (alpha) return `${alpha[1]?.replace(/^--/, '')} / ${alpha[2]?.trim()}`;
  return null;
}

/**
 * Group primitives by ramp: `--brand-600` → ramp `brand`, step `600`.
 * `--white` and `--orange-500` are ramps of one; they group by themselves
 * rather than being special-cased.
 */
export function ramps(decls: Decls): [string, string[]][] {
  const byRamp = new Map<string, string[]>();
  for (const [name, value] of Object.entries(decls)) {
    if (!isPrimitive(value)) continue;
    const step = /-(\d+)(-soft)?$/.exec(name);
    const ramp = step ? name.slice(0, step.index) : name;
    const list = byRamp.get(ramp);
    if (list) list.push(name);
    else byRamp.set(ramp, [name]);
  }
  return Array.from(byRamp, ([ramp, names]) => [
    ramp.replace(/^--/, ''),
    names,
  ]);
}

/** The resolved value of a custom property, theme and pack included. */
export function resolved(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/** An HSL triplet as a hex string, so a swatch can be read off the page. */
export function tripletToHex(triplet: string): string {
  const [h = Number.NaN, s = Number.NaN, l = Number.NaN] = triplet
    .replace(/%/g, '')
    .split(/\s+/)
    .map((n) => Number.parseFloat(n));
  if ([h, s, l].some(Number.isNaN)) return '';
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    const v = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * v)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`.toUpperCase();
}
