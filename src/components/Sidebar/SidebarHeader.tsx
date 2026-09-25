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
 * `pb-2` spaces the brand row off the navigation. `empty:pb-0` drops it when
 * the header has nothing in it, so a sidebar that carries no mark does not keep
 * a gap where one would have been.
 */
function SidebarHeader({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        'flex flex-col gap-0 ps-4 pe-2 pt-3 pb-2 empty:pb-0',
        // Collapsed the rail is 48px and the asymmetric inset stops being an
        // inset: 16/8 puts the surviving control's centre on 28 while every nav
        // glyph below it centres on 24, so the top of the rail leans 4px right
        // of the column it heads. Symmetric 8/8 is the same gutter the nav
        // column uses, so the two line up.
        'group-data-[collapsible=icon]:px-2',
        className
      )}
      {...props}
    />
  );
}

export { SidebarHeader };
