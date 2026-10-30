'use client';

/**
 * The developers' `SidebarMobileTrigger`, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/Sidebar/SidebarMobileTrigger.tsx`, import paths
 * alone changed. The Before halves of the Sidebar review page render it. It
 * reads the vendored `SidebarProvider` beside it, not the package's, and is
 * drawn by their `IconButton`, vendored beside it too. Not edited: replace it
 * whole when the base moves.
 */

import { Menu } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../../src/lib/utils';
import { IconButton } from './IconButton';
import { useSidebar } from './SidebarProvider';

export interface SidebarMobileTriggerProps
  extends ComponentProps<typeof IconButton> {
  label?: string;
  icon?: ReactNode;
}

function SidebarMobileTrigger({
  className,
  ref,
  label = 'Toggle Sidebar',
  icon,
  variant = 'tertiary',
  size = 'sm',
  onClick,
  ...props
}: SidebarMobileTriggerProps) {
  const { openMobile, toggleSidebar } = useSidebar();

  return (
    <IconButton
      ref={ref}
      variant={variant}
      size={size}
      aria-label={label}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      className={cn('pointer-events-auto z-10', className)}
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
}

export { SidebarMobileTrigger };
