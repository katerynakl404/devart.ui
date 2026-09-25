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

## Disabled-state recipe: spec vs kit

The design report specifies, for Checkbox disabled (unchecked & checked):
`opacity: --opacity-disabled` (.65) + `pointer-events:none` + `cursor:not-allowed`
— *"each position fades from its own base; no colour override"* — and claims it
**"unifies with Switch / Button / IconButton / Tabs"**.

Measured against the kit:

| Component | Recipe in code | Matches the spec? |
|---|---|---|
| Checkbox | `disabled:opacity-disabled` | yes |
| Switch | `disabled:opacity-disabled` | yes |
| Tabs (`TabsTrigger`) | `disabled:opacity-disabled` | yes |
| RadioButton | `disabled:opacity-50` | **no — wrong value**, was a raw 0.5 instead of the 0.65 token. FIXED to `opacity-disabled`. |
| Button | `disabled:bg-state-disabled` + `disabled:text-ink-inactive` | **no — colour override**, per-variant |
| IconButton | `disabled:bg-state-disabled` + `disabled:text-ink-inactive` | **no — colour override**, per-variant |

So the unification the spec describes holds for Switch and Tabs but **not** for
Button and IconButton, which override colour rather than fading from their own
base. That is a real spec-vs-kit discrepancy and needs a decision: either the
spec's "unifies with Button / IconButton" claim is wrong, or those two should
move to the opacity recipe (a visible change to every disabled button).

**Do not "fix" Checkbox to a fill-based recipe.** It was already correct; one
was attempted during this sync and reverted. The dimmed-brand-fill appearance
of a disabled+checked checkbox is the specified behaviour.

## Regression introduced and fixed during this sync

Moving the field's horizontal padding onto the InputGroup shell (audit #36)
zeroed both the addon's `pl-2.5` and the control's `px-1.5` — but that control
padding was also the only thing separating a leading icon from the placeholder
text, so the icon and text ended up touching. The outer edge is the shell's
job; the icon-to-text distance is a **gap between siblings**, so it now lives on
the inline addons (`me-2` / `ms-2`) where it cannot affect the full-width block
addons. Watch for this if the ladder is ever retuned.

## Open component findings from the design review (NOT yet rebuilt/uploaded)

The reference is `C:\Users\katerynak\Documents\Claude\Projects\Insightis\
insightis-preview-kit.html` — a 561KB preview kit with a section per component
plus a written `Spec.` line for each. It is the authority on intended
appearance, and it is far more specific than the UX audit was.

Fixed in the working tree, pending a rebuild:
- **SegmentedControl**: the trigger hardcoded `rounded` (4px) and never read the
  track's `rounded` from context, so at `rounded="full"` the track was a pill and
  every trigger stayed square. Now derived from context, inset one step; `md`
  unchanged so the default does not regress.
- **Sheet**: panel used `bg-surface-page` (the page ground) where Modal uses
  `bg-surface-card`. Now `surface-card`.
- **Modal + Sheet overlays**: hardcoded `bg-black/80`, so `--overlay-scrim` was
  unreachable and the scrim was not themeable — SPEC's own failure-modes list
  calls this out. The token was **declared only under `.dark`**, so using it
  first required a `:root` value; added, and both overlays now use
  `bg-overlay-scrim`.
- **InputGroup**: regression from the #36 padding move — see the regression note
  above.
- **RadioButton**: control used raw `opacity-50` instead of `opacity-disabled`.

Known-open, not yet addressed:
- **Sidebar does not match the reference shell at all.** The kit's section
  specifies a brand row + dark-teal CTA header, four compact 32px nav rows, a
  hairline-separated Pinned/Recent chat list with hover-revealed row actions, and
  a footer with a tokens meter and user row; nav row spec is h32 / radius md /
  gap 8 / icon 16 / text-sm medium, active = `State/Pressed` bg with `Text/Body`
  ink and NO brand colour. The kit's Sidebar stories are a generic nav tree.
- **Datepicker range endpoints**: rounding reads wrong at the range ends
  (`range_start`/`range_end` round the outer side while the selected day button
  is forced `rounded-none`). Needs checking against the kit's datepicker section.
- **Modal sizes are invisible in the product card** because Modal is
  `cardMode: "single"`, which renders exactly one story. The portal-container
  work below is what unblocks moving it to `column`.
