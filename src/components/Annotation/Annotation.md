Labels that point at specific controls inside a lit area.

```jsx
<AnnotationGroup top={rect.bottom + 34}>
  <Annotation target={['[data-tour="attach"]', '[data-tour="connect"]']} icon={<Workflow />}>
    Choose a connector or <b>attach a file</b>
  </Annotation>
  <Annotation target='[data-tour="model"]'>Pick a model</Annotation>
</AnnotationGroup>
```

`Annotation` renders nothing on its own — the group reads its children
(`target`, `icon`, text) and draws them.

## What it draws

Every label sits on the one line `top` names (viewport px) and fans out from
its target without overlapping its neighbour: the first label ends just past
its target, the rest start just before theirs. A curved Brand/Primary arrow
runs from each label to a dashed ring 3px around its target, concentric with
it. Rings side by side never touch — they split the gap and keep 6px apart.

Put `top` below the lit area — and below the coachmark when the coachmark sits
under the target; `Tour` works that out.

## Where it shows

Hidden at 640px and below: there the coachmark is a bottom sheet and lists the
same texts instead. `leaving` fades the group out. Portalled above the
spotlight (`--spotlight-z` + 1) and never takes a click.
