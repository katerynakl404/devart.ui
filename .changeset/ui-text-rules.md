---
'@devart/ui-react': patch
---

UI text follows one written rule, `CONTENT-RULES.md`, and three defaults move to it.

The package ships 40-odd strings a user actually reads, and nothing said how they should be
written, so they drifted: `Search...` in `Autocomplete` while its own story said `Search cities…`,
a hint ending in a period while no other label did, an em dash cutting a toast in half. The base
is the Material 3 style guide (Grammar and punctuation), which follows AP, with the house rule
that both products already carry (`LinkAI/linkai-kit` rule 6, `Insightis/devart-ui` rule 6) on top
of it: **an act is Title Case, everything that names is sentence case**.

What changes:

- **One ellipsis character.** `Search...` → `Search…`, `Loading...` → `Loading…` (`Autocomplete`).
  Both are placeholders, so neither changes case.
- **No period on a single-sentence hint.** `DropdownMenuSegmentedItem`'s hint is now
  `Left and right arrows change it`.
- **No em dash in the strings a user reads.** A comma, a colon or a second sentence says it and
  scans faster: `Failed to upload. Try again.`, `Everything is where it was: its connections,
  metrics and files.` Documentation prose keeps its dashes, and `—` stays as the empty-value mark
  in a cell.
- **Title Case for the labels that act**, after reading where each one lands rather than what its
  prop is called: `Select All` and `Deselect All` (`ListSelectionBar`, a `Button`), `See more` and
  `See less` (`ClampedText`, a `LinkButton` with no `href`, which renders a `<button>`),
  `Exit Selection` (`ListSelectionBar`), `Clear Selection` (`MetaRow`) and `Clear Search`
  (`SearchInput`) — the last three are the tooltip of an icon button. `Clear selection` in
  `Autocomplete` and `Select` stays sentence case, because there it is an `aria-label` with no
  tooltip behind it: the same words, two cases, decided by where they land.

What deliberately does **not** change, because each renders as a button's own words or as a
tooltip: `Set Date` (`SingleDatePicker`, `DateRangePicker`), `Show Less` (`AlertStack`) and
`Toggle Sidebar` (`SidebarRail`, `SidebarTrigger`, `SidebarMobileTrigger`). The last one is the
only judgement call: `label` is an `aria-label`, which the rule puts in sentence case, but the
same string is `SidebarRail`'s `title` and the tooltip the two triggers can show — so it is read
as a tooltip and keeps Title Case. A prop that can render both ways takes Title Case, and
`CONTENT-RULES.md` says so. `Datepicker`'s story was the odd one out at `Set date` and now matches
the default.

Every changed string is a prop with a default, so a consumer passing its own label is untouched.

`More actions for {row}` on every row's ⋮ keeps its sentence case although it reaches a tooltip:
the products fixed that wording (`LinkAI/linkai-kit` rule 6) and a product's own string outranks
this file.

`CONTENT-RULES.md` is loaded from `CLAUDE.md` beside `SPEC.md` and `COMPONENT-RULES.md`. Two
questions it records rather than answers: whether a single-sentence description or error line ends
in a period, and whether the uppercase section labels stay given that M3 rejects caps blocks.
