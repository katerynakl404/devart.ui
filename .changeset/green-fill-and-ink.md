---
'@devart/ui-react': minor
---

Green is split the way red already is: a fill that keeps one colour in both
themes, and an ink that moves with the theme.

- `--fb-green` is the fill: Green-700 in both themes, white on it 5.48:1 — like
  `--fb-red` under the destructive button. It was Green-600 / Green-500, and
  white on it fell to 3.77:1 on light and 2.54:1 on dark.
- New `--fb-green-text` (`text-fb-green-text`), the twin of `--fb-red-text`:
  Green-800 on light, Green-500 on dark. Every success text — `Alert`, `Badge`,
  `IconHint`, `Spinner`, `StatusView`, `Timeline`, `Typography` — and every
  green wash (`--alert-*`, `--toast-*`, `--badge-green-*`) reads it, as the red
  ones read `--fb-red-text`. Success text on the card was 3.77:1 on light; it is
  7.68:1. New primitive `--green-800`.
- `SegmentedControl` (draft parts): a `tinted` option is a 10% wash under the
  tone's ink and keeps it on hover, taking the rim every option takes — the 30%
  hover wash dropped its text below 4.5:1 in both themes. New `semantics`
  (`'tabs' | 'radio'`, `radio` by default when `deselectable`): a value picker
  is a `radiogroup` of `radio`s with `aria-checked`, not tabs pointing at panels
  that are not there. New `tintedLabel` on the trigger, read after the label
  while the option is `tinted` and not chosen ("in effect" by default).
- New `src/__tests__/contrast.test.ts` checks these pairs in both themes from
  `globals.css`.

`apps/web/src/index.css` keeps its own copy of the tokens: `--green-800`,
`--fb-green`, `--fb-green-text` and the green washes need the same edit there.