- **Autocomplete card clips** its wider cells; needs `cardMode: "column"`.

## Planned but unfinished: portal containment + dark state matrix

`src/lib/portal-container.ts` was added (a `PortalContainerContext` +
`usePortalContainer`) and exported as `./portal-container` in both export maps,
but **it is not yet wired into the portal components**. The intent:

1. `DropdownMenuContent`, `DropdownMenuSubContent`, `PopoverContent`,
   `TooltipContent`, `ModalPortal`, `SheetContent` and `TruncatedTitleTooltip`
   take an optional `portalContainer`, falling back to the context, then to
   Radix's `document.body`.
2. Stories provide the container, so an open overlay renders INSIDE the card and
   inside a `.dark` subtree. That fixes both the light-dropdown-on-dark-panel bug
   and the reason those components need single-story cards.
3. With overlays contained, `cardMode` for DropdownMenu/Modal/Popover/Sheet/
   Sidebar can move from `single` to `column`, so every story (Modal's three
   sizes included) becomes visible in the product card.
4. `DarkTheme` stories should then compose the component's OTHER stories inside
   one dark wrapper, so every state appears in dark rather than one demo.

# Reference-kit review (insightis-preview-kit.html)

Four agents compared all 44 components against their section + `Spec.` line.
Reference sections are split to `.design-sync/.cache/reference/<id>.html` by
`/tmp/splitkit.mjs` logic (regenerate by re-splitting the kit).

## CLOSED: the disabled-recipe question

**Button and IconButton are correct as shipped.** The IconButton section states
for every variant: `Disabled — bg State/Disabled, icon Text/Inactive`, and
`Loading — spinner, aria-busy, --opacity-disabled`; the kit CSS agrees
(`.btn-primary:disabled{background:var(--state-disabled);color:var(--ink-inactive)}`).
So the opacity fade is the **loading** recipe, not the disabled one, and the
earlier "Button/IconButton deviate" note was a misreading — the Checkbox spec's
"unifies with Button" line refers to loading. Both already do both correctly.

## More dead CSS (the recurring failure mode in this kit)

A class naming a key that does not exist compiles to nothing and fails as a
wrong pixel, never an error. Beyond Banner's `max-[880px]:` and Sheet's `h-6.5`:

- **RadioButton** focus ring used `ring-ring` — `--ring` has ZERO declarations,
  so the ring fell back to browser-default blue.
- **IconButton** `destructiveOutline` used `outline-destructive-*`; the real
  Tailwind key is `outlineDestructive-*`, so its border and both washes emitted
  nothing.
- **Typography** `h3` read `'texl-xl …'` — a typo, so `h3` had no base size and
  jumped from inherited straight to `text-2xl` at `md`.
- **Card** `CardDivider`'s base began with `hidden`, so it never rendered.
- **Banner** `sm` gated on `[data-gradient-icon]`, an attribute set nowhere.

## Central token work applied

`--line-height-compact` (13px had no paired leading — wrong in TextArea),
`spacing.control` (Checkbox `size-[18px]` vs RadioButton `size-5` disagreed and
one was arbitrary), `formFocusRing` (brand never visualises FORM-control focus;
three controls were hand-rolling a neutral ring), `--radius-2xl: .875rem` and
`--shadow-modal` (both themes — the dialog used stock `shadow-lg`, which has no
dark value), and `--sidebar-width` 15.95rem -> 16rem.

## Deferred token requests, with reasons

