# design-sync notes — @devart/ui-react

## Repo facts

- **Package manager**: pnpm 10.27.0, but `pnpm` is NOT on PATH in this
  environment. Use `corepack pnpm ...` (corepack ships with the Node install and
  reads `packageManager` from package.json). Node 24 is present; repo wants >=22.
- **No unit tests exist** (`test:unit` reports "No test files found"). The only
  automated safety nets are `check-types`, `biome check`, and the design-sync
  visual compare against storybook. Treat the compare loop as the real gate.
- **No root barrel**: `exports` maps `./*` -> `dist/components/*/index.js`, so
  there is no `.` entry to bundle. `.design-sync/make-entry.mjs` generates
  `dist/_ds-entry.js` re-exporting all 45 components + `lib/utils` +
  `hooks/use-mobile`. It is part of `buildCmd`; never hand-edit the generated file.
- **One export collision**: `toggleVariants` is exported by both Toggle and
  ToggleGroup. The generated entry re-exports Toggle's as `toggleVariants` and
  ToggleGroup's as `toggleGroupVariants`; explicit re-exports win over `export *`,
  which is what resolves the ambiguity.
- **Biome scans by a catch-all glob** (`**/*.{json,md,css,ts,tsx,js,mjs}`), so the
  generated storybook build under `.design-sync/` made `biome check` take >5min.
  `!**/.ds-sync`, `!**/ds-bundle`, `!**/.design-sync` were added to `biome.json`
  `files.includes`. Without them a sync makes linting unusable.
- **Repo arrived with pre-existing staged changes** (`.changeset/`,
  `scripts/smoke/`, `pnpm-lock.yaml`, and others). Do not commit them as part of a
  sync; stage only the files the sync touched.

## Styling architecture (matters for the export)

- Component styling is **Tailwind utilities compiled by the consuming app**, not
  a shipped stylesheet. `globals.css` carries only CSS variables. The compiled
  CSS therefore has to come from the storybook build (`[CSS_FROM_STORYBOOK]`) or
  a purpose-built Tailwind compile — see `conventions.md`.
- Tokens are layered: **Layer 1 primitives** (`--brand-*`, `--tertiary-*`,
  `--slate-*`) -> **Layer 2 semantic** -> **Layer 3 component-scoped**, with
  `.dark` overriding layers 2 and 3. `THEME_COLORS` (src/lib/constants.ts)
  exposes only layers 2 and 3 to Tailwind, each as
  `hsl(var(--token) / <alpha-value>)`. A colour pack is therefore a stylesheet
  that redefines layers 1-2; no component or utility class names a raw colour.

## Insightis audit implementation (2026-09-04 audit + type-scale companion)

Implemented in this repo. Screen-level items (#1-#20, #28-#33) belong to the
Insightis **application** repo, not this kit, and were not actionable here.

- **#34** Banner: `max-[880px]`/`max-[600px]` emitted no CSS at all -> `max-md`/
  `max-sm`. The arbitrary max-width variant is the one Tailwind form that
  silently produces nothing; prefer named breakpoints always.
- **#35** Shared `focusRing` recipe added to `src/lib/utils.ts` and applied to
  Accordion, ToggleGroup, Input, Sheet (which had `focus:`, not `focus-visible:`,
  so it also rang on mouse click), and the bare Popover/Tooltip triggers.
  **Stepper was a false positive** - it is fully headless and renders no DOM, so
  there is no element to indicate focus on.
- **#36** Padding ladder 8/12/12/16/20 on Button, and the identical ladder on the
  field side. The field edge now lives on the **InputGroup shell**; the control
  and the addons contribute none (`px-0`), which also fixed an inconsistent edge
  (6px bare vs 10px with an addon). Autocomplete and PasswordInput compose
  InputGroup, so they inherit it. `transparent`'s `!p-0` became a
  `compoundVariants` entry - same result, no `!important`.
- **#37** Button rendered `<span>{children}</span>` unconditionally, so an
  icon-only button with a `rightSlot` got a 0px third flex child and a doubled
  gap. Now rendered only when there is a label.
- **#38** Button's `ghost` removed (identical to `tertiary` in every state); six
  call sites migrated. **No back-compat alias** - confirmed with the user that
  everything uses tertiary. Card, CardIcon and Toggle keep their own unrelated
  `ghost` variants.
- **#39** `pressed:` (which is `:active` + `[aria-expanded=true]`) on Button
  `destructiveTertiary` and IconButton destructive. Button has **no `accent`
  variant**, so that third site in the audit does not exist here.
- **#40/#25** 23 raw `duration-*` values mapped onto `duration-fast|base|slow`.
  The two `duration-500` panel slides (Sheet, Sidebar) stay, per the audit.
- **#41** 12 arbitrary tints normalised; `opacity` steps 6/8/12 added to the
  preset, since their absence was the only reason `/[0.06]` notation existed.
- **#42 was already fixed** - no `bg-chip`/`text-content-light` remain.
- **#21** `aria-label` is now **required at the type level** on `IconButton`.
  That surfaced four genuinely unnamed controls (Autocomplete clear + popup
  indicator, FileDismiss, FileRetry), all now named after their action.
- **#22/#24** Typography gained `textStyle` - the 19 named styles, carrying size
  + weight + line-height together. `variant` is kept (public API) but `textStyle`
  is the one to use. `element` already decoupled the semantic tag from the size.
- **#23/#27** Off-scale values moved onto the scale (13->14, 11->12, 12.8->12,
  14px paddings -> 16). Tracking tokens added; note `tracking-tight` now resolves
  to the system's -0.01em rather than Tailwind's stock -0.025em.

