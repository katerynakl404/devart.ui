---
'@devart/ui-react': patch
---

`Button` / `IconButton` — a disabled `secondary` (and `destructiveOutline`) fades instead of being repainted:
the label keeps `--ink-body` and the whole control goes to `opacity-disabled`, the way a loading `primary` and a
disabled `Checkbox` already look. No fill, as before. DESIGN-SYSTEM-CHANGES §165.

Switched off, `destructiveOutline` is the disabled `secondary`: the secondary border (`--btn-secondary-border`)
instead of `--ink-inactive`, and no red. Both variants read the new `secondaryDisabled` fragment (`./cn`).
