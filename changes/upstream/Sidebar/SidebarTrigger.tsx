'use client';

/**
 * The developers' `SidebarTrigger`, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/Sidebar/SidebarTrigger.tsx`, import paths alone
 * changed. The Before halves of the Sidebar review page render it. It reads
 * the vendored `SidebarProvider` beside it, not the package's. Not edited:
 * replace it whole when the base moves.
 */

import { PanelLeft } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { Button } from '../../../src/components/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../src/components/Tooltip';
import { cn } from '../../../src/lib/utils';
import { useSidebar } from './SidebarProvider';

export interface SidebarTriggerProps extends ComponentProps<typeof Button> {
  /** Accessible name for the trigger's screen-reader-only text. */
  label?: string;
  /**
   * Replaces the default panel glyph. Sizing stays with `className`, so an
   * override inherits whatever `[&_svg]:size-*` the caller already set.
   */
  icon?: ReactNode;
  /** Also shows `label` visually, which is what an icon-only rail needs. */
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
  ...props
}: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();

  const trigger = (
    <Button
      ref={ref}
      data-sidebar="trigger"
      className={cn('h-7 w-7', className)}
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

  if (!tooltip) {
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
