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
      <TableHead>Source</TableHead>
      <TableHead width="md">Status</TableHead>
      <TableHead width="md" className="text-right">Rows</TableHead>
      <TableHead width="actions"><span className="sr-only">Actions</span></TableHead>
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
state, the loading `colSpan` row, and each page of data. Cells truncate with an
ellipsis under `fixed`, so a long value can never blow its column open.

**Widths come from `TableHead`'s `width` prop, never a `w-*` class.**

```jsx
<TableHead width="control"><Checkbox /></TableHead>
<TableHead>Name</TableHead>              {/* auto — takes the slack */}
<TableHead width="md">Data source</TableHead>
<TableHead width="lg">Workspaces</TableHead>
<TableHead width="actions" className="text-right">Actions</TableHead>
```

`sm` (12%), `md` (16%) and `lg` (20%) are **shares of the table, not sizes**,
and that is the point: under `fixed` a specified width is the entire algorithm,
content sizes nothing, and **`min-width` on a `th` is ignored** — so a pixel
width can never narrow with the window and a pixel floor never holds. A
percentage does both. `control` (48px) and `actions` (112px) stay in pixels
because a checkbox and a row's action cluster each have one correct size.

Give exactly one column `auto`: the one holding the reading, where truncation
costs the reader something. The **floor** is the scroll container's own
`min-width` — one number, from which every percentage column inherits a
sensible minimum, instead of one number per column.

A `th`'s width is overruled by a body cell that sets one of its own, so do not
put `w-*` on a `TableCell` or `TableActionsCell` either.

**Row actions belong in `TableActionsCell`**, never a hand-rolled `TableCell`.
It is a fixed 48px, right-aligned, and fades its buttons in on row hover or
keyboard focus *without* reflowing, because the width is reserved either way.
Mounting actions on hover instead makes the table jump under the pointer. Pair
it with a `<TableHead width="actions">` carrying an `sr-only` label. Size row
actions `2xs` — a 24px box around a 14px glyph, one step below the shared
Button/IconButton ladder. `reveal={false}` keeps them visible at rest.

**Clickable rows take `data-interactive`** — that attribute is what switches the
hover and press fills on. Selection is either `className="is-selected"` or
`data-state="selected"`; both paint `--tbl-row-pressed`, a step beyond the hover
fill in both themes.

### A row that navigates

`data-interactive` paints the states; it does not make the row reachable. A row
that opens a page is **one real anchor, stretched over the row** — not an
`onClick` on the `<tr>`, and not a link on the title.

```jsx
<TableRow data-interactive>
  <TableCell>
    <a href={`/connections/${row.id}`} className="after:absolute after:inset-0">
      {row.name}
    </a>
  </TableCell>
  <TableCell>{row.source}</TableCell>
  <TableActionsCell>…</TableActionsCell>
</TableRow>
```

The anchor is the accessible target — it takes Tab, announces as a link, and
opens in a new tab on middle-click or ⌘-click. Its `::after` is what makes the
**whole row** the hit area, so the user aims at the row rather than at the few
words of the name. `TableCell` is `relative`, which is the positioned ancestor
that `inset-0` resolves against — a `<tr>` cannot be relied on for that, because
`position: relative` on a table row is ignored by some engines.

Two things follow from the stretched link:

- **The title is not styled as a link.** It inherits the cell's ink; the row's
  hover fill is the affordance. A blue underlined name inside a row that is
  itself clickable advertises two targets where there is one.
- **Anything else interactive in the row must out-stack the `::after`** — give
  it `relative` so it sits above the sheet. `TableActionsCell`'s buttons already
  do. This is also why `TableCell`'s press state is guarded with
  `:not(:has(a:active))`: pressing a control in the row must not paint the row.

**Numeric columns are `text-right` on both the head and the cell**, or the
figures drift away from their own label.

## Selection and select-all

`Table` holds no state — selection lives in the consumer. The wiring is always
the same shape, and the header checkbox is where it usually goes wrong:

```jsx
const allSelected = selected.length === rows.length;
const someSelected = selected.length > 0 && !allSelected;

<TableHead width="control">
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

Both are a single row with `colSpan` covering every column. Under
`layout="fixed"` the columns hold their widths through the transition; under
`auto` they snap.

Loading is `h-24 text-center`. **Empty is a `StatusView`** —
`surface="embedded" tone="transparent"`, with `py-12` on the cell instead of
`h-24`, because StatusView brings its own padding:

```jsx
<TableRow>
  <TableCell className="py-12" colSpan={5}>
    <StatusView
      surface="embedded"
      tone="transparent"
      size="lg"
      withIconHalo={false}
      icon={<EmptyStateIllustration />}
      title="No connections yet"
      description="Connect a data source to give AI access to it"
      actions={<Button size="sm">Create Connection</Button>}
    />
  </TableCell>
</TableRow>
```

Three things this settles, and all three are easy to get wrong:

- **The empty state lives INSIDE the table.** The header row, the search field
  and the primary button stay exactly where they were, so the page does not
  rebuild itself around the absence of rows and the user does not have to
  re-find the controls when the first row appears.
- **Two states, not one.** A first run ("nothing here yet") and a filtered miss
  ("nothing matches *this*") are different problems and need different copy. The
  filtered one also needs a way to undo the filter.
- **Both carry an action.** An empty state is never a dead end: it is the one
  moment when the next step is obvious, so it is spelled out rather than left for
  the user to find in the toolbar.

Copy: the title is a short phrase with no trailing period; the description is one
line, centred, also with no period.