- **11px step** (Badge `sm`, StatusView `sm` description). **Rejected for now:**
  it contradicts the agreed type scale (audit #24), which is deliberately eight
  sizes — 10/12/14/16/20/24/30/36. Adding 11px reintroduces an off-scale step.
  Needs a design decision between the two documents.
- **`--shadow-focus`** (4 call sites). All four already approximate it with
  `ring-2 ring-focus-ring-brand` + offset, which renders the same; adding an
  unused token would be drift. Worth doing only alongside rewiring all four.
- **Card 300ms** vs `--motion-slow` 240ms — a 60ms delta does not earn a fourth
  motion token; likely the reference means the existing `slow`.
- **Banner collapse keyframes**, **`--chat-fade`** — both belong with the
  features that need them (dismiss animation; the Sidebar chat row).

## Open conflicts — reference vs the agreed audit decisions

1. **TextArea padding**: reference says square 8px; audit #36 put it on the
   8/12/12/16/20 ladder shared with Button. Left on the ladder.
2. **InputGroup default variant**: reference marks `primary` default; the code
   defaults to `outline`. Flipping restyles PasswordInput, Autocomplete,
   Datepicker and File. `primary` now EXISTS and is selectable; default unchanged.
3. **tertiary hover**: the States tables say `Brand/Primary @6%` but the kit's
   own `kit-theme.css` renders neutral `--state-hover`, with a comment about
   moving away from the brand tint. Not flipped — it would make `tertiary` a
   byte-for-byte duplicate of `primaryTertiary`, which is exactly what got
   `ghost` deleted.
4. **Button gap**: prose says 6px, kit CSS renders 8px.

Note the kit's prose and its `pages/kit-theme.css` disagree in at least three
places. **The CSS is the renderer, so prefer it when they conflict.**

## [API] gaps — Sidebar is a different component, not a restyle

The paint is now close (nav + chat rows hit the kit's geometry, ink tokens and
all four states). The SHELL is absent: brand row with logo swap, full-width
primary CTA, a chat-section primitive (hairline + all-caps label + collapse
chevron + See-all), a chat-row primitive (right-edge gradient fade, status slot
with 10px spinner / 6px dot, hover- and focus-within-revealed kebab opening
Pin/Unpin -> Rename -> Delete), a footer tokens meter and user row, and the
collapsed-mode Chats icon. Closing it means ~5 new exported subcomponents
(`SidebarBrand`, `SidebarChatSection`, `SidebarChatRow`, `SidebarTokensMeter`,
`SidebarUser`). Purely additive breaks nothing; **repurposing `NavigationGroup`
or `SidebarMenuSubButton` into the chat row WOULD break `apps/web`**, which
drives both through `SidebarNavigationItems items={…}` with a custom `renderLink`.

Also open: `NavigationItem` has no `isActive` (only `SidebarMenuButton` does);
`File` has no `disabled` state though the kit's states table asks for one;
`Modal`'s multi-step wizard shell (`.dlg-progress`/`.dlg-body`/`.dlg-step`) has
no React counterpart.

# AUTHORITY ORDER — read this before resolving any design conflict

When sources disagree, later entries lose:

1. **Decisions recorded in this file** (agreed with the design owner in session).
2. **The UX audit + type-scale companion** (2026-09-04) — the agreed *target*.
3. **`insightis-preview-kit.html`'s CSS** (`pages/kit-theme.css`) — what it
   actually renders.
4. **The preview kit's prose** — demonstrably the least reliable layer.
5. **Production** (`insightis-app.devart.info`) — useful evidence of what exists
   today, but it is PRE-migration, so it is not a target.

**The preview kit can be wrong.** Two confirmed errors so far:
- Its Tertiary blurb and states table claimed `Brand/Primary @6%/@8%` hover and
  press while its own `kit-theme.css` renders neutral `--state-hover` /
  `--state-pressed` — which is also what production shows. **Corrected in the
  kit itself** this session (a `.bak` sits beside it).
- Its type sizes are pre-migration (see below).

## Type scale: 13px and 11px are NOT targets

The type-scale companion defines nineteen styles on **eight sizes** —
10/12/14/16/20/24/30/36 — and its migration table says outright:
`size — 13→14, 11→12, 9→10, 18→20`.

Production is pre-migration and still renders both as ARBITRARY values
(measured live): sidebar nav rows `text-[0.8125rem]` (13px), sidebar balance
footer `text-[0.688rem]` (11px). The preview kit mirrors that state.

**Decision: the design system follows the scale and leads the migration.**
- `text-compact` (13px) is used by NO kit component. The `--font-size-compact`
  token stays (it is public API) and now has a paired `--line-height-compact`,
  but nothing in the kit should reach for it.
- The 11px token request (Badge `sm`, StatusView `sm` description, sidebar
  balance) is **rejected** — 11px maps to 12px under the migration.
- A review agent moved InputGroup/TextArea/Sidebar to 13px to match the kit;
  those were reverted. The real bug it found underneath — InputGroup `sm` mixing
  a 12px control with a 14px placeholder — stays fixed, resolved DOWN to 12.

## Production sidebar, measured live (evidence, not a target)

Nav row: h32 · px 8 · radius 6 · gap 8 · icon 16 · weight 500 · `--ink-secondary`
· `hover:bg-state-hover` · `active:bg-state-pressed`. Everything except the font
size matches what the reference review already fixed. Sidebar width ~254px.
Footer carries a Balance label + wallet glyph + value, and a user row (avatar,
email, "Owner · Trial", chevron) — so the footer meter and user row DO exist in
production. **"New Chat" is a nav ROW there, not the full-width teal CTA the kit
spec describes** — another place the kit and production disagree.

## Deferred: migrate the preview kit's own off-scale type sizes

Agreed to handle separately, not during a sync. Scope, already surveyed:

- `insightis-preview-kit.html` has **20 hardcoded off-scale `font-size` decls**:
  `11px` x7, `13px` x5, `18px` x8. Per the migration table these become 12 / 14
  / 20.
- `pages/kit-theme.css` has **none** — it already runs on a `--ts-*` token
  system (`--ts-body-m-size`, `--ts-title-14-size`, `--ts-overline-size`, …), so
  the stylesheet is on-scale and only the demo markup in the HTML is not.
- **Only touch `font-size` declarations.** The raw 9px/18px counts are dominated
  by geometry (icon sizes, padding, offsets) that must not move.
- The kit's Tertiary prose was already corrected this session; a `.bak` of the
  file sits beside it.

## The 900x700 capture ceiling — a SILENT failure

**Preview (`_ds`) captures are a fixed 900x700 viewport. Anything taller is
cropped with no `[GRID_OVERFLOW]` and no warning of any kind** — the run looks
clean while the product card shows a truncated component. The storybook (`_sb`)
side is captured full-height, so the sheet can even look plausible.

Caught on two cards, both now carrying a declared `viewport` override:
- `Colors` — the full token grid is ~2500px; roughly 17 of 24 groups never
  rendered. Grid densified to 6 columns with 24px swatches, `viewport 900x1600`.
- `Typography` — the `Text Styles` story is 766px, so the scale was cut after
  `label12`. `viewport 900x1000`.

**Check tall stories on every sync**: compare the `_sb` raw height against 700.
A `viewport` override is the fix, and it re-grades that component (the capture
viewport is part of the grade key).

## Reading techniques worth reusing (folded from the final fan-out)

- **Levels-stretch near-zero-contrast fills.** Draw the raw PNG to a canvas in a
  chromium page and map an input range like [238,256] onto [0,255]. Every
  "missing" Skeleton bar / progress track / Separator rule became plainly
  visible, and none was actually absent. `playwright` is NOT resolvable from the
  repo root but IS installed under `.ds-sync/node_modules` — import it by an
  absolute `file:///` URL or node throws `ERR_UNSUPPORTED_ESM_URL_SCHEME`.
- **Measure the ink bounding box** instead of eyeballing 1px geometry: most
  common colour = ground, then bbox of everything far from it. Separator came
  out exactly 256x1 / 1x64 on BOTH panels, turning "is the rule even there" into
  an equality.
- **Sample the pixel** when "dimmed vs not" is too close to call. StepSlider
  `Disabled`: stop ink rgb(144,156,171) vs rgb(147,158,172), against
  rgb(90,106,128) enabled — same dimming both sides.
- **The `_sb` capture is the storybook ROOT (868px wide), not the element box.**
  Computing a fill fraction against 868 instead of the real track width makes a
  correct 65% bar read as 21%.
- **Gating is systematic, not occasional.** For every "Initially Open" overlay
  story the reference is cropped to the TRIGGER's box (Modal 240x40, Sheet
  110x55, Popover 140x60, DropdownMenu ~90x55) while the preview renders the
  whole overlay. Six of seven portalled stories had a defective reference.
