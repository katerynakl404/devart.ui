'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { THEME_COLORS } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';
import {
  aliasOf,
  type Decls,
  darkDecls,
  lightDecls,
  ramps,
  resolved,
  tripletToHex,
} from './tokens';

/**
 * Token-preview components for the design system's foundations.
 *
 * Every swatch resolves its token through an inline `var(--token)` rather than
 * a composed class name (`bg-${name}`): a dynamic class is invisible to
 * Tailwind's static scan and would generate no CSS, so the swatches would come
 * up blank. Inline custom properties always resolve, and they re-theme under
 * `.dark` exactly like any utility would.
 */

/**
 * Six columns for a one-line cell, four for a two-line one. A colour swatch now
 * carries its source underneath the name, and at six columns that second line
 * truncates to `brand-600 · dar…` — which is the half of it that matters, since
 * the whole point of the line is to say when a token moves under a theme.
 */
function Grid({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <div
      className={cn(
        'grid gap-x-3 gap-y-2',
        wide
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          : 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6'
      )}
    >
      {children}
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5">
      <Typography element="h3" textColor="secondary" textStyle="overline">
        {title}
      </Typography>
      {children}
    </section>
  );
}

/**
 * Read the stylesheet once per theme and per colour pack.
 *
 * Both are attributes on `<html>` — `class="dark"` and `data-palette` — so one
 * observer covers the theme toolbar and the palette toolbar alike. Without it
 * the hex column would keep showing light-mode values after a theme flip while
 * the swatches beside it had already moved, which is worse than no hex.
 */
function useTokenGraph() {
  const [graph, setGraph] = useState<{
    light: Decls;
    dark: Decls;
    hex: Decls;
  }>({ light: {}, dark: {}, hex: {} });

  useEffect(() => {
    const read = () => {
      const light = lightDecls();
      // The hexes are resolved here rather than per swatch, because `resolved`
      // reads the cascade and the cascade has only just moved: taking them in
      // the same pass as the declarations is what guarantees the printed value
      // and the painted one describe the same moment.
      const hex: Decls = {};
      for (const [, names] of ramps(light)) {
        for (const name of names) hex[name] = tripletToHex(resolved(name));
      }
      setGraph({ light, dark: darkDecls(), hex });
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributeFilter: ['class', 'data-palette'],
    });
    return () => observer.disconnect();
  }, []);

  return graph;
}

/**
 * A primitive swatch.
 *
 * The fill is `hsl(var(--name))` rather than the hex beside it: the cascade has
 * to be the thing on screen, or the page would go on showing teal while the
 * Palette switch says Blue. The hex is the read-off value, printed because a
 * designer matching a mock needs it and `globals.css` keeps it in a comment
 * nobody opening Storybook can see.
 */
function PrimitiveSwatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        aria-hidden
        className="size-6 shrink-0 rounded border border-stroke"
        style={{ background: `hsl(var(${name}))` }}
      />
      <span className="flex min-w-0 flex-col">
        <Typography className="truncate" element="span" textStyle="body12">
          {name.replace(/^--/, '')}
        </Typography>
        <Typography
          className="truncate tabular-nums"
          element="span"
          textColor="secondary"
          textStyle="body12"
        >
          {hex}
        </Typography>
      </span>
    </div>
  );
}

/**
 * Layer 1 — the ramps.
 *
 * These are shown and still not exposed to Tailwind: there is no `bg-slate-200`
 * and decision 3 is unchanged. Reading a ramp is not the same as naming one in
 * a class, and the page above this one is unreadable without it — `fb-info` is
 * a blue rectangle with no answer to *which* blue until the ramp it aliases is
 * on the same page.
 */
export function Primitives() {
  const { light, hex } = useTokenGraph();
  return (
    <div className="flex flex-col gap-4">
      {ramps(light).map(([ramp, names]) => (
        <Group key={ramp} title={ramp}>
          <Grid>
            {names.map((name) => (
              <PrimitiveSwatch hex={hex[name] ?? ''} key={name} name={name} />
            ))}
          </Grid>
        </Group>
      ))}
    </div>
  );
}

