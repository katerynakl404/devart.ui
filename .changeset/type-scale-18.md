---
'@devart/ui-react': minor
---

`Typography` gains an 18px rung: `heading18` (500) and `title18` (600), each
`text-lg` with a 24px leading.

They are what prod sets at 18 — the profile dialog's plan panel ("Choose a
plan" at 500, the plan names at 600) and its balance panel (the credit amounts
at 600). Prod declares `leading-6` on all of them; where it renders
28px instead, it is `md:text-lg`'s paired line-height overriding that class, so
the style takes the 24px prod asks for.
