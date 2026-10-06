---
'@devart/ui-react': patch
---

`Banner` — `size="sm"` tightens the gap between title and description from 6px to 2px, and the
body gains `data-slot="banner-body"` so the size can reach it.

`sm` already steps the title down to 14/20, but the gap under it stayed at the default's 6px — a
value chosen for a 16px title. Each line box already carries 3px of half-leading above and below,
so 6px of gap on top of that pushes the pair apart; `Alert`, stating the same kind of thing at the
same type, has always used 2.

The default size is untouched: its 16px title and taller block still want the air.
