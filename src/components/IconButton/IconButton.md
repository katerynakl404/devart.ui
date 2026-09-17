An icon-only button. Same variants and the same states as `Button`, on a square
box.

**`aria-label` is required.** Name the action, not the surrounding row: "Delete
connection", not "Connection". Without it the control is unusable by screen
reader and by e2e locators, which bind to the accessible name rather than a test
id.

## Sizes

`2xs` (24) `xs` (28) `sm` (32) `md` (36) `lg` (40) `xl` (44). The box ladder from
`xs` up mirrors `Button` step for step, so an icon-only control lines up with a
text button of the same size. The glyph is 16px everywhere and 14px on the two
smallest steps.

**`2xs` is the row-action size** — use it for a kebab or an inline edit/delete
pair inside a table row or a list row, and nothing else.

```jsx
<TableActionsCell>
  <IconButton aria-label={`Edit ${name}`} size="2xs" variant="tertiary">
    <Pencil />
  </IconButton>
  <IconButton aria-label={`Delete ${name}`} size="2xs" variant="destructiveTertiary">
    <Trash2 />
  </IconButton>
</TableActionsCell>
```

## Variants worth knowing

- `tertiary` — the default for a secondary affordance: no border, no fill at
  rest, neutral hover.
- `destructiveTertiary` — its destructive twin. Red ink, red-tinted hover. The
  tint is matched to the neutral hover's perceived strength in **both** themes,
  which is why it reads as the same weight beside a `tertiary` sibling rather
  than shouting.
- `transparent` — no box at all (`p-0`, fit-content), for an inline trigger
  inside dense text.

Never paint a raw red icon in place of `destructiveTertiary`: a bare `<Trash2
className="text-fb-red" />` has no hit area, no hover and no focus ring.

## Behaviour

`isLoading` swaps the glyph for a `Spinner` and sets `aria-busy` without
disabling. Focus is the kit-wide brand ring on every variant, destructive
included — a red ring on a red control reads as noise.
