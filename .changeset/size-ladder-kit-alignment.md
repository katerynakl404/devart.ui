---
'@devart/ui-react': major
---

Align the size ladder with the reference kit: `lg` and `xl` now grow the type and
the glyph, not only the box.

The heights were already right — 28/32/36/40/44 in `Button`, `IconButton`,
`Input`/`InputGroup` and `TextArea`. The top two steps grew the box and nothing
in it: the label stayed 14px and the glyph 16px, so a 44px `xl` read as an
oversized `md`. The kit lets the label, the glyph and the field text climb.
Padding is in the changeset that introduced the ladder.

**Breaking — `Button` and `IconButton`**

- Label: `lg` and `xl` 14 → **16px** (Label XL). The ladder caps at 16 — an
  18px control label reads as body copy, not as a label.
- Gap: 6 → **8px**, tightening to **4px** at `xs`.
- Glyph: `lg` and `xl` 16 → **20px**. The ladder repeats at both ends —
  16 across `sm`/`md`, 20 across `lg`/`xl`.

An `lg` or `xl` button's label gets visibly larger. Anything that sized a
container around one by eye needs a second look.

**Breaking — `InputGroup` / `Input`**

- Field text: `sm` 12 → **14px**, `lg` and `xl` 14 → **16px**. `sm` is
  a correction in its own right — the earlier "13 → 14" migration rounded it
  down to 12 when the kit's `sm` field has always been Body M.
- Addon glyph: `xs` 16 → **14px**, `md` 20 → **16px**; `sm` (16), `lg` (20) and
  `xl` (20) unchanged. Both glyphs in a field now read the same step — the
  leading one from the addon, the trailing one from the size passed to its
  IconButton, because a class written on the icon loses to both.
- Addon gap at `xs`: 8 → **4px**, via a compound variant, because at 28px tall a
  14px glyph with 8px either side is most of the remaining width.

**Breaking — `TextArea`**

- Padding: `xs` 8/8 → **4/8**, `sm` 8/12 → **6/12**, `lg` 10/16 → **8/12**,
  `xl` 12/20 → **10/12**. `md` (8/12) unchanged.
- Font: `sm` 12 → **14px**, `lg` and `xl` 14 → **16px**.

**Added — `Typography`**

`textStyle` gains `label16` — Label XL (16/24), which is what `lg` and `xl`
controls now use. The 18px rungs of the agreed nineteen are deliberately not
added: nothing in the control ladder reaches 18px any more, and an unused rung
on a named scale is an invitation to use it.

**One glyph ladder across three components.** `Button`, `IconButton` and
`InputGroupAddon` now carry the same 14/16/16/20/20 steps, so a field, a text
button and an icon-only control at the same size show the same glyph. The kit
expresses this as one token set (`--icon-xs` … `--icon-xl`) read by `.btn`,
`.iconbtn`, `.field` and `.igrp` alike; the package has three cva ladders that
have to agree by hand, and a comment in each says so.

**Why grow the content.** Padding alone stops meaning anything at the top of the
range: `px-5` on a 44px control beside a 14px label — unchanged since `sm` —
reads as loose rather than large. Growing the label and the glyph is what makes
the step legible at a glance, which is the only reason a five-step ladder exists.

**Icon colour.** A decorative glyph in a field takes the placeholder ink
(`--ink-inactive`) so an empty field is one weight of grey; a docked control sits
on `--ink-secondary` and lifts to `--ink-body` on hover, which is the reference`s
`.igrp-act` recipe. Both are child selectors on the addon, because the nested
IconButton sets its own colour and a plain class would lose to it.
