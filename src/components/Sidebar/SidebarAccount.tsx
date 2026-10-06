'use client';

import { ChevronsUpDown } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';

// The footer rows are buttons that open a popover above themselves. One
// recipe for both: neutral hover and pressed fills, no ink change.
const footerRowClassName = cn(
  'flex w-full items-center rounded-md text-left',
  'transition-colors duration-fast',
  'pressed:bg-state-pressed hover:bg-state-hover',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card'
);

export interface SidebarStatProps
  extends Omit<ComponentProps<'button'>, 'value'> {
  /** What is counted — "Balance". */
  label: ReactNode;
  /** The figure, with its unit — "9,480 left". Tabular numerals. */
  value: ReactNode;
  /** A 12px glyph in front of the value, on a round `State/Hover` chip. */
  icon?: ReactNode;
}

/**
 * One compact figure in the footer — a balance, a quota — that opens the
 * detail above itself. Label left, value right, one line.
 *
 * It replaced a 14px meter with a bar: a figure the person checks in passing
 * does not need a progress bar under it in the rail, and the detail popover
 * has room for one. Hidden when the rail collapses.
 */
function SidebarStat({
  label,
  value,
  icon,
  className,
  type = 'button',
  ref,
  ...props
}: SidebarStatProps) {
  return (
    <button
      ref={ref}
      data-sidebar="stat"
      className={cn(
        footerRowClassName,
        'justify-between gap-2 px-1.5 py-1',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      type={type}
      {...props}
    >
      <span className="font-medium text-ink-secondary text-xs leading-4">
        {label}
      </span>
      <span className="inline-flex items-center gap-1.5 text-ink-primary text-xs tabular-nums leading-4">
        {icon ? (
          <span
            aria-hidden="true"
            className="flex rounded-full bg-state-hover p-[3px] [&_svg]:size-3"
          >
            {icon}
          </span>
        ) : null}
        {value}
      </span>
    </button>
  );
}

export interface SidebarUserProps
  extends Omit<ComponentProps<'button'>, 'name'> {
  /** A 24px `Avatar`. */
  avatar: ReactNode;
  /** The display name — not the email. */
  name: ReactNode;
  /** One quiet line under the name — "Admin · Free". */
  meta?: ReactNode;
}

/**
 * The account row at the foot of the sidebar: avatar, name, one line of role
 * and plan, and the up-down chevron that says it opens a menu above itself.
 *
 * Collapsed to icons it keeps only the avatar, centred in a 28px box — the
 * way to the account menu survives the rail.
 */
function SidebarUser({
  avatar,
  name,
  meta,
  className,
  type = 'button',
  ref,
  ...props
}: SidebarUserProps) {
  return (
    <button
      ref={ref}
      data-sidebar="user"
      className={cn(
        footerRowClassName,
        'gap-2 p-1',
        'group-data-[collapsible=icon]:size-7 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:self-center group-data-[collapsible=icon]:p-0',
        className
      )}
      type={type}
      {...props}
    >
      <span className="flex shrink-0 [&>*]:size-6 [&>*]:text-xs">{avatar}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-px group-data-[collapsible=icon]:hidden">
        <span className="truncate font-semibold text-ink-primary text-xs leading-4">
          {name}
        </span>
        {meta ? (
          <span className="truncate text-ink-secondary text-xxs leading-4">
            {meta}
          </span>
        ) : null}
      </span>
      <ChevronsUpDown
        aria-hidden="true"
        className="size-3.5 shrink-0 text-ink-body opacity-70 group-data-[collapsible=icon]:hidden"
      />
    </button>
  );
}

/**
 * The slot between the list and the footer for one `PromoCard`.
 *
 * Above the footer rule, not inside it, so the card reads as the last thing in
 * the list rather than as part of the account block. The slot owns the 8px
 * gutter and hides itself when the rail collapses — there is no 48px version
 * of a two-line offer. Whether to render it at all (a free plan, not yet
 * dismissed) is the product's call, not the sidebar's.
 */
function SidebarPromo({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="promo"
      className={cn(
        'shrink-0 px-2 pb-2',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  );
}

export { SidebarPromo, SidebarStat, SidebarUser };
