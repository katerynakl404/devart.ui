---
'@devart/ui-react': major
---

`IconHint` opens on a tap where there is no hover, and the glyph with nothing to explain is a new `StatusMark`.

`IconHint` was one component doing two jobs behind one prop: with a `tooltip` it was a focusable glyph that showed words, without one an `aria-hidden` span that only painted a state. The two are now separate — `StatusMark` is the state's glyph, decoration always; `IconHint` is the hint, and `tooltip` and `label` are required.

`Tooltip`'s trigger ignores a `touch` pointer by design, so on a phone the glyph never opened. It now opens on a tap, gated on `pointerType === 'touch'`. On a desktop nothing changes: hover and keyboard focus show the words, nothing is clickable, and the glyph is not marked as a control.

Migrating: `<IconHint variant="warning" />` with no tooltip becomes `<StatusMark variant="warning" />`; every `IconHint` that already passed `tooltip` and `label` keeps working unchanged.
