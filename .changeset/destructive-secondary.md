---
'@devart/ui-react': major
---

`Button` / `IconButton` `variant="destructiveOutline"` is now
`variant="destructiveSecondary"` — the bordered destructive button is the
secondary's destructive form, named like its sibling `destructiveTertiary`.
The tokens follow: `--btn-outline-destructive-*` → `--btn-destructive-secondary-*`,
and the Tailwind key `outlineDestructive` → `destructiveSecondary`
(`border-destructiveSecondary-border`, `bg-destructiveSecondary-bg-hover`, …).
Values are unchanged.

Disabled, it is now the disabled `secondary`: the secondary border
(`--btn-secondary-border`) instead of `--ink-inactive`, no fill, the inactive
label. Both variants read the new `secondaryDisabled` fragment (`./cn`).

Update call sites: rename the variant, and any class or `var()` that names the
old tokens.
