'use client';

import { Slot } from '@radix-ui/react-slot';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { SidebarTrigger } from './SidebarTrigger';

/**
 * Classes merged onto the `logoIcon` element. Exported so a consumer that needs
 * a different wrapper can reproduce the swap without copying the strings.
 */
const sidebarPanelHeaderSlotClassName = cn(
  'flex min-w-0 flex-1 items-center rounded-md transition-opacity duration-fast',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',
  'group-data-[collapsible=icon]:absolute',
  'group-data-[collapsible=icon]:inset-0 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:justify-center',
  'group-data-[collapsible=icon]:group-hover/brand:opacity-0',
  'group-data-[collapsible=icon]:group-has-[[data-sidebar=trigger]:focus-visible]/brand:opacity-0'
);

/**
 * Classes on the trigger *wrapper*. The trigger itself may be a Tooltip root
 * (no DOM node), so these cannot ride a Slot onto the button — they live here
 * and `has-[:focus-visible]` stands in for the button's own `focus-visible`.
 * Not `focus-within`: a mouse click leaves the button focused after the rail
 * collapses, which would pin the trigger over the logo once the pointer leaves.
 * The `[data-sidebar=trigger]` child is stretched to fill the rail square so
 * its hover paint covers the logo underneath.
 */
const sidebarPanelHeaderTriggerSlotClassName = cn(
  'group-data-[collapsible=icon]:absolute',
  'group-data-[collapsible=icon]:inset-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:size-full group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center',
  'group-data-[collapsible=icon]:opacity-0',
  'group-data-[collapsible=icon]:group-hover/brand:opacity-100',
  'group-data-[collapsible=icon]:has-[:focus-visible]:opacity-100',
  'group-data-[collapsible=icon]:[&_[data-sidebar=trigger]]:size-full'
);

export interface SidebarPanelHeaderProps {
  /**
   * The brand mark, usually wrapped in the consumer's own home link. Must be a
   * single element: the row's layout and focus classes are merged onto it, not
   * onto a wrapper, so the focus ring lands on the thing that takes focus.
   */
  logoIcon: ReactNode;
  /** Defaults to a plain `SidebarTrigger`; pass one to control its label. */
  sidebarTrigger?: ReactNode;
  className?: string;
}

/**
 * The sidebar panel header: brand mark on the leading edge, collapse trigger on
 * the trailing one. A fixed 32px row — the same height as a nav row.
 *
 * **The row carries no horizontal inset.** `SidebarHeader` owns it (`ps-4 pe-2`
 * expanded, `px-2` on the rail), so a hand-laid row and this one line up
 * identically and nesting the two never doubles it.
 *
 * Collapsed to the icon rail the two stack in the same square and swap on
 * hover. The swap is **opacity-only, never `display`** — the trigger stays in
 * the layout and in the tab order while invisible, which is what lets keyboard
 * focus reveal it (`has-[:focus-visible]:opacity-100`) and what consumers' tests
 * assert by reading accumulated opacity.
 */
const SidebarPanelHeader = ({
  logoIcon,
  // `xs`: the kit's collapse control is `iconbtn-tertiary iconbtn-xs`. The
  // variant is `SidebarTrigger`'s own default.
  sidebarTrigger = <SidebarTrigger size="xs" className="shrink-0 p-0" />,
  className,
}: SidebarPanelHeaderProps) => (
  <div
    className={cn(
      'group/brand flex h-8 min-w-0 items-center justify-between gap-2',
      'group-data-[collapsible=icon]:relative',
      'group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-7 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0',
      className
    )}
  >
    <Slot className={sidebarPanelHeaderSlotClassName}>{logoIcon}</Slot>
    <div className={sidebarPanelHeaderTriggerSlotClassName}>
      {sidebarTrigger}
    </div>
  </div>
);

SidebarPanelHeader.displayName = 'SidebarPanelHeader';

export {
  SidebarPanelHeader,
  sidebarPanelHeaderSlotClassName,
  sidebarPanelHeaderTriggerSlotClassName,
};
