'use client';

import { PanelLeft } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
import { useSidebar } from './SidebarProvider';

export interface SidebarTriggerProps extends ComponentProps<typeof Button> {
  /** Accessible name for the trigger's screen-reader-only text. */
  label?: string;
  /**
   * Replaces the default panel glyph. Sizing stays with `className`, so an
   * override inherits whatever `[&_svg]:size-*` the caller already set.
   */
  icon?: ReactNode;
  /**
   * Also shows `label` visually, which is what an icon-only rail needs. Off
   * while the sidebar is the sheet (`isMobile`): there is no rail then, and
   * the sheet hands this button focus as it opens, so the tooltip would pop
   * with no pointer anywhere near it.
   */
  tooltip?: boolean;
  tooltipSide?: ComponentProps<typeof TooltipContent>['side'];
}

/**
 * A dedicated button component used to toggle the sidebar's open/closed state.
 * It automatically consumes the `toggleSidebar` function from the sidebar context.
 *
 * `label` is the accessible name, so a caller that swaps it per state
 * ("Collapse sidebar" / "Expand sidebar") gets that for free. The tooltip, when
 * enabled, shows that same string — there is no second label to keep in sync.
 */
function SidebarTrigger({
  className,
  onClick,
  ref,
  label = 'Toggle Sidebar',
  icon,
  tooltip = false,
  tooltipSide = 'right',
  /* Tertiary, not Button's `primary` default. The collapse control is chrome:
     it sits beside the product mark and is reached rarely, so a solid brand
     fill there makes it the loudest thing in the rail and reads as the
     sidebar's main action. It carried no `variant` at all, which is how it
     ended up filled. */
  variant = 'tertiary',
  ...props
}: SidebarTriggerProps) {
  const { toggleSidebar, isMobile } = useSidebar();

  const trigger = (
    <Button
      ref={ref}
      data-sidebar="trigger"
      className={cn('h-7 w-7 p-0', className)}
      variant={variant}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {icon ?? <PanelLeft />}
      <span className="sr-only">{label}</span>
    </Button>
  );

  if (!tooltip || isMobile) {
    return trigger;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent side={tooltipSide}>{label}</TooltipContent>
    </Tooltip>
  );
}

export { SidebarTrigger };
