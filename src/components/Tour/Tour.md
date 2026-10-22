A guided walk over the real interface: per step a `Spotlight`, a `Coachmark`
and, when the step has them, annotations.

```jsx
const [step, setStep] = useState(0);
const [open, setOpen] = useState(true);

<Tour
  open={open}
  steps={STEPS}
  step={step}
  onStepChange={setStep}
  onClose={(reason) => setOpen(false)}       // 'finish' | 'skip' | 'escape'
  boundary=".app-shell"
/>
```

A step is `{ id, target, title, icon?, content, label?, side?, width?, annotations? }`;
an annotation is `{ target, icon?, text }`. The caller holds the step.

## The coachmark

The header is the progress — `StepProgress size="sm" fill showStepTitle`. By
default it counts the tour's own steps (`label`, else a string `title`). When
the tour is part of a longer flow, pass `progress={{ steps, offset }}` and the
read-out counts the whole flow. The footer is Back · Skip · Next, with Done on
the last step and no Skip there; `labels` renames them. Back on the first step
shows only with `onBeforeFirst` — for a tour that continues an onboarding.

## Behaviour

- **Keyboard** → next, ← back, Esc closes (`onClose('escape')`); ignored while
  typing in a field.
- **Focus** moves to the coachmark on every step, after the target scrolls into
  view.
- **A click on the scrim** shakes the coachmark: the page is not reachable
  until the tour ends, and the card is where to go.
- **Closing** fades the whole tour out (300ms) before it unmounts.
- **Phones** (≤ 640px): the coachmark is a bottom sheet and lists the step's
  annotations instead of drawing them.

`padding` (8) and `boundary` reach the spotlight.
