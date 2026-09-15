import { Label } from '@radix-ui/react-dropdown-menu';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * A text label used to organize and caption groups of items within a dropdown menu.
 */
const DropdownMenuLabel = ({
  className,
  inset,
  ref,
  ...props
}: ComponentProps<typeof Label> & {
  inset?: boolean;
}) => (
  <Label
    ref={ref}
    className={cn(
      // Section heading inside a menu: the Overline style (10px / 600 / caps),
      // Text/Inactive, sitting on the same 12px horizontal rail as the items.
      'px-3 pt-2 pb-1',
      'font-semibold text-ink-inactive text-xxs uppercase leading-4 tracking-caps',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
);

DropdownMenuLabel.displayName = Label.displayName;

export { DropdownMenuLabel };
