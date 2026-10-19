---
'@devart/ui-react': minor
---

Add `PageHeader` — the title row a screen starts with: an optional back control,
the page title (an `h2`, the developers' level), and trailing actions. It has
no inset of its own: the page pads it, as `ListPageLayout`'s sticky header does.

Two measurements in it are deliberate and easy to lose in a rewrite. The back
arrow is a 20px glyph rather than the 16px used inside dense controls, because
it sits beside the 24–30px title and a smaller arrow reads as a stray icon instead of
the page's own control. And it sits 8px from the title while everything else in
the row is 12px apart — the arrow belongs to the title rather than being a
sibling of it, and the tighter gap is what says so.

The title truncates, so a long name shortens instead of pushing the actions off
the row.

The title is the product's page title: `heading30`, `heading24` below `md`, and
`heading20` when `condensed` (it was `title24` / `title16`).
