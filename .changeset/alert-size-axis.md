---
'@devart/ui-react': minor
---

`Alert` — a size axis, because the component does two jobs and they do not want the same type.

Tucked inside another surface — a queue band, a card — an Alert is a footnote and reads at 12.
Standing on a page, above a table, speaking about the whole screen, it occupies a full row, and
12px there is a whisper from something large. Consumers were reaching for `titleClassName` and
`descriptionClassName` to say that, which puts the type scale back in the page.

`size="sm" | "md"`, default `sm` — every inline use predates `md`, and the component was drawn for
the footnote case first.

| | sm | md |
|---|---|---|
| Title | `text-xs leading-4` | `text-sm leading-5` |
| Description | `text-xs leading-4` | `text-sm leading-5` |
| Glyph | 16px | 20px — stroke 2 at both, `glyphStroke` |
| Padding / gap | `px-3 py-2.5` · `gap-2.5` | `px-3.5 py-3` · `gap-3` |
| Title → description gap | 2px | 2px — unchanged; the line boxes carry their own leading |

Every rung moves together — type, glyph, padding and gap — so `md` is a size, not an Alert with a
bigger font. The glyph box equals the title's line box at both sizes, which is what aligns them.

`sm`'s own inset moves with it: `p-2.5` (10px square) becomes `px-3 py-2.5` (10/12), which is what
the Insightis kit has shipped since the component was first copied there. The two systems now agree
on the Alert box token for token, at both sizes.
