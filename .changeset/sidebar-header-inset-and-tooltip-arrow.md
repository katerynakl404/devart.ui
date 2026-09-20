---
'@devart/ui-react': patch
---

Fix `SidebarHeader` losing its horizontal inset, and put the tooltip arrow on
the 4px scale.

`SidebarHeader` had been changed to `flex flex-col gap-0 pt-3 pb-2` — no
horizontal padding — on the theory that the rows inside it would carry their own
inset via `SidebarBrand`. That made the component unsafe by default: any
consumer that lays the row out by hand (which is most of them, and what the
first product page did) gets a brand mark flush against x=0 while every
navigation icon below sits at x=16. Nothing errors; the rail just looks broken.

The inset moves back onto the header as `ps-4 pe-2`, and `SidebarBrand` drops
its own copy so nesting the two does not double it. A row that genuinely needs
to reach the edges now opts out with `-ms-4 -me-2`, which is the rarer case and
fails visibly rather than silently.

`TooltipContent`'s arrow was Radix's default 10x5. The arrow is drawn into the
`sideOffset` gap rather than beside it, so the gap a reader sees is
`sideOffset - arrowHeight` = 8 - 5 = 3px; neither 5 nor 3 is on the 4px scale.
The arrow is now 8x4, which puts the tip exactly 4px from the trigger.

One related trap this does not fix, because it belongs to the consumer: an
icon-only tooltip trigger must be `inline-flex`. Left as a plain inline `span`,
the icon sits in a text line box and the trigger grows to the line-height (20px
around a 14px icon) — and Radix measures `sideOffset` from the trigger, so the
tip drifts 6px further out than the number says.
