# Handoff to the developers' GitLab

What goes from this package to `devart/components/devart.ui.react` (`upstream`), in which merge
request, in what state. Kept by the `ds-handoff` skill (`Design system/.claude/skills/ds-handoff`).
A § leaves `DESIGN-SYSTEM-CHANGES.md` only when the developers have **released** it.

## Header

| | |
|---|---|
| design base | `upstream` **1.4.0 — `f69ebc9`** (since 2026-10-28, the 1.3/1.4 sync §154). Packages are cut from it; `git diff f69ebc9 master -- <files>` is what is still ahead |
| developers now | `796efa7` (2026-11-18). Eight of her merge requests are in: `773d5d8` `6dc3101` `e88067c` on 2026-11-06, then `ee7bdb5` `27214a4` `69e3dd8` `32f88e9` `0d7843d` `4d72640` on 2026-11-16. Andrii refactored what he merged — `f7463ae` (`disabledProps`, `Switch` split), `e2c1511` (`DropdownMenu` context, `restoreFocus`), `85bfe0f` + `b6c5b36` (`Select` split) — and those are in the library since 2026-11-18, with `261513b` (no `size-control`) since 2026-11-19. Oleksii's own work rides on top: `LinkButton` `StatTile` `MetaRow` `FilterMenu` `AlertStack`, `Badge` and `File` fixes — **taken back on 2026-11-20**: `LinkButton`, `StatTile`, `MetaRow` and `AlertStack` are now byte-identical to theirs (component, stories and tests), `File` took their `dismissLabel`, and `globals.css` took `--link-underline`. `FilterMenu` is the one that did not come whole: they removed the hierarchy in a commit of its own, so ours keeps it — §148 |
| open MRs (MCP, 2026-11-19) | **merged**: !25 !26 (2026-11-06), !29 !30 !31 !37 !38 !39 (2026-11-16). **Still open**: !40 (now targeting `master`) !41 !42 !44 !45 !46 !47 !48 — **every pipeline green**, no conflicts, no review comments, and **!44 approved** (Andrii, 2026-11-18 21:15). On 2026-11-18 he rebased the whole remaining chain onto master himself and re-applied her commits onto his own split; `git range-diff` says each of hers came through unchanged. His own commits on the open branches: `12f633a` `a36d358` (`design/search-input`), `2ef7fc5` (`design/text-area`), `261513b` (`design/controls`) |
| stacked on her branches | `oleksiip` cut his own MRs on top of the chain: !27 StatTile → `design/switch`, !32 FilterMenu → `design/autocomplete`, !33 AlertStack → !32, !43 Badge hairline → `design/digits-only` (2026-11-10: the library's `--badge-border` and base `border-badge-border`, identical — the rest of `Badge` is still ahead). Those bases are merged now, and his work with them, so only `design/digits-only` and the links above it still carry anyone else's MR: **no force-push from `design/search-input` up** — changes go forward as new links of the chain |
| differences left | **132** entries in the `DESIGN-SYSTEM-CHANGES` index (143 → 141 after !22 → 131 after the eight → 133 on 2026-11-19 → **132 on 2026-11-20**: five closed because the developers ported those components themselves — §33's hairline, §46, §47, §52, §149 — against four newly numbered, §191 `File`, §192 `Badge`, §193 `Typography` `h3`, §194 `Foundations`; §188 §189 §190 were written up on 2026-11-19 and never indexed). Index and sections agree both ways — `node scripts/sync-audit.mjs` asserts it. Goal: 0 |
| route | **A** — branch `design/<KEY>-<slug>` pushed to their project, MR inside it, their CI runs (2026-10-28) |
| her role in their project | **Developer** (access level 30) — confirmed by the MCP, 2026-10-28. Can push a branch; merging stays theirs |
| `katerynak/design-system` a GitLab fork of theirs | not needed for route A |
| AIINS task per MR | **none** — her decision, 2026-10-28; the § number is the reference |
| grouping | **one MR per component** if it is not big (≈300 lines, ≈5 §s, or any 🔴 → split by §); one commit per § |
| GitLab MCP | `Design system/.mcp.json` → built-in server, GitLab 19.5.1, **connected** 2026-10-28 as `katerynak`; all write tools denied — also those of the GitLab plugin (`mcp__plugin_gitlab_gitlab__*`) |
| worktree | `Design system/_handoff` (own `core.autocrlf=input`) |
| audit | `node scripts/sync-audit.mjs` — what moved in `upstream` since the last run, our own house-rule debt (theirs subtracted), comment weight, and whether the index and the sections still agree. State in `.sync-audit.json`; `--where` prints each violating line, `--full` rescans, `--write` stores the new baseline |

Status: `prepared` (local commit, gates green) → `published` (Draft MR) → `in review` → `merged` →
`released vX.Y.Z` → § retired.

## Packages

| id | § | component | local branch | bump | gates | MR | status |
|---|---|---|---|---|---|---|---|
| H-001 | §99 §163 §164 (§57 dropped) | `Checkbox` | MR !22 | patch | CI ✓ | [!22](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/22) | **merged** 2026-11-03 as `1f6a577` (squash); Andrii put the marks back to Lucide 10px `stroke-[3.6]` — the library follows |
| H-002 | radio — size, border, hover, disabled, error, focus offset, label | `RadioButton` | `handoff/radiobutton` @ `214a664` → `design/radiobutton` (from master `1f6a577`) | patch | all 6 ✓ · CI ✓ | [!25](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/25) | **merged** 2026-11-06 as `773d5d8`; closes no § — `RadioButton` already worked this way in `upstream` for §99 |
| H-003 | switch — description, tooltip, disabled state, label | `Switch` (+ `Tooltip/ControlTooltip`) | `handoff/switch` @ `74d59bc` → `design/switch` (on `design/radiobutton`) | minor | all 6 ✓ · CI ✓ | [!26](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/26) → `design/radiobutton` | **merged** 2026-11-06 as `6dc3101` + `e88067c`; closes §160 and §151's and §99's `Switch`. Andrii then split the component — `f7463ae`, in the library 2026-11-18 |
| H-004 | field padding 8/12/12/12/12, icon 14/16/16/20/20, gaps, text sm 14 · lg/xl 16, unit 12, label body, error 12, disabled cursor, xs ✕ 14, block addons, Autocomplete text and chips on the field's text line | `Input` + `InputGroup` (+ `Autocomplete` insets, `SearchInput` test) | `handoff/input` @ `41034d9` → `design/input` (on `design/switch` `74d59bc`) | minor | all 6 ✓ · CI ✓ | [!29](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/29) → `design/switch` | **merged** 2026-11-16 as `ee7bdb5`; closes §102 §169 §173 and §9's `InputGroup`. Still ahead: §7's `[&>svg]` and §45's docked-control inks |
| H-005 | thin scrollbar as a base rule in the preset (+ `scrollbar-thin`, `scrollbar-none`) | preset | `handoff/scroll` @ `39b1b54` → `design/scroll` (on `design/input`) | minor | all 6 ✓ · CI ✓ | [!30](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/30) → `design/input` | **merged** 2026-11-16 as `27214a4`; closes §98 — the preset's base rule gives `Table` and `ModalBody` the thin bar without the class. 🔴 apps/web must drop its own global scrollbar rule |
| H-006 | Autocomplete: real ✕/chevron buttons + labels, chips on the 4px scale, list (padding, check, hover clears, 7.5 rows, one-row empty), multi stays open, endAddon, label; addon icon grey; placeholder ellipsis | `Autocomplete` (+ hook, `InputGroupAddon`, `InputGroupInput`) | `handoff/autocomplete` @ `8b107e9` → `design/autocomplete` (on `design/scroll`) | minor | all 6 ✓ · CI ✓ | [!31](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/31) → `design/scroll` | **merged** 2026-11-16 as `69e3dd8`; closes §3 §62 and §106. Not now: chip hairline border (Badge MR) |
| H-007 | menu focus: back to the trigger as before, the ring only after the keyboard; no ring on rows | `DropdownMenu` (+ `lib/focus-modality`, `trigger-ref`) | `handoff/dropdown-menu` @ `4e84f67` → `design/dropdown-menu` (on `design/autocomplete` `ecdce0e`) | patch | all 6 ✓ | [!37](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/37) → `design/autocomplete` | **merged** 2026-11-16 as `32f88e9`; closes §74's menu half — the tooltip half waits on !47. Andrii then moved the trigger ref into `context.ts` and added `restoreFocus` (`e2c1511`), in the library 2026-11-18 |
| H-008 | new Select on Radix Select (+ `@radix-ui/react-select` ^2.3.7, shares the menu's internals); `InputGroup` `required` — asterisk + `aria-required`, off by default; disabled guard for any control; the menu list surface as a recipe | `Select` (+ `InputGroup`, `DropdownMenuContent`) | `handoff/select` @ `1117392` → `design/select` (on `design/dropdown-menu`) | minor | all 6 ✓ | [!38](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/38) → `design/dropdown-menu` | **merged** 2026-11-16 as `0d7843d`; closes §175. Andrii then split the component and kept the error border while the list is open (`85bfe0f`, `b6c5b36`), in the library 2026-11-18; her copy differs by `usePortalContainer` and the empty option id (!45) |
| H-009 | the eye follows the field size (14/16/16/20/20, `passwordToggleVariants` — not the `IconButton` ladder) and shows the action, as the Insightis sign-in does | `PasswordInput` | `handoff/password-input` @ `d9ac00b` → `design/password-input` (on `design/select`) | minor (recipe exported) | all 6 ✓ | [!39](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/39) → `design/select` | **merged** 2026-11-16 as `4d72640`; closes no § — the eye has none of its own. Their play test was already carried back |
| H-010 | §145: the matches under the field while typing (`results`, `onSelect`, `getResultLabel`, `renderResult`, `emptyText`; 7.5 rows, the cap fixed to apply once the portal mounts); passes on `variant`, `aria-label`, `autoFocus`. Dropped 2026-11-10 as unused: `disabled`, `id`, `style`, `onKeyDown`, `maxVisibleResults`, `enterKeyHint`; browser suggestions off only with the list | `SearchInput` | `handoff/search-input` @ `4269b8c` → `design/search-input` (on `design/password-input`) | minor | all 6 ✓ | [!40](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/40) → `design/password-input` | published 2026-11-10; behaviour checked by the With Results story scenario — her unit tests stay in the library (they need `setup.ts` stubs the package has not got). Andrii refactored on the branch (`f096000`, `8a8490a`) and it is **not** in the library — see *Found while preparing* |
| H-011 | padding / text / label / error as `Input`; `required` (asterisk + native required, off by default) as `InputGroup`'s; `hintText` (§41/§70) beside the counter, the error replaces it; disabled keeps pointer events, no hover border; counter row 16px. `wrapperClassName` dropped 2026-11-10 as unused | `TextArea` | `handoff/text-area` @ `281bf84` → `design/text-area` (on `design/search-input`) | minor | all 6 ✓ | [!41](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/41) → `design/search-input` | published 2026-11-10 with push options (MCP needed re-auth — squash left at the project default); the hint and counter use the package's `Typography` API (`variant="span"` + `weight="normal"` + `text-xs`), the library keeps `textStyle="body12"` until `Typography` is handed over — same pixels |
| H-012 | §172 `digitsOnly` on `Input` / `InputGroupInput` (typed, pasted, dropped letters never land; Ctrl+Z kept through `execCommand`; numeric keypad); `InputGroupInput` takes `InputProps` | `Input` (+ `InputGroupInput`) | `handoff/digits-only` @ `846b06a` → `design/digits-only` (on `design/text-area`) | minor | all 6 ✓ | [!42](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/42) → `design/text-area` | published 2026-11-10; the hidden browser ✕ on `Input` kept out on purpose (see *Found while preparing*) |
| H-013 | `focusRing` (`lib/utils`, from `./cn`) shared by the three controls; `Switch` takes the package's `withDescription` only beside the label (the `sm` track no longer drops 2px with the label above / below); her stories carried over. The preset's `size-control` was dropped by Andrii (`261513b`) — see *Found while preparing* | `Checkbox`, `RadioButton`, `Switch` | `handoff/controls` @ `9c29927` → `design/controls` (on `design/digits-only`) | minor | all 6 ✓ | [!44](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/44) → `design/digits-only` | **approved** by Andrii 2026-11-18, CI ✓ on `261513b`; `duration-fast` held back on her word (see *Found while preparing*) — the only difference left in these three files. His re-application put her `Switch` change on his split, with a `besideLabel` prop; the library is byte-identical to `2ff5f0f` + `261513b` apart from `duration-fast` |
| H-014 | an option with an empty `id` (a default such as "Automatic") shows and can be picked: Radix keeps `''` for "nothing picked", so the option goes by `__empty__` inside; with `name`, a hidden input submits the option's own `id` | `Select` | `handoff/select-empty-id` @ `93796a3` → `design/select-empty-id` (on `design/controls`) | patch | all 6 ✓ | [!45](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/45) → `design/controls` | published 2026-11-10, squash off; found through LinkAI (PostgreSQL → Protocol stayed empty); the library keeps the Empty Id Option story |
| H-015 | §40 §44 size ladder; §66 no hover when disabled; §80 §165 §181 one disabled look (`secondaryDisabled`, `ghostDisabled`); §151 `tooltip`; §179 `primaryTertiary` label tokens; §180 one wash a family (red 8/12 light, 12/15 dark); §182 xs radius; §183 icon beside the label; `asChild` (threw on every render), no empty label box; `ghost` removed; `IconButton` `aria-label` required, ladder 14/14/16/16/20/20 | `Button` + `IconButton` (+ `lib/utils`, tokens, `ModalContent` / `SidebarMobileTrigger` label types, `ghost` call sites in Sidebar) | `handoff/button` @ `0fd93ce` → `design/button` (on `design/select-empty-id`) | **major** | all 6 ✓ (unit 390, storybook 362) · CI ✓ | [!46](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/46) → `design/select-empty-id` | published 2026-11-12 (ready, squash off). Held in the library: `duration-fast`, `glyphStroke` (§92), `IconButton` `3xs` (with Tree), `data-variant` (read by the library's `TableActionsCell` — goes with Table; the 2026-11-10 sheet wrongly said nobody reads it). 4b done: Button, IconButton, utils, ControlTooltip and focusRing comments are the package's |
| H-016 | §13 the gap (tip 4, bubble 8, arrow 8×4); §63 delay 300 by default (Modal's 200 and Sidebar's 500 dropped); §177 above a dialog (`z-[110]`, the close button's per-call one dropped); focus opens it only after the keyboard (from H-007); `focusRing` on a bare trigger; §184 a long tip wraps at 288px | `Tooltip` (+ `ModalContent`, `SidebarProvider`) | `handoff/tooltip` @ `c8ad5c5` → `design/tooltip` (on `design/button`) | minor | all 6 ✓ (unit 392, storybook 363) | [!47](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/47) → `design/button` | published 2026-11-13 (ready, squash off). Held: `portalContainer` (needs `PortalContainer`, not in the package). The test stubs jsdom's missing `ResizeObserver` and top layer in its own file, as their tests do; the library keeps both in its setup too |

## Waves — how the rest breaks down (2026-10-27)

Index of `DESIGN-SYSTEM-CHANGES.md`: 127 entries — 85 signed off, 41 draft, 1 open.

0. **Take theirs back first** — done, §154 (committed 2026-10-28). Where they had moved: 1.3.0–1.4.0 added `ChoiceGroup` /
   `ChoiceCard` (AIINS-2125, AIINS-2143), `GuideCard` (AIINS-2127), `StatusView` sizes (AIINS-2143),
   `ScrollShadow` tab stop (AIINS-2137). Our §118 (ChoiceCard, draft), §120 (Coachmark — vs their
   GuideCard), §51 §104 §107 (StatusView) are to be compared with theirs before anything is sent.
1. **Foundations** — one MR each, each 🔴 (tokens are a two-repository change: `apps/web/src/index.css`):
   tokens and colour §2 §5 §6, §48's `--code-*` · sizes and glyphs §40 §44 §92 · across components §98 §99 · plus
   the shared pieces the component diffs reach for (`focusRing`, `duration-fast`, …).
2. **Standalone fixes** on components they have, needing nothing from wave 1 — like §57. Quick, patch.
3. **Fixes that need wave 1** — after it is merged.
4. **New components** (17 not in theirs, all draft today) — after sign-off, and after wave 1.
5. **Not for them**: §19 §20 §84 (build and tooling), §97 §146 (sync records), `ds-bundle/`,
   `changes/`, palettes, `.design-sync/`. Waiting on a component they do not have: CodeBlock §48,
   ConnectorLogo §16, MetaRow §52.

## Found while preparing — decide before the wave that touches it

- **`size-control` is gone, on Andrii's call (2026-11-18, `261513b` on !44).** He took the token
  out of the preset and wrote `size-[18px]` into `Checkbox` and `RadioButton`, and trimmed the
  changeset line that named it. Carried into the library 2026-11-19: their code wins, and it is a
  visual no-op — both controls still measure 18px. What is lost is the name: the token existed
  because the two disagreed (18 vs 20) and one of them was an arbitrary value, so the 18 is an
  arbitrary value again, now written twice. He approved !44 straight after, so this is the shape
  that merges. Hers to re-open if she wants the name back — a token MR of its own, not a fix over
  his commit.
- **`besideLabel` is public in their `Switch` (2026-11-18, `2ff5f0f`).** `SwitchBaseProps` omits
  only `descriptionId` and `tooltip`, so the internal prop reaches `SwitchProps`, and `Switch`
  spreads `{...controlProps}` **after** it — a consumer passing `besideLabel` overrides the
  computed value and defeats the fix. One word (`'besideLabel' |` in the `Omit`) closes it. Not
  changed here: the library matches his file byte for byte, and this is worth a word to him
  rather than a silent divergence.

- **`SearchInput` — their split is held (2026-11-19, her word: «поки не чіпати»).** On `design/search-input`
  (`12f633a`, `a36d358` after his 2026-11-18 rebase) Andrii cut the component in two: `SearchInput` no longer takes `results` at
  all, and the list under the field becomes a public `SearchInputWithResults`, with
  `SearchResultsList.tsx` and `use-search-results.ts` beside it and `SearchInputProps` no longer
  generic. §145 gave `results` to `SearchInput` itself, and LinkAI calls it that way in
  `linkai-kit.stories.js` and `_shared/workspaces.js` — under their shape the list there goes blank
  until both are rewritten. **Half of it is carried, which this entry used to deny:** the library
  has `SearchInputWithResults.tsx` as its own file since `1d00a57` (2026-11-12) and `SearchInput`
  delegates to it when `results` is given, so only the public shape still differs — theirs drops
  `results` from `SearchInput` entirely. Their `SearchResultBase` typing came over on 2026-11-20,
  which removed the two `as { … }` casts their review named. Decide with !40: if it merges as it
  stands, the public shape moves then, and the two LinkAI call sites move with it.
  `Issues/oleksiip/AIINS-2343` ("extended search input") is already stacked on the whole open
  chain, so this is theirs to extend either way.

- **Their `StatTile` carries two classes the `Card` MR has to remove (2026-11-20).** It sets
  `bg-surface-card hover:border-stroke` on the tile, which is them neutralising, by hand and in one
  component, the two things §4 and §60 change about `Card outline` — their outline card has no fill
  and tints its border on hover, ours is filled and does not. The library took their file verbatim,
  so the two classes are a no-op here and the components stay byte-identical. When §4 goes over,
  those two classes come out of `StatTile` in the same MR, or they stay as dead weight that
  contradicts the card under them.

- **`scrollbar-thin` on `Table` and `ModalBody` is now spare (2026-11-18).** !30 put the thin bar
  in the preset as a base rule on `*`, so both surfaces draw it in `upstream` without the class —
  which is why §98 is retired. The library still writes the class on `TableContainer` and
  `ModalBody`; it is the same declarations, one layer higher, so nothing changes either way. Drop
  it with the next MR that touches those two files, or leave it as insurance against an app that
  overrides the base rule — her call.

- **`Toggle` / `ToggleGroup` → a batch MR of small fixes, later (2026-11-12, her word).** The variant names stay theirs (`outline`, `stroke`, `ghost`, `badge`) — a toggle is not a button, so no renaming to the button scale. What differs is small: a disabled toggle lights up under the pointer in theirs (`enabled:` hover guards here, as §66 for buttons), and theirs `disabled:pointer-events-none` hides the not-allowed cursor and any tooltip; `ToggleGroupItem` takes `focusRing` here (check it moves nothing); `duration-fast` is held as for the controls; `/6` vs `/[0.06]` is syntax — keep theirs.
- **Glyph stroke §92 is not handed over (2026-11-12, her word: "товщини лінії іконок давай не рухати").** The library keeps `glyphStroke` (`[&_svg]:stroke-2`); the package keeps the glyphs' own weight. Not offered as an MR again unless she brings it back.
- **Controls' motion (2026-11-10, her word: "duration поки не треба").** The library animates `Checkbox`, `RadioButton` and `Switch` at `duration-fast` (`--motion-fast`, 120ms); the package keeps `duration-150` (Checkbox, RadioButton) and `duration-100` (Switch). Held out of !44; hand over when she decides on motion as a whole.
- **`Input` hides the browser's own ✕ in `type="search"` (2026-11-10).** In the library since 2026-09-20 (`[&::-webkit-search-cancel-button]:hidden` on the base `Input`); the package hides it only inside `SearchInput`. Not dead code: Insightis builds two search fields by hand — `InputGroupInput type="search"` with its own clear button (ChatLibrary, DsCatalog) — and without the rule Chrome draws a second ✕ there. Kept out of the digitsOnly MR on purpose (unrelated, it only shares the file); hand over with the next `Input` / `SearchInput` change.

- **`--ink-inactive` reads blue (2026-11-05, her call: recolour later, from an existing token).** It is `--slate-450` #7C8CA2 — the lightest step of the slate text ladder, so the hue shows most (placeholders, disabled text, decorative icons: 216 uses in 39 files). Candidates already in the ramps: `--grey-500` #6B7280 (neutral, 4.8:1 on white, close to `--ink-secondary` in weight), `--grey-400` #9CA3AF (neutral, 2.5:1 — too faint for text). Decide on a side-by-side of the form story (`Review/Form fields`), both themes; a token change, so the developers' `apps/web/src/index.css` too.
- **`Checkbox` exports.** Ours exports `Checkbox, checkboxVariants`; theirs also
  `checkboxContainerVariants, checkboxIndicatorVariants`. Copying our file would remove two exports
  — a major for them. Keep theirs.

---

## H-001 — `Checkbox`: §57 §99 §163 §164

Cut from `upstream/master` `f69ebc9`, one commit `4698ac9`, 5 files (+128 −25). Not pushed.

- **Gates:** format-and-lint ✓ · lint:tokens ✓ · check-types ✓ · test:unit ✓ 363 (snapshot: Checkbox
  lines only) · test:storybook ✓ 343 · check-changeset ✓ patch.
- **Checked live:** the tooltip opens over the disabled box itself; no hover fill; cursor not-allowed.
- **§57 reworked on her review (2026-10-28):** marks looked off-centre and the bar long → redrawn in a 10px grid,
  bar 8px; approved in the design library first («на локал виглядає ок»), then ported.
- **Her answers (2026-10-28):** rows 1–5 of the change sheet approved; rows 6–8 wait for foundations;
  exports and `Checkbox.md` stay out.

**MR title:** `[UI-Kit]: Checkbox — позначки по центру й однієї товщини, вимкнений стан і підпис, як у дизайні`

**MR description:**

> ## Що змінилось
>
> | § | Зміна | Було → стало |
> |---|---|---|
> | §57 | Галочка й риска однієї товщини, по центру | Lucide 14px → власна сітка 10px, stroke 1.5; 4px з боків — цілий піксель при 100–200%; риска 8px, по 5px до країв |
> | §99 | Вимкнений не підсвічується під курсором | `hover:` → `enabled:hover:`; прибрано `disabled:pointer-events-none` — видно курсор not-allowed |
> | §99 | На вимкнений можна повісити підказку | нова сторі `DisabledWithTooltip` (підказка на обгортці: `TooltipTrigger asChild` перетер би `data-state`) |
> | §163 | Позначка вимкненого блідне разом із квадратиком | була `text-ink-inactive` — майже не видно → `content-on-solid` + `opacity-disabled` |
> | §164 | Підпис | `text-ink-body`; підписи `CheckboxGroup` — `font-medium text-sm`, як в одиночного |
>
> Пропи, експорти й `data-*` без змін. Bump: **patch**.
>
> **Дизайн:** https://katerynakl404.github.io/devart.ui/?path=/story/components-checkbox--states
>
> **Перевірки (локально, на `master` f69ebc9):** format-and-lint ✓ · lint:tokens ✓ · check-types ✓ ·
> test:unit ✓ (знімок — лише рядки Checkbox) · test:storybook ✓ · check-changeset ✓
>
> 🔴 До застосунку дійде після релізу пакета й оновлення версії в `apps/web`.
>
> **Не входить** (окремими MR пізніше): анімація через токен `duration-fast`, розмір через `size-control`,
> фокус через спільний `focusRing` — чекають спільних основ.
