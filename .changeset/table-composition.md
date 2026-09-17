---
'@devart/ui-react': minor
---

Rework `Table`'s padding, dividers and row actions, and add `TableActionsCell`.

**Padding.** `TableHead` and `TableCell` disagreed — `ps-3 pe-2` against `p-2` —
so every column's header sat 4px off its own body text, at half the reference
inset. Both now carry one recipe, 10px vertical and 16px horizontal, and the row
height comes from that padding rather than a competing `h-9`. Body text moves
from `text-xs` to `text-sm`, the size the reference has always used.

**Dividers** moved onto `TableBody` as a child selector, so a plain `<tr>` — 
valid, and what a generator tends to write — still gets separated. `TableRow`
keeps its own copy for a row used outside a body.

**`TableActionsCell`** is new: a fixed 48px, right-aligned, fading its buttons in
on row hover or keyboard focus without reflowing, because the width is reserved
either way. Mounting actions on hover instead makes the table jump under the
pointer. Its buttons' hover is lifted one step, since an action is only ever seen
over a row that is already painting its own hover fill — on dark those two were
previously the same value, making the button hover invisible.

**`layout="fixed"`** is a new prop. The default `auto` layout re-measures every
column from its content, so the same table re-flows between its empty state, its
loading `colSpan` row, and each page of data. Cells truncate under `fixed`, so a
long value can no longer blow its column open.

The header paints **no band** — it sits on the card surface like the rows,
separated by the divider alone.
