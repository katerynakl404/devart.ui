The standard text button. `IconButton` is its icon-only sibling and shares the
same variant and size scales.

## Variants

`primary` `secondary` `outline` `tertiary` `primaryTertiary` `destructive`
`destructiveOutline` `destructiveTertiary` `transparent` `transparentUnderline`.

There is **no `ghost`** — use `tertiary`. There is exactly one regular tertiary
and one destructive tertiary; do not reach for a third low-emphasis treatment.

Prefer `secondary` for the cancelling action and `primary` for the confirming
one. `destructive` is a solid red fill and is for the confirming action of a
destructive flow, not for every delete affordance — an inline "Remove" in a list
is `destructiveTertiary`.

## Rules

`Button` and `IconButton` alike. Each rule is one place in the code; change it
there, not per variant.

1. **One wash a family** (§180). Hover and press on every unfilled button are
   the state wash, 8% / 12%: `--state-hover` / `--state-pressed` for `secondary`,
   `outline`, `tertiary`, `primaryTertiary`; red for `destructiveOutline` and
   `destructiveTertiary`, 8% / 12% on light and 12% / 15% on dark. A filled
   button steps its own fill.
2. **`secondary` keeps its fill.** Its wash is pre-mixed over `--surface-card`
   (`--btn-secondary-bg-hover` / `-press`), so it stays a white chip on any ground.
3. **A border steps on hover and stays stepped while pressed** — `secondary`,
   `outline`, `destructiveOutline`.
4. **Every label holds 4.5:1 in every state**, in both themes, on the card, the
   page and a hovered table row; `theme-audit` checks it. The `secondary` border
   is light on purpose: the label names the button.
5. **Two disabled looks** (§181). Filled (`primary`, `destructive`):
   `--state-disabled` fill, `--ink-inactive` label. Every other button: its own
   `--ink-body` label, no fill, the whole control at `opacity-disabled`; with a
   border it keeps the secondary border (`secondaryDisabled`), without one it has
   none (`ghostDisabled`). Switched off, a red button is not red.
6. **Disabled does not answer the pointer** (§66). No hover, no press, and the
   `aria-disabled` form looks the same as `disabled`.
7. **The icon stands beside the label**, with `fullWidth` too (§183).
8. **The radius follows the box** (§182): 28px and smaller (`xs`, `IconButton`
   `2xs` / `3xs`) take 4px, larger boxes 6px, unless `rounded` is set.
9. **An icon-only button has a name.** `IconButton` requires `aria-label`; a
   `tooltip` shows it and does not replace it.
10. **One focus ring**: 2px `--focus-ring-brand` with a 2px card gap on every
    variant, red ones included.

## Sizes

`xs` `sm` `md` `lg` `xl`, with horizontal padding 8 / 12 / 12 / 16 / 20. A field
(`InputGroup`, `TextArea`) has the same edge at `xs`, `sm` and `md`, so a button
and a field of the same size line up on a row; at `lg` and `xl` the field holds
12. Prefer `sm` and `md`; modal footer buttons are always `sm`.

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

**`tooltip`** (and `tooltipSide`) — the same prop as `IconButton`'s, on the same
code. Its first use is the reason a button is off:

```jsx
<Button disabled tooltip="Activate the connection to add it to a workspace">
  Add Workspace
</Button>
```

With `disabled` and a `tooltip` the button is rendered `aria-disabled` rather
than `disabled` — still in the tab order, so the reason opens on focus as well
as on hover, painted exactly as disabled, and its click swallowed. Do not wrap a
disabled button in a focusable span to hold a tooltip. `tooltip` with no
`disabled` names the action; `true` shows the `aria-label`. Needs a
`TooltipProvider` above, as every tooltip does.

**Focus is inherited, never re-declared.** Anything that renders a `Button` gets
the ring for free.

**`pressed:` not `active:`.** A trigger that opens a menu keeps its pressed fill
for as long as the menu is open, because the variant expands to `:active`,
`[aria-expanded=true]` and `[aria-expanded=true]:hover`.
