A surface for grouping related content.

Default is `variant="outline"` with `rounded="lg"` — a bordered card on the page
surface. That is the right starting point for almost everything.

## Variants

- `outline` (default) — border, card background, no shadow.
- `secondary` — the filled sibling, for a card nested inside another card where
  a second border would read as a box in a box.
- `elevated` — shadow instead of a border, and it lifts on hover. Use it only
  when the card is itself clickable.
- `row` — a horizontal list row rather than a block.
- `ghost` — no fill, and a **dashed** 1px border: the "browse more" tile, an
  empty slot the user clicks to add the thing the grid is full of. Pair it with
  `CardIcon variant="ghost"`, which is its dashed icon well. A dashed edge here
  means *nothing here yet*, not *drop something here* — a file drop target is
  `DropZone`, its own component with its own drag state.

  Do not reach for it as the backdrop of an empty state: a no-results block
  inside a dashed box invites a click that leads nowhere. An empty state is
  `StatusView` with `surface="embedded"`; for a plain unframed group, use no
  card at all.

## Radius

`none` · `sm` (2) · `rounded` (4, the default step of the system) · `md` (6) ·
`lg` (8, the card default) · `xl` (12) · `full`. A card is `lg`; drop to `md`
only when it sits inside something already rounded at `lg`.

## Composition

`Card` is a plain surface — it brings no padding, no gap and no typography of
its own, deliberately, so it does not fight the content:

```jsx
<Card className="flex flex-col gap-4 p-6">
  <Typography element="h2" textStyle="title20">Storage</Typography>
  <Typography element="p" textStyle="body14" textColor="secondary">
    2.4 GB of 10 GB used across all connections.
  </Typography>
  <ProgressBar value={24} />
  <div className="flex items-center justify-end gap-2 border-stroke border-t pt-4">
    <Button size="md" variant="tertiary">Manage</Button>
    <Button size="md" variant="primary">Upgrade</Button>
  </div>
</Card>
```

Card padding is `p-6` at page level, `p-4` for a dense list card. Never wrap a
`Table` in a `Card` — the table ships its own frame.
