A grouped pill switch — **a view switcher**, not a filter. Same content, shown a
different way: List / Board / Calendar, Chart / Table, Day / Week / Month.

The distinction matters: a segmented control always has exactly one segment
active, and every segment shows the *same* set of things. A filter narrows the
set, can be off entirely, and often stacks with other filters. If the choice
removes rows from a list, this is the wrong control.

```jsx
<SegmentedControl defaultValue="table" onValueChange={setView}>
  <SegmentedControlList>
    <SegmentedControlTrigger value="table">Table</SegmentedControlTrigger>
    <SegmentedControlTrigger value="chart">Chart</SegmentedControlTrigger>
  </SegmentedControlList>
  <SegmentedControlContent value="table">…</SegmentedControlContent>
  <SegmentedControlContent value="chart">…</SegmentedControlContent>
</SegmentedControl>
```

`SegmentedControlContent` is optional — leave it out when the switch only drives
state you render yourself.

## Which control for which job

| Situation | Use |
|---|---|
| Same content, different presentation | **`SegmentedControl`** |
| Switching between peer views of one object, each its own panel | `Tabs` |
| Several independent on/off options held at once | `ToggleGroup type="multiple"` |
| A linear, ordered flow | `Stepper` |
| A non-interactive status label | `Badge` |

Narrowing a result set — filter chips with counts, clear-all, multi-select — has
**no component in this library yet**. Do not press a segmented control into that
job: it cannot express "none selected" or "two of five".

## Sizes and shape

Triggers are `sm` (20px) or `md` (32px) — `md` at page level, `sm` only inside a
dense toolbar. The `rounded` scale runs `none | sm | md | lg | xl`; set it once
on the list, since the triggers derive their radius from the group.

Keep labels to one word where possible. A segmented control that wraps to a
second line is a `Select` wearing the wrong clothes.
