/**
 * Emits .design-sync/.cache/ds-classlist.txt — the full utility vocabulary of
 * this design system, written out literally.
 *
 * Why literally rather than via Tailwind's `safelist`: safelist patterns are
 * matched O(pattern x candidate). A few thousand of them takes many minutes and
 * then OOMs the compiler. A content file is scanned linearly and costs seconds.
 *
 * The kit ships no stylesheet of its own — components are Tailwind utilities
 * that the consuming app compiles — so a design agent writing new layout glue
 * needs these classes to exist in the exported CSS, not just the ones the
 * components happen to use.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const out = [];
const add = (...c) => out.push(...c);
const cross = (prefixes, steps, variants = ['']) => {
  for (const v of variants) {
    for (const p of prefixes) for (const s of steps) add(`${v}${p}-${s}`);
  }
};

// ---------- colours (from THEME_COLORS, so a colour pack keeps working) -----
const constants = fs.readFileSync(path.join(root, 'src/lib/constants.ts'), 'utf8');
const colors = [];
const noTint = new Set();
let group = null;
for (const line of constants.split('\n')) {
  const g = line.match(/^\s{2}([A-Za-z0-9_]+):\s*\{/);
  if (g) {
    group = g[1];
    continue;
  }
  if (/^\s{2}\},/.test(line)) {
    group = null;
    continue;
  }
  const top = group ? null : line.match(/^  '?([A-Za-z0-9_-]+)'?: '/);
  if (top) {
    colors.push(top[1]);
    if (!line.includes('hsl(var(')) noTint.add(top[1]);
    continue;
  }
  const k = line.match(/^\s{4}'?([A-Za-z0-9_-]+)'?:/);
  if (k && group) {
    const name = k[1] === 'DEFAULT' ? group : `${group}-${k[1]}`;
    colors.push(name);
    // A color-mix() token is passed through as a bare var() and accepts NO
    // alpha modifier - `bg-badge-brand-bg/50` is silently dead CSS. Only
    // hsl(... / <alpha-value>) tokens are tintable.
    if (!line.includes('hsl(var(')) noTint.add(name);
  }
}

const CORE_UTILS = ['bg', 'text', 'border', 'ring'];
const EXTRA_UTILS = ['ring-offset', 'fill', 'stroke', 'from', 'via', 'to',
  'divide', 'placeholder', 'caret', 'accent', 'outline', 'decoration', 'shadow'];
const OPACITY = [5, 6, 8, 10, 12, 15, 20, 30, 40, 50, 60, 70, 80, 90];
const CV = ['', 'hover:', 'focus-visible:', 'active:', 'pressed:', 'disabled:',
  'group-hover:', 'dark:', 'data-[state=open]:', 'data-[state=on]:',
  'data-[state=checked]:'];
for (const c of colors) {
  // The four utilities that carry real UI state get the full variant set.
  for (const u of CORE_UTILS) {
    for (const v of CV) add(`${v}${u}-${c}`);
    if (u !== 'ring' && !noTint.has(c)) {
      for (const o of OPACITY) add(`${u}-${c}/${o}`, `hover:${u}-${c}/${o}`);
    }
  }
  // The rest are base-only: enumerating them across every variant is what
  // pushed the compiled sheet past 7MB, and designs never load it.
  for (const u of EXTRA_UTILS) add(`${u}-${c}`, `dark:${u}-${c}`);
}

// ---------- geometry --------------------------------------------------------
const S = ['', 'sm:', 'md:', 'lg:', 'xl:', 'max-sm:', 'max-md:'];
const SPACE = ['0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6',
  '7', '8', '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40',
  '44', '48', '52', '56', '60', '64', '72', '80', '96', 'auto', 'control'];
cross(['p', 'px', 'py', 'pt', 'pb', 'pl', 'pr', 'ps', 'pe'], SPACE, S);
cross(['m', 'mx', 'my', 'mt', 'mb', 'ml', 'mr', 'ms', 'me', '-m', '-mx', '-my',
  '-mt', '-mb', '-ml', '-mr'], SPACE, S);
cross(['gap', 'gap-x', 'gap-y', 'space-x', 'space-y'], SPACE, S);
const SIZE = [...SPACE, 'full', 'screen', 'min', 'max', 'fit', 'dvh', 'svh', 'lvh',
  '1/2', '1/3', '2/3', '1/4', '3/4', '1/5', '2/5', '3/5', '4/5', '1/6', '5/6', '11/12'];
cross(['w', 'h', 'size', 'min-w', 'min-h', 'basis'], SIZE, S);
cross(['max-w'], [...SIZE, 'modal-sm', 'modal-md', 'modal-lg', 'none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl',
  '5xl', '6xl', '7xl', 'prose'], S);
cross(['max-h'], SIZE, S);
cross(['top', 'right', 'bottom', 'left', 'inset', 'inset-x', 'inset-y', 'start', 'end'],
  [...SPACE, 'full', '1/2'], S);
cross(['translate-x', 'translate-y', '-translate-x', '-translate-y'],
  [...SPACE, 'full', '1/2'], S);

// ---------- typography ------------------------------------------------------
cross(['text'], ['xxs', 'xs', 'compact', 'sm', 'base', 'lg', 'xl', '2xl', '3xl',
  '4xl', 'display', 'left', 'center', 'right', 'justify', 'start', 'end', 'wrap',
  'nowrap', 'balance', 'pretty'], S);
cross(['font'], ['sans', 'mono', 'light', 'normal', 'medium', 'semibold',
  'bold', 'extrabold', 'black'], S);
cross(['leading'], ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose', '3', '4',
  '5', '6', '7', '8', '9', '10'], S);
cross(['tracking'], ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest', 'caps', 'display'], S);
cross(['line-clamp'], ['none', '1', '2', '3', '4', '5', '6'], S);
for (const v of S) {
  add(`${v}truncate`, `${v}uppercase`, `${v}lowercase`, `${v}capitalize`,
    `${v}normal-case`, `${v}italic`, `${v}not-italic`, `${v}underline`,
    `${v}overline`, `${v}line-through`, `${v}no-underline`, `${v}whitespace-normal`,
    `${v}whitespace-nowrap`, `${v}whitespace-pre`, `${v}whitespace-pre-line`,
    `${v}whitespace-pre-wrap`, `${v}break-normal`, `${v}break-words`,
    `${v}break-all`, `${v}tabular-nums`, `${v}antialiased`);
}

// ---------- layout ----------------------------------------------------------
for (const v of S) {
  for (const d of ['flex', 'inline-flex', 'grid', 'inline-grid', 'block',
    'inline-block', 'inline', 'hidden', 'table', 'table-cell', 'table-row',
    'contents', 'flow-root', 'list-item']) add(`${v}${d}`);
  for (const p of ['static', 'fixed', 'absolute', 'relative', 'sticky']) add(`${v}${p}`);
  for (const f of ['flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse',
    'flex-wrap', 'flex-wrap-reverse', 'flex-nowrap', 'flex-1', 'flex-auto',
    'flex-initial', 'flex-none', 'grow', 'grow-0', 'shrink', 'shrink-0']) add(`${v}${f}`);
  for (const a of ['start', 'end', 'center', 'baseline', 'stretch']) {
    add(`${v}items-${a}`, `${v}self-${a}`);
  }
  for (const j of ['start', 'end', 'center', 'between', 'around', 'evenly', 'stretch']) {
    add(`${v}justify-${j}`, `${v}content-${j}`, `${v}justify-items-${j}`,
      `${v}place-items-${j}`, `${v}place-content-${j}`);
  }
  for (let i = 1; i <= 12; i++) {
    add(`${v}grid-cols-${i}`, `${v}col-span-${i}`, `${v}row-span-${i}`, `${v}order-${i}`);
  }
  for (let i = 1; i <= 6; i++) add(`${v}grid-rows-${i}`);
  add(`${v}grid-cols-none`, `${v}col-auto`, `${v}col-span-full`, `${v}row-auto`,
    `${v}order-first`, `${v}order-last`, `${v}order-none`);
  for (const o of ['auto', 'hidden', 'clip', 'visible', 'scroll', 'x-auto', 'y-auto',
    'x-hidden', 'y-hidden', 'x-scroll', 'y-scroll']) add(`${v}overflow-${o}`);
  for (const z of ['0', '10', '20', '30', '40', '50', 'auto']) add(`${v}z-${z}`);
  for (const o of ['contain', 'cover', 'fill', 'none', 'scale-down', 'center', 'top',
    'bottom', 'left', 'right']) add(`${v}object-${o}`);
  for (const a of ['auto', 'square', 'video']) add(`${v}aspect-${a}`);
}

// ---------- borders, radius, effects ----------------------------------------
const RADII = ['none', 'sm', '', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];
for (const v of S) {
  for (const side of ['', '-t', '-r', '-b', '-l', '-tl', '-tr', '-br', '-bl']) {
    for (const r of RADII) add(`${v}rounded${side}${r ? `-${r}` : ''}`);
  }
}
for (const v of ['', 'hover:', 'focus-visible:', 'disabled:', 'dark:']) {
  for (const side of ['', '-x', '-y', '-t', '-r', '-b', '-l']) {
    for (const w of ['0', '', '2', '4', '8']) add(`${v}border${side}${w ? `-${w}` : ''}`);
  }
}
for (const v of ['', 'hover:', 'focus-visible:', 'dark:', 'group-hover:']) {
  for (const s of ['sm', '', 'md', 'lg', 'xl', '2xl', 'inner', 'none', 'rest',
    'card-hover', 'dropdown', 'segctrl-hover', 'segctrl-active', 'lift-hover',
    'overlay-soft', 'menu', 'modal', 'banner-ic', 'banner-grad-ic', 'plan-card-featured',
    'thumb', 'thumb-hover']) add(`${v}shadow${s ? `-${s}` : ''}`);
}
for (const v of ['', 'hover:', 'focus-visible:', 'disabled:']) {
  for (const o of [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100, 'disabled']) {
    add(`${v}opacity-${o}`);
  }
}
for (const v of ['', 'focus-visible:', 'focus:']) {
  for (const r of ['0', '1', '2', '4', '8', '', 'inset']) add(`${v}ring${r ? `-${r}` : ''}`);
}
for (const v of ['', 'focus-visible:']) {
  for (const r of ['0', '1', '2', '4', '8']) add(`${v}ring-offset-${r}`);
}

// ---------- motion, interaction ---------------------------------------------
for (const t of ['', '-none', '-all', '-colors', '-opacity', '-shadow', '-transform']) {
  add(`transition${t}`);
}
for (const d of ['fast', 'base', 'slow', '0', '75', '100', '150', '200', '300', '500',
  '700', '1000']) add(`duration-${d}`);
for (const e of ['linear', 'in', 'out', 'in-out']) add(`ease-${e}`);
for (const d of ['0', '75', '100', '150', '200', '300', '500', '700', '1000']) add(`delay-${d}`);
for (const a of ['none', 'spin', 'ping', 'pulse', 'bounce', 'accordion-down',
  'accordion-up', 'collapsible-down', 'collapsible-up']) add(`animate-${a}`);
for (const v of ['', 'hover:', 'group-hover:']) {
  for (const s of ['0', '50', '75', '90', '95', '100', '105', '110', '125', '150']) {
    add(`${v}scale-${s}`, `${v}scale-x-${s}`, `${v}scale-y-${s}`);
  }
}
for (const r of ['0', '1', '2', '3', '6', '12', '45', '90', '180']) {
  add(`rotate-${r}`, `-rotate-${r}`);
}
for (const c of ['auto', 'default', 'pointer', 'wait', 'text', 'move', 'help',
  'not-allowed', 'none', 'grab', 'grabbing']) add(`cursor-${c}`, `disabled:cursor-${c}`);
for (const s of ['none', 'text', 'all', 'auto']) add(`select-${s}`);
for (const p of ['none', 'auto']) add(`pointer-events-${p}`, `disabled:pointer-events-${p}`);
add('sr-only', 'not-sr-only', 'isolate', 'container', 'resize', 'resize-none',
  'resize-x', 'resize-y', 'appearance-none', 'outline-none',
  'focus-visible:outline-none', 'will-change-transform');
for (const b of ['none', 'sm', '', 'md', 'lg', 'xl', '2xl', '3xl']) {
  add(`blur${b ? `-${b}` : ''}`, `backdrop-blur${b ? `-${b}` : ''}`);
}

/* Structural variants a component uses to describe ITSELF rather than to be
   configured. `empty:pb-0` is how SidebarHeader tells the two sidebar shapes
   apart: a header with a brand row is spaced off the navigation, an empty one
   is pure top inset. Without the class enumerated here the rule is never
   compiled and the component silently keeps the padding — which is exactly the
   failure mode this list creates, so anything relying on a variant must be
   added deliberately. */
