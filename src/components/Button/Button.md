The standard text button. `IconButton` is its icon-only sibling and shares the
same variant and size scales.

## Variants

`primary` `secondary` `outline` `tertiary` `destructive` `destructiveOutline`
`destructiveTertiary` `transparent` `transparentUnderline`.

There is **no `ghost`** — use `tertiary`. There is exactly one regular tertiary
and one destructive tertiary; do not reach for a third low-emphasis treatment.

Prefer `secondary` for the cancelling action and `primary` for the confirming
one. `destructive` is a solid red fill and is for the confirming action of a
destructive flow, not for every delete affordance — an inline "Remove" in a list
is `destructiveTertiary`.

## Sizes

`xs` `sm` `md` `lg` `xl`, with horizontal padding 8 / 12 / 12 / 16 / 20. `Button`,
`IconButton`, `InputGroup` and `TextArea` share this ladder, so a button and a
field of the same size line up on a row. Prefer `sm` and `md`; modal footer
buttons are always `sm`.

## Icons

An icon can be passed either way, and the difference matters:

```jsx
<Button leftSlot={<Plus />}>Create</Button>   {/* icon in the button's own row */}
<Button><Plus />Create</Button>               {/* icon inside the label */}
```

Both are supported and both stay on one line. Use `leftSlot` / `rightSlot` when
the icon is a fixed affordance of the control (a chevron, a spinner slot), and a
plain child when it reads as part of the label.

## Behaviour

**`isLoading` is not `disabled`.** It swaps the content for a `Spinner`, sets
`aria-busy`, and blocks pointer input while keeping the variant fill — but never
sets `disabled`, which would drop the control out of the tab order mid-request.

**`asChild`** renders the child element instead of a `<button>` — the only
sanctioned way to make a link look like a button:

```jsx
<Button asChild variant="primary"><a href="/new">New connection</a></Button>
```

**`fullWidth`** stretches the button and takes `align` (`left` | `center` |
`right`) for the label; without `fullWidth` the label is always centred.

**Focus is inherited, never re-declared.** Anything that renders a `Button` gets
the ring for free.

**`pressed:` not `active:`.** A trigger that opens a menu keeps its pressed fill
for as long as the menu is open, because the variant expands to `:active`,
`[aria-expanded=true]` and `[aria-expanded=true]:hover`.
