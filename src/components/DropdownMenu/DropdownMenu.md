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
