---
'@devart/ui-react': patch
---

`InputGroupAddon` — text after the value (`align="inline-end"`), a unit after a number ("30 seconds"), is body12
(`text-xs`) instead of the field's 14px, so it reads under the value it qualifies. Text before the value ("@") and
glyphs are unchanged. DESIGN-SYSTEM-CHANGES §169.
