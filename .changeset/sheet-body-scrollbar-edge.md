---
'@devart/ui-react': patch
---

`SheetBody` — the scrollbar sits against the sheet's edge and the content is inset alike on both
sides, with a bar or without one, as `ModalBody` since §176.

It was a bare `overflow-y-auto` inside `SheetContent`'s `p-6`: the platform's wide bar, and the
content lost its width on the right only while it scrolled. Now it carries `scrollbar-thin`, spans the
sheet (`-mx-6 px-6`; a sheet with no padding passes `mx-0`), and takes the new `useGutterInset` hook —
the gutter reserved, the right padding the measured left padding less the bar — which `ModalBody` now
shares. See DESIGN-SYSTEM-CHANGES.md §178.
