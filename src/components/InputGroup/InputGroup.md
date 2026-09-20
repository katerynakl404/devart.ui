A text field with optional leading and trailing addons — the search box, the
labelled input, the field with a unit suffix.

```jsx
<InputGroup size="md">
  <InputGroupAddon><Search /></InputGroupAddon>
  <InputGroupInput placeholder="Search connections…" />
</InputGroup>
```

## Variants

- `primary` — a well cut into the page: filled `Surface/Bg` with a border. Use
  it for page-level fields sitting on a card.
- `outline` — border only, no fill, for a field inside an already-filled
  surface where a second fill would muddy the stack.

## Sizes

`xs` `sm` `md` `lg` `xl`, on the same padding ladder as `Button` and `TextArea`
(8 / 12 / 12 / 16 / 20), so a field and a button of the same size line up on one
row. Prefer `sm` and `md`.

## Addons

`InputGroupAddon` holds an icon or a short unit. Icons inside it are already
spaced from the input — do not add your own margin. An addon is decorative: if
it is interactive (a clear button, a visibility toggle) it takes
**`InputGroupAction`** with an `aria-label`, never an `IconButton`:

```jsx
<InputGroupAddon align="inline-end">
  <InputGroupAction aria-label="Clear search">
    <X aria-hidden />
  </InputGroupAction>
</InputGroupAddon>
```

No pill, no border, no fill. A control docked in a field is a sub-part of the
field: the field already owns hover, focus and press, and a second hover surface
inside it reads as a button sitting in a button. `InputGroupAction` is a 24px
box around the field's 16px glyph, answering the pointer with colour alone
(`--ink-icon` → `--ink-icon-hover`), and `InputGroup` swaps its own `px-3` for
`pe-2` when one is present, so the action adds no margin of its own.

`IconButton size="2xs"` is the same 24px box but a 14px glyph and a hover fill,
which is why reaching for it here produces a control one step small and one
surface too many.

Do not size the glyph either — the addon carries the field's step, and anything
written on the icon loses to it.

## States

Focus uses the **neutral** ring, not the brand one — brand never visualises form
focus in this system. Hover is suppressed while the field is focused, pressed or
disabled, so the states never stack into a muddier border.

`aria-invalid` is a first-class variant here: set it on the input and the error
treatment applies. Pair it with a message in `body12` at `textColor="secondary"`
— or the feedback red when the message *is* the error.
