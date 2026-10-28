---
'@devart/ui-react': major
---

Take the developers' 1.3.0 and 1.4.0 (`upstream/master` f69ebc9) as the base,
with this package's additions kept as extensions on top.

Replaced or renamed — update call sites:

- `Coachmark` → `GuideCard` (theirs: `header`, `icon`, `title`, `titleId`,
  body, `footer`, `width`, `side`, `arrowOffset`, `nudgeCount`, `isLeaving`).
  Placement, the phone bottom sheet, the dialog role and focus are the tour's:
  they moved into `Tour` (`TourCard`, `placeGuideCard`). `coachmark*`
  data-slots, recipes and `animate-coachmark-*` are `guide-card*`,
  `guideCard*Variants` and `animate-guide-card-*`; `CoachmarkSide`,
  `CoachmarkPosition`, `CoachmarkPlacement` are `GuideCardSide`,
  `GuideCardPosition`, `TourCardPlacement`.
- `StepProgress`: `counter` is gone — pass `label` (no `label`, no read-out).
  `fill` is `labelPosition="top"`. `step-progress-head` is
  `step-progress-header`. Theirs: read-only bars without `onStepSelect`,
  `labelPosition`, `showStepTitle`, `stepProgressVariants`,
  `stepProgressStepsVariants`, `stepProgressHeaderVariants`,
  `stepProgressTitleVariants`. Kept on top: `size="sm"`, `data-state` per bar.
- `ChoiceCard` / `ChoiceGroup` are theirs (new parts, `style`); a standalone
  toggle card always carries `aria-pressed`. `ChoiceGroup` `columns` is gone:
  `columns={2}` is `className="sm:grid-cols-2 sm:gap-3"`, the same classes.
  Storybook: `Components/ChoiceCard`.

New, as they ship them:

- `ScrollShadow` `focusable` (`'auto'` by default): a Tab stop only while it
  overflows and nothing inside can take focus, then `role="region"`. Hosts of
  controls — `FilterChips`, `ModalBody` — lose the unnamed stop in front of
  their content, and a `Modal` focuses its first control again.
- `StatusView` `iconSize`, `titleSize`, `contentWidth`, a `base` step,
  `contentVariants`. The 48ch description cap holds inside the default `md`
  block only.
- `guide-card-{in,nudge,out}` keyframes and animations in the preset.
