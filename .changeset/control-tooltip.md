---
'@devart/ui-react': minor
---

`Button` and `Switch` take `tooltip` and `tooltipSide`, the same props and the same code as `IconButton`'s. A disabled `Button`, `IconButton` or `Switch` with a tooltip is rendered `aria-disabled` instead of `disabled` — focusable, so the reason it is off opens on hover and focus — and does nothing when pressed. Every `Button` / `IconButton` variant now paints the `aria-disabled` form as it paints `disabled`; `Switch` keys its off look on `data-disabled` (§151).
