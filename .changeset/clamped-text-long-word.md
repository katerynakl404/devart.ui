---
'@devart/ui-react': patch
---

`ClampedText`: a word longer than the line — a URL, a path, an id typed without spaces — now breaks (`overflow-wrap: anywhere`), so the clamp counts its lines and See more appears instead of the text running out of its box sideways.