/**
 * Where a semantic token's colour comes from, in one line.
 *
 * Three shapes, because the token system has three: a plain `var()` alias names
 * the ramp step it pins (`fb-info` -> `blue-600`), a `color-mix()` recipe is
 * marked as one and stops there, and a bare triplet is its own answer and shows
 * the hex. A dark value is printed only when it differs from the light one —
 * per SPEC most tokens need no `.dark` twin precisely because they alias a role,
 * and printing "dark: same" 118 times would bury the 76 that do move.
 */
function lineage(
  cssName: string,
  light: Decls,
  dark: Decls
): { light: string; dark: string } {
  const describe = (value: string | undefined): string => {
    if (!value) return '';
    const alias = aliasOf(value);
    if (alias) return alias;
    if (value.startsWith('color-mix')) return 'color-mix';
    if (/^\d/.test(value)) return tripletToHex(value);
    return value;
  };
  const l = describe(light[cssName]);
  const d = describe(dark[cssName]);
  return { light: l, dark: d && d !== l ? d : '' };
}

function Swatch({
  name,
  value,
  light,
  dark,
}: {
  name: string;
  value: string;
  light: Decls;
  dark: Decls;
}) {
  // THEME_COLORS ships Tailwind's alpha placeholder; resolve it to opaque.
  const css = value.replace('<alpha-value>', '1');
  // THEME_COLORS wraps the variable (`hsl(var(--x) / …)` or a bare `var(--x)`),
  // so the token name is the first custom property in the string.
  const cssName = /--[\w-]+/.exec(value)?.[0] ?? '';
  const from = lineage(cssName, light, dark);
  // A token with no `:root` value paints nothing in light mode — SPEC names
  // this as a failure mode with two live instances (`--fb-red-hover`,
  // `--fb-red-press`), so the line says "dark only" rather than opening with a
  // stray separator and letting it pass for an ordinary pair.
  // The line is narrow enough to clip on a long pair, so the title carries the
  // variable it came from as well as the text — a truncated cell is still
  // answerable without opening `globals.css`.
  const source = from.light
    ? `${from.light}${from.dark ? ` · dark ${from.dark}` : ''}`
    : `dark only: ${from.dark}`;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        aria-hidden
        className="size-6 shrink-0 rounded border border-stroke"
        style={{ background: css }}
      />
      <span className="flex min-w-0 flex-col">
        <Typography className="truncate" element="span" textStyle="body12">
          {name}
        </Typography>
        <Typography
          className="truncate"
          element="span"
          textColor="secondary"
          textStyle="body12"
          title={`${cssName}: ${source}`}
        >
          {source}
        </Typography>
      </span>
    </div>
  );
}

/** Flatten THEME_COLORS into `[group, [utilitySuffix, cssValue][]]` pairs. */
function colorGroups(): [string, [string, string][]][] {
  const loose: [string, string][] = [];
  const groups: [string, [string, string][]][] = [];
  for (const [key, value] of Object.entries(THEME_COLORS)) {
    if (typeof value === 'string') {
      loose.push([key, value]);
      continue;
    }
    const entries = Object.entries(value as Record<string, string>).map(
      ([k, v]) => [k === 'DEFAULT' ? key : `${key}-${k}`, v] as [string, string]
    );
    groups.push([key, entries]);
  }
  if (loose.length) groups.push(['standalone', loose]);
  return groups;
}

/**
 * Every semantic and component-scoped colour token, by role — Layers 2 and 3,
 * which is the whole of what Tailwind is given. The second line under each name
 * is where the colour comes from: the ramp step a plain `var()` pins, or
 * `color-mix` where the recipe is a mix rather than an alias. A dark value is
 * printed only where it differs, so the tokens that actually move under a theme
 * are the ones that stand out.
 */