### Found while implementing, beyond the audit

- `Sheet`'s close icon used `h-6.5 w-6.5`. **There is no `6.5` spacing step** in
  Tailwind 3.4 or in this preset, so it emitted no CSS - the same dead-class
  family as #34. Now `size-6`. A scan for other off-scale spacing utilities
  (`/tmp/deadclass.mjs` logic) came back clean.

## Re-sync risks

- `make-entry.mjs` enumerates `dist/components/*`. A new component is picked up
  automatically, but a **new export-name collision** would be silently dropped by
  `export *`. Re-run the collision check if components are added.
- The `textStyle` variant relies on `text-xxs` having no paired line-height
  (line-height is set explicitly for `label10`/`overline`). If the type tokens in
  `globals.css` change, re-check those two.
- Tailwind's stock `tracking-tight` is overridden by this preset. Any consumer
  that expected -0.025em now gets -0.01em.
- The audit was dated 4 Sept 2026 and had already partly rotted by this run
  (#42 fixed, #39's `accent` site absent, #35's Stepper a false positive).
  **Re-verify each item against the source before acting on it** in a future pass.

## Converter wiring — why each knob is set

- **`entry` + `make-entry.mjs`.** SPEC decision 1 makes "no root barrel"
  deliberate, so the barrel is sync-only scaffolding: `dist/_ds-entry.js`,
  `dist/_ds-entry.d.ts` and a root `index.d.ts`, all generated by `buildCmd` and
  all gitignored. The package's own `exports`, `files` and tarball are untouched.
  - The `.js` entry must use **explicit named re-exports**. With `export *` the
    converter reported `exported PascalCase symbols: 0` and `components: 0` —
    its bundle-export scan is static and cannot see through star re-exports.
  - The `.d.ts` side may use `export *` (the TypeScript checker follows them).
  - The root `index.d.ts` exists because the converter resolves a package's type
    entry as `publishConfig.types` -> `types` -> `typings` -> `<root>/index.d.ts`,
    and this package declares none of the first three. Without it `exportedNames()`
    got an undefined source file and returned an empty set.
- **`titleMap`.** Three story titles don't match an export; each story's own
  `component:` field is the authority: Datepicker -> `SingleDatePicker`,
  Resizable -> `ResizablePanelGroup`, Toast -> `ToastMessage`.
- **`cssEntry` + the Tailwind export compile.** The kit ships no stylesheet, so
  by default the converter falls back to scraping the storybook build
  (`[CSS_FROM_STORYBOOK]`, 103 KB). That covers the components but NOT the layout
  glue a design agent writes itself, which would render unstyled.
  `.design-sync/tailwind-export.config.ts` compiles the repo's own preset against
  a generated literal class list (`gen-classlist.mjs`) plus `./src/**`, so it is a
  strict superset of the scrape. ~2 MB.
  - **Do not express this as Tailwind `safelist` patterns.** Safelist matching is
    O(pattern x candidate): ~5k patterns ran >10 min and then OOMed the compiler
    at 8 GB heap. A content file is scanned linearly — the same vocabulary
    compiles in ~18 s.
  - Tint (`/<opacity>`) classes are generated only for `hsl(var(--x) / <alpha-value>)`
    tokens. SPEC is explicit that a `color-mix()` token is a bare `var()` and takes
    no alpha modifier ever, so `bg-badge-brand-bg/50` is dead CSS.
- **`libOverrides: source-storybook.mjs`.** The decorator bundle hard-codes
  `loader: { '.js', '.json' }` and does NOT consult `cfg.storyImports.loaders`, so
  `.storybook/preview.tsx` importing `../fonts.css` (which url()s `.woff2`) failed
  it outright. The fork adds font/image loaders and changes nothing else.
  It needs `.design-sync/node_modules` -> `../.ds-sync/node_modules` (gitignored,
  recreate per clone) because it does `await import('esbuild')`.
- **`guidelinesGlob`.** `SPEC.md` and `README.md` ship to `guidelines/` — the
  token layering, theming rules and failure modes are exactly what the design
  agent should be able to read.

## Consequences of the audit work that live OUTSIDE this repo

- **`apps/web/src/index.css` holds a hand-synced duplicate of the token set**
  (SPEC, Cross-Feature Dependencies: "every token edit is a two-file edit", and
  nothing in either build enforces it). This run added
  `--font-size-display`, `--line-height-display` and
  `--tracking-{tight,normal,caps,display}` to `globals.css`, so that copy is now
  behind. Drift shows up as a wrong pixel, never as an error.
- **`tracking-tight` changed meaning** for every consumer: the preset now maps it
  to -0.01em instead of Tailwind's stock -0.025em.
- **Audit Parts 1 and 3 (#1-#20, #28-#33) are application work**, not kit work —
  they were found by walking the Insightis app's 20 routes and cannot be done
  from this repo.
- A **major** changeset is committed at
  `.changeset/insightis-audit-implementation.md`. `check-changeset` would only
  have demanded `minor` (it detects removed `export` lines, not removed cva
  variants or newly-required props), but removing Button's `ghost` and requiring
  `IconButton`'s `aria-label` are both breaking.

## Preview/provider wiring — hard-won, do not undo

- **`cfg.provider = TooltipProvider`, and NO decorator bundle.** The first
  instinct was to make `.storybook/preview.tsx` bundle (it failed on `.woff2`),
  and a `source-storybook.mjs` fork did make it succeed — which was **worse**.
  The converter stubs every `@storybook/*` module with inert callables, so
  `withThemeByClassName` resolved to a non-function and **all 44 previews threw
  at load** (`render check: 0/44 clean`). Setting `cfg.provider` skips decorator
  bundling entirely, which is the documented remedy. The fork was deleted.
  - Losing the theme decorator costs nothing here: it maps `light: ''`,
    `dark: 'dark'`, and previews want the light (no-class) case.
  - `TooltipProvider` is a genuinely useful wrapper — it carries the shared
    hover delay, so Tooltip stories behave.
- **`cssEntry` must carry the tokens.** Pointing `cssEntry` at a bare Tailwind
  compile dropped every CSS custom property (`[TOKENS_MISSING]`, 154 of them) —
  components would have shipped unstyled. `.design-sync/tailwind-export.css`
  therefore starts with `@import "../globals.css";`. The Tailwind CLI inlines it.
- **`font-serif` must stay out of the generated class list.** Tailwind's stock
  serif stack begins with Cambria, which tripped `[FONT_MISSING]` for a face the
  DS does not use and never ships. The DS has no serif.
- **`overrides`**: DropdownMenu/Modal/Popover/Sheet/Sidebar are `cardMode:
  "single"` (portal/overlay content paints outside its grid cell) and
  TextArea/Timeline are `cardMode: "column"` (stories wider than a cell).
  Both came from validate's `[GRID_OVERFLOW]` suggestions.

## Known-and-triaged warnings

- `[RENDER_THIN] Spinner` — a spin animation with no text paints nothing in a
  still screenshot. Legitimately short; it will read as thin on every sync.
- `[STORY_CAP] Button` — 7 stories, 6 captured. The tail story is a variant
  already covered by the Variants swatch row.

## Story edits made by this sync (they move the fidelity oracle)

- `Button.stories.tsx` — the `#38` migration changed the demo's `variant` to
  `tertiary` but left the label reading **"Ghost"**, leaving a duplicate of the
  Tertiary swatch advertising a variant that no longer exists. A grep for
  `variant="ghost"` could not see it; the compare screenshots did. Removed.
- `Typography.stories.tsx` — added a `TextStyles` story showcasing all 19 named
  styles. Without it the type scale (audit #24) was invisible in the component
  card, and a design agent would have kept choosing type by size.

**Any story edit requires rebuilding `.design-sync/sb-reference` before
grading** — the reference IS the oracle, so a stale one silently grades against
the old design.

## How to READ the compare sheets (folded from wave-1 fan-out learnings)

Three framing effects look like defects and are not. All three were hit
independently by different agents; check them before calling a mismatch.

- **Gated reference — the LEFT panel is the broken one.** For components that
  portal to `document.body` (Modal, Sheet, Popover, DropdownMenu), storybook's
  capture frame is cropped to the trigger's own bounding box, so an
  "Initially Open" story shows a sliver or nothing on the reference side while
  the preview renders the complete overlay. Judge the preview's render on its
  own merits and note the gating: a preview that renders MORE than a gated
  reference is `match`, not `close`. **Never** write an owned preview to "fix"
  this — it would shadow any future reference-side fix forever.
- **Low-contrast fills vanish on the storybook side.** The storybook canvas
  paints `--surface-page` (#F8FAFC), which is the exact fill of Skeleton bars
  and the ProgressBar track, while the preview renders on white. The element is
  present on both; decode the raw PNGs before calling it missing.
- **The preview column is ~16px narrower** than the storybook canvas (852 vs
  868 usable), so a `flex-wrap` row can wrap one item earlier in the preview
  (Card `Rounded` wraps `xl` to a second row). Framing, not a component delta.

Also confirmed by the fan-out: `aria-invalid:` compiles into the exported CSS,
and DM Sans renders on BOTH panels for every component checked — this is not
the both-sides-fall-back-to-the-same-default case that the compare loop cannot
see.

### Story caps (tail stories captured but never individually graded)

`[STORY_CAP]` fires at 6 stories. Components with an ungraded tail story:
Button (7), Autocomplete (7), Table (7 — `Loading`), StatusView (7). Raise with
`--max-stories 8` when those tail variants matter.

## Dark-theme previews (folded from the wave-2 fan-out)

Every component has a `DarkTheme` story wrapping its primary demo in
`<div className="dark rounded-lg bg-surface-page p-6">`. All 29 wave-2
components graded `match` on that cell, each image-judged from the raw pair.
What that proves, and what it does not:

- The `.dark` token block **ships inside `_ds_bundle.css`** and is reachable by a
  **scoped** class — not only by `<html class="dark">`. Confirmed independently
  by three batches.
- `color-mix()` tokens re-resolve correctly per theme (Badge `--badge-brand-*`,
  Banner `--banner-grad-*`), so the bundled CSS carries the `.dark` operands
  rather than a light-resolved snapshot.
- On **portalled** primitives (DropdownMenu, Popover, Sheet, Tooltip) the story
  leaves the overlay CLOSED, so the cell only ever verifies that the TRIGGER
  re-themes. Both panels showing a dark wrapper + dark-token trigger is the
  complete expected result — do not hunt for a dark overlay there.
- `DarkTheme` is the positive control for the low-contrast-fill artifact: a
  Skeleton bar or progress track that "vanishes" in the light stories is
  plainly visible on the dark panel, proving the light story was framing.
- New framing case: when a story's whole output is the same colour as the
  storybook canvas, the storybook capture can fall back to the full 900x700
  viewport instead of the element box (`ProgressBar / Empty` did). That is a
  zero-contrast capture artifact, not an empty render.

### A real bug the dark stories exposed (fixed in src/)

`Checkbox`, `CheckboxGroup` and `RadioButton` rendered their `<label>` with
`font-medium text-sm` and **no ink token**, so the label inherited the host
page's text colour and went dark-on-dark — illegible — inside a `.dark` subtree.
Every other labelled control tokenises its label ink via `Typography`. All three
now carry `text-ink-body`; `RadioButton`'s disabled state also used a raw
`opacity-50` instead of the system's `opacity-disabled` (0.65) and was corrected.

This is exactly the class of defect the light-only previews could never surface:
both panels agreed, so the compare loop called it `match` (correctly — the sync
was faithful), and only a human-readable dark render made it visible.

## Story caps and the DarkTheme trap (folded from the final fan-out)

**`--max-stories` can silently hide `DarkTheme`.** It is appended last, so it
sorts last, so on any component with more stories than the cap it is never
captured and never graded — while the run still looks clean. StepSlider (11
stories) hit this at `--max-stories 8`; Button and Avatar were caught by an
explicit audit of every `grade.json` for a dark verdict, not by any tool warning.

**Check that audit on every future sync.** The one-liner: for each
`.design-sync/.cache/compare/*.grade.json`, assert some key matches `/dark/i`.
Story counts today: StepSlider 11, Toggle/File/Table/StatusView/Autocomplete/
Button 8, most others 4-7. `--max-stories 12` covers the whole roster.

Other reading techniques worth keeping:
- A very wide, very short capture (StepSlider's are ~900x60) is unreadable both
  on the sheet and opened directly. Rendering the raw pair into a scratch HTML
  page at 3x with playwright (`.ds-sync/node_modules/playwright`) makes thumb
  position and stop count decidable.
- Never grade a numeric story from the sheet — `File > Uploading` looks like a
  progress delta at sheet scale and reads `43%` on both at full res.
- Storybook crops to the element bounding box, so a fixed-width element (a 288px
  `File` chip) reads as full-bleed on the sheet. It is not stretched.

## Dark-mode contrast gaps in the components themselves

Found by the dark previews, agreed by BOTH panels (so not sync defects):

- **FIXED**: `Checkbox`, `CheckboxGroup`, `RadioButton` label ink (see above).
- **OPEN**: `SingleDatePicker`'s month caption is very low contrast on dark.
- **OPEN**: the `TruncatedTitleTooltip` story's trigger is a bare `<a>` with no
  ink class, so it renders dark-on-dark. A story-authoring nit, not a component
  bug — the component's own tooltip content is correctly tokenised.
