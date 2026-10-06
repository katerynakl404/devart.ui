---
'@devart/ui-react': patch
---

Glyph stroke `1.75` → `2` in `Button`, `IconButton`, `InputGroupAddon` and `DropdownMenuItem`;
`Alert sm` `1.5` → `2`.

`glyphStroke` (`@devart/ui-react/cn`) is now `[&_svg]:stroke-2`: Lucide's own default, and the
weight production draws every UI glyph at, measured on the live app on 2026-10-06 (20 glyphs,
13 in a 16px box and 7 in a 14px box, all `stroke-width="2"` in a 24 viewBox). At 1.75 the same
mark rendered 12% lighter than in production. The Insightis kit moved its `--icon-stroke` to 2
the same day.

One weight; the box does the scaling. The rule stays on the controls although it equals the
default, so a glyph passed in with its own `strokeWidth`, or from a set that does not default to
2, comes out at the same weight as its neighbours.

`Alert` now takes `glyphStroke` at both sizes. Its 16px glyph drew at 1.5 so it would match the
weight of the 20px one, which made it the one 16px glyph lighter than a button glyph beside it.

Unchanged, and deliberately so: `Checkbox` keeps its 12px tick at 3 — below 16px a stroke has to
stay heavy enough to survive rasterisation.
