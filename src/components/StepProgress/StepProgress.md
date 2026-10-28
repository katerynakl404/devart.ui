A short bar per step with the position in words beside them — where a
multi-step flow stands. The developers' component (1.3.0), with this
package's extensions on top.

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
| `label` | — | the position in words, Body/M on Text/Secondary, `aria-live="polite"`; left out or `null`, none |
| `labelPosition` | `right` | `right` / `left`: beside 24px bars; `top` / `bottom`: stacked with bars that share the full width |
| `showStepTitle` | off | the current step's `title` after the label (Text/Secondary, 12px); at the far end above or below |
| `aria-label` | — | names the bar group (a `<fieldset>`) |
| `onStepSelect(i)` | — | every bar becomes a 28×24 button with its `title` as a tooltip; without it the bars are read-only |

Extensions on top of the developers' API:

| Prop / attribute | Default | Use |
|---|---|---|
| `size` | `md` | `sm` is the compact read-out a tour's card carries: the label at 12px, the gaps one step tighter (12 → 8 beside the bars, 8 → 6 and 6 → 4 above them) |
| `data-state` on `step-progress-step` | — | `done` · `current` · `upcoming` |
| a step with an empty `title` | — | gets no tooltip, rather than an empty bubble |

```jsx
<StepProgress aria-label="Steps" steps={STEPS} current={1} label="Step 2 of 4" />
<StepProgress aria-label="Steps" steps={STEPS} current={1} label="Step 2 of 4" labelPosition="top" showStepTitle />
<StepProgress aria-label="Progress" steps={STEPS} current={1} label="Step 2 of 4" labelPosition="top" showStepTitle size="sm" />  // in a tour's card
```

## Parts

`step-progress` (root, `data-label-position`) › `step-progress-steps` (the
`<fieldset>`) › `step-progress-step` › `step-progress-bar`; then
`step-progress-header` › `step-progress-label` · `step-progress-title`.

## Accessibility

With `onStepSelect` each bar is a named button (`ariaLabel`, else `title`)
with `aria-current="step"` on the current one, and every bar is its own tab
stop; wrap the page in `TooltipProvider`. Without it the bars are read-only:
hidden from assistive tech, no pointer, focus ring, hover or tooltip, and the
label speaks.

## Migrating from this package's earlier API

| Before | Now |
|---|---|
| `counter={(n, total) => …}`, or `label` left out for "Step N of M" | `label={…}` — write the read-out yourself; left out, there is none |
| `fill` | `labelPosition="top"` (the label above bars that share the width) |
| `data-slot="step-progress-head"` | `data-slot="step-progress-header"` — now also wraps the label beside the bars |
| `stepProgressVariants({ fill })`, `…StepsVariants({ fill })`, `…StepVariants({ fill })`, `…BarVariants({ fill })` | `labelPosition` on the root, `stretched` on the others |
| `stepProgressTitleVariants({ size })` | `stepProgressTitleVariants()` — the key was a no-op |
| `stepProgressLabelVariants` base (`whitespace-nowrap text-ink-secondary text-sm`) | the label is a `Typography`; the recipe carries only `size` |

## Not Stepper / StepperIndicator

`Stepper` is headless and renders step content; `StepperIndicator` is a
numbered rail of labelled steps to travel along. This only draws progress and
fits on one header line.
