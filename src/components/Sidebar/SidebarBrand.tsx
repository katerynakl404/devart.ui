import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The product/workspace row at the top of the sidebar: mark and name on the
 * left, an optional trailing control (a switcher chevron, a collapse button)
 * on the right.
 *
 * It is a fixed 32px row — the same height as a nav row — with a 16px leading
 * inset that lines the mark up with the navigation icons below it, and an 8px
 * trailing inset so a 24px icon button sits flush with the rail edge.
 * `justify-between` is what pins that trailing control to the right without a
 * spacer element.
 *
 * ```jsx
 * <SidebarHeader>
 *   <SidebarBrand>
 *     <span className="flex min-w-0 items-center gap-2">
 *       <Database className="size-5 shrink-0 text-brand-primary" />
 *       <Typography className="truncate" element="span" textStyle="title14">
 *         Devart LinkAI
 *       </Typography>
 *     </span>
 *     <IconButton aria-label="Switch workspace" size="2xs" variant="tertiary">
 *       <ChevronsUpDown />
 *     </IconButton>
 *   </SidebarBrand>
 * </SidebarHeader>
 * ```
 */
function SidebarBrand({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="brand"
      className={cn(
        'flex h-8 min-w-0 items-center justify-between gap-2 ps-4 pe-2',
        className
      )}
      {...props}
    />
  );
}

export { SidebarBrand };
