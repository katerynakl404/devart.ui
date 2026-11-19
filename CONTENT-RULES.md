# How UI text is written here

Every string a user reads: labels, buttons, placeholders, helper and error lines, tooltips, empty
states, dialog body text, toasts, menu items. Not Storybook prose, not JSDoc, not this file —
documentation has its own voice and keeps it.

The base is the Material 3 style guide, [Grammar and
punctuation](https://m3.material.io/foundations/content-design/style-guide/grammar-and-punctuation),
which follows AP style. What is below is that guide, minus what this library does differently on
purpose, plus the cases it leaves open. Where a default label ships from this package, it is the
product's text until the product overrides it, so it is written to this file from the start.

## Capitalisation

- **An act is Title Case; everything else is sentence case** (her decision, 2026-11-19, as both
  products already have it — `LinkAI/linkai-kit/README.md` rule 6, `Insightis/devart-ui/README.md`
  rule 6).
  - **Title Case — what the user does**: a button's own words, a menu item, and the tooltip of an
    icon button, which names its button with the menu item's words for the same act: `Set Up`,
    `Remove from Workspace`, `Test Connection`.
  - **Sentence case — everything that names rather than acts**: field labels, headings, dialog
    titles, column heads, tabs, chips, links, hints, empty states, toasts, and an `aria-label`
    that is not a tooltip: `Create workspace`, `Clear selection`, `First page`, `No matches`,
    `Remove file`, `More actions for {row}`.
- Capitals belong to proper nouns and product names in either case: `Postgres`, `Salesforce`,
  `Amazon S3`, `Pro` — and they keep them inside a sentence-case string: `Add to Permissions`,
  `Add MCP Server to Claude`.
- **Where the string lands decides, not the prop name.** Three defaults in this package are
  Title Case for that reason: `Set Date` (`SingleDatePicker` and `DateRangePicker` render it as
  the confirm `Button`'s own words), `Show Less` (`AlertStack`, likewise a `Button`) and
  `Toggle Sidebar` (`SidebarRail` puts it in `title`, and `SidebarTrigger` /
  `SidebarMobileTrigger` can show it as a tooltip). `AlertStack`'s neighbour
  `Show {n} more notices` is an `aria-label` and no tooltip, so it is sentence case. A prop that
  can render both ways takes Title Case, because the tooltip is the visible one.
- **Not swept yet.** The same rule catches defaults nobody has looked at: `Select all` and
  `Deselect all` (`ListSelectionBar`, both inside a `Button`) and `Exit selection` (its tooltip)
  should be Title Case. `See more` / `See less` (`ClampedText`) sit in a `LinkButton`, which the
  rule above puts on neither side — a link is sentence case, a button is not. Settle the
  `LinkButton` case and sweep all four at once, rather than one label at a time.

## Dashes

- **No em dash (—) in UI text.** It cuts a line in two and reads as an aside. A comma, a colon or
  a second sentence says the same thing and scans faster:
  - `Failed to upload. Try again.`
  - `Everything is where it was: its connections, metrics and files.`
  - `Primary analytics warehouse, production replica, EMEA region`

  It stays in two places only: documentation prose, and the empty-value mark in a cell (`—`).
- **En dash (–) for a range, no spaces:** `9 AM–noon`, `1–20 of 240`.
- **Hyphens** bind words that act as one: `two-factor`, `case-insensitive`, `read-only`, `multi-step`.
  Never a space around them. A verb phrase keeps its space (`check in to the room`, but `the next
  check-in`). AP decides the doubtful ones.

## Ellipsis

- One character, `…`, never three periods: `Search…`, `Loading…`, `Type your message…`.
- Only for an action under way or text that is cut off.
- Never on a button or a menu item that opens a dialog: `Rename`, not `Rename…`.
- No space before it.

## Periods

- **Two sentences or more take periods:** `Failed to upload. Try again.`
- **A heading or a title never takes one**, however long.
- A single sentence in a label, tooltip, link, list item or dialog body: see [Open](#open) — this
  one is not settled yet.

## Contractions

- Contract what English contracts: `can't`, `didn't`, `you'll`, `we couldn't`. A spelled-out form
  is for weight where it is earned: `Do not close this window`.
- No `Please`, no `Sorry`, no `Oops`.

## Commas

- **The serial comma**, in every list of three or more: `subscription, invoices, and payment
  methods`. Not before `&`.
- **Thousands take a comma:** `1,200`, `15,000`. Not in a year, a street address or a port number.
  Past a million, round and abbreviate where the point is the volume: `8.4M rows`.

## The small marks

- **Exclamation point** — only for something worth celebrating. Never on an empty state or a task
  someone does twenty times a day.
- **Colon** — in body text before a list; never at the end of a heading.
- **Parentheses** — to expand a term or a code: `(HTTP 401)`, `Oracle ERP (staging)`. Not for an
  afterthought: if it matters, it belongs in the sentence.
- **Ampersand** — fine in a label, a chip, a tab, a column header or a button, where space is
  short. Spelled out inside a sentence.
- **Italics** — a single word or a name, never a sentence. Bold carries emphasis.
- **Quotation marks** — typographic, “like this”, with the comma or period inside them.

## One word for one thing

One pair of verbs means the same thing everywhere in the library: show / less on a pile of notices,
see more / see less on clamped text, expand / collapse on a tree row, show / hide a password,
pin / unpin, clear selection on anything that clears one. Take one of these before inventing a
third pair. Their capitals follow Capitalisation above and not this list: the same verb is
`Show Less` in a button and `show less` inside a sentence.

## Open

Two questions this file does not answer yet. Both are one sweep through the demo copy and the
product pages once decided, so they are worth settling before the copy grows.

1. **A period after a single sentence** in a description, helper or error line. M3 drops it, Apple
   HIG requires it, and the library does both today: `Password is too short.` sits next to `The
   file is larger than the 25 MB limit`. Whichever wins, it has to win everywhere.
2. **Caps blocks.** `Typography overline`, `DropdownMenuLabel`, `SidebarSection` and
   `CardSectionLabel` set small labels in uppercase with `tracking-caps`. M3 rejects uppercase
   outright, as hard to read and poorly announced. Here it is a type style for section labels, not
   a way of writing a word. Keep it, or drop the uppercase and hold the step with size and weight
   alone.
