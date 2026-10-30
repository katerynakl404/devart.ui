'use client';

/**
 * The developers' `SidebarNavItem`, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/Sidebar/SidebarNavItem.tsx`, import paths alone
 * changed. The Before half of the Sidebar review page renders it. Not edited:
 * replace it whole when the base moves.
 */

import { Slot, Slottable } from '@radix-ui/react-slot';
import type { LucideIcon } from 'lucide-react';
import type { ComponentProps, MouseEventHandler, ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../src/components/Tooltip';
import { cva } from '../../../src/lib/cva';
import { cn } from '../../../src/lib/utils';

const sidebarNavItemVariants = cva(
  cn(
    'flex h-8 items-center gap-2 rounded-md px-2',
    'font-medium text-compact text-ink-secondary',
    'transition-colors duration-100',
    'hover:bg-state-hover active:bg-state-pressed',

    // Focus — same neutral card-gap brand ring as Button/IconButton.
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',

    // Icon rail: square tap target, label hidden, glyph a notch smaller.
    'group-data-[collapsible=icon]:size-7 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0'
  ),
  {
    variants: {
      activatable: {
        true: cn(
          'data-[status=active]:bg-state-pressed data-[status=active]:text-ink-body',
          'aria-[current=page]:bg-state-pressed aria-[current=page]:text-ink-body'
        ),
        false: '',
      },
    },
    defaultVariants: { activatable: true },
  }
);

export interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  activatable?: boolean;
  withTooltip?: boolean;
  tooltipSide?: ComponentProps<typeof TooltipContent>['side'];
  className?: string;
  href?: string;
  asChild?: boolean;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const SidebarNavItem = ({
  icon: Icon,
  label,
  activatable = true,
  withTooltip = false,
  tooltipSide = 'right',
  className,
  href,
  asChild = false,
  children,
  onClick,
}: SidebarNavItemProps) => {
  const rowClassName = cn(sidebarNavItemVariants({ activatable }), className);

  const icon = (
    <Icon className="size-4 shrink-0 group-data-[collapsible=icon]:size-3.5" />
  );

  const text = (
    <span className="min-w-0 flex-1 truncate group-data-[collapsible=icon]:hidden">
      {label}
    </span>
  );

  const row = asChild ? (
    <Slot className={rowClassName} aria-label={label} onClick={onClick}>
      <Slottable>{children}</Slottable>
      {icon}
      {text}
    </Slot>
  ) : (
    <a
      href={href}
      className={rowClassName}
      aria-label={label}
      onClick={onClick}
    >
      {icon}
      {text}
    </a>
  );

  if (!withTooltip) {
    return row;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{row}</TooltipTrigger>
      <TooltipContent side={tooltipSide}>{label}</TooltipContent>
    </Tooltip>
  );
};

SidebarNavItem.displayName = 'SidebarNavItem';

export { SidebarNavItem, sidebarNavItemVariants };
