A Radix checkbox, including the indeterminate state for a "select all" header.

```jsx
<Checkbox checked={all ? true : some ? 'indeterminate' : false} onCheckedChange={…} />
```

In a table, the select-all checkbox lives in a `TableHead` and the row ones in a
`TableCell`; both cells drop their trailing padding automatically via
`[&:has([role=checkbox])]`, so do not re-pad them.

**Disabled is an opacity fade, not a colour swap.** The checkbox keeps its own
fill and ink and drops to `opacity-disabled`; overriding the colours instead
makes a checked-disabled box read as unchecked.

`aria-invalid` is supported for a checkbox that must be ticked to proceed. Give
every standalone checkbox a visible label, or an `aria-label` when the label is
a column header rather than adjacent text.
