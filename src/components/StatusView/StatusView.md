# StatusView — the empty states

One component for every "there is nothing to show" block. What changes between
them is **which state it is**, and that decides the picture and the action.

Every number below is quoted from `Insightis/pages/kit-theme.css`
(`.empty-state`, `.empty-state.is-sm`, `.cl-menu-empty`) or from
`reports/2026-09-04-insightis-ux-audit.md`. Where the package has no counterpart
in either, it says so.

## The three states

| | When | Picture | Action |
|---|---|---|---|
| **Nothing yet** | the list has never had anything in it | `EmptyStateIllustration` | **the create CTA** |
| **No matches** | a query or a filter returned nothing | `EmptySearchIllustration` | a way back to All — **never create** |
| **Failed** | the request errored | `tone="error"` glyph | `onRetry` + `retryLabel` |

Two rules make this more than a table.

**A first-run empty state offers the thing it is missing.** The kit's menu empty
state is "a tinted icon chip, a short title, helper text, **then the CTA**"
(`.cl-menu-empty`), and the audit's first-run case keeps the drop zone next to
"No files yet" (#51). An empty list with no way out of being empty makes the
reader go looking for the button that should have been in front of them.

**A no-matches state does not.** The audit is explicit: keep the filter chips,
show "No matches found" "with a hint to switch back to All" (#52). Offering
*create* here is wrong twice over — the thing may already exist, just filtered
away, and creating a second one is the one action that cannot help.

The two must be distinguishable, which is why the pack has two illustrations
rather than one. A single picture cannot say both.

**The meta row goes with them.** When the visible set is empty, the count /
Select all row is not rendered (#53) — a row reading "0 connections · Select
all" above an empty state is a control for nothing.

## One action or two

`actions` takes **one or two buttons, and no more.**

- **One** — the thing the state is missing: *Create connection*, *Clear search*,
  *Try again*. This is the default shape.
- **Two** — that, plus its alternative: *Create connection* / *Import from a
  file*; *Clear search* / *Clear all filters*. The first is the primary, the
  second is `variant="secondary"` or `tertiary`.

Never two primaries: a block whose whole job is to point at one thing cannot
point at two with equal weight. Never three — an empty state that offers three
ways out is a menu with a picture on it.

`actionsOrientation="stacked"` puts them in a column for a narrow surface (a
popover, a tray). The row is capped at `max-w-xs` either way, so a stacked pair
does not stretch to the width of the block.

The action's offset is the kit's, not the block's gap: **12px below the text at
`lg`, 8px at `sm`** (`.empty-state .btn{margin-top:.75rem}`, `.5rem` at
`.is-sm`). The component adds it; a consumer does not.

```jsx
<StatusView
  icon={<EmptyStateIllustration />}
  withIconHalo={false}
  size="lg"
  surface="embedded"
  title="No connections yet"
  description="Connect a data source to start querying it."
  actions={
    <>
      <Button leftSlot={<Plus />}>Create connection</Button>
      <Button variant="secondary">Import from a file</Button>
    </>
  }
/>
```

## Anatomy and sizes

`lg` and `sm` are the kit's two, copied:

| | `lg` — `.empty-state` | `sm` — `.is-sm` |
|---|---|---|
| Padding | 48 / 24 | 24 / 16 |
| Gap | 8 | 6 |
| Glyph, no halo | 48 | 32 |
| Illustration | 150px | 104px |
| Title | Title 16 | |
| Message | Body M, max 32ch, balanced | |
| CTA offset | 12 | 8 |

`xs` and `md` have **no counterpart in the kit**. They are the package's own
rungs for a status block inside a card or a tray, and are not to be cited as kit
values.

The kit's page-level empty state has **no chip**: `.empty-ic` is a bare 48px
glyph in `--ink-inactive`. Pass `withIconHalo={false}` for that, which is also
what the illustrations need. The chip that is in the kit belongs to the menu
state — `.cl-menu-empty-ic`, 28px, `--icon-wrapper-bg`, a border, a 16px glyph.

## In a popover or a dialog

The menu state is the same component one size down, and the kit fixes one more
thing about it: the surface is **a fixed width across every state** — loading,
empty, filled (`.cl-menu-*`, 16rem). The empty state must not shrink, or the
popover resizes as results arrive.

```jsx
<StatusView
  size="sm"
  surface="embedded"
  icon={<EmptySearchIllustration />}
  withIconHalo={false}
  title={`No workspace matches “${query}”`}
  description="Check the spelling, or clear the search."
  actions={<Button size="sm" variant="secondary" onClick={clear}>Clear search</Button>}
/>
```

## Usage

```jsx
// Nothing yet — offers the thing that is missing.
<StatusView
  icon={<EmptyStateIllustration />}
  withIconHalo={false}
  size="lg"
  surface="embedded"
  title="No connections yet"
  description="Connect a data source to start querying it."
  actions={<Button leftSlot={<Plus />}>Create connection</Button>}
/>

// Failed — the one state with a retry.
<StatusView
  tone="error"
  size="lg"
  title="Could not load connections"
  description="The request timed out."
  onRetry={refetch}
  retryLabel="Try again"
/>
```
