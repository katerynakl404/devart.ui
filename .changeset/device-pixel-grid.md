---
'@devart/ui-react': patch
---

`Tabs` draws the list's line out of the layout (the strip was 39.8px at 125% scaling) and `CardHeader` puts 4px, not 6, between title and description — nothing under them lands on a half device pixel (§171).