- **The `--surface-page` canvas effect is broader than first thought**: any
  control whose own fill is `--surface-page` or transparent (StepSlider track,
  ScrollShadow tiles, Toggle's `Primary` on-state, File's `tertiary` row) reads
  as unfilled on the LEFT panel only.

## Two story-level ink defects (identical on both panels, so not sync defects)

`TruncatedTitleTooltip` `DarkTheme` renders a dark title on the dark card, and
`SingleDatePicker` `DarkTheme` a dark month caption. Both are the stories' own
untokenised ink, reproduced faithfully. Worth fixing in the stories.

## 2026-09-15 — Table and page-shell heights (user-reported from the live project)

Reported: *"в таблицях абсолютно не вірні падінги, стрибають колонки, екшени
виглядають погано"* and *"чомусь висоти екрану теж не вірні"*.

### Table

Graded against the kit's `table.tbl` recipe (`pages/kit-theme.css:2109-2120`,
`.mx-tbl-actions` at `:3441`), which is authority over production here.

| Defect | Was | Now | Kit |
|---|---|---|---|
| Header/body inset disagree | `th` `ps-3 pe-2`, `td` `p-2` | both `px-4 py-2.5` | `.625rem 1rem` on both |
| Body text a step too small | `text-xs` | `text-sm` | `--ts-body-m` = 14/20 |
| Height locked | `h-9` on `th`/`td` | padding defines it | padding + `vertical-align` |
| Header band never painted | no class | `bg-table-header-bg` | `thead th{background:var(--card2)}` |
| Footer border untokenised | `border-t` | `border-stroke border-t` | — |
| Two competing row-state systems | `tbody` `tr`-level **and** `td`-level | `td`-level only | `td` |
| No actions affordance | — | `TableActionsCell` | `.mx-tbl-actions` |
| Columns re-measure per render | always `auto` | `layout="fixed"` opt-in | `.mx-tbl` `table-layout:fixed` |

