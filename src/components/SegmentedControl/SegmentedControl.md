A grouped pill switch — **a view switcher**, not a filter. Same content, shown a
different way: List / Board / Calendar, Chart / Table, Day / Week / Month.

The distinction matters: a segmented control has one segment active, and every
segment shows the *same* set of things. A filter narrows the set, can be off
entirely, and often stacks with other filters. If the choice removes rows from
a list, this is the wrong control.

The one exception is **`deselectable`** (below): a two-answer setting where
"not chosen here" is an answer of its own.

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

## Tones — `positive` / `negative`

For two options that are not equivalent — a FACT with a consequence: included
or excluded, allowed or blocked. `tone` is per trigger, because only the
option knows whether it is the permissive one. Selected, `positive` fills
`--fb-green` and `negative` `--fb-red` with white text — one colour in both
themes, like the destructive button; unselected, both are neutral text. A plain
view switcher stays `neutral` (the default).

A control with tones is a value picker, not a view switcher: give it
`semantics="radio"` (below).

```jsx
<SegmentedControlTrigger value="allow" tone="positive">Allow</SegmentedControlTrigger>
<SegmentedControlTrigger value="deny" tone="negative">Deny</SegmentedControlTrigger>
```

**Hover** — an unselected option lifts and its text steps up to primary, as on
any trigger: the colour is the answer, not the offer, and a grey option turning
red under the pointer would announce a Deny nobody chose. A `tinted` option
keeps its own wash and ink instead (below).

## Nothing selected — `deselectable`

`deselectable` on the root makes none a state: `value` may be `''`, and
pressing the selected option again — or Enter / Space on it — returns to it
(`onValueChange('')`). For a setting that can also be left to a level above:
Allow / Deny / *Inherit*, Included / Excluded / *inherited*. Use the same on
every surface that has such a setting, so the way back works the same
everywhere. Without it, a view switcher keeps one segment active.

```jsx
<SegmentedControl deselectable value={own ?? ''} onValueChange={(v) => set(v || null)}>
  …
</SegmentedControl>
```

## Inherited — `tinted`

A solid pill is a value chosen on this row. `tinted` draws a value that is in
effect WITHOUT being chosen here — inherited from a level above, or a default —
as the tone's fill at 10% under the tone's ink (`--fb-green-text` /
`--fb-red-text`), on an unselected option: a Badge's pale fill, a step lighter
because it sits on the recessed track.

Hovered, a tinted option keeps its wash and its ink and takes the rim every
option takes: pressing it confirms the value on this row. A deeper wash under
the same ink fell below 4.5:1. With `deselectable`, pressing it again goes back
to inheriting.

A screen reader cannot see the pale fill, so the trigger reads `tintedLabel`
after its label while it is tinted and not chosen — "Allow, in effect" by
default. Pass your own words: `tintedLabel="inherited from Finance"`.

```jsx
<SegmentedControl deselectable value={own ?? ''} onValueChange={(v) => set(v || null)}>
  <SegmentedControlList>
    <SegmentedControlTrigger value="allow" tone="positive" tinted={!own && fromAbove === 'allow'}>
      Allow
    </SegmentedControlTrigger>
    <SegmentedControlTrigger value="deny" tone="negative" tinted={!own && fromAbove === 'deny'}>
      Deny
    </SegmentedControlTrigger>
  </SegmentedControlList>
</SegmentedControl>
```

Say where the value comes from in a tooltip — the control cannot.

## What a screen reader hears — `semantics`

The control is built on Radix Tabs, which is right for a view switcher: its
segments show panels. A value picker shows no panel, and announced as tabs it
reads "Allow, tab, 1 of 2" with each option pointing at a panel that is not
there. `semantics="radio"` makes the list a `radiogroup` and each option a
`radio` with `aria-checked`; arrows, Tab and Space work as before.

| | `semantics` |
|---|---|
| View switcher with `SegmentedControlContent` | `tabs` (the default) |
| Allow / Deny, Included / Excluded, anything with `tone` | `radio` |
| `deselectable` | `radio` — the default when it is set |

Name the group as you would any radio group — `aria-label` on
`SegmentedControlList`, or `aria-labelledby` pointing at the row's name.

## Disabled

A disabled trigger keeps what it shows — the selected tone, a tinted option —
dimmed (`opacity-disabled`), with the not-allowed cursor. Do not swap it to
`neutral` when it is switched off: a row that cannot be changed still has to
say what it holds and what it would get back.

## A tooltip on a trigger

Wrap the trigger in a `span` and hang the tooltip on that. `TooltipTrigger
asChild` writes its own `data-state` ("closed" / "delayed-open") onto its
child — the very attribute a trigger's selected fill is painted from — so put
straight onto a trigger it repaints the selected option as unselected.

```jsx
<Tooltip>
  <TooltipTrigger asChild>
    <span className="inline-flex">
      <SegmentedControlTrigger value="allow" tone="positive">Allow</SegmentedControlTrigger>
    </span>
  </TooltipTrigger>
  <TooltipContent>Inherited from the connection</TooltipContent>
</Tooltip>
```

## Sizes and shape

Triggers are `sm` (20px) or `md` (32px) — `md` at page level, `sm` only inside a
dense toolbar. The `rounded` scale runs `none | sm | md | lg | xl`; set it once
on the list, since the triggers derive their radius from the group.

Keep labels to one word where possible. A segmented control that wraps to a
second line is a `Select` wearing the wrong clothes.
