'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import {
  type ComponentProps,
  type ComponentType,
  isValidElement,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
  useId,
} from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

const sidebarNavItemVariants = cva(
  cn(
    'flex h-8 items-center gap-2 rounded-md px-2',
    // Kit `.sbx-nav-item`: Label L — 14/20 medium, the same label the
    // `SidebarNavigationItems` rows carry.
    'font-medium text-ink-secondary text-sm',
    'transition-colors duration-fast',
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
  /**
   * The row's glyph. A component — a lucide icon — is rendered at the row's
   * size; an element — a product mark, an `<img>` — is set in the same 16px
   * box (14px on the rail).
   */
  icon: ComponentType<{ className?: string }> | ReactElement;
  label: string;
  /**
   * Trailing content at the row's end — a `Counter`, a `Badge`. The rail has
   * no room for it, so it leaves there; it is the row's accessible
   * description, which the rail keeps.
   */
  badge?: ReactNode;
  activatable?: boolean;
  withTooltip?: boolean;
  tooltipSide?: ComponentProps<typeof TooltipContent>['side'];
  className?: string;
  href?: string;
  asChild?: boolean;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

/**
 * One navigation row: icon, label, active state, collapsed-rail geometry.
 *
 * A row rather than a list — call sites write their items as explicit JSX
 * instead of mapping a data array through `SidebarNavigationItems`. A real
 * router link arrives through `asChild`: the row's classes are merged onto the
 * caller's element and the icon and label are injected as its children.
 *
 * Active paint reads both `data-status="active"` and `aria-current="page"`;
 * `activatable={false}` suppresses it for a row that navigates somewhere it
 * does not represent ("New chat"). Never a brand colour.
 *
 * `badge` rides at the row's end, after the label. The name stays the label
 * alone and the badge is its description — "Data sources", then "3" — so the
 * rail, where the badge is not drawn, still says it.
 */
const SidebarNavItem = ({
  icon: Icon,
  label,
  badge,
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
  const badgeId = useId();
  // Only with a badge: an explicit `undefined` would also mask the rail
  // tooltip's own `aria-describedby` on the same element.
  const describedBy = badge ? { 'aria-describedby': badgeId } : null;

  const iconClassName =
    'size-4 shrink-0 group-data-[collapsible=icon]:size-3.5';
  // An element cannot take the row's classes, so it gets the row's box.
  const icon = isValidElement(Icon) ? (
    <span
      aria-hidden="true"
      className={cn(
        'flex items-center justify-center [&>*]:size-full',
        iconClassName
      )}
    >
      {Icon}
    </span>
  ) : (
    <Icon className={iconClassName} />
  );

  const text = (
    <span className="min-w-0 flex-1 truncate group-data-[collapsible=icon]:hidden">
      {label}
    </span>
  );

  const trailing = badge ? (
    <span
      id={badgeId}
      className="flex shrink-0 items-center group-data-[collapsible=icon]:hidden"
    >
      {badge}
    </span>
  ) : null;

  const row = asChild ? (
    <Slot
      className={rowClassName}
      aria-label={label}
      {...describedBy}
      onClick={onClick}
    >
      <Slottable>{children}</Slottable>
      {icon}
      {text}
      {trailing}
    </Slot>
  ) : (
    <a
      href={href}
      className={rowClassName}
      aria-label={label}
      {...describedBy}
      onClick={onClick}
    >
      {icon}
      {text}
      {trailing}
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
