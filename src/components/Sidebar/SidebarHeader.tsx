import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The top section of the sidebar — branding, a workspace switcher.
 *
 * It carries no horizontal padding on purpose: the rows inside it own their
 * own insets, so a nav-style row can align with the navigation below while a
 * full-bleed row (a search field, a banner) can still reach the edges. Put
 * `SidebarBrand` inside rather than laying the row out by hand.
 */
function SidebarHeader({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn('flex flex-col gap-0 pt-3 pb-2', className)}
      {...props}
    />
  );
}

export { SidebarHeader };
