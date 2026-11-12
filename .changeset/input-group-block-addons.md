---
'@devart/ui-react': patch
---

`InputGroup` — with an addon above or below the value (`align="block-start"` / `"block-end"`), the value keeps 12px
from the field's edge. Before, it sat on the border: Tailwind 3 compiled the padding rule onto the input's own `:has`,
so it never matched. Two equally dead `inline-*` rules are removed; the inline gap is unchanged. DESIGN-SYSTEM-CHANGES
§173.
