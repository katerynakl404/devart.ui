---
'@devart/ui-react': minor
---

`Button` / `IconButton` — one set of state rules (DESIGN-SYSTEM-CHANGES §180–§183, `Button.md` → Rules):

- Hover and press, one wash a family (§180). `secondary`, `outline`, `tertiary` and `primaryTertiary` take
  `--state-hover` / `--state-pressed`, 8% / 12%; `secondary` has it mixed over its card fill (new
  `--btn-secondary-bg-press`). The red pair is 8% / 12% on light and 12% / 15% on dark;
  `--btn-destructive-tertiary-bg-*` alias `--btn-outline-destructive-bg-*`.
- One disabled look for every unfilled button (§181): its `--ink-body` label, no fill, faded. `outline`
  takes `secondaryDisabled`; the borderless ones take the new `ghostDisabled` (`./cn`).
- `Button` `xs` has the 4px radius of `IconButton` `xs` (§182).
- `fullWidth`: a `leftSlot` icon stays beside the label when it is centred, right-aligned or beside a
  `rightSlot` (§183).
- `ModalContent`'s `closeButtonProps` no longer requires `aria-label`; the close button has a default.
