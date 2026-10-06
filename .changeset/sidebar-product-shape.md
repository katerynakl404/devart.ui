---
'@devart/ui-react': minor
---

The sidebar gets the parts the product has been building by hand: `SidebarSection`,
`SidebarChatItem`, `SidebarPromo`, `SidebarStat` and `SidebarUser`.

Storybook still showed the old prod shape — Home / Search / a `Chats` row with a
nested, left-railed sub-list — because only the shell fixes had been ported, not
the redesign inside it. The redesign is information architecture, so it needed
parts, not new classes on old ones:

- `SidebarSection` — a flat Pinned / Recent list with an overline label, a
  chevron that appears under the pointer, and a "See all" slot that reveals on
  hover and is always visible below `lg`. 16px under the nav, 12px between two.
- `SidebarChatItem` — h28 row whose title fades rather than ellipsises, with a
  `loading` / `new` status or a queue `count`, and an optional kebab menu that is
  a sibling of the link.
- `SidebarPromo` — the slot above the footer rule for one `PromoCard`, hidden
  on the collapsed rail.
- `SidebarStat` and `SidebarUser` — the compact footer: one figure (Balance) and
  the account row.

`PromoCard`'s focus ring never drew: it named `shadow-focus`, which the preset
does not generate. It now uses the package's ring recipe, its dismiss is the
shared `IconButton` tertiary `2xs`, and its padding is the kit's 10/12.

In Storybook the Sidebar stories render the product shape, and **Promo card** is
a control on every one of them.
