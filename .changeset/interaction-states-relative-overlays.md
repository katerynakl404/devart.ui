---
'@devart/ui-react': minor
---

Interaction states become relative overlays instead of absolute colours.

`--state-hover` and `--tbl-row-pressed` resolved to the **same colour** in both
themes — `#F1F5F9` on light, `#21212C` on dark — so a control's hover inside a
selected row was invisible. That is not a tuning miss: any absolute colour
eventually equals the surface it lands on, and absolute colours cannot stack, so
a control could never be "one step deeper than whatever is under it".

Each state is now a translucent wash, so states composite rather than replace.
Each theme declares one base and four strengths; the four state tokens are
written once in `:root` and read them, so retuning a theme touches no consumer
and needs no `.dark` copy of a state token.

- new `--state-overlay` — `--brand-300` on light, `--slate-400` on dark. A
  coloured wash over the near-black card reads as a cast rather than a lift,
  which is why dark washes with a cold neutral.
- four percentages — 4 / 8 / 8 / 12 — written inline and **shared by both
  themes**, because `--slate-400` moves against the near-black card at roughly
  the rate `--brand-300` moves against white.
- `--brand-300` retuned `#5DA0A8` → `#46A6B9` (190°, 45%). It had no consumers.
  The brand ramp drifts from ~194° to 179°, so washing with the brand role lands
  green; `--tertiary-600` reads minty; the old step had the right hue at 29%
  saturation, and a desaturated wash reads dirty rather than soft.
- new `--tint-4`.
- **`--tbl-row-selected-hover` is removed.** A selected row keeps its own surface
  under the pointer; the control on it composites on top. The old token made a
  selected row read as *less* selected the moment you touched it.

**Breaking for a consumer that maps these tokens itself.** `--state-hover`,
`--state-pressed`, `--tbl-row-hover` and `--tbl-row-pressed` are finished colours
carrying their own alpha, so their Tailwind mapping is now bare `var()`. Left
wrapped in `hsl(... / <alpha-value>)` the declaration is invalid and the fill
silently disappears. They also no longer take an opacity modifier — there were
no `bg-state-hover/50`-style call sites in the package.

Rows are deliberately lighter than controls: a row is wide and sits in a stack,
where a heavy wash turns a list into stripes. Composited over the card, measured:

| | strength | light | Δ | dark | Δ |
|---|---|---|---|---|---|
| row hover | `--tint-4` | `#F8FBFC` | 7 | `#1C1D24` | 5 |
| row pressed / selected | `--tint-8` | `#F0F8F9` | 15 | `#21222A` | 10 |
| control hover | `--tint-8` | `#F0F8F9` | 15 | `#21222A` | 10 |
| control pressed | `--tint-12` | `#E9F4F7` | 22 | `#262830` | 15 |

`--tbl-row-pressed` and `--state-hover` share a strength on purpose. Overlays
composite rather than replace, so a control hovering on a selected row lands at
8% over 8% — `#F0F8F9` → `#E3F1F4` on light, `#21222A` → `#2A2C36` on dark.

Destructive tertiary was re-stepped **on light** to hold parity with the neutral
ladder it had drifted from — hover `--tint-6`→`--tint-4`, press
`--tint-8`→`--tint-6`; these alias the outline sibling, which moves with them.
Without it the destructive control read heavier than its neutral sibling. Dark
was left alone: its existing 20 / 30 were already in parity.

`--state-disabled` is untouched: it is a rest surface, never stacked on another
state, and has to stay an opaque fill.
