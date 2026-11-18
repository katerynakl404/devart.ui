---
'@devart/ui-react': minor
---

A field's label gets one owner, and `Autocomplete` gets `required`.

`InputGroup`, `TextArea` and `Autocomplete` each drew the label above a field themselves. Only
`InputGroup`'s stepped with the field size — 12 at `xs` and `sm`, 14 from `md` — so an
`Autocomplete` next to an `Input` at `sm` carried a label two pixels larger than its neighbour's.
The label now comes from one internal `FieldLabel`, which holds the rung, the `<label>` element
and the asterisk — the asterisk through a new `RequiredMark`; the rung itself is unchanged.

`Autocomplete` takes `required` for the first time, with the same contract as `InputGroup`: the
asterisk after the label and `aria-required` on the input, off by default.

Nothing moves at `md`, `lg` or `xl`, which is every size in use; `xs` and `sm` are where the three
labels now agree.
