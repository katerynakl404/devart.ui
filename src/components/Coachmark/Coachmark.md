The explanation next to what a spotlight lights: a popover-surface card with
an arrow at the target.

```jsx
<Coachmark
  target='[data-tour="composer"]'
  side={['top', 'bottom']}
  header={<StepProgress size="sm" fill showStepTitle aria-label="Progress" steps={STEPS} current={2} />}
  icon={<MessageSquare />}
  title="Start here: ask your first question"
  footer={<><span className="flex-1" /><Button size="sm">Next</Button></>}
>
  <p>Type a question and press <b>Enter</b>.</p>
</Coachmark>
```

## Placement

`side` is a preference list (default bottom, top, right, left). The card takes
the first side where it fits whole without covering the target — 14px off it,
8px inside the bounds. If none fits it takes the first with 75% of its size
free, else the roomiest, and pins to that edge. It re-places itself as the page
moves; `onPlace({ top, bottom, side })` reports where it landed (`null` as a
sheet). At 640px and below it is a bottom sheet with no arrow.

## Parts

`header` (12px above the title), `icon` (a 32px disc), `title` (16/600),
the body (14, relaxed, Text/Secondary — `<p>`s 12px apart, `<b>` in Text/Body),
`footer` (16px below). `width`: `md` 352px, `lg` 464px.

## Behaviour

`role="dialog"`, non-modal, labelled by its title, `tabIndex={-1}` — pass a
`ref` to move focus to it. `nudge` is a number; each change shakes the card
once. `leaving` fades it out and drops it 8px, taking no clicks.
