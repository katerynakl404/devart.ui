'use client';

import { Menu } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { IconButton } from '../IconButton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
import { useSidebar } from './SidebarProvider';

export interface SidebarMobileTriggerProps
  extends Omit<ComponentProps<typeof IconButton>, 'aria-label'> {
  /** Overrides `label` as the accessible name; prefer `label`. */
  'aria-label'?: string;
  label?: string;
  icon?: ReactNode;
  /**
   * Also shows the accessible name visually — the button is a glyph and
   * nothing else. The same string, so there is no second label to keep in
   * sync.
   */
  tooltip?: boolean;
  tooltipSide?: ComponentProps<typeof TooltipContent>['side'];
}

/**
 * Opens the sidebar's mobile sheet from a floating app header.
 *
 * Separate from `SidebarTrigger` because the two are never on screen together:
 * this one sits over the page, the panel trigger sits inside the sidebar. It
 * deliberately carries **no `data-sidebar` attribute** — consumers tell the two
 * apart with `:not([data-sidebar])`, so stamping one here would quietly make
 * every such selector match both.
 *
 * The default glyph rotates a quarter turn while the sheet is open. The
 * tooltip hangs below by default: the button lives in a header at the top of
 * the page, with nothing above it to hang from.
 */
function SidebarMobileTrigger({
  className,
  ref,
  label = 'Toggle Sidebar',
  'aria-label': ariaLabel,
  icon,
  tooltip = false,
  tooltipSide = 'bottom',
  variant = 'tertiary',
  size = 'sm',
  onClick,
  ...props
}: SidebarMobileTriggerProps) {
  const { openMobile, toggleSidebar } = useSidebar();
  const name = ariaLabel ?? label;

  const trigger = (
    <IconButton
      ref={ref}
      variant={variant}
      size={size}
      aria-label={name}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      className={cn('pointer-events-auto z-10 [&_svg]:size-[18px]', className)}
      {...props}
    >
      {icon ?? (
        <Menu
          className={cn(
            'transition-transform duration-200',
            openMobile && 'rotate-90'
          )}
        />
      )}
    </IconButton>
  );

  if (!tooltip) {
    return trigger;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent side={tooltipSide}>{name}</TooltipContent>
    </Tooltip>
  );
}

export { SidebarMobileTrigger };
