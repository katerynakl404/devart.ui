---
'@devart/ui-react': minor
---

Fix the sidebar shell's heights and add `SidebarBrand`.

`SidebarInset` was `h-full` under a `min-h-svh` `SidebarProvider`. A percentage
height resolved against a parent whose computed `height` is `auto` also computes
to `auto`, so that rule was not wrong-looking, it was **inert**: the content area
never filled the screen, and nothing inside it could scroll internally — it grew
the page instead. It is now `min-h-svh`, which a flex item can carry without a
definite parent, with the `inset` variant's own margins subtracted.

`SidebarFooter` gained the divider above it and `mt-auto`. It previously stayed
at the bottom only because `SidebarContent` had grown enough to push it there;
in a sidebar with two nav items it drifted up.

`SidebarBrand` is new — the 32px product row, with a 16px leading inset that
lines the mark up with the navigation icons below it and an 8px trailing inset
so a 24px icon button sits flush with the rail edge. Without it the header's
internal layout had to be invented at each call site, and was.
