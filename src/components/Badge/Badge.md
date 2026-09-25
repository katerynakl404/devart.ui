A small status or category chip.

## Variants

`primary` `secondary` — neutral categorisation.
`attention` `success` `error` — feedback states.
`brand` `green` — emphasis chips with an opaque tint.

Pick by **meaning, not colour**: a "Syncing" chip is `attention`, a "Connected"
chip is `success`, a "Failed" chip is `error`. Do not use `error` for a count or
`success` for a label that is merely positive-sounding.

```jsx
<Badge variant="success">Connected</Badge>
<Badge variant="attention">Syncing</Badge>
<Badge variant="error">Failed</Badge>
```

## When a state is a badge and when it is text

This is a product-wide rule, not a per-row choice. A field that is a **state of
the object** — one value out of a closed set — is a badge in *every* place it
appears, and the variant carries the severity:

| Meaning | Variant | Example |
|---|---|---|
| normal, nothing to do | `secondary` | `Configured`, `3 days ago` |
| needs an action | `attention` | `Not configured`, `Disabled` |
| the thing failed | `error` | `Check failed` |
| explicitly good | `success` | `Connected` |

The trap this rule exists to close: styling the *bad* value as a badge and the
*good* value as plain text. It looks tidy on one screen and makes the column
unreadable — the eye learns "a chip means trouble", and then the first neutral
chip it meets is a false alarm. A column of chips where one is amber scans in a
single pass; a column where only the amber rows have chips does not.

Anything that is **not** a state — a name, a count, a description — is
`Typography`, never a badge.

## A badge is never a control

It carries no action, is never a `<button>`, and is never wrapped in one. Its
only behaviour is a tooltip, and the component owns that:

```jsx
<Badge variant="secondary" tooltip="Last checked 18 Sep 2026, 14:20">
  3 days ago
</Badge>
```

`tooltip` needs a `TooltipProvider` above it, the same as every other tooltip
in the package — an app mounts one at its root. Without it the badge throws
rather than rendering without a tooltip, so a page that adds `tooltip` to a
status inside an unwrapped subtree goes blank.

`tooltip` makes the badge itself the trigger — reachable by keyboard through
`tabIndex`, with no `role="button"` promising an action it does not keep. A
badge wrapped in a bare `<button>` announces "button" to a screen reader and
picks up a press state in the theme; that is the thing this prop replaces.

If a chip really does need to *do* something, it is not a badge. Use
`Button size="xs"`, or `FilterChips` when it is a filter.

## The hairline

Every badge carries a 1px border in `--badge-border` — `color-mix()` from
`currentColor`, so the line is the chip's own hue on every variant and no
variant needs a border token of its own.

It is not decoration. A `secondary` badge is filled with `--surface-card2`,
which is also where a hovered or selected table row lands, so without the
hairline the chip dissolves into the row underneath it and every table has to
put the edge back with a rule of its own. `flat` is the opt-out for a chip on a
surface it already contrasts with:

```jsx
<Badge variant="secondary" flat>Draft</Badge>
```

## A note on the tints

The feedback variants are alpha tints of the feedback roles
(`bg-fb-green/15` and friends), so they sit on any surface. The `brand` and
`green` variants are built with `color-mix()` instead, because they need to be
**opaque** — a translucent chip over a card border lets the border show through.

That has one consequence worth knowing: a `color-mix()` token takes **no**
opacity modifier. `bg-badge-brand-bg/50` silently emits nothing.

## Placement

A badge inside a table cell or a title row is `inline` and vertically centred —
do not wrap it in a flex container just to align it. Keep the label to one or
two words; a chip that wraps is a sentence wearing a chip's clothes.

The base is `whitespace-nowrap overflow-hidden`, so it cannot: the height comes
from `size`, and a second line would spill out of the pill rather than grow it.
A label with too little room is **truncated with an ellipsis inside the pill** —
it never wraps and never runs out over what sits next to it. The dot, both slots
and the delete control are `shrink-0`; the label is the only part that gives
way, so a squeezed chip still shows its glyph and its shape.

An ellipsis is a fallback, not a layout: `Not config…` is the sign that the
label needs shortening or the column widening. Pair a badge whose text can be
cut with `tooltip`, so the full wording stays reachable.
