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
