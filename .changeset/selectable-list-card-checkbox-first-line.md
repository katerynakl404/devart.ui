---
'@devart/ui-react': patch
---

`SelectableListCard`'s checkbox is held to the item's FIRST line instead of to the middle of the item. On a one-line row the two are the same place; on a row whose content is two or three lines they are not, and the card's own `align-items` decided it — centred, the checkbox fell into the gap between the lines (16px below the title, measured on LinkAI's connections card at 390px), and passing `items-start` to lift it overshot by 3px, because the checkbox is 18px and a title line is 20px. The slot is now `h-5 self-start`, so its own `items-center` lands the checkbox on the title whatever the caller aligns the card to.