export function Colors() {
  const { light, dark } = useTokenGraph();
  return (
    <div className="flex flex-col gap-4">
      {colorGroups().map(([group, entries]) => (
        <Group key={group} title={group}>
          <Grid wide>
            {entries.map(([name, value]) => (
              <Swatch
                dark={dark}
                key={name}
                light={light}
                name={name}
                value={value}
              />
            ))}
          </Grid>
        </Group>
      ))}
    </div>
  );
}

const RADII = [
  ['rounded-sm', '--radius-sm', '2px'],
  ['rounded', '--radius', '4px'],
  ['rounded-md', '--radius-md', '6px'],
  ['rounded-lg', '--radius-lg', '8px'],
  ['rounded-xl', '--radius-xl', '12px'],
  ['rounded-full', '9999px', 'pill'],
] as const;

/** The radius scale, each step shown at its real value. */
export function Radius() {
  return (
    <Grid>
      {RADII.map(([cls, token, px]) => (
        <div className="flex flex-col gap-2" key={cls}>
          <span
            aria-hidden
            className="h-14 w-full border border-stroke bg-surface-chips"
            style={{
              borderRadius: token.startsWith('--') ? `var(${token})` : token,
            }}
          />
          <Typography element="span" textStyle="body12">
            {cls}
          </Typography>
          <Typography element="span" textColor="secondary" textStyle="body12">
            {px}
          </Typography>
        </div>
      ))}
    </Grid>
  );
}

const SHADOWS = [
  ['shadow-rest', '--shadow-rest', 'a flat card at rest'],
  ['shadow-card-hover', '--shadow-card-hover', 'that card under the pointer'],
  ['shadow-lift-hover', '--shadow-lift-hover', 'a stronger lift'],
  ['shadow-menu', '--shadow-menu', 'dropdown and context menus'],
  ['shadow-dropdown', '--shadow-dropdown', 'select and combobox listboxes'],
  ['shadow-overlay-soft', '--shadow-overlay-soft', 'popovers, soft panels'],
  ['shadow-thumb', '--shadow-thumb', 'slider and switch thumbs'],
  ['shadow-thumb-hover', '--shadow-thumb-hover', 'thumb under the pointer'],
] as const;

/** Elevation as roles rather than sizes — pick by what the surface is doing. */
export function Shadows() {
  return (
    <Grid>
      {SHADOWS.map(([cls, token, role]) => (
        <div className="flex flex-col gap-2" key={cls}>
          <span
            aria-hidden
            className="h-14 w-full rounded-lg bg-surface-card"
            style={{ boxShadow: `var(${token})` }}
          />
          <Typography element="span" textStyle="body12">
            {cls}
          </Typography>
          <Typography element="span" textColor="secondary" textStyle="body12">
            {role}
          </Typography>
        </div>
      ))}
    </Grid>
  );
}

/**
 * The scale. The third column is quoted from `Spacing.md` and from nowhere
 * else: three steps have a stated rule, the other nine do not, and a step with
 * no rule stays blank. Filling it with plausible prose would make this page a
 * second source for a number nobody has decided.
 */
const SPACING: readonly (readonly [string, number, string])[] = [
  ['1', 4, ''],
  ['2', 8, 'tight cluster'],
  ['3', 12, ''],
  ['4', 16, 'related elements'],
  ['5', 20, ''],
  ['6', 24, 'page padding, and the gap between sections'],
  ['8', 32, ''],
  ['10', 40, ''],
  ['12', 48, ''],
  ['16', 64, ''],
  ['20', 80, ''],
  ['24', 96, ''],
] as const;

/**
 * Control internals only, per `Spacing.md` — never page or section rhythm.
 * The third column is not a rule: it names one call site in this library, so
 * that "control internals" is read off real code rather than guessed at.
 */
