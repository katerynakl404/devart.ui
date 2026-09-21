import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The primary scrollable container for sidebar interactive elements or navigation links.
 * It automatically handles overflow behavior, switching to hidden when the sidebar is
 * in 'icon' collapse mode to prevent layout shifting.
 */
function SidebarContent({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        // `px-2` is the nav column's own gutter, and without it the rail has
        // none: nothing between the sidebar edge and a row button supplies one,
        // so the icons sat on 8 while the brand mark sits on 16. With it the
        // row fill starts 8 from the edge and the glyph lands on 16, which is
        // what the product renders.
        'flex min-h-0 flex-1 flex-col gap-2 px-2 pb-4',

        'overflow-auto',
        'group-data-[collapsible=icon]:overflow-hidden',

        className
      )}
      {...props}
    />
  );
}

export { SidebarContent };
