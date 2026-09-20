---
'@devart/ui-react': major
---

Align the size ladder with the reference kit: `lg` and `xl` now grow the type and
the glyph instead of the padding.

The heights were already right — 28/32/36/40/44 in `Button`, `IconButton`,
`Input`/`InputGroup` and `TextArea`. Everything else about the top two steps was
not, and the divergence had a shape: **the package grew the box, the kit grows
the content.** A previous changeset stated the padding ladder as settled
("8/12/12/16/20"), which is why this went unchecked — the kit holds the
horizontal inset at 12px from `sm` upward and lets the label, the glyph and the
field text climb instead.

**Breaking — `Button` and `IconButton`**

- Padding: `lg` 16 → **12px**, `xl` 20 → **12px**. `xs`/`sm`/`md` unchanged
  (8/12/12).
- Label: `lg` and `xl` 14 → **16px** (Label XL). The ladder caps at 16 — an
  18px control label reads as body copy, not as a label.
- Gap: 6 → **8px**, tightening to **4px** at `xs`.
- Glyph: `lg` and `xl` 16 → **20px**. The ladder repeats at both ends —
  16 across `sm`/`md`, 20 across `lg`/`xl`.

An `xl` button gets visibly narrower and its label visibly larger. Anything that
sized a container around an `xl` or `lg` button by eye needs a second look;
anything that used `lg`/`xl` *because* they were wider should move to an explicit
width instead.

**Breaking — `InputGroup` / `Input`**

- Padding: `xs` 8 → **6px**, `lg` 16 → **12px**, `xl` 20 → **12px**. The `xs`
  step is the one half-step on this ladder and a deliberate step tighter than
  the reference: at 28px tall with a 14px glyph, 8px of edge puts the icon
  closer to the border than to the text it introduces. **`Button` `xs` stays at
  8px**, so at that one step a field and a button no longer share an edge.
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

**Why the kit's model and not the package's.** Padding-driven scaling stops
meaning anything at the top of the range: `px-5` on a 44px control beside a 14px
label — unchanged since `sm` — reads as loose rather than large, and two `xl`
buttons overflow a narrow column long before their labels would. Growing the
content is also what makes the step legible at a glance, which is the only reason
a five-step ladder exists.

**Icon colour.** A decorative glyph in a field takes the placeholder ink
(`--ink-inactive`) so an empty field is one weight of grey; a docked control sits
on `--ink-secondary` and lifts to `--ink-body` on hover, which is the reference`s
`.igrp-act` recipe. Both are child selectors on the addon, because the nested
IconButton sets its own colour and a plain class would lose to it.
