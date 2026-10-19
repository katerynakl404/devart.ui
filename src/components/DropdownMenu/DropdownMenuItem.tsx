import { Item } from '@radix-ui/react-dropdown-menu';
import { Slottable } from '@radix-ui/react-slot';
import { ArrowUpRight } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn, glyphStroke } from '../../lib/utils';

// Single `.mi` recipe shared by every menu in the system. Roomier hit target
// (6/12px, ~32px tall), neutral hover/pressed; danger keeps a red-tinted hover.
const dropdownMenuItemVariants = cva(
  cn(
    // Radius is one step inside the 8px `.menu` shell.
    'relative flex items-center gap-2 rounded px-3 py-1.5',
    'text-sm',
    'outline-none',
    'transition-colors',
    'cursor-pointer select-none',

    // Performance optimization: use transform for GPU acceleration
    '[transform:translateZ(0)]',

    // Disabled state — the label drops to Text/Inactive with no surface change;
    // a menu row never fades, so a disabled row still aligns with its peers.
    // Not `pointer-events-none`: it hides the not-allowed cursor, and the
    // tooltip that says why the control is off. A disabled control fires
    // nothing either way.
    'data-[disabled]:cursor-not-allowed',
    'data-[disabled]:text-ink-inactive',

    // Icon specific styles — one step lighter stroke for a more modern feel
    '[&_svg]:pointer-events-none',
    '[&_svg]:size-4',
    '[&_svg]:shrink-0',
    glyphStroke,

    //Focused state
    // Highlight is the ONE state here: Radix focuses the item on pointer-move,
    // so a focus ring would always paint on top of the highlight fill.
    'focus-visible:outline-none'
  ),
  {
    variants: {
      variant: {
        default: cn(
          'text-ink-body',
          // Highlighted (hover + keyboard) → neutral State/Hover; pressed → State/Pressed
          'focus:bg-state-hover data-[highlighted]:bg-state-hover',
          'active:bg-state-pressed'
        ),
        danger: cn(
          'text-fb-red-text',
          'focus:bg-fb-red/8 data-[highlighted]:bg-fb-red/8',
          'active:bg-fb-red/12'
        ),
        // The one row in a menu that is THE action — "Manage connections",
        // "Choose file", "Configure workspace". Brand ink plus medium weight,
        // and the same neutral hover as every other row.
        //
        // Deliberately NOT a bordered button dropped into the menu. A button
        // inside a 4px-padded surface doubles its border against the divider
        // above it and outweighs the list it belongs to; the leading icon and
        // the brand ink are what separate an action from a reading, at the
        // same size and on the same rail.
        accent: cn(
          'font-medium text-ink-highlight',
          'focus:bg-state-hover data-[highlighted]:bg-state-hover',
          'active:bg-state-pressed'
        ),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * A standard interactive item within a dropdown menu, used for actions or links.
 * Pass `variant="danger"` for destructive actions (e.g. delete) and
 * `variant="accent"` for the menu's primary action.
 *
 * Every action item takes a leading 16px glyph: a text-only menu makes the user
 * read each label to find one action, while a glyph gives the row a shape the
 * eye catches first. It inherits `currentColor`, so a danger or accent row
 * tints label and icon together.
 *
 * `isExternal` marks a row that leaves the product for a new tab: a trailing
 * 14px arrow in `Text/Secondary` — the same affordance `SidebarMenuRow` draws
 * — and `externalLabel` appended to the name for a screen reader. It only
 * says so; the `target="_blank"` belongs to the caller's own link, passed
 * with `asChild`, and the arrow and words are injected into it.
 */
const DropdownMenuItem = ({
  className,
  inset,
  variant,
  isExternal = false,
  externalLabel = '(opens in new tab)',
  children,
  ref,
  ...props
}: ComponentProps<typeof Item> &
  VariantProps<typeof dropdownMenuItemVariants> & {
    inset?: boolean;
    /** The row opens a new tab: trailing arrow plus a spoken note. */
    isExternal?: boolean;
    /** The note `isExternal` adds to the row's name. */
    externalLabel?: string;
  }) => {
  const itemClassName = cn(
    dropdownMenuItemVariants({ variant }),
    inset && 'pl-8',
    // A trailing affordance sits a step under the 16px leading glyph; the
    // recipe's own `[&_svg]:size-4` would otherwise win.
    isExternal && '[&_[data-slot=dropdown-menu-item-external]]:size-3.5',
    className
  );

  // Plain children unless external: `asChild` needs exactly one element, and
  // the extra nodes reach the caller's link only through `Slottable`.
  if (!isExternal) {
    return (
      <Item ref={ref} className={itemClassName} {...props}>
        {children}
      </Item>
    );
  }

  return (
    <Item ref={ref} className={itemClassName} {...props}>
      <Slottable>{children}</Slottable>
      <ArrowUpRight
        aria-hidden="true"
        className="ms-auto text-ink-secondary"
        data-slot="dropdown-menu-item-external"
      />
      <span className="sr-only">{` ${externalLabel}`}</span>
    </Item>
  );
};

DropdownMenuItem.displayName = Item.displayName;

export { DropdownMenuItem, dropdownMenuItemVariants };
