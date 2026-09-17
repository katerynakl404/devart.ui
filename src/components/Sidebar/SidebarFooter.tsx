import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The bottom section of the sidebar — the user row, settings, secondary
 * actions.
 *
 * `mt-auto` pins it to the bottom rather than relying on `SidebarContent`
 * having grown, so the footer still sits correctly in a sidebar with only two
 * nav items. The top border is the divider that separates it from the
 * navigation above.
 */
function SidebarFooter({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
        'relative mt-auto flex flex-col gap-2 border-stroke border-t p-2',
        className
      )}
      {...props}
    />
  );
}

export { SidebarFooter };
