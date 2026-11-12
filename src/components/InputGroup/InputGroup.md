A text field with optional leading and trailing addons — the search box, the
labelled input, the field with a unit suffix.

```jsx
<InputGroup size="md">
  <InputGroupAddon><Search /></InputGroupAddon>
  <InputGroupInput placeholder="Search connections…" />
</InputGroup>
```

## Variants

- `outline` (default) — white fill (`Surface/Card`) with a border: the field
  every form uses, on a card or on the grey page.

## Sizes

`xs` `sm` `md` `lg` `xl`, horizontal padding 8 / 12 / 12 / 12 / 12. At `xs`, `sm`
and `md` it is `Button`'s, so a field and a button of the same size line up on
one row; at `lg` and `xl` the button opens out to 16 and 20 and the field holds
12. `TextArea` carries the same ladder. Prefer `sm` and `md`.

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

## A number

A port, a timeout, a count: `InputGroupInput digitsOnly`, its unit after it.
The field keeps only the digits of what is typed or pasted, so there is no "not
a number" error to write; a range is still the form's check. Not
`type="number"` — its spinner steps what nobody steps.

```jsx
<InputGroup label="Connection timeout">
  <InputGroupInput digitsOnly value={timeout} onChange={(e) => setTimeout(e.target.value)} />
  <InputGroupAddon align="inline-end">seconds</InputGroupAddon>
</InputGroup>
```

## States

Focus is a **neutral** border (`--input-focus`), not the brand ring — the kit
keeps field focus neutral for Input, TextArea and InputGroup. Hover is suppressed while the field is focused, pressed or
disabled, so the states never stack into a muddier border.

`aria-invalid` is a first-class variant here: set it on the input and the error
treatment applies. Pair it with a message in `body12` at `textColor="secondary"`
— or the feedback red when the message *is* the error.
