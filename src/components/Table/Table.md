Data tables with sortable headers, row states and a row-actions column.

`Table` ships its own frame — border and radius — so **never wrap it in a
`Card`**. The header paints **no band**: it sits on the card surface like the
rows below it, separated by the divider alone. The container also scrolls horizontally, which is what
keeps a wide table inside its column instead of stretching the page.

## Table or cards

A list of records that share the same fields is a **table**, not a grid of
cards. Cards look friendlier and cost the things a list is for: you can no
longer scan one column top to bottom, compare a status across rows at a glance,
sort, or select several at once — a checkbox column has nowhere to live in a
card grid.

| Use a table | Use cards |
|---|---|
| Homogeneous records, same fields on each | Heterogeneous things, or one-off summaries |
| Values worth comparing down a column (dates, sizes, counts, status) | A preview, thumbnail, or chart is the point |
| Sorting, selection, bulk actions, pagination | Free-form body text of varying length |
| More than ~5 rows | A handful of entry points |

Connections, users, invoices, files, logs are tables. A dashboard of unrelated
metrics is cards.

## Composition

```jsx
<Table layout="fixed">
  <TableHeader>
    <TableRow>
      <TableHead className="w-1/2">Source</TableHead>
      <TableHead className="w-32">Status</TableHead>
      <TableHead className="w-32 text-right">Rows</TableHead>
      <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map((r) => (
      <TableRow key={r.id} data-interactive>
        <TableCell className="font-medium">{r.name}</TableCell>
        <TableCell>{r.status}</TableCell>
        <TableCell className="text-right">{r.rows}</TableCell>
        <TableActionsCell>
          <IconButton aria-label={`Actions for ${r.name}`} size="2xs" variant="tertiary">
            <MoreHorizontal />
          </IconButton>
        </TableActionsCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Rules

**Never re-pad a cell.** `TableCell` and `TableHead` carry one shared recipe —
10px vertical, 16px horizontal — deliberately identical in both, because a
header inset that differs from its column's body inset is the most visible
table defect there is. Row height comes from that padding; do not add `h-*`.

**Use `layout="fixed"` for anything that loads, paginates or filters**, and give
each `TableHead` in the first row a width. The default `auto` layout re-measures
every column from its content, so the columns visibly jump between the empty
state, the loading `colSpan` row, and each page of data. Give one column the
slack (`w-1/2`, or no width) and pin the rest. Cells truncate with an ellipsis
under `fixed`, so a long value can never blow its column open.

**Row actions belong in `TableActionsCell`**, never a hand-rolled `TableCell`.
It is a fixed 48px, right-aligned, and fades its buttons in on row hover or
keyboard focus *without* reflowing, because the width is reserved either way.
Mounting actions on hover instead makes the table jump under the pointer. Pair
it with a `<TableHead className="w-12">` carrying an `sr-only` label. Size row
actions `2xs` — a 24px box around a 14px glyph, one step below the shared
Button/IconButton ladder. `reveal={false}` keeps them visible at rest.

**Clickable rows take `data-interactive`** — that attribute is what switches the
hover and press fills on. Selection is either `className="is-selected"` or
`data-state="selected"`; both paint `--tbl-row-pressed`, a step beyond the hover
fill in both themes.

**Numeric columns are `text-right` on both the head and the cell**, or the
figures drift away from their own label.

## Selection and select-all

`Table` holds no state — selection lives in the consumer. The wiring is always
the same shape, and the header checkbox is where it usually goes wrong:

```jsx
const allSelected = selected.length === rows.length;
const someSelected = selected.length > 0 && !allSelected;

<TableHead className="w-12">
  <Checkbox
    aria-label="Select all invoices"
    checked={allSelected ? true : someSelected ? 'indeterminate' : false}
    onCheckedChange={(next) => setSelected(next === true ? rows.map((r) => r.id) : [])}
  />
</TableHead>
```

Three things to get right:

- **The partial state is the literal string `'indeterminate'`**, not a separate
  boolean prop. A plain `checked={someSelected}` collapses it: the header reads
  as "nothing selected" while rows visibly are.
- **The header toggle is select-all / clear-all**, never a per-row invert.
  `onCheckedChange` hands you `true | false | 'indeterminate'`, so branch on
  `next === true` rather than on the previous state.
- **The checkbox column is `w-12`** and its cells need no padding of their own —
  `TableCell` and `TableHead` already drop their trailing padding when they
  contain a `[role=checkbox]`.

Mark the selected rows with `data-state="selected"` (or `className="is-selected"`)
so they paint the selected fill, and keep `data-interactive` on them if the row
itself is clickable.

## States

Row fills paint on the **cells**, not the row: a `<tr>` background renders below
every `<td>`, so a row-level rule loses to any cell with a background of its own.
The ladder is hover → selected → selected+hover, each a larger step than the
last, in both themes.

Inside a hovered row an action's own hover is lifted one rung, because the row
is already painting a fill underneath it and the two would otherwise collapse
into one flat surface.

## Empty and loading

Both are a single row with `colSpan` covering every column and `h-24
text-center`. Under `layout="fixed"` the columns hold their widths through the
transition; under `auto` they snap.
