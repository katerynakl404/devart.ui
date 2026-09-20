'use client';

import { PanelLeft } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../Button';
import { useSidebar } from './SidebarProvider';

export interface SidebarTriggerProps extends ComponentProps<typeof Button> {
  /** Accessible label for the trigger's screen-reader-only text. */
  label?: string;
}

/**
 * A dedicated button component used to toggle the sidebar's open/closed state.
 * It automatically consumes the `toggleSidebar` function from the sidebar context.
 */
function SidebarTrigger({
  className,
  onClick,
  ref,
  label = 'Toggle Sidebar',
  /* Tertiary, not Button's `primary` default. The collapse control is chrome:
     it sits beside the product mark and is reached rarely, so a solid brand
     fill there makes it the loudest thing in the rail and reads as the
     sidebar's main action. It carried no `variant` at all, which is how it
     ended up filled. */
  variant = 'tertiary',
  ...props
}: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();

  return (
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
      <PanelLeft />
      <span className="sr-only">{label}</span>
    </Button>
  );
}

export { SidebarTrigger };
