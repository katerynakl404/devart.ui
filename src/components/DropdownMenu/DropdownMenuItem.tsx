import { Item } from '@radix-ui/react-dropdown-menu';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
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
    'data-[disabled]:pointer-events-none',
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
 */
const DropdownMenuItem = ({
  className,
  inset,
  variant,
  ref,
  ...props
}: ComponentProps<typeof Item> &
  VariantProps<typeof dropdownMenuItemVariants> & {
    inset?: boolean;
  }) => (
  <Item
    ref={ref}
    className={cn(
      dropdownMenuItemVariants({ variant }),
      inset && 'pl-8',
      className
    )}
    {...props}
  />
);

DropdownMenuItem.displayName = Item.displayName;

export { DropdownMenuItem, dropdownMenuItemVariants };
