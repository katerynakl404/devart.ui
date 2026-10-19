A bar per step and "Step N of M" — where a multi-step flow stands.

```jsx
<StepProgress steps={STEPS} current={1} />                       // 24px bars, then the counter
<StepProgress steps={STEPS} current={1} fill showStepLabel />    // header over full-width bars
<StepProgress steps={STEPS} current={1} size="sm" fill showStepLabel />  // inside a coachmark
```

`steps` is `{ id, label? }[]`; `current` is 0-based. Done and current bars are
Brand/Primary over the Stroke/Border track.

## Props worth knowing

| Prop | Default | Use |
|---|---|---|
| `isStepDone(i)` | `i < current` | when "done" is not "before this one" — a question answered out of order |
| `counter(n, total)` | `Step n of total` | the read-out's words ("Question 2 of 4") |
| `showStepLabel` | off | the current step's label — a caption (Text/Secondary 400) at both sizes |
| `fill` | off | the header above bars that share the full width |
| `size` | `md` | `sm` is the compact read-out a coachmark carries |
| `onStepSelect(i)` | — | every bar becomes a button, its tooltip the step's label |
| `getStepAriaLabel(i, { done, current })` | `"<label>, step i of n[, completed]"` | the bar button's name |

## Accessibility

Read-only, the bars are `aria-hidden` and the counter speaks
(`aria-live="polite"`). With `onStepSelect` each bar is a named button with
`aria-current="step"` on the current one; wrap the page in `TooltipProvider`.

## Not StepperIndicator

`StepperIndicator` is a numbered rail of labelled steps to travel along. This
is a progress read-out that fits on one header line.
