---
'@devart/ui-react': minor
---

`CodeBlock` takes a `header` (Copy moves into it), `lineNumbers`, `maxHeight`, `wrap` and `variant="error"`, and exports `codeSyntaxVariants` for pre-highlighted children (DESIGN-SYSTEM-CHANGES.md §127–§129). New tokens `--code-keyword`, `--code-string`, `--code-number`, `--code-comment` (AA in both themes) and primitives `--violet-400`, `--violet-600`, `--green-700`. The padding moved onto the `<pre>`, so a horizontal scrollbar now sits on the block's bottom edge.
