---
'@devart/ui-react': minor
---

Add `FilterChips` — the single-select filter strip that narrows a list: All /
Artifacts / Uploaded, with an optional count on each chip. The API is the
developers' (`upstream` 1.1.0): `items` (`FilterChipItem` — `value`, `label`,
`count?`), `value`, `onValueChange`, `className`. There are no child parts and
no `size`.

The strip is fully controlled, so the selection can live in a URL parameter or a
store. Toggling the active chip off reports `''`, which is how a single toggle
group signals deselection — a strip that must always have a selection ignores
that value rather than storing it. One horizontally scrolling row with a fade at
the overflowing edge below `md` (the kit's `.chip-row` at ≤767px), wrapping from
`md` up.

`count` is optional and `0` renders; only `undefined` hides it, so an empty
bucket reads honestly as `0` instead of disappearing. The chip itself is
`ToggleGroup`'s `stroke` / `xs` / `full` item — the kit's `.chip`.

This is **not** `SegmentedControl`. That switches how the same content is
presented (Table / Chart); this changes which items are shown. The two look
alike and are not interchangeable, and both components' docs say so.
