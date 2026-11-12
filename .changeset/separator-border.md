---
'@devart/ui-react': patch
---

`Separator` draws its line as a border, not a 1px fill, so it stays one crisp device pixel at fractional display scaling (§170).
