A single-choice filter bar — the pill row that narrows a list.

```jsx
<FilterChips value={filter} onValueChange={setFilter}>
  <FilterChip value="all" count={24}>All</FilterChip>
  <FilterChip value="artifacts" count={11}>Artifacts</FilterChip>
  <FilterChip value="uploaded" count={13}>Uploaded</FilterChip>
</FilterChips>
```

## Not a SegmentedControl

They look nearly identical and are not interchangeable:

| | Changes | Can be "none" |
|---|---|---|
| `FilterChips` | **which items** are shown | no — one chip is always active, and that chip is usually "All" |
| `SegmentedControl` | **how the same items** are presented (Table / Chart) | no |
| `ToggleGroup type="multiple"` | several independent options at once | yes |

If the choice removes rows from a list, it is this component.

## Why a radio group

`FilterChips` is a Radix radio group, not a row of buttons. That is the real
semantic — exactly one is active — and it is what gives arrow-key movement
along the row, a single tab stop for the whole bar, and "2 of 3" announced to a
screen reader. A hand-rolled row of pills looks the same and has none of it.

## Counts

`count` is optional. **`0` renders** — only `undefined` hides it, so an empty
bucket still shows honestly as `0` rather than disappearing. The count is a
plain span, deliberately not a `Badge`: a badge inside a chip reads as a second
control and doubles the border noise.

## Sizes

`sm` (28px) inside a dense toolbar, `md` (32px, the default) at page level —
the same box ladder as `Button` and `IconButton`, so a chip row lines up with a
button beside it. Set `size` on the group and on each chip.

Put the bar directly above the list it filters, with `gap-2` between chips. It
wraps rather than scrolls, so keep the set small; past six or seven buckets a
`Select` is the honest control.
