'use client';

/**
 * The developers' `Sidebar`, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/Sidebar/index.tsx`, import paths alone changed. The
 * Before halves of the Sidebar review page render it. The parts it re-exports
 * resolve to this package's files, except those vendored beside it —
 * `SidebarProvider`, `SidebarTrigger`, `SidebarMobileTrigger`, `SidebarNavItem`
 * — so render `Sidebar` from here only under this folder's `SidebarProvider`,
 * whose context it reads. Not edited: replace it whole when the base moves.
 */

import type { ComponentProps } from 'react';
import { Sheet, SheetContent } from '../../../src/components/Sheet';
import { SidebarContent } from '../../../src/components/Sidebar/SidebarContent';
import { SidebarFooter } from '../../../src/components/Sidebar/SidebarFooter';
import { SidebarGroup } from '../../../src/components/Sidebar/SidebarGroup';
import { SidebarHeader } from '../../../src/components/Sidebar/SidebarHeader';
import { SidebarInset } from '../../../src/components/Sidebar/SidebarInset';
import { SidebarMenu } from '../../../src/components/Sidebar/SidebarMenu';
import {
  SidebarMenuButton,
  sidebarMenuButtonVariants,
} from '../../../src/components/Sidebar/SidebarMenuButton';
import { SidebarMenuItem } from '../../../src/components/Sidebar/SidebarMenuItem';
import {
  SidebarMenuRow,
  type SidebarMenuRowProps,
} from '../../../src/components/Sidebar/SidebarMenuRow';
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../../../src/components/Sidebar/SidebarMenuSub';
import {
  SidebarNavigationItems,
  type SidebarNavigationItemsProps,
} from '../../../src/components/Sidebar/SidebarNavigationItems';
import {
  SidebarPanelHeader,
  type SidebarPanelHeaderProps,
  sidebarPanelHeaderSlotClassName,
  sidebarPanelHeaderTriggerSlotClassName,
} from '../../../src/components/Sidebar/SidebarPanelHeader';
import {
  SidebarRail,
  type SidebarRailProps,
} from '../../../src/components/Sidebar/SidebarRail';
import {
  type DefaultLink,
  isNavigationGroup,
  isNavigationItem,
  type NavigationElement,
  type NavigationGroup,
  type NavigationItem,
  type RenderLinkOptions,
} from '../../../src/components/Sidebar/types';
import { cn } from '../../../src/lib/utils';
import {
  SidebarMobileTrigger,
  type SidebarMobileTriggerProps,
} from './SidebarMobileTrigger';
import {
  SidebarNavItem,
  type SidebarNavItemProps,
  sidebarNavItemVariants,
} from './SidebarNavItem';
import {
  type SidebarContextProps,
  SidebarProvider,
  useSidebar,
} from './SidebarProvider';
import { SidebarTrigger, type SidebarTriggerProps } from './SidebarTrigger';

/**
 * The main container for the application's sidebar.
 *
 * It automatically handles responsive behavior:
 * - **Mobile**: Renders as a Sheet (drawer) that slides in.
 * - **Desktop**: Renders as a collapsible side panel that pushes sibling content.
 *
 * @prop side - Determines if the sidebar appears on the 'left' or 'right' of the screen.
 * @prop variant - 'sidebar' (standard bordered), 'floating' (detached card-like), or 'inset'.
 * @prop collapsible - Controls behavior when closed: 'offcanvas' (hidden completely) or 'icon' (minimized to icon width).
 */
function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  sheetClassname,
  ref,
  ...props
}: ComponentProps<'div'> & {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
  sheetClassname?: string;
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === 'none') {
    return (
      <div
        className={cn(
          'flex h-full w-[--sidebar-width] flex-col bg-surface-card text-ink-primary',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          side="left"
          className={cn(
            'w-[--sidebar-width] bg-surface-card p-0 [--sidebar-width:var(--sidebar-width-mobile)] [&>button]:hidden',
            'data-[state=closed]:duration-500',
            'data-[state=open]:duration-500',
            sheetClassname
          )}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      ref={ref}
      className="group peer hidden lg:block"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
    >
      <div
        className={cn(
          'relative w-[--sidebar-width]',
          'bg-transparent',
          'transition-[width] duration-200 ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
            : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]'
        )}
      />
      <div
        className={cn(
          'fixed inset-y-0 z-10',
          'hidden lg:flex',
          'h-svh w-[--sidebar-width]',
          'transition-[left,right,width] duration-200 ease-linear',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
            : 'border-stroke group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className={cn(
            'flex h-full w-full flex-col',
            'bg-surface-card',
            'group-data-[variant=floating]:rounded-md',
            'group-data-[variant=floating]:border',
            'group-data-[variant=floating]:border-stroke',
            'group-data-[variant=floating]:shadow'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export {
  type DefaultLink,
  isNavigationGroup,
  isNavigationItem,
  type NavigationElement,
  type NavigationGroup,
  type NavigationItem,
  type RenderLinkOptions,
  Sidebar,
  SidebarPanelHeader,
  type SidebarPanelHeaderProps,
  SidebarContent,
  type SidebarContextProps,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuRow,
  type SidebarMenuRowProps,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMobileTrigger,
  type SidebarMobileTriggerProps,
  SidebarNavItem,
  type SidebarNavItemProps,
  SidebarNavigationItems,
  type SidebarNavigationItemsProps,
  SidebarProvider,
  SidebarRail,
  type SidebarRailProps,
  SidebarTrigger,
  type SidebarTriggerProps,
  sidebarPanelHeaderSlotClassName,
  sidebarPanelHeaderTriggerSlotClassName,
  sidebarMenuButtonVariants,
  sidebarNavItemVariants,
  useSidebar,
};