add('empty:pb-0', 'empty:pt-0', 'empty:hidden');

/* The table's truncation clamp. A cell wraps by default so the row grows with
   its content; only a `layout="fixed"` table clamps, because there the column
   widths come from the first row and never re-measure. The scope is a
   descendant selector on the `data-layout` the table stamps, which is an
   arbitrary variant — nothing in the enumeration generates it, so all three
   have to be listed by hand or a fixed-layout table silently stops truncating. */
add(
  '[[data-layout=fixed]_&]:overflow-hidden',
  '[[data-layout=fixed]_&]:text-ellipsis',
  '[[data-layout=fixed]_&]:whitespace-nowrap'
);

/* Glyph sizing and glyph colour, both written as child/descendant selectors on
   the control rather than on the icon. Nothing else in this file produces an
   `svg`-scoped class, so the entire icon surface of the library was absent
   from the bundle's vocabulary: Button, IconButton, Badge, File and
   InputGroupAddon all size their glyph this way, and in the bundle none of
   those rules existed. Storybook compiles from source and showed the ladder
   working, which is why it stayed invisible.

   The ladder is 14/16/16/20/20 — `size-3.5` / `size-4` / `size-5` — plus the
   `size-3` and `size-6` steps other components use, and the stroke weight the
   menu row asks for. */
for (const step of ['3', '3.5', '4', '5', '6', '7', '8']) {
  add(`[&>svg]:size-${step}`, `[&_svg]:size-${step}`);
}
add(
  '[&>svg]:text-ink-inactive',
  '[&>button]:text-ink-secondary',
  '[&>button]:transition-colors',
  '[&>button:hover]:text-ink-body',
  '[&_svg]:pointer-events-none',
  '[&_svg]:shrink-0',
  '[&>svg]:shrink-0',
  '[&_svg]:stroke-[1.75]',
  /* The stretched row link (Table.md): one anchor covers the row via a
     pseudo-element, so the row is the hit area while the anchor stays the
     accessible target. */
  'after:absolute',
  'after:inset-0',
  'relative',
  '[&::-webkit-search-cancel-button]:hidden',
  '[&::-webkit-search-decoration]:hidden'
);

const dir = path.join(root, '.design-sync/.cache');
fs.mkdirSync(dir, { recursive: true });
const uniq = [...new Set(out)];
fs.writeFileSync(path.join(dir, 'ds-classlist.txt'), uniq.join('\n'));
console.log(`colours: ${colors.length}, unique classes: ${uniq.length}`);
