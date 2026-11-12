---
'@devart/ui-react': minor
---

Dark `--ink-inactive` is Grey-400 (`#9CA3AF`), not Slate-400 (`#94A3B8`): the
dark ink ladder is grey from top to bottom (`--ink-primary` Grey-50,
`--ink-body` Grey-100, `--ink-secondary` Grey-300), and the one slate step read
blue beside it. Every placeholder, a field's search glyph and the text of a
switched-off menu item, input, select or toggle move with it; a faded control
(`opacity-disabled` over its own ink — `Tabs`, `Button`, `Checkbox`) now
reads the same grey as the placeholder next to it. Light is unchanged.
Same lightness (65%), so no contrast moves. DESIGN-SYSTEM-CHANGES §174.

`apps/web/src/index.css` keeps its own copy of the tokens and needs the same
edit.
