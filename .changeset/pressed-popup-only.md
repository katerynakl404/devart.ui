---
'@devart/ui-react': patch
---

`pressed:` holds a button pressed while it is an open popup trigger (`aria-haspopup`, `role="combobox"`), not on every `aria-expanded` — an open disclosure (a tree branch, "Show less", an expandable `ChoiceCard`) no longer sits pressed. `Tree`'s toggle keeps `aria-expanded`; its rows hover with the row wash, `tbl-row-hover` (§150, §155).