`--tbl-header-bg` was the SPEC's own *"an exposed token with no call site
drifts"* failure mode, verbatim: zero call sites anywhere in `src/`, and its
value had drifted to `--mx-group-band`'s (slate-150 / grey-700). The kit states
the contract explicitly — the header band and a selected row are the same
surface *by construction* — so it is now `var(--surface-card2)` in both themes,
matching `--tbl-row-pressed`.

`TableActionsCell` reserves its 48px whether or not the buttons show, and fades
them with opacity. Mounting actions on hover instead reflows the table under the
pointer, which is half of what "columns jump" describes.

### Page shell

`SidebarInset` was `h-full` under a `min-h-svh` `SidebarProvider`. A percentage
height against a parent whose computed `height` is `auto` also computes to
`auto`, so the inset never filled the screen and nothing inside it could scroll
internally — it grew the page instead. Now `min-h-svh` (a flex item's own
`min-height` needs no definite parent), with the inset variant's own margins
subtracted. `conventions.md` gained a **Page shells** section with the pinned
`h-svh min-h-0 overflow-hidden` shape and the `min-h-0` flex rule, plus a
**Tables** section; `Sidebar` gained an `AppShell` story that renders it.

### Harness

`dark-matrix.mjs` was not idempotent against its own output — it looked for a
`\n};` terminator and the generated block ends `\n} as Story;`, so a second run
skipped all 48 files. Both terminators are now recognised.

### Both-theme verification is now a gate, not a habit

Design owner, 2026-09-15: *"ти ж розумієш що все має перевірятись і в темній і світлій темі?"* — correct, and the process was not doing it. The table padding work earlier the same day changed `--tbl-header-bg` on reasoning alone, with no dark measurement.

`.design-sync/theme-audit.mjs` now resolves the whole `globals.css` token graph in **both** themes (following `var()` chains and `color-mix()`, including the translucent `…, transparent)` form) and reports each state ladder as a dL* step over the surface it actually paints on. It fails on a **collision** (two states within 0.5 dL*), an **inversion** (a later state weaker than an earlier one), a broken `expectEqual` pair, and a **parity** gap between the neutral and destructive versions of the same state.

Run it after any token edit:

```
node .design-sync/theme-audit.mjs
```

It caught one pre-existing defect on its first run: **`--tbl-row-hover` and `--tbl-row-pressed` were the identical value on dark** (both grey-800, because row-hover was pinned to `--state-hover`), so a hovered row and a selected row were the same colour. The kit fixed this on 2026-07-09 — *"halfway between the row surface and the selected/header surface … Mirrors light exactly"* — and the package never adopted it. Now `color-mix(in srgb, hsl(var(--surface-card2)) 50%, hsl(var(--surface-card)))`, giving 2.57 / 5.09 / 9.21 on dark against light's 1.86 / 3.73 / 8.65.

