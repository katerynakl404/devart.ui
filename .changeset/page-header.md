---
'@devart/ui-react': minor
---

Add `PageHeader` — the title row a screen starts with: an optional back control,
the page's one `h1`, and trailing actions.

Two measurements in it are deliberate and easy to lose in a rewrite. The back
arrow is a 20px glyph rather than the 16px used inside dense controls, because
it sits beside a `title24` and a smaller arrow reads as a stray icon instead of
the page's own control. And it sits 8px from the title while everything else in
the row is 12px apart — the arrow belongs to the title rather than being a
sibling of it, and the tighter gap is what says so.

The title truncates, so a long name shortens instead of pushing the actions off
the row.
