A list item that reveals a checkbox once the list enters selection mode — a
file, a chat, an insight.

```jsx
<AsyncList
  containerProps={{ 'data-has-selection': selected.size ? 'true' : undefined }}
  renderItem={(chat) => (
    <SelectableListCard
      layout="row"
      isSelected={selected.has(chat.id)}
      checkboxAriaLabel={`Select ${chat.title}`}
      cardContent={<span className="min-w-0 flex-1 truncate">{chat.title}</span>}
      rightSlot={<span className="text-xs text-ink-secondary">{chat.time}</span>}
      menu={<>
        <DropdownMenuItem><Pin /> Pin</DropdownMenuItem>
        <DropdownMenuItem variant="danger"><Trash2 /> Delete</DropdownMenuItem>
      </>}
      onCheckboxToggle={() => toggle(chat.id)}
      onCardClick={() => open(chat.id)}
    />
  )}
  …
/>
```

## Two layouts

| | `row` | `card` (default) |
|---|---|---|
| surface | `Card variant="row"` — the 44px one-line row | `Card variant="secondary"` |
| checkbox | inline, first in the row | floats 24px left of the card from `md` up; inline below |
| selected | Brand/Primary border over State/Pressed | `selectedClassName` |
| `menu` | yes | no — put a `RowMenuButton reveal={false}` in `rightSlot` |

## Selection mode is not a prop

An ancestor carrying `group/list` stamps `data-has-selection` while anything is
selected, and every item answers it. `AsyncList` supplies that ancestor.
Passing a flag to each item instead would re-render the whole list on the
first selection. A selected row shows its checkbox either way.

## Keyboard

The item is a **tab stop**, and **Enter and Space** do what a click does —
`onCardClick`. Only while the item *itself* has focus: the checkbox, a pin, the
⋮ and a rename field answer their own keys, and those keys bubble through the
item on their way out.

The item carries its selection as **`aria-selected`**. The checkbox inside
says the same thing to anything that does not read the attribute.

The `row` layout has the row's own focus ring; the `card` layout takes the
system ring (`focusRing`), held off by the page colour.

## The menu

`menu` takes `DropdownMenuItem`s and puts a `RowMenuButton` at the right edge
of the row, after `rightSlot`. It is revealed on hover, on keyboard focus and
while open, and **always shown below `md` and on touch**. It takes only a text
line's height, so a row with a menu stays 44px, level with one without.

`menuLabel` names it (default "More actions"); in a list of many, add the
row's title. Clicks and keys in the menu never reach the row, and an item that
opens a field (Rename → `InlineRename`) keeps the focus it gave it. See
`RowMenuButton`.

The menu does not toggle selection by itself: "Select" is an item the page
adds, like any other.

## A conversation row

The parts compose into the full chat row with nothing local:

- the title — or an `InlineRename` in its place while renaming;
- a `PinToggle` (`-my-0.5`) beside a pinned title;
- the time in `rightSlot`;
- `menu`: Pin / Unpin · Select / Deselect · Rename · Delete;
- above the list, a `MetaRow` that goes `sticky` while anything is selected.

The **Interactive** story is that list.
