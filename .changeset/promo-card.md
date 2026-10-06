---
'@devart/ui-react': minor
---

`PromoCard` — the small offer card a sidebar has room for, directly above the footer.

A glyph, what is on offer, one line of what it gives, and a dismiss. Products were building this
by hand: Insightis had a one-line pill first, which said almost nothing in a 15rem column, and then
a card of its own CSS. It is named for the job rather than for a plan: an upgrade, an invitation or an ending trial all fit the same shape, and the first thing a product does with a plan-shaped component is outgrow it.

Two rules the component enforces, because both were got wrong by hand first:

- **It does not name the plan the person is on.** The account row directly below already does, and
  the same word twice in 40px of column is noise rather than emphasis. The title is the offer; the
  line under it is what the money buys.
- **The dismiss is a sibling of the link, never nested inside it** — a button inside an anchor is
  not markup, and the whole card is the link's hit area.

Hover is the package's card recipe. An earlier hand-built version recoloured the title on hover,
which read as the heading turning into a link under the pointer.

`<PromoCard icon={…} title description href onDismiss />`; renders an anchor when `href` is
given and a button otherwise.
