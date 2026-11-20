---
'@devart/ui-react': minor
---

`SelectableListCard` `layout="row"` takes `checkboxAlign` — `first-line` (the default) or `center` — and stops letting the card's own `align-items` decide. On a one-line row the two land in the same place; on a row of two or three lines they do not. Centred, the checkbox fell into the gap between the lines (16px below the title, measured on LinkAI's connections card at 390px), and passing `items-start` to lift it overshot by 3px, because the checkbox is 18px and a title line is 20px. `first-line` makes the slot `h-5 self-start`, so its own `items-center` lands the checkbox on the title; `center` centres it on the whole row, for a row that reads as one block rather than a title over a description.
