# Handoff to the developers' GitLab

What goes from this package to `devart/components/devart.ui.react` (`upstream`), in which merge
request, in what state. Kept by the `ds-handoff` skill (`Design system/.claude/skills/ds-handoff`).
A § leaves `DESIGN-SYSTEM-CHANGES.md` only when the developers have **released** it.

## Header

| | |
|---|---|
| design base | `upstream` **1.4.0 — `f69ebc9`** (since 2026-10-28, the 1.3/1.4 sync §154). Packages are cut from it; `git diff f69ebc9 master -- <files>` is what is still ahead |
| developers now | `1f6a577` (1.4.0 + our Checkbox, 2026-11-03) — **all of it taken into the library** |
| differences left | **141** entries in the `DESIGN-SYSTEM-CHANGES` index (143 → 141 after !22) — goal: 0 |
| route | **A** — branch `design/<KEY>-<slug>` pushed to their project, MR inside it, their CI runs (2026-10-28) |
| her role in their project | **Developer** (access level 30) — confirmed by the MCP, 2026-10-28. Can push a branch; merging stays theirs |
| `katerynak/design-system` a GitLab fork of theirs | not needed for route A |
| AIINS task per MR | **none** — her decision, 2026-10-28; the § number is the reference |
| grouping | **one MR per component** if it is not big (≈300 lines, ≈5 §s, or any 🔴 → split by §); one commit per § |
| GitLab MCP | `Design system/.mcp.json` → built-in server, GitLab 19.5.1, **connected** 2026-10-28 as `katerynak`; all write tools denied — also those of the GitLab plugin (`mcp__plugin_gitlab_gitlab__*`) |
| worktree | `Design system/_handoff` (own `core.autocrlf=input`) |

Status: `prepared` (local commit, gates green) → `published` (Draft MR) → `in review` → `merged` →
`released vX.Y.Z` → § retired.

## Packages

| id | § | component | local branch | bump | gates | MR | status |
|---|---|---|---|---|---|---|---|
| H-001 | §99 §163 §164 (§57 dropped) | `Checkbox` | MR !22 | patch | CI ✓ | [!22](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/22) | **merged** 2026-11-03 as `1f6a577` (squash); Andrii put the marks back to Lucide 10px `stroke-[3.6]` — the library follows |
| H-002 | radio — size, border, hover, disabled, error, focus offset, label | `RadioButton` | `handoff/radiobutton` @ `214a664` → `design/radiobutton` (from master `1f6a577`) | patch | all 6 ✓ | [!25](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/25) | published 2026-11-03 (ready, no squash); first of the forms-and-buttons chain |
| H-003 | switch — description, tooltip, disabled state, label | `Switch` (+ `Tooltip/ControlTooltip`) | `handoff/switch` @ `4e21b4f` → `design/switch` (on `design/radiobutton`) | minor | all 6 ✓ | [!26](https://git.devart.com/devart/components/devart.ui.react/-/merge_requests/26) → `design/radiobutton` | published 2026-11-04; retargets to master when !25 is merged |

## Waves — how the rest breaks down (2026-10-27)

Index of `DESIGN-SYSTEM-CHANGES.md`: 127 entries — 85 signed off, 41 draft, 1 open.

0. **Take theirs back first** — done, §154 (committed 2026-10-28). Where they had moved: 1.3.0–1.4.0 added `ChoiceGroup` /
   `ChoiceCard` (AIINS-2125, AIINS-2143), `GuideCard` (AIINS-2127), `StatusView` sizes (AIINS-2143),
   `ScrollShadow` tab stop (AIINS-2137). Our §118 (ChoiceCard, draft), §120 (Coachmark — vs their
   GuideCard), §51 §104 §107 (StatusView) are to be compared with theirs before anything is sent.
1. **Foundations** — one MR each, each 🔴 (tokens are a two-repository change: `apps/web/src/index.css`):
   tokens and colour §2 §5 §6, §48's `--code-*` · sizes and glyphs §40 §44 §92 · across components §98 §99 · plus
   the shared pieces the component diffs reach for (`focusRing`, `duration-fast`, `size-control`, …).
2. **Standalone fixes** on components they have, needing nothing from wave 1 — like §57. Quick, patch.
3. **Fixes that need wave 1** — after it is merged.
4. **New components** (17 not in theirs, all draft today) — after sign-off, and after wave 1.
5. **Not for them**: §19 §20 §84 (build and tooling), §97 §146 (sync records), `ds-bundle/`,
   `changes/`, palettes, `.design-sync/`. Waiting on a component they do not have: CodeBlock §48,
   ConnectorLogo §16, MetaRow §52.

## Found while preparing — decide before the wave that touches it

- **`Checkbox` disabled mark, no §.** Theirs fades the checked/indeterminate mark to `ink-inactive`
  (`disabled:data-[state=checked]:text-ink-inactive`), which leaves it barely visible on the faded fill;
  ours removed that line — "disabled is an opacity fade, not a colour swap" (`Checkbox.md`). A real
  difference with no § number: record it, or it will never be handed over.
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
