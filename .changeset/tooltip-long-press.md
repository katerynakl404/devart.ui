---
'@devart/ui-react': minor
---

`Tooltip` opens on a long press where there is no hover. Radix's trigger ignores a `touch` pointer by design, so every tooltip in the kit was silent on a phone; a 700ms press now opens it and it closes 1500ms after the finger lifts — MUI's delays, and the gesture Angular Material's `matTooltip` settled on. The tap is left to the trigger, so a `Badge` still opens its log and a `Button` still runs its action. `touchGestures="off"` opts a trigger out. `Tooltip` now keeps the open state and shares it through `TooltipContext`; a consumer's own `open` / `onOpenChange` still win.
