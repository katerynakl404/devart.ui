import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The main content area beside the sidebar. It reads the sidebar's
 * peer-data attributes to adjust its margin, radius and shadow as the sidebar
 * expands, collapses, or switches to the `inset` variant.
 *
 * **Height.** This is `min-h-svh`, not `h-full`. `SidebarProvider` sets only a
 * `min-height`, so its computed `height` is `auto` — and a percentage height
 * resolved against an `auto` parent also computes to `auto`. An `h-full` here
 * silently collapsed to the height of its content, which is why a page built
 * on this shell never filled the screen. A flex item's own `min-height` needs
 * no definite parent, so it works in both directions: at least a screenful,
 * and free to grow past it.
 *
 * For a shell that scrolls *inside* the content region instead of growing the
 * page (a chat column, a table with a sticky header), pin the whole shell
 * instead and let this stretch into it:
 *
 * ```jsx
 * <SidebarProvider className="h-svh min-h-0 overflow-hidden">
 *   <Sidebar>…</Sidebar>
 *   <SidebarInset className="min-h-0">
 *     <header className="shrink-0">…</header>
 *     <div className="min-h-0 flex-1 overflow-y-auto p-6">…</div>
 *   </SidebarInset>
 * </SidebarProvider>
 * ```
 *
 * `min-h-0` is the part that is easy to miss: a flex item defaults to
 * `min-height: auto`, so an `overflow-y-auto` child grows the page rather than
 * scrolling until something tells it it may shrink.
 */
function SidebarInset({ className, ref, ...props }: ComponentProps<'main'>) {
  return (
    <main
      ref={ref}
      className={cn(
        'relative flex min-h-svh flex-1 flex-col',

        'bg-surface-page',

        'overflow-hidden',

        // The inset variant floats the panel off the edges, so its own margins
        // have to come back out of the height or the shell overflows by 16px.
        'lg:peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))]',
        'lg:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2',
        'lg:peer-data-[variant=inset]:m-2',
        'lg:peer-data-[variant=inset]:ml-0',
        'lg:peer-data-[variant=inset]:rounded-xl',
        'lg:peer-data-[variant=inset]:shadow',
        className
      )}
      {...props}
    />
  );
}

export { SidebarInset };
