---
'@devart/ui-react': minor
---

`Switch` takes `description` — a `body12` secondary line under the label, wired as the switch's `aria-describedby`. A described switch needs a `label`, `aria-label` or `aria-labelledby`, and `tooltip={true}` needs an `aria-label`: `SwitchProps` is a union that asks for them, not an interface. With a `left` or `right` label the row aligns to the top so the switch sits on the label's first line; `top` and `bottom` stay centred. An `id` passed to `Switch` reaches the switch and the label's `htmlFor` alike (§160).
