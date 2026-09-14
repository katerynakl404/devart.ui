# Building with @devart/ui-react

Radix-based primitives styled entirely through CVA recipes over CSS-variable
tokens. There is **no theme provider and no context to wrap** — every token is
plain CSS cascade.

## Setup

- **No wrapper is required.** Render any component directly.
- **Dark mode** is a class, not a prop: put `class="dark"` on an ancestor
  (normally `<html>`), and every token re-resolves. A scoped `.dark` on a
  subtree also works — but several components portal to `document.body`
  (Modal, Sheet, Popover, DropdownMenu, Tooltip, TruncatedTitleTooltip, and
  Sonner's Toaster), so a scoped theme never reaches them — put the class on
  the document root.
- **Font** is DM Sans, shipped with the bundle. `font-sans` resolves to it.
- **`TooltipProvider`** is the one wrapper with a real job: it sets the shared
  hover delay. Wrap the app (or the subtree) in it if you use tooltips.

## Both themes come free

Every colour token is redeclared under `.dark`, so a subtree re-themes with a
class and nothing else — no provider, no props, no JS, no component changes:

```jsx
<div className="dark bg-surface-page p-6">
  {/* everything in here is dark-themed */}
</div>
```

Build in light and it works in dark, provided you only ever name role tokens
(`bg-surface-card`, `text-ink-body`) and never a raw colour. Each component
has a `DarkTheme` story showing exactly this. The one limit: components that
portal to `document.body` (Modal, Sheet, Popover, DropdownMenu, Tooltip,
Toast) are not reached by a scoped class — put `dark` on `<html>` to theme an
open overlay.

## Styling idiom — Tailwind utilities over semantic tokens

Style with utility classes, and **never name a raw colour**. There is no
`bg-slate-200` here: the primitive ramps are deliberately not exposed to
Tailwind, so only role names resolve. That indirection is what makes the whole
system re-theme from one stylesheet.

| Family | Real class names |
|---|---|
| Page/surfaces | `bg-surface-page` `bg-surface-card` `bg-surface-card2` `bg-surface-chips` `bg-surface-accent` `bg-surface-bg` |
| Text | `text-ink-primary` `text-ink-body` `text-ink-secondary` `text-ink-inactive` `text-ink-highlight` |
| Brand | `bg-brand-primary` `text-brand-secondary` `border-brand-tertiary` `hover:bg-brand-hover` `pressed:bg-brand-press` |
| Borders | `border-stroke` `border-stroke-hover` `border-stroke-field-hover` |
| Interaction | `bg-state-hover` `bg-state-pressed` `bg-state-disabled` `ring-state-focus-ring` `ring-focus-ring-brand` |
| Feedback | `bg-fb-red` `text-fb-red-text` `bg-fb-green` `bg-fb-attention` `hover:bg-fb-error-hover` |
| Tables | `bg-table-header-bg` `bg-table-row-hover` `bg-table-row-pressed` |
| On solid fills | `text-content-on-solid` |

Tints use one scale: `bg-brand-primary/6`, `/8`, `/12` alongside `/5 /10 /20 …`.
Tokens built with `color-mix()` (most `badge-*`, `toast-*`, `card-border-*`)
take **no** opacity modifier — `bg-badge-brand-bg/50` silently emits nothing.

### Spacing — a 4px grid

Spacing is stock Tailwind, so the step number is the unit: `4` = 16px. Every
value must land on a step; an arbitrary `p-[0.92rem]` is always wrong.

| Step | `0` | `1` | `2` | `3` | `4` | `5` | `6` | `8` | `10` | `12` | `16` | `20` | `24` |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| px | 0 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64 | 80 | 96 |

Half-steps exist for control internals only — `px` (1px), `0.5` (2), `1.5` (6),
`2.5` (10), `3.5` (14). Use them inside a control (icon gaps, chip padding),
never for page or section rhythm.

Applies to `p/px/py/pt/pb/pl/pr/ps/pe`, `m/mx/my/…`, `gap`, `gap-x`, `gap-y`,
`space-x`, `space-y`, `w`, `h`, `size`, `min-*`, `max-*`, `top/right/bottom/left`,
`inset*` — each also available at `sm:` `md:` `lg:` `xl:` `max-sm:` `max-md:`.

### Radius

| Class | Token | Value | Typical use |
|---|---|---|---|
| `rounded-sm` | `--radius-sm` | 2px | hairline chips, kbd keys |
| `rounded` | `--radius` | 4px | the default |
| `rounded-md` | `--radius-md` | 6px | buttons, inputs, menu items |
| `rounded-lg` | `--radius-lg` | 8px | cards, popovers, accordion rows |
| `rounded-xl` | `--radius-xl` | 12px | banners, large surfaces |

`rounded-full` (pills, avatars) and `rounded-none` are also available, as are
the per-corner and per-side forms (`rounded-t-lg`, `rounded-tl-md`, …).

### Elevation

Shadows are roles, not sizes — pick by what the surface is doing. Never write a
raw `shadow-[0_1px_2px_…]`.

| Class | Role |
|---|---|
| `shadow-rest` | a flat card at rest |
| `shadow-card-hover` | that card lifted under the pointer |
| `shadow-lift-hover` | a stronger lift for interactive tiles |
| `shadow-menu` | dropdown and context menus |
| `shadow-dropdown` | select/combobox listboxes |
| `shadow-overlay-soft` | popovers and soft floating panels |
| `shadow-segctrl-hover` / `shadow-segctrl-active` | the SegmentedControl pill |
| `shadow-thumb` / `shadow-thumb-hover` | slider and switch thumbs |
| `shadow-banner-ic` / `shadow-banner-grad-ic` | Banner icon wells |
| `shadow-plan-card-featured` | the featured plan card |

Stock `shadow-sm|md|lg|xl|2xl|inner|none` still resolve, but a role token is
always the better choice — it re-themes, a stock shadow does not.

### Motion and tracking

`duration-fast` (120ms) · `duration-base` (180ms) · `duration-slow` (240ms) —
never a raw `duration-200`. `tracking-tight|normal|caps|display`, where
`tracking-tight` is this system's -0.01em, **not** Tailwind's stock -0.025em.
Plus `opacity-disabled` (0.65) for the disabled treatment.

Custom variants: **`pressed:`** means *pressed or held open* (it expands to
`:active`, `[aria-expanded=true]`, and `[aria-expanded=true]:hover`). Use it on
anything that can open a menu, so the trigger keeps its fill while open; use
`active:` only where nothing can be held open. `aria-invalid:` is also enabled.

## House rules

These come from the design-system audit and are not optional:

1. **Type is chosen as a named style, never as a size.** Use
   `<Typography textStyle="...">`: `display` · `heading36|30|24|20|16` (500) ·
   `title30|24|20|16|14|12` (600) · `body16|14|12` (400) · `label14|12|10` (500)
   · `overline`. Each carries size, weight and line-height together. Pick the
   semantic tag separately with `element` — heading level follows content
   hierarchy, not visual weight, and there is one `h1` per page.
2. **Stay on the 4px step.** Never write an arbitrary value (`p-[0.92rem]`,
   `text-[13px]`). If nothing fits, that argues for a token, not a literal.
   Note that arbitrary *breakpoint* variants (`max-[880px]:`) emit no CSS at
   all — use `max-sm` / `max-md` / `sm` / `md` / `lg` / `xl`.
3. **Every icon-only control needs an accessible name.** `IconButton` requires
   `aria-label`; name the action ("Remove file"), not the surrounding row.
4. **Button variants**: `primary` `primaryTertiary` `secondary` `outline`
   `tertiary` `destructive` `destructiveOutline` `destructiveTertiary`
   `transparent` `transparentUnderline`. There is **no `ghost`** — use
   `tertiary`. Sizes `xs|sm|md|lg|xl` carry padding 8/12/12/16/20; `Button`,
   `InputGroup` and `TextArea` share that ladder, so a button and a field of the
   same size line up. Prefer `sm` and `md`.
5. **Size a dialog by what it holds**, never one width for everything:
   `<ModalContent size="sm|md|lg">` — `sm` (360px) a confirm the user only
   reads and answers, `md` (480px, the default) anything the user fills in,
   `lg` (576px) a multi-step wizard. Rename is `md`, not `sm` — the user types
   into it, so it is a form. Footer buttons are `size="sm"`, right-aligned,
   Cancel `secondary` then the confirming action (`destructive` or `primary`).
6. **Don't re-declare focus.** Controls that render a `Button` inherit the ring;
   everything else uses the exported `focusRing` recipe.

## Where the truth lives

- `_ds/<folder>/styles.css` and its imports — the tokens and the full compiled
  utility surface. Read it before inventing a class.
- `guidelines/SPEC.md` — the authoritative reference: the three token layers,
  how to add a token, theming and its failure modes.
- `components/<Group>/<Name>/<Name>.prompt.md` and `.d.ts` — per-component API.

## A representative composition

```jsx
<Card className="flex flex-col gap-4 rounded-lg bg-surface-card p-6">
  <Typography element="h2" textStyle="title20" textColor="primary">
    Storage
  </Typography>
  <Typography element="p" textStyle="body14" textColor="secondary">
    2.4 GB of 10 GB used across all connections.
  </Typography>

  <ProgressBar value={24} />

  <div className="flex items-center justify-end gap-2 border-stroke border-t pt-4">
    <Button variant="tertiary" size="md">Manage</Button>
    <Button variant="primary" size="md">Upgrade</Button>
  </div>
</Card>
```

Library components carry the design language; the agent's own glue (`flex`,
`gap-4`, `p-6`, `border-stroke`) is written in the vocabulary above.
