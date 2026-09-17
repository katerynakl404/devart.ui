A group of toggles — for **several independent filters held at once**, where any
combination can be on.

```jsx
<ToggleGroup type="multiple" value={active} onValueChange={setActive}>
  <ToggleGroupItem value="csv">CSV</ToggleGroupItem>
  <ToggleGroupItem value="xlsx">XLSX</ToggleGroupItem>
  <ToggleGroupItem value="pdf">PDF</ToggleGroupItem>
</ToggleGroup>
```

`type="single"` also exists. Use it when exactly one option must be held and
the options are peers; reach for `SegmentedControl` only when the choice changes
how the *same* content is presented rather than which items are shown.

Note that a true filter-chip row — multi-select, clearable, with counts — has no
dedicated component here yet, so a toggle group is the closest honest fit.

## Sizes

`xs` (28) `sm` (32, the default) `md` (36) `lg` (40) — the same box ladder as
`Button` and `IconButton`, so a toggle group lines up beside a button of the
same size. Variants are `default` and `outline`; `outline` is the default and
the right one for a filter bar, where the unselected items still need an edge.

An icon-only toggle needs an `aria-label`, exactly like `IconButton`.
