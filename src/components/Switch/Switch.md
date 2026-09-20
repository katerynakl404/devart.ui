A two-position control that applies its change immediately. If the change needs a
Save, that is a `Checkbox`, not a `Switch`.

## Sizes

| Size | Track | Thumb | Where |
|---|---|---|---|
| `default` | 36 x 20 | 16 | forms, settings panels, anywhere the toggle is the subject of its row |
| `sm` | 28 x 16 | 12 | **inside a table row or a dense list row** |

**A toggle inside a table row is `sm`.** A row is a dense context: at `default`
the toggle is a step louder than every other thing in the row and pulls the eye
off the name it belongs to — you end up reading a column of switches instead of a
list of connections. `sm` sits level with 14px row text and reads as a property of
the row rather than its headline.

Both sizes share every colour token and every state; only the four dimensions
above differ.

## States

Brand fill when on, a filled medium-grey track when off (`--switch-off-bg`), and
a white thumb with `--shadow-thumb` in both positions — the shadow is what keeps
the thumb's edge perceivable against the grey. Hover lifts each track one step
(`--brand-hover` / `--switch-off-bg-hover`). Focus is the neutral form ring, never
the brand one. Disabled fades from whichever position it is in.

Position, not colour, is what conveys state (WCAG 1.4.1). The visual track stays
36 x 20, but an invisible `::before` extends the hit area to 44 x 44, which is
what closes the short-axis gap in WCAG 2.5.5 / 2.5.8.

## Label

Pass `label` rather than rendering your own `<label>`: the component wires
`htmlFor` to a generated id, applies the shared ink and disabled treatment, and
keeps the text clickable. `labelPosition` puts it left / right / top / bottom.

`containerVariant="tertiary"` turns the whole label row into a hover/press
surface — for a settings list where the row, not the switch, is the target.

## Confirming a change

The component never confirms anything itself, and most toggles should not. Ask
for confirmation only when switching **off** has a consequence the user cannot
see from where they are standing — a connection that stops feeding every
workspace, for example. Even then, confirm one direction only: switching back on
is its own undo, and a dialog on both directions just teaches people to dismiss
it.
