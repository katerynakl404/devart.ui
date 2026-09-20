import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * A vertical list container for sidebar navigation items.
 * It serves as the primary wrapper for `SidebarMenuItem` components,
 * providing consistent spacing and alignment.
 *
 * `gap-0.5` — 2px, not 4. The kit is explicit about both halves of this:
 * `.sbx-nav { gap: 2px }` over `.sbx-nav-item { height: 2rem }`, and its
 * spacing section names 2px as the scale's "fine sub-step". A 32px row with
 * 4px between rows reads as a list of separate buttons; at 2px the rows read
 * as one navigation block, which is what they are.
 */
function SidebarMenu({ className, ref, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn('flex w-full min-w-0 flex-col gap-0.5', className)}
      {...props}
    />
  );
}

export { SidebarMenu };
