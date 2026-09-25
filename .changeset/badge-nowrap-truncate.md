---
'@devart/ui-react': patch
---

`Badge` — a pill can no longer wrap, and truncates when it does not fit.

Every size fixes the height (`xs`/`sm` 20px, `md` 28px, `lg` 32px, `xl` 36px), so
a label that wrapped did not make the chip taller: the second line was drawn
outside it, across the border and whatever sat below. On a dashboard tile
`1 not configured` broke in two and read as a rendering fault rather than as a
label that was too long.

`Badge.md` already carried the rule in prose — keep the label to one or two
words — which holds only while the author can see the narrow case. A three-digit
count, a longer locale or a column the page did not size is exactly where they
cannot.

The base is now `whitespace-nowrap overflow-hidden`, and the label span is
`min-w-0 truncate`. When a badge does not fit, the one thing that happens is a
truncated label: `overflow-hidden` is what lets the pill give way at all — a
flex item's automatic minimum size is its content width until the item hides its
overflow, and then it is 0 — and `truncate` keeps the ellipsis inside the
border. `leftSlot` and `rightSlot` are wrapped in `shrink-0` spans, as the dot
and the delete control already were, so a squeezed chip loses characters and
keeps its glyph.

The ellipsis is a fallback, not a layout: it says the label wants shortening or
the column widening, and a badge whose text can be cut should carry `tooltip`.
