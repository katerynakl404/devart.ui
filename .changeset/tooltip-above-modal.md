---
'@devart/ui-react': patch
---

`Tooltip` — opens above a dialog instead of behind it.

`TooltipContent` was `z-50` and `Modal` is `z-[100]`, so a tooltip on any control inside a dialog
rendered under it; only the sliver past the dialog's edge showed. It is now `z-[110]`, as
`Autocomplete`'s and `Select`'s lists already were, and `ModalContent` no longer lifts its close
button's tooltip per call. See DESIGN-SYSTEM-CHANGES.md §177.
