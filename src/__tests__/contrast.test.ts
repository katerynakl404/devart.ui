/**
 * Text contrast of the feedback colours, read from `globals.css` in both themes.
 *
 * A token edit is a wrong pixel, never an error (SPEC decision 10), and contrast
 * is the pixel that matters most: a green one step lighter passes every other
 * gate and leaves white on it at 2.5:1. These pairs are the ones a component
 * actually paints — a solid fill under white, a 10% / 15% wash under its ink —
 * resolved the way the browser does: the `var()` chain down to a Layer-1
 * triplet, the wash composited over the surface it sits on.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, '../../globals.css'), 'utf8');

/** The declarations of one top-level block — `:root` or `.dark`. */
function block(selector: string): Map<string, string> {
  const start = css.indexOf(`${selector} {`);
  const end = css.indexOf('\n}', start);
  const body = css.slice(start, end).replace(/\/\*[\s\S]*?\*\//g, '');
  const declarations = new Map<string, string>();
  for (const [, name = '', value = ''] of body.matchAll(
    /(--[\w-]+)\s*:\s*([^;]+);/g
  )) {
    declarations.set(name, value.trim());
  }
  return declarations;
}

const root = block(':root');
const dark = block('.dark');

type Rgb = [number, number, number];

function hslToRgb(triplet: string): Rgb {
  const [h = 0, s = 0, l = 0] = triplet
    .split(/\s+/)
    .map((part) => Number.parseFloat(part));
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) =>
    light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

/** A token's colour in a theme: `.dark` over `:root`, `var()` followed down. */
function color(token: string, theme: 'light' | 'dark'): Rgb {
  const value =
    (theme === 'dark' ? dark.get(token) : undefined) ?? root.get(token);
  if (!value) throw new Error(`${token} is not declared`);
  const alias = /^var\((--[\w-]+)\)$/.exec(value)?.[1];
  return alias ? color(alias, theme) : hslToRgb(value);
}

/** `bg-x/NN` over a surface: the wash composited, as the page shows it. */
function wash(fill: Rgb, alpha: number, over: Rgb): Rgb {
  return fill.map((v, i) => v * alpha + (over[i] ?? 0) * (1 - alpha)) as Rgb;
}

function luminance([r, g, b]: Rgb): number {
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
}

/** [what is painted, text, background] — every pair is body-size text: 4.5:1. */
type Pair = [string, Rgb, Rgb];

function pairs(theme: 'light' | 'dark'): Pair[] {
  const c = (token: string) => color(token, theme);
  const card = c('--surface-card');
  const track = c('--surface-card2');
  return [
    ['white on the green fill', c('--content-on-solid'), c('--fb-green')],
    ['white on the red fill', c('--content-on-solid'), c('--fb-red')],
    ['green ink on the card', c('--fb-green-text'), card],
    ['red ink on the card', c('--fb-red-text'), card],
    [
      'Badge success — green ink on a 15% green wash',
      c('--fb-green-text'),
      wash(c('--fb-green'), 0.15, card),
    ],
    [
      'Badge error — red ink on a 15% red wash',
      c('--fb-red-text'),
      wash(c('--fb-red'), 0.15, card),
    ],
    [
      'SegmentedControl tinted positive — green ink on 10% over the track',
      c('--fb-green-text'),
      wash(c('--fb-green'), 0.1, track),
    ],
    [
      'SegmentedControl tinted negative — red ink on 10% over the track',
      c('--fb-red-text'),
      wash(c('--fb-red'), 0.1, track),
    ],
    [
      'SegmentedControl unselected — secondary ink on the track',
      c('--ink-secondary'),
      track,
    ],
  ];
}

describe.each(['light', 'dark'] as const)('%s theme', (theme) => {
  it.each(pairs(theme))('%s reaches 4.5:1', (_, text, background) => {
    expect(contrast(text, background)).toBeGreaterThanOrEqual(4.5);
  });
});
