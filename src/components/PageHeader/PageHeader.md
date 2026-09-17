The title row every screen starts with: an optional back control, the page's one
`h1`, and trailing actions.

```jsx
<PageHeader
  title="Connections"
  actions={<Button size="sm" variant="primary"><Plus />New connection</Button>}
/>
```

Use it as the fixed header of the shell — `SidebarInset`'s first child, above
the scrolling region. It is already `shrink-0`, so it stays put while the
content below scrolls; see the Sidebar doc for the surrounding shape.

## Rules

- **One `h1` per page**, and this is it. Do not put another heading at
  `title24` under it — the next level down is `title20`.
- **`onBack` renders the back control.** Omit it on a top-level page rather
  than passing a no-op: a back arrow that goes nowhere is worse than none.
  `backLabel` names the destination ("Back to connections"), not the gesture.
- **Actions go in `actions`**, not as loose children — they are pushed to the
  end of the row with `ms-auto` and spaced at 12px. The primary action is last.
- The title truncates, so a long name shortens instead of pushing the actions
  off the row.

## Two details that are deliberate

The back arrow is a **20px glyph**, not the 16px used inside dense controls: it
sits beside a `title24`, and a 16px arrow reads as a stray icon rather than the
page's own control.

The arrow is **8px from the title** while everything else in the row is 12px
apart. The arrow belongs to the title rather than being a sibling of it, and the
tighter gap is what says so.
