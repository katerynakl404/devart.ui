import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * A row inside a menu that is **not** an action: a label and its own control —
 * a switch, a badge, a counter — or a plain reading.
 *
 * It sits on the item rail (the same 12px horizontal inset, the same 6px
 * vertical) so every label in the menu shares one left edge, and it carries
 * **no hover surface and no pointer cursor**, because nothing happens when you
 * click it. That is the whole distinction: in a menu, a hover fill is a promise
 * that the row does something.
 *
 * Not `DropdownMenuLabel` — that is the Overline section heading (10px, caps,
 * Text/Inactive) that captions a group. This is a full row of content.
 */
const DropdownMenuRow = ({
  className,
  ref,
  ...props
}: ComponentProps<'div'>) => (
  <div
    ref={ref}
    data-slot="dropdown-menu-row"
    className={cn(
      'flex items-center justify-between gap-3',
      'rounded px-3 py-1.5',
      'text-ink-body text-sm',
      className
    )}
    {...props}
  />
);

DropdownMenuRow.displayName = 'DropdownMenuRow';

export { DropdownMenuRow };
