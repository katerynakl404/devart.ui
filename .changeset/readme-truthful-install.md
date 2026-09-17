---
'@devart/ui-react': patch
---

README: replace the fictional install path with the two that actually work.

The Install section promised `pnpm add @devart/ui-react` from a Nexus repository
whose name is still the literal placeholder `PENDING-DEVOPS` — `verify-dist` only
asserts the registry *host* is internal, not that the path exists, so the build
passes and a publish would not. The section now says so, and documents the two
real routes: a linked clone (with the reason `pnpm build` is mandatory outside
the monorepo) and the `ds-bundle` browser build the prototypes consume.

The component catalog was 17 components short — `Banner`, `FilterChips`,
`PageHeader`, `RadioButton`, `SegmentedControl`, `StatusView`, `StepSlider`,
`Stepper`, `TextArea`, `Timeline`, `Toggle`, `ToggleGroup`,
`TruncatedTitleTooltip`, `Resizable`, `PortalContainer`, `DialogTitleFallback`
and `Foundations` were all missing, and several listed rows had stale variant
lists. All 50 are now present with their real `cva()` axes, plus the
FilterChips-vs-SegmentedControl distinction and an honest count of which
components carry a usage `.md`.

Also adds a "Where this lives" table for the two remotes.
