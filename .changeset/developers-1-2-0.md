---
'@devart/ui-react': major
---

Take the developers' 1.2.0 (`upstream/master` 8d69821) as the base: their
names, props, recipes and behaviour, with this package's additions kept as
extensions on top.

Renamed or replaced — update call sites:

- `SearchField` → `SearchInput` (developers' API: `placeholder`, `value`,
  `onValueChange`, `onClear`, `clearLabel`, `size` — default `lg` — and
  `searchInputVariants`). The ✕ shows only while there is a value **and**
  `onClear` is passed, and it needs a `TooltipProvider` above. The results
  dropdown and `variant`, `disabled`, `autoFocus`, `id`, `style`, `onKeyDown`
  stay, as extensions.
- `PageHeader` `leading` → `titleLeft`, `badge` → `titleRight`.
- `StepProgress` steps are `{ title, done?, ariaLabel? }`; `current` and
  `aria-label` are required; `label` is the read-out. `isStepDone`,
  `getStepAriaLabel` and step `label` are gone; `showStepLabel` →
  `showStepTitle`; `stepProgressCounterVariants` → `stepProgressLabelVariants`.
  `counter`, `fill` and `size` stay as extensions. `Tour`'s `progress.steps`
  follows: `{ title, done? }`.

Added from the developers: `CtaBanner`, `ConfirmationDialog`; `Popover`
`openOnHover`, `delay`, `closeDelay`, `pinOnClick`, `closeOnViewportChange` and
`PopoverContent` `fallbackSides`; `TextArea` `softLimit`, with the counter
referenced from `aria-describedby` instead of being a live region; `IconCard`
composes a consumer `onClick` / `onKeyDown` with `onActivate`; recipes
`alertIconVariants`, `alertTextVariants`, `promoCardVariants`,
`inputGroupActionVariants`, `textAreaCountVariants`; token `--alert-tint`.

`Alert` keeps an optional `title` and the `illustration` slot; its classes now
come from the developers' recipes, with no visual change.

Storybook follows the developers' sections: `Components/<Name>` for a primitive
and its parts, `Compositions/<Name>` for a block that assembles other controls.
