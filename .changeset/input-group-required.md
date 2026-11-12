---
'@devart/ui-react': minor
---

`InputGroup` — new `required`: the label takes an asterisk in the error ink and the input takes `aria-required`.
Before, a form that marks its required fields drew the mark itself and passed it in through `label`, so two forms in
one product could mark differently. The asterisk is `aria-hidden` and nothing sets the native `required` attribute, so
a form that validates itself is left alone. DESIGN-SYSTEM-CHANGES §175.
