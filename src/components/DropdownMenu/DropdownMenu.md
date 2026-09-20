A Radix dropdown menu — the row kebab, the account menu, the bulk-actions menu.

```jsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <IconButton aria-label="Row actions" size="2xs" variant="tertiary">
      <MoreHorizontal />
    </IconButton>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## The trigger keeps its pressed fill

Always use `asChild` with a real `Button` or `IconButton`. The button recipes
use the `pressed:` variant, which covers `[aria-expanded=true]` — so the trigger
stays visibly held while its menu is open. A hand-rolled `<button>` loses that.

## Highlight is the only item state

Radix moves focus on pointer-move, so an item's highlight *is* its hover — there
is no separate focus ring on items, and adding one produces two competing
indicators on the same row. Do not re-declare focus on `DropdownMenuItem`.

## Portals

The menu portals to `document.body`. That breaks a scoped `.dark` (the menu
renders light inside a dark panel) and lets it paint outside a card or a
scrolling container. Two ways out, and the prop always wins:

```jsx
<PortalContainerProvider>
  <DropdownMenu>…</DropdownMenu>
</PortalContainerProvider>
```

or `<DropdownMenuContent portalContainer={el}>`. For a page-level dark theme,
put `dark` on `<html>` and neither is needed.

## Inside a table

The row's actions cell already lifts its own stacking while a menu is open, so
the menu is never painted under the next row. Use `align="end"` so the menu
hangs from the right edge of the kebab rather than overflowing the table.

## Three kinds of row

| | Part | Looks like | Does |
|---|---|---|---|
| A reading | `DropdownMenuRow` | item rail, **no hover fill**, no pointer | nothing — it is a label and its own control (switch, badge, counter) |
| An action | `DropdownMenuItem` | item rail, neutral hover | what its label says |
| **The** action | `DropdownMenuItem variant="accent"` | brand ink + medium weight, leading glyph | the thing the menu exists to offer |

A hover fill in a menu is a promise that the row does something, so a row that
does nothing must not have one — that is the whole reason `DropdownMenuRow`
exists rather than an `Item` with `disabled`, which would also grey the label.

`accent` is for the one row like "Manage connections" or "Choose file":

```jsx
<DropdownMenuSeparator />
<DropdownMenuItem variant="accent" onSelect={configure}>
  <Settings />
  Configure Workspace
</DropdownMenuItem>
```

**Do not put a bordered `Button` in a menu to make an action stand out.** Inside
the 4px-padded shell its edge lands 4px from the divider — two lines doing the
same job — and it outweighs the list it belongs to. The distinction a menu uses
is ink and weight at the same size, on the same rail.

## Every action item takes a leading glyph

16px, `stroke-width: 1.75`, `currentColor` — so a `danger` or `accent` row
tints label and icon together with no extra rule. A text-only menu makes the
reader parse every label to find one action; the glyph gives each row a shape
the eye catches first.

Selection lists are the exception: a source picker or a model list already has a
leading element and expresses a *choice*, not a command, so a second glyph there
reads as a competing affordance.
