A short bar per step with the position in words beside them — where a
multi-step flow stands.

```jsx
<StepProgress
  aria-label="Questions"
  steps={[{ title: 'Time period', done: true }, { title: 'Audience' }]}
  current={1}
  label="Question 2 of 2"
  onStepSelect={setCurrent}
/>
```

`steps` is `{ title, done?, ariaLabel? }[]`; `current` is 0-based. A bar fills
(Brand/Primary) once its step is `done` or while it is `current`; the rest sit
on the Stroke/Border track. `done` is never inferred — a step before the
current one is empty until it says it is done.

## Props

| Prop | Default | Use |
|---|---|---|
| `steps` | — | `title` names the bar (tooltip, and button name without `ariaLabel`); `done` fills it |
| `current` | — | the step on screen; its bar is filled and carries `aria-current="step"` |
| `label` | from `counter` | the position in words, Body/M on Text/Secondary, `aria-live="polite"`; `null` renders none |
| `aria-label` | — | names the bar group (a `<fieldset>`) |
| `onStepSelect(i)` | — | every bar becomes a 28×24 button with its `title` as a tooltip |

Extensions on top of the developers' API:

| Prop | Default | Use |
|---|---|---|
| `counter(n, total)` | `Step n of total` | writes `label` when it is left out |
| `showStepTitle` | off | the current step's `title` — a caption (Text/Secondary 400) at both sizes |
| `fill` | off | the label above bars that share the full width |
| `size` | `md` | `sm` is the compact read-out a coachmark carries |

```jsx
<StepProgress aria-label="Steps" steps={STEPS} current={1} />                 // "Step 2 of 4"
<StepProgress aria-label="Steps" steps={STEPS} current={1} fill showStepTitle />
<StepProgress aria-label="Progress" steps={STEPS} current={1} size="sm" fill showStepTitle />  // in a coachmark
```

## Accessibility

With `onStepSelect` each bar is a named button (`ariaLabel`, else `title`)
with `aria-current="step"` on the current one, and every bar is its own tab
stop; wrap the page in `TooltipProvider`. Without it the bars are read-only:
hidden from assistive tech, no tooltips, and the label speaks.

## Not Stepper / StepperIndicator

`Stepper` is headless and renders step content; `StepperIndicator` is a
numbered rail of labelled steps to travel along. This only draws progress and
fits on one header line.
