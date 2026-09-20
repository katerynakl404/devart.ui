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

## Three details that are deliberate

The back control is a **tertiary button and measures as one**: a 32px box with
a 16px glyph, the same as `Button size="sm"`. That matters beyond looks — it is
what keeps a header the same height whether or not a screen has a back arrow,
so the page does not slide between two screens one step apart in a flow. An
earlier version used a 36px box with a forced 24px glyph, and cost exactly that
4px.

Its **box sits 6px from the title** (the glyph, 12px) while everything else in
the row is 12px apart. The arrow belongs to the title rather than being a
sibling of it, and the tighter gap is what says so.

**The box starts on the header's own inset** — it is not pulled outward to put
the *glyph* on that line. It was, once, on the principle that a tertiary control
is measured by its glyph rather than by the box its hover state happens to
paint. That holds for a control with no surface; this one has one, and a painted
pill starting 6px left of the search field and the table below it broke the
page's left edge every time the pointer crossed the arrow. **Align by the glyph
only while there is no box; align by the box as soon as the box can be seen.**
