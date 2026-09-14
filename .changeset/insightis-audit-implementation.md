---
'@devart/ui-react': major
---

Implement the Insightis UX audit (2026-09-04) and its type-scale companion.

**Breaking**

- `Button`: the `ghost` variant is removed. It was identical to `tertiary` in
  every state, and `tertiary` has a family (`destructiveTertiary` is its
  sibling). Replace `variant="ghost"` with `variant="tertiary"`. `Card`,
  `CardIcon` and `Toggle` keep their own unrelated `ghost` variants.
- `IconButton`: `aria-label` is now required. An icon-only control has no
  visible text, so without it a screen reader announces only "button".
- `Button`, `InputGroup` and `TextArea` horizontal padding now follows one
  ladder (8/12/12/16/20 for xs/sm/md/lg/xl) instead of a flat 10px, so a button
  and a field of the same size share one edge. The field edge moved onto the
  `InputGroup` shell; `Input` and the addons no longer add their own.
- `tracking-tight` now resolves to this system's -0.01em rather than Tailwind's
  stock -0.025em, via a new `letterSpacing` scale in the preset.

**Breaking (dialog width)**

- `ModalContent` no longer uses one width for every dialog. It gains
  `size="sm|md|lg"` — 360px / 480px / 576px, backed by new
  `--modal-w-{sm,md,lg}` tokens and `max-w-modal-*` utilities. The default is
  `md` (480px); the previous fixed width was `max-w-lg` (512px), so every
  existing dialog gets narrower unless it opts into `lg`. Size a dialog by
  what it holds: `sm` for a confirm, `md` for anything the user fills in,
  `lg` for a wizard.

**Added**

- `focusRing` (exported from `./cn`): the system's focus recipe, now applied to
  Accordion, ToggleGroup, Input, Sheet and the bare Popover/Tooltip triggers,
  none of which had a focus indicator (WCAG 2.4.7 AA).
- `Typography` gains `textStyle` — the 19 named type styles, each carrying size,
  weight and line-height together so no call site re-decides them. Prefer it
  over `variant`; pick the semantic tag separately with `element`.
- Tokens: `--font-size-display` / `--line-height-display`, and a tracking scale
  (`--tracking-tight|normal|caps|display`). Preset gains `text-display`, the
  `letterSpacing` scale, and opacity steps 6/8/12.
- Every component gains a `DarkTheme` story: tokens are pure CSS cascade, so a
  scoped `.dark` re-themes a subtree with no provider and no props. (Components
  that portal to `document.body` need the class on `<html>` to theme an open
  overlay — the story notes this.)
- `Typography` gains a `TextStyles` story showing all 19 named styles.
- `Modal` gains a `Sizes` story demonstrating the three dialog steps.
- `Autocomplete` gains `clearLabel` and `popupIndicatorLabel`; `FileDismiss` and
  `FileRetry` gain `label`.

**Fixed**

- `Banner` was never responsive: its nine `max-[880px]:*` / `max-[600px]:*`
  classes produced no CSS at all, because the arbitrary max-width variant emits
  nothing. Now `max-md` / `max-sm`.
- `Sheet`'s close icon used `h-6.5 w-6.5`, which is not a step in Tailwind's
  spacing scale and likewise emitted no CSS. Now `size-6`.
- `Button` rendered its label wrapper unconditionally, so an icon-only button
  with a `rightSlot` got a 0px third flex child and a doubled gap.
- `Button`'s `destructiveTertiary` and `IconButton`'s destructive variant used
  `active:` instead of `pressed:`, so they went flat while holding a menu open.
- `Checkbox`, `CheckboxGroup` and `RadioButton` rendered their `<label>` with
  no ink token, so it inherited ambient colour and was illegible dark-on-dark
  inside a `.dark` subtree. All three now use `text-ink-body`.
  `RadioButton`’s disabled state also used a raw `opacity-50` instead of the
  system’s `opacity-disabled` (0.65).
- 23 raw `duration-*` values now use `--motion-fast|base|slow`. The two
  `duration-500` panel slides (Sheet, Sidebar) are unchanged by design.
- Tints use one notation on one scale; off-scale sizes moved onto the type
  scale (13→14, 11→12) and off-grid paddings onto the 4px step.

**Note for consumers keeping a local token copy:** `globals.css` gained the
display and tracking tokens, so any hand-synced copy (e.g. an app's own
`index.css`) needs the same additions.
