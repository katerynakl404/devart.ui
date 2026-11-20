---
'@devart/ui-react': patch
---

`SidebarMobileTrigger`'s glyph no longer turns a quarter while the sheet is open. A burger turned a quarter is three VERTICAL lines — not a second state of the same sign, and not the ✕ that a turning burger reads as promising. It was also the one control the two prototypes share behaving differently in each, because the turn had reached one bundle and not the other, which is how it was found. A caller that wants a second state passes `icon` and draws it.
