# How a component is built here

The rules every component in this library follows — written down from what the developers rewrote
after merging ours (their package `devart/components/devart.ui.react`, 2026-11-16), from their
reviews of each other's merge requests, and from their own `CLAUDE.md`. Code that breaks them gets
rewritten on the way into their package, so it is written this way here from the start. The hashes are
their commits; `!NN` are their merge requests.

The base conventions are in `SPEC.md` → Component Conventions and decisions 3–6 (tokens only, CVA only,
`variant` not `tone`, `pressed:`, `cn()`, extend before adding). This file adds what that section does
not say.

**Checked by `src/__tests__/house-rules.test.ts`** — the rules marked ✔. It is a ratchet: what the library
already breaks is listed in `src/__tests__/house-rules.baseline.json`, and only going over that list
fails. Fixing a component lowers its line; refresh the list after a fix with
`$env:UPDATE_HOUSE_RULES=1; corepack pnpm vitest run src/__tests__/house-rules.test.ts`. Never raise a
number to make the gate pass.

## Files and parts

- ✔ **One component per file.** Their review of !28: "three components in one file — split it". `Switch` +
  `SwitchTrack` became `Switch.tsx` / `SwitchControl.tsx` / `SwitchRoot.tsx` (`f7463ae`); the 294-line
  `Select` became `Select.tsx` + `SelectTrigger` / `SelectList` / `SelectItem` / `SelectClearButton`, each
  with a small props interface and its recipe beside it (`85bfe0f`). Length alone is not the trigger:
  one-component files of 219–245 lines pass.
- **`index.tsx` only re-exports** once the folder has several files.
- **`types.ts`** when types are shared between part files; otherwise props stay beside their component.
- **State shared between parts → a context** (`context.ts`, `<Component>Context`): an object value in
  `useMemo`, `null` by default so a bare Radix root keeps Radix's behaviour (`e2c1511`).
- **Pure logic leaves the component**, into a kebab-case module named for what it returns or does:
  `get-footer-message.ts`, `use-search-results.ts`, `restoreFocus` in `src/lib/focus-modality.ts`.
- **A helper takes only what it decides on and returns only what it adds** — `disabledProps(disabled,
  hasTooltip)`, spread after the consumer's props, replaced `inertForTooltip(disabled, hasTooltip,
  onClick)` (`f7463ae`).
- **Markup written twice becomes one component** — `RequiredMark` for the asterisk; one `Typography`
  driven by `{ id, content, tone }` for an error or a hint (`9c9f1a4`).
- **One component, one job.** A prop that swaps the whole render is a separate exported component:
  `SearchInput results` → `SearchInputWithResults`, `results` required (`f096000`).

## Types and props

- **A requirement lives in the types, as a union** — not a doc line, not a blanket required prop —
  with a type test using `@ts-expect-error` (`SwitchDescriptionProps`, `SwitchTooltipProps`,
  `switch-props.test.ts` — `f7463ae`).
- ✔ **No `as { … }` casts.** Type the generic's base so defaults read typed fields (`SelectOptionBase`,
  `SearchResultBase` with `label?`); write defaults in the destructuring (`85bfe0f`, `f096000`).
- **Data and state props first, `className` next, callbacks and getters last** — interface and
  destructuring alike (review !28; `85bfe0f`).
- **The root takes `ref` and the element's `...props`** (`extends HTMLAttributes<HTMLDivElement>`) —
  review !33.
- **React's names keep React's meaning** — `defaultValue` is the initial value (review !32).
- **Label props are strings** (`clearLabel`, `dismissLabel`), never functions (review !33).
- **A closed list of a union's members** is `satisfies Record<Union, true>` (review !33).

## Classes and recipes

- ✔ **No condition in TSX** — no `cond && 'class'`, no `cond ? 'a' : 'b'` in `cn()` or `className`, no
  `Record<…, string>` class map (`Toast` is the one sanctioned exception, SPEC decision 5). Read the state
  from the DOM — `group/switch` on the container, `group-has-[[data-disabled]]/switch:opacity-disabled` on
  the label (`f7463ae`) — or make it a recipe axis: `selectGroupVariants({ isInvalid })` (`85bfe0f`).
- **Every class string sits in a named, exported `cva` recipe**, so `recipes.md` sees it (`85bfe0f`;
  review !32 held up our Select `withClear` axis as the model). Name it for what it styles
  (`filterMenuOptionLabelVariants`). An axis whose value is fixed in each JSX branch is two recipes
  (`b82469b`).
- ✔ **`pressed:`, never `active:`**, and never `data-[state=open]:` on a trigger (SPEC decision 6;
  `f7463ae` on the Switch tertiary row).
- **A colour in an arbitrary property is a Layer-3 token**; a utility beats an arbitrary property where
  one exists (`underline-offset-[25%]`, `font-[family-name:inherit]`) — `e1cdc52`, review !24.
- **Text goes through `Typography` and its props** (`textColor`, `weight`), not a bare `<span>` with a
  colour class (`9c9f1a4`; review !32).

## Reuse what exists

- Their part, not a copy: the ✕ is `IconButton`; a radio row is `DropdownMenuRadioItem` with a variant,
  not `role="menuitemradio"` by hand (review !32).
- `src/lib` helpers, not local ones: `composeRefs`, `composeEventHandlers` (`f096000`, `e2c1511`).
- A sibling's CSS value, not a JS measurement — the results list took Autocomplete's
  `max-h-[min(21.5rem,…)]` instead of a `useLayoutEffect` height (`f096000`).

## Walk the edges before calling it done

What they fixed in ours:
- **Replacing a library default keeps the cases it handled** — DropdownMenu's close-focus dropped
  Radix's outside-interaction rule (`e2c1511`).
- **Act on `click`, not `pointerdown`**; `pointerdown` only keeps focus — the Select clear button cleared
  on a right-click (`85bfe0f`).
- **The inputs nobody tries**: a consumer `id`; a soft-disabled control in a form (drop its `name`); a
  value not in `options`; invalid + open; the disabled look of every glyph; `aria-keyshortcuts` for keys
  that act (`f7463ae`, `85bfe0f`).
- **Disabled blocks the action**, not only the look, with a test (review !24).
- **A child keeps its place in the tree** across states, or it remounts (review !33).

## Stories and tests

- **A behaviour fix ships with a `play` story asserting it** (`FocusReturn`, `NonModalOutsideClick`,
  `ClearOnClick`, `UnknownValue`).
- **Stories run on args**: `useArgs`, callbacks as `fn()`, function props `control: false`; an
  interactive `Playground` where the state matters (`85bfe0f`; reviews !28, !33).
- **One behaviour per `play`**, `waitFor` around anything animated (`b6c5b36`, `86e794a`).

## Docs in the same commit

A new component → a row in README's component table. A portal → SPEC "Portals". A new `src/lib`
module → the SPEC tree line. A cross-cutting behaviour → a SPEC Component Conventions bullet.

## Words for axes and parts

- `variant` is style only, with the kit's values: `primary` / `secondary` / `white` (!24). Layout is
  `align` or `layout` (!28).
- Modifiers and states are boolean axes (`inline`, `open`); one prop name keeps one type across
  components (!24, !33).
- Name by role, not position (`actions`, not `end`); `part` values match the `data-slot` suffixes (!28).
  No numbers as words (!33).

## Checked and not rules

- Splitting by length alone; `displayName` everywhere (their Select parts have none); arbitrary lengths
  in rem (a nit — they kept `end-[34px]` in Select); `context.ts` vs `<Component>Context.ts` (both live
  in their tree).
