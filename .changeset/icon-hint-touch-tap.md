---
'@devart/ui-react': patch
---

`IconHint` opens its tooltip on a tap, not only on hover and keyboard focus — Radix's trigger ignores a `touch` pointer by design, so on a phone the glyph never opened at all. A second tap closes it; tapping elsewhere already did, through the tooltip's own dismiss layer. Unchanged for the mouse and the keyboard, and for every other tooltip (`ControlTooltip`'s buttons keep tap as their action — opening on tap there would race the press).
