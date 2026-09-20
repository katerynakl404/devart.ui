The line above a list: what the list holds, and what can be done to a selection.

```jsx
<MetaRow onClear={() => setSelected([])}>
  <MetaRow.Count>3 selected</MetaRow.Count>
  <Link>Select all</Link>
  <MetaRow.End>
    <Button size="sm" variant="destructiveTertiary" leftSlot={<Trash2 />}>
      Delete
    </Button>
  </MetaRow.End>
</MetaRow>
<Table />
```

## Spacing — the one rule

The row supplies **its own** vertical space and **no outer margin**:

| | |
|---|---|
| vertical padding | 6px top and bottom |
| minimum height | 44px |
| between members | 12px, 8px when it wraps |
| inside `MetaRow.End` | 4px |
| **between the row and the list under it** | **4px** |

```jsx
<div className="flex flex-col gap-1">
  <MetaRow>…</MetaRow>
  <Table>…</Table>
</div>
```

A gap on the stack, not a margin on either. **Never both.** A row with its own padding, a margin under it and a
stack gap around it is three answers to one question, and it is exactly why
this gap drifts from page to page.

The 44px floor is what keeps the list from moving when a selection appears and
the actions arrive — the row is already that tall with nothing in it.

## Why it has no surface

No background, no border, no card. The row belongs to the list under it; give
it a surface and it becomes a toolbar, which is a different thing that sits
above the list rather than introducing it.

For the same reason everything in it reads at one typographic level — the
count, the link and the buttons are all Body — so the row is one sentence
rather than three controls that happen to be on a line.

## What goes in it

- **`MetaRow.Count`** — the reading. `Text/Secondary`, regular weight, never
  wraps. "5 connections", "3 selected", "1 connection" (mind the singular).
- **A `Link` beside it** — the action that belongs to the count, and the reason
  the default layout clusters them: "10 conversations · Select all" reads as one
  thing, where two edge-anchored items read as two. It toggles *Select all* →
  *Deselect all* when the selection reaches the total.
- **`MetaRow.End`** — the cluster that acts on the selection, pushed to the far
  edge. Buttons are `size="sm"` and **tertiary**: the row is a reading with
  actions attached, not a toolbar, and an outlined destructive button here
  outweighs the list it introduces.

- **`onClear`** — the way out. See below.

Use `variant="split"` when the action belongs on the opposite edge from the
count rather than next to it.

## Leaving the selection

`onClear` renders a ✕ at the very end of the row, after `MetaRow.End`.

It belongs to the component rather than to each page because it is part of the
contract, not a decoration on top of it. A selection changes what the row says
and what the list means, and the only other ways out are untick every row or
guess — so the row that announces the selection is also the row that ends it.

It sits outside `MetaRow.End` on purpose: everything in that cluster *acts on*
the selection, and leaving one is not one of those actions. Give it a handler
whenever there is a selection to leave, and leave it off when the row is only
reporting a count.
