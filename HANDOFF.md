# Handoff to the developers' GitLab

What goes from this package to `devart/components/devart.ui.react` (`upstream`), in which merge
request, in what state. Kept by the `ds-handoff` skill (`Design system/.claude/skills/ds-handoff`).
A § leaves `DESIGN-SYSTEM-CHANGES.md` only when the developers have **released** it.

## Header

| | |
|---|---|
| design base | `upstream` **1.4.0 — `f69ebc9`** (since 2026-10-28, the 1.3/1.4 sync §154). Packages are cut from it; `git diff f69ebc9 master -- <files>` is what is still ahead |
| developers now | 1.4.0 — `f69ebc9` (2026-10-27) |
| route | **A** — branch `design/<KEY>-<slug>` pushed to their project, MR inside it, their CI runs (2026-10-28) |
| her role in their project | **Developer** — her word, 2026-10-28; the MCP check confirms it (`list_project_members`). Developer can push a branch, not `master` if it is protected; merging stays theirs |
| `katerynak/design-system` a GitLab fork of theirs | not needed for route A |
| AIINS task per MR | **none** — her decision, 2026-10-28; the § number is the reference |
| grouping | **one MR per component** if it is not big (≈300 lines, ≈5 §s, or any 🔴 → split by §); one commit per § |
| GitLab MCP | `Design system/.mcp.json` → built-in server, not yet authorised; all write tools denied |
| worktree | `Design system/_handoff` (own `core.autocrlf=input`) |

Status: `prepared` (local commit, gates green) → `published` (Draft MR) → `in review` → `merged` →
`released vX.Y.Z` → § retired.

## Packages

| id | § | component | local branch | bump | gates | MR | status |
|---|---|---|---|---|---|---|---|
| H-001 | §57 | `Checkbox` | `handoff/57-checkbox-mark-weight` @ `1160fa9` | patch | all 6 ✓ | — | prepared (test run) |

## Waves — how the rest breaks down (2026-10-27)

Index of `DESIGN-SYSTEM-CHANGES.md`: 127 entries — 85 signed off, 41 draft, 1 open.

0. **Take theirs back first** — done, §154 (committed 2026-10-28). Where they had moved: 1.3.0–1.4.0 added `ChoiceGroup` /
   `ChoiceCard` (AIINS-2125, AIINS-2143), `GuideCard` (AIINS-2127), `StatusView` sizes (AIINS-2143),
   `ScrollShadow` tab stop (AIINS-2137). Our §118 (ChoiceCard, draft), §120 (Coachmark — vs their
   GuideCard), §51 §104 §107 (StatusView) are to be compared with theirs before anything is sent.
1. **Foundations** — one MR each, each 🔴 (tokens are a two-repository change: `apps/web/src/index.css`):
   tokens and colour §2 §5 §6 §129 · sizes and glyphs §40 §44 §92 · across components §98 §99 · plus
   the shared pieces the component diffs reach for (`focusRing`, `duration-fast`, `size-control`, …).
2. **Standalone fixes** on components they have, needing nothing from wave 1 — like §57. Quick, patch.
3. **Fixes that need wave 1** — after it is merged.
4. **New components** (17 not in theirs, all draft today) — after sign-off, and after wave 1.
5. **Not for them**: §19 §20 §84 (build and tooling), §97 §146 (sync records), `ds-bundle/`,
   `changes/`, palettes, `.design-sync/`. Waiting on a component they do not have: CodeBlock §81
   §127–§129, ConnectorLogo §108 §115, MetaRow §134.

## Found while preparing — decide before the wave that touches it

- **`Checkbox` disabled mark, no §.** Theirs fades the checked/indeterminate mark to `ink-inactive`
  (`disabled:data-[state=checked]:text-ink-inactive`), which leaves it barely visible on the faded fill;
  ours removed that line — "disabled is an opacity fade, not a colour swap" (`Checkbox.md`). A real
  difference with no § number: record it, or it will never be handed over.
- **`Checkbox` exports.** Ours exports `Checkbox, checkboxVariants`; theirs also
  `checkboxContainerVariants, checkboxIndicatorVariants`. Copying our file would remove two exports
  — a major for them. Keep theirs.

---

## H-001 — §57 `Checkbox`: the tick and the bar at one weight

Test run of the workflow: built on `upstream/master` `f69ebc9`, never pushed.

- **Files:** `Checkbox.tsx` (the § hunks only — not `focusRing`, `enabled:hover`, `duration-fast`,
  `size-control` or the export list, which are other §s), `Checkbox.stories.tsx` (+ disabled and
  invalid indeterminate), `recipes.md` snapshot, `.changeset/checkbox-mark-weight.md`.
- **Gates:** format-and-lint ✓ · lint:tokens ✓ (503) · check-types ✓ · test:unit ✓ 363 (snapshot: 2
  lines, `checkboxIndicatorVariants` only) · test:storybook ✓ 342 in Chromium · check-changeset ✓ patch.
- **Rendered** (Storybook of the worktree, port 6020): all 8 states draw a 12px mark at stroke 3; the
  bar is `M2 12h20`.
- **🔴** reaches the app only after their release and an upgrade in `apps/web`.

**MR title:** `[UI-Kit]: Checkbox — галочка і риска індетермінату однієї товщини, як у кіті`

**MR description:**

> ## Що і чому
> Галочка і риска індетермінату тепер однієї ваги, як у дизайн-кіті. Було: Lucide `Check` і `Minus`
> 14px зі штатним штрихом — риска читалась тоншою за галочку поруч. Стало: обидві 12px, stroke 3
> (1.5px на екрані), риска — штрих у viewBox галочки, `M2 12h20`, 10px (Lucide `Minus` — 7px).
>
> | § | що змінилось | bump |
> |---|---|---|
> | §57 | позначки 12px / stroke 3; риска 10px | patch |
>
> ## Перевірки (локально, на `upstream/master` f69ebc9)
> format-and-lint ✓ · lint:tokens ✓ · check-types ✓ · test:unit ✓ (знімок: 2 рядки, лише
> `checkboxIndicatorVariants`) · test:storybook ✓ · check-changeset ✓ (patch)
>
> ## 🔴
> - До застосунку дійде лише після релізу пакета й оновлення версії в `apps/web`.
>
> ## Чого тут немає
> Інші відмінності `Checkbox` у дизайн-бібліотеці (кільце фокусу, `enabled:hover`, токени тривалості
> й розміру, колір позначки у вимкненому стані) — окремими §, окремими MR.
