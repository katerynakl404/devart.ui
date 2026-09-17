---
'@devart/ui-react': minor
---

Add `FilterChips` / `FilterChip` — the single-choice filter bar that narrows a
list: All / Artifacts / Uploaded, with an optional count on each chip.

It is a Radix radio group rather than a row of buttons, because that is the
actual semantic: exactly one chip is always active. A hand-rolled pill row looks
identical and has none of what follows from that — arrow-key movement along the
row, one tab stop for the whole bar, and "2 of 3" announced to a screen reader.

`count` is optional and `0` renders; only `undefined` hides it, so an empty
bucket reads honestly as `0` instead of disappearing. The count is a plain span,
deliberately not a `Badge` — a badge inside a chip reads as a second control and
doubles the border noise.

This is **not** `SegmentedControl`. That switches how the same content is
presented (Table / Chart); this changes which items are shown. The two look
alike and are not interchangeable, and both components' docs now say so.
