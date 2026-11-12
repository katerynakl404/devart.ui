---
'@devart/ui-react': minor
---

`Button` / `IconButton` `primaryTertiary` — the label reads three new tokens, `--btn-primary-tertiary-text`,
`--btn-primary-tertiary-text-hover` and `--btn-primary-tertiary-text-press` (`text-btn-primary-tertiary-text*`), and
holds AA 4.5:1 in every state. Before, light hover (`--brand-hover`, 3.66:1) and dark press (`--brand-press`, 3.09:1)
fell under it. Light: `--brand-primary`, then `--brand-press` on hover and press; dark: `--ink-highlight` in every
state, on `IconButton` too. DESIGN-SYSTEM-CHANGES §179.