const HALF_STEPS: readonly (readonly [string, number, string])[] = [
  ['px', 1, 'Card — the lift on hover'],
  ['0.5', 2, 'SidebarMenu — between nav rows'],
  ['1.5', 6, 'Button sm — glyph to label'],
  ['2.5', 10, 'SidebarFooter — the row own inset'],
  ['3.5', 14, ''],
] as const;

function Step({
  step,
  px,
  use,
  max,
}: {
  step: string;
  px: number;
  use: string;
  max: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <Typography
        className="w-10 shrink-0 text-end tabular-nums"
        element="span"
        textStyle="body12"
      >
        {step}
      </Typography>
      <Typography
        className="w-10 shrink-0 tabular-nums"
        element="span"
        textColor="secondary"
        textStyle="body12"
      >
        {px}px
      </Typography>
      {/* The bar is measured against the largest step on the page, so the
          column is a true ruler rather than twelve bars scaled to fit. */}
      <span
        className="hidden shrink-0 sm:block"
        style={{ width: `${max}px` }}
        aria-hidden
      >
        <span
          className="block h-3 rounded-sm bg-brand-primary"
          style={{ width: `${px}px` }}
        />
      </span>
      <Typography
        className="min-w-0 truncate"
        element="span"
        textColor={use ? 'secondary' : 'light'}
        textStyle="body12"
      >
        {use || '—'}
      </Typography>
    </div>
  );
}

/** One rhythm, rendered rather than described. */
function Rhythm({
  label,
  cls,
  children,
}: {
  label: string;
  cls: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Typography element="span" textStyle="body12">
        <code className="rounded bg-surface-chips px-1 py-0.5 font-mono text-xxs">
          {cls}
        </code>{' '}
        {label}
      </Typography>
      <div className="rounded-md border border-stroke bg-surface-card">
        {children}
      </div>
    </div>
  );
}

/** A filled block standing in for content, so only the space is the subject. */
function Fill({ h = 'h-6' }: { h?: string }) {
  return (
    // A tint rather than `--surface-chips`: the block sits on a card and has
    // to read as content at a glance, or the gap it is there to show reads as
    // the whole box being empty.
    <span aria-hidden className={`block rounded-sm bg-brand-primary/15 ${h}`} />
  );
}

/**
 * The 4px step. The step number **is** the unit: `4` is 16px, so `p-4`,
 * `gap-4` and `m-4` are all 16.
 */
export function Spacing() {
  const max = SPACING.at(-1)?.[1] ?? 96;
  return (
    <div className="flex flex-col gap-5">
      <Group title="The scale — the number in p-*, m-*, gap-*, size-*">
        <div className="flex flex-col gap-1.5">
          {SPACING.map(([step, px, use]) => (
            <Step key={step} max={max} px={px} step={step} use={use} />
          ))}
        </div>
      </Group>

      <Group title="Half-steps — control internals only · one call site each">
        <div className="flex flex-col gap-1.5">
          {HALF_STEPS.map(([step, px, use]) => (
            <Step key={step} max={max} px={px} step={step} use={use} />
          ))}
        </div>
      </Group>

      <Group title="Page rhythm — the four states Spacing.md names">
        <div className="grid gap-3 sm:grid-cols-2">
          <Rhythm cls="gap-2" label="a tight cluster">
            <div className="flex flex-col gap-2 p-3">
              <Fill h="h-4" />
              <Fill h="h-4" />
            </div>
          </Rhythm>
          <Rhythm cls="gap-4" label="related elements">
            <div className="flex flex-col gap-4 p-3">
              <Fill h="h-4" />
              <Fill h="h-4" />
            </div>
          </Rhythm>
          <Rhythm cls="gap-6" label="between sections">
            <div className="flex flex-col gap-6 p-3">
              <Fill h="h-4" />
              <Fill h="h-4" />
            </div>
          </Rhythm>
          <Rhythm cls="p-6" label="the page’s own padding">
            <div className="p-6">
              <Fill />
            </div>
          </Rhythm>
        </div>
      </Group>
    </div>
  );
}
