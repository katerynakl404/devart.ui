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
it is interactive (a clear button, a visibility toggle) it needs to be a real
`IconButton` with an `aria-label`.

## States

Focus uses the **neutral** ring, not the brand one — brand never visualises form
focus in this system. Hover is suppressed while the field is focused, pressed or
disabled, so the states never stack into a muddier border.

`aria-invalid` is a first-class variant here: set it on the input and the error
treatment applies. Pair it with a message in `body12` at `textColor="secondary"`
— or the feedback red when the message *is* the error.
