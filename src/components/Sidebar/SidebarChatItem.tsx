'use client';

import { Slot } from '@radix-ui/react-slot';
import { EllipsisVertical } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Counter } from '../Counter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import { IconButton } from '../IconButton';

export interface SidebarChatItemProps
  extends Omit<ComponentProps<'a'>, 'children'> {
  /** The row's title. It fades out at the right edge rather than ellipsising. */
  children: ReactNode;
  /** Render the child element instead of an `<a>` — a router link, a button. */
  asChild?: boolean;
  /** The open chat. Mark the same row `aria-current="page"` as well. */
  isActive?: boolean;
  /**
   * `loading` — the chat is generating; `new` — something arrived while the
   * person was elsewhere. Both have a spoken label, never colour alone.
   */
  status?: 'loading' | 'new';
  /** Messages queued in this chat. Takes the status slot when given. */
  count?: number;
  /**
   * The queue is still sending. Quiet otherwise — stopped and waiting for a
   * person looks the same wherever it surfaces.
   */
  countActive?: boolean;
  /**
   * `DropdownMenuItem`s for the row menu — Pin / Rename / Delete. When given,
   * a kebab appears at the right edge on hover and focus, and the status or
   * count steps aside for it.
   */
  menu?: ReactNode;
  menuLabel?: string;
  /** Spoken labels for `status`. */
  statusLabels?: { loading: string; new: string };
}

/**
 * One row of a `SidebarSection` — a chat, a saved report, anything the person
 * made and comes back to.
 *
 * h28, 14px `Text/Secondary`, radius `md`; hover paints `State/Hover`, pressed
 * and active paint `State/Pressed`, and active also lifts the ink to
 * `Text/Body`. No brand colour on any state.
 *
 * **The title fades, it does not ellipsise.** A 36px gradient sits on the right
 * edge in the row's own surface colour, and widens to 72px on hover so the
 * kebab lands on solid fill rather than on letters. The fade takes a
 * pre-composited colour, not the state token, because `--state-hover` is a
 * translucent overlay and a gradient ending in it would let the text through.
 *
 * **The kebab is a sibling of the link, never inside it** — a button inside an
 * anchor is not markup. It is the shared row kebab (`IconButton` tertiary
 * 2xs); the row adds only its position.
 *
 * ```jsx
 * <SidebarChatItem
 *   href="/chats/7"
 *   status="new"
 *   menu={<>
 *     <DropdownMenuItem>Pin</DropdownMenuItem>
 *     <DropdownMenuItem>Rename</DropdownMenuItem>
 *     <DropdownMenuItem variant="danger">Delete</DropdownMenuItem>
 *   </>}
 * >
 *   Jira · first 5 issues
 * </SidebarChatItem>
 * ```
 */
function SidebarChatItem({
  children,
  asChild = false,
  isActive = false,
  status,
  count,
  countActive = false,
  menu,
  menuLabel = 'More actions',
  statusLabels = { loading: 'In progress', new: 'New activity' },
  className,
  ref,
  ...props
}: SidebarChatItemProps) {
  const Comp = asChild ? Slot : 'a';
  const hasCount = count !== undefined;
  const indicator = hasCount ? (
    <Counter active={countActive} size="sm">
      {count}
    </Counter>
  ) : status === 'loading' ? (
    <span className="size-2.5 animate-spin rounded-full border-[1.5px] border-current border-r-transparent" />
  ) : status === 'new' ? (
    <span className="size-1.5 rounded-full bg-current" />
  ) : null;

  return (
    <div
      data-sidebar="chat-item"
      data-active={isActive}
      className={cn(
        'group/chat relative',
        // The fade's end colour, per state: the row's surface, pre-composited.
        // Hover and pressed use the same overlay strengths as the state tokens.
        '[--chat-fade:hsl(var(--surface-card))]',
        'hover:[--chat-fade:color-mix(in_srgb,hsl(var(--state-overlay))_var(--tint-8),hsl(var(--surface-card)))]',
        'has-[[aria-expanded=true]]:[--chat-fade:color-mix(in_srgb,hsl(var(--state-overlay))_var(--tint-8),hsl(var(--surface-card)))]',
        'has-[[data-sidebar=chat-link]:active]:[--chat-fade:color-mix(in_srgb,hsl(var(--state-overlay))_var(--tint-12),hsl(var(--surface-card)))]',
        'data-[active=true]:[--chat-fade:color-mix(in_srgb,hsl(var(--state-overlay))_var(--tint-12),hsl(var(--surface-card)))]',
        'group-data-[collapsible=icon]:hidden'
      )}
    >
      <Comp
        ref={ref}
        aria-busy={status === 'loading' || undefined}
        data-sidebar="chat-link"
        className={cn(
          'relative flex h-7 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md px-2',
          'font-medium text-ink-secondary text-sm',
          'transition-colors duration-fast',
          'hover:bg-state-hover',
          'group-has-[[aria-expanded=true]]/chat:bg-state-hover',
          'active:bg-state-pressed',
          'group-data-[active=true]/chat:bg-state-pressed group-data-[active=true]/chat:text-ink-body',
          // Kept inside the row box, so it cannot overlap the rows above and
          // below in a 1px-gap list.
          'outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-inset',
          // The fade. It is off on a row that carries a count, or the title
          // runs under the number instead of stopping before it.
          !hasCount &&
            cn(
              'after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-9 after:rounded-r-md',
              'after:bg-[linear-gradient(90deg,transparent_0,var(--chat-fade)_70%)]',
              'after:transition-[width] after:duration-fast',
              menu &&
                'group-focus-within/chat:after:w-[72px] group-hover/chat:after:w-[72px] group-has-[[aria-expanded=true]]/chat:after:w-[72px]'
            ),
          className
        )}
        data-active={isActive}
        {...props}
      >
        <span className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
          {children}
        </span>
        {indicator ? (
          <span
            aria-hidden={hasCount ? undefined : true}
            className={cn(
              'z-[1] flex size-4 shrink-0 items-center justify-center text-brand-primary',
              hasCount && 'w-auto',
              'transition-opacity duration-fast',
              menu &&
                'group-focus-within/chat:opacity-0 group-hover/chat:opacity-0 group-has-[[aria-expanded=true]]/chat:opacity-0'
            )}
          >
            {indicator}
          </span>
        ) : null}
        {status && !hasCount ? (
          <span className="sr-only">{statusLabels[status]}</span>
        ) : null}
      </Comp>

      {menu ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              aria-label={menuLabel}
              className={cn(
                'absolute top-1/2 right-1 z-[2] -translate-y-1/2',
                'pointer-events-none opacity-0',
                'focus-visible:pointer-events-auto focus-visible:opacity-100',
                'group-focus-within/chat:pointer-events-auto group-focus-within/chat:opacity-100',
                'group-hover/chat:pointer-events-auto group-hover/chat:opacity-100',
                'aria-expanded:pointer-events-auto aria-expanded:opacity-100'
              )}
              size="2xs"
              variant="tertiary"
            >
              <EllipsisVertical />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">{menu}</DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}

export { SidebarChatItem };
