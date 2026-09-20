---
'@devart/ui-react': major
---

`TableCell` wraps again, so a row's height comes from its content.

Every cell carried `overflow-hidden text-ellipsis whitespace-nowrap` in its base
class string, under a comment claiming the clamp "only bites under
`layout="fixed"`". It bit everywhere. `white-space: nowrap` stops text wrapping
whatever `table-layout` is in effect — so in the default `auto` table the column
widened instead of the text wrapping, the table scrolled sideways, and a
two-line cell was unreachable in either mode. The same file's other comment said
the opposite ("a two-line cell has to be free to grow"); the class string won.

The reference has no clamp at all on the base cell —
`table.tbl td { padding: .625rem 1rem; border-bottom: …; color: … }` — and makes
truncation opt-in where it is actually wanted: one description column in the
Connections table, and the horizontally scrolling table variant.

The clamp is now scoped to `layout="fixed"`, keyed off the `data-layout` the
`Table` root already stamps. That is the one mode where it belongs: fixed widths
are taken from the first row and never re-measured, so a long value there really
must not blow its column open.

**Breaking.** Any table relying on single-line rows gets taller rows as soon as a
value wraps. Two ways back: pass `layout="fixed"` (which also stops the columns
re-flowing between the empty, loading and loaded states), or put `truncate` on
the specific cells that should clamp — which is what the reference does, and it
keeps the decision next to the column it affects.

The three arbitrary-variant classes are enumerated in
`.design-sync/gen-classlist.mjs`. They have to be: nothing in that generator
produces a `[[data-layout=fixed]_&]:` prefix, and an un-enumerated class compiles
to nothing in the `ds-bundle` with no error — a fixed-layout table would silently
stop truncating.
