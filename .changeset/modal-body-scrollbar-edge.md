---
'@devart/ui-react': patch
---

`ModalBody` — the scrollbar sits in the dialog's own right padding, against its edge, and the fields
are inset 16px on both sides, with a bar or without one.

It reached into the padding by a fixed 16px and gave 8px back, as if every scrollbar were 8px; the
thin bar is about 11px in Chrome on Windows and 0 where scrollbars overlay, so the right side ran
wider than the left and the body changed width as it began to scroll. Now it spans the dialog
(`-mx-4 px-4`), reserves the gutter (`scrollbar-gutter: stable`) and pads the right by 16px less the
bar's measured width. See DESIGN-SYSTEM-CHANGES.md §176.
