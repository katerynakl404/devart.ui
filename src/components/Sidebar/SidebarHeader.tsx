import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The top section of the sidebar — branding, a workspace switcher.
 *
 * The horizontal inset lives here, not in the rows inside: `ps-4` puts a
 * leading icon on the same 16px line as the navigation icons below, and `pe-2`
 * matches the nav container so a trailing collapse button lines up with the
 * menu edge. Any content aligns correctly without knowing the rule — laying the
 * row out by hand is as safe as using `SidebarBrand`.
 *
 * A row that must reach the edges (a full-bleed banner, a search field) opts
 * out with negative margins — `className="-ms-4 -me-2"` — which is the rarer
 * case and, unlike the reverse, fails visibly rather than silently.
 *
 * The two sidebar shapes differ only here, and the element tells them apart by
 * itself. `pb-2` spaces a brand row off the navigation, which is what a web app
 * needs — the browser tab is not a place to put a product mark, so the sidebar
 * carries it. A desktop app already shows the mark in its window bar, so it
 * renders `<SidebarHeader />` with nothing inside, purely for the top inset —
 * and `empty:pb-0` drops the bottom half on its own.
 *
 * Deliberately `:empty` rather than a `variant` prop: there is nothing for a
 * consumer to decide or to get wrong. A header with content is spaced; one
 * without is not. Adding the prop instead would mean every product has to know
 * which shape it is and say so, which is the kind of rule that silently goes
 * unfollowed — exactly how the horizontal inset above got lost once already.
 */
function SidebarHeader({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        'flex flex-col gap-0 ps-4 pe-2 pt-3 pb-2 empty:pb-0',
        className
      )}
      {...props}
    />
  );
}

export { SidebarHeader };
