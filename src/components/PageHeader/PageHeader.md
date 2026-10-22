The title row every screen starts with: an optional back control, the page title
(an `h2`), and trailing actions.

```jsx
<PageHeader
  title="Connections"
  actions={<Button size="sm" variant="primary"><Plus />New connection</Button>}
/>
```

It has **no inset of its own** — the developers' shape, and the kit's, where
`.cl-page` pads `.cl-page-head`. The page pads it: `ListPageLayout`'s sticky
header does, and a shell header wraps it in the same padding as the content
below. It is `shrink-0`, so as the fixed header of the shell — `SidebarInset`'s
first child, above the scrolling region — it stays put while the content below
scrolls; see the Sidebar doc for the surrounding shape.

## Rules

- **The title is an `h2`**, as in the developers' package and the product. Do
  not put another heading at `heading30` under it — the next level down is
  `title20`.
- **`onBack` renders the back control.** Omit it on a top-level page rather
  than passing a no-op: a back arrow that goes nowhere is worse than none.
  `backLabel` names the destination ("Back to connections"), not the gesture.
- **Actions go in `actions`**, not as loose children — they are pushed to the
  end of the row with `ms-auto` and spaced at 12px. The primary action is last.
- **What belongs to the title goes beside it**, not in `actions`.
  **`titleRight`** sits immediately after it, 12px away inside the title's
  cluster — an info control, a status chip, the data source a form connects
  to; in `actions` it would be pushed to the far edge and read as one more
  control next to Save. **`titleLeft`** opens the row, 12px before what
  follows — a leading icon, a logo, the mobile sidebar trigger. With a back
  control it sits before the arrow, so the arrow stays against the title it
  belongs to. Like `actions`, both are checked for truthiness, so
  `canEdit && <Badge />` renders nothing when the flag is false.

```jsx
<PageHeader
  title="Files"
  titleRight={<IconButton size="sm" variant="tertiary" aria-label="About files"><Info /></IconButton>}
/>
```

- The title truncates, so a long name shortens instead of pushing the actions
  off the row. **`wrapTitle`** wraps it onto more lines instead, for a title
  that must be read whole — on a phone a two-word title beside a button
  otherwise loses its second word to an ellipsis. The arrow, `titleLeft` and
  `titleRight` stay centred on the wrapped title and the actions keep their
  edge; only the row grows taller.
- **`condensed`** is the header once the page has scrolled under it: the title
  at `heading20` and the back control a step smaller, animated over
  `--motion-slow`. The page decides when — `ListPageLayout` does it for you
  with `condenseAfter` and a render-function `stickyHeader`:

```jsx
<ListPageLayout
  condenseAfter={60}
  stickyHeader={({ condensed }) => (
    <PageHeader title="Files" condensed={condensed} wrapTitle />
  )}
>
  …
</ListPageLayout>
```

## Three details that are deliberate

The back control is a **tertiary button sized against the title, not the
row**: a 36px box (`size="md"`) with a 24px glyph beside the full-size title,
stepping to the component's own 32px box and 16px glyph once `condensed`. A
16px arrow beside a 24–30px title reads as a stray icon rather than the page's
own control. The cost is known and accepted: the control is 36px in a row whose
other controls are 32, so a header with a back arrow is 4px taller than one
without.

Its **box sits 6px from the title** (the glyph, 12px) while everything else in
the row is 12px apart. The arrow belongs to the title rather than being a
sibling of it, and the tighter gap is what says so.

**The box starts on the row's edge** — the page's inset — and is not pulled outward to put
the *glyph* on that line. It was, once, on the principle that a tertiary control
is measured by its glyph rather than by the box its hover state happens to
paint. That holds for a control with no surface; this one has one, and a painted
pill starting 6px left of the search field and the table below it broke the
page's left edge every time the pointer crossed the arrow. **Align by the glyph
only while there is no box; align by the box as soon as the box can be seen.**