Because that token is now a `color-mix()`, `tbl.row-hover` **and** its `table.row-hover` alias had to move to a bare `var()` in `THEME_COLORS` — an `hsl()` wrapper round a `color-mix()` emits invalid CSS and drops the declaration whole. No call site used an alpha modifier on it, so nothing broke; `bg-tbl-row-hover/50` is now silently dead, as with every other `color-mix()` token.

### Converter timings, measured (2026-09-15)

Design owner: *"дуже довго ти робиш зміни і заливаєш"*. Measured rather than guessed:

| step | cost |
|---|---|
| full `package-build` (48 components) | **725 s** |
| per preview inside it | ~15 s |
| `preview-rebuild.mjs --components Table` | **75 s** |
| Storybook reference build | ~4 min |
| `gen-classlist.mjs` | ~60 s |

**A parallel-lanes fork of `lib/previews.mjs` was tried and removed.** `buildPreviews` is a strictly sequential loop of 48 full `esbuild.build()` calls, which looks like the obvious win — but sharding it 8 ways changed the total by nothing (725 s). esbuild already saturates every core inside a single build, so lanes just split the same CPU. The fork was deleted rather than kept on a hunch; both adding and removing it shift the grade contract for every component, and both were free only because `.design-sync/.cache` held no grades yet.

**The real levers are workflow, not code:**

1. **Close every edit before starting a chain.** Three full chains ran on 2026-09-15 and two were invalidated by edits landing after they started — roughly 50 minutes of the ~75 spent building.
2. **`preview-rebuild.mjs --components A,B` for story, presentation and `viewport` changes** — 75 s against 725 s. It does not touch `_ds_bundle.js`, `styles.css`, `.d.ts` or `.prompt.md`, so it is wrong for a recipe or token change, and right for everything else.
3. **Storybook is the grading reference, not a build input.** Skip it unless a capture/compare pass is actually going to run.
4. **`gen-classlist.mjs` depends only on `THEME_COLORS`.** Skip it otherwise.
5. **Never interrupt a running chain.** Killing one mid-flight leaves `dist/_ds-entry.js` in a state the next run cannot read: once as *missing*, costing a `[NO_DIST]` failure and a re-run to diagnose; once as *present but orphaned*, where step 2's `verify-dist` type-checks it against dist's own module resolution and prints a page of TS2835 about relative imports needing file extensions — which names neither the kill nor the script. `pnpm bundle` now clears both on taking over a stale lock, so a kill costs the build and nothing after it.
6. **One chain at a time, per checkout.** On 2026-09-21 three ran together — two plain, one `--storybook` — from three sessions that could not see each other. They share `dist/`, `ds-bundle/` and `.design-sync/.cache`, so they overwrite each other's steps and every one of them reports success; what reached the prototype was a part of each. `scripts/bundle.mjs` takes `.design-sync/.cache/bundle.lock` with `wx` (creating the file is the test, so two starts in the same second cannot both pass) and a second run now refuses and names the first. It is a lock per checkout, not per machine: a second clone has its own.

Not done, deliberately: **content-hash caching of preview compiles.** It is the only remaining lever on a full build, but a correct key has to cover every transitive import (via esbuild's `metafile`), or a change in `Button/index.tsx` leaves Button's preview silently stale — the exact failure class this project spends its time hunting. Not worth it on the critical path without that.

### Storybook is NOT optional when the component set changes

Correcting the optimisation note above: "skip Storybook unless grading" is wrong for **any build that adds or removes a component**. `cfg.shape` is `storybook`, so `package-build.mjs` enumerates components from the static Storybook build — not from `dist`. Skipping it on the build that introduced `FilterChips` produced a clean, validating bundle with `components: 48` and no FilterChips directory at all: `dist` had it (52 entry points, `make-entry` 193 exports), the stories index did not, and nothing failed.

Revised rule:

| change | Storybook rebuild |
|---|---|
| new / removed component, renamed story export | **required** |
| recipe, token, doc, viewport override | not needed for upload |
| any capture / compare / grading pass | required (it is the fidelity oracle) |
