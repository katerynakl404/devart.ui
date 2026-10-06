'use client';

import { ChevronDown } from 'lucide-react';
import { type ComponentProps, type ReactNode, useId, useState } from 'react';
import { cn } from '../../lib/utils';

export interface SidebarSectionProps
  extends Omit<ComponentProps<'section'>, 'title'> {
  /** The section's name — a word or two, set as an overline. */
  label: ReactNode;
  /**
   * A trailing link on the header row, usually "See all" as a `LinkButton`.
   * Revealed on hover or keyboard focus, always visible below `lg` and on
   * touch. It is a sibling of the collapse trigger, so it navigates and never
   * collapses.
   */
  action?: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * A flat, labelled list inside `SidebarContent` — Pinned, Recent.
 *
 * It replaces the nested `Chats` group with its left rail: a list of things
 * the person made is not a level of navigation, so it does not indent under a
 * nav row. The whole label is the collapse target, and the chevron only shows
 * under the pointer — an open list is not news. Closed, the chevron stays,
 * because it is then the only sign the list is there.
 *
 * Spacing is the component's: 16px under the nav rows, 12px between two
 * sections. Put `SidebarChatItem` rows directly inside.
 *
 * Hidden when the rail collapses to icons: there is no 48px form of a list of
 * titles.
 *
 * ```jsx
 * <SidebarContent>
 *   <SidebarNavigationItems items={nav} />
 *   <SidebarSection label="Pinned" action={<LinkButton href="/chats">See all</LinkButton>}>
 *     <SidebarChatItem href="/chats/1">Message queue</SidebarChatItem>
 *   </SidebarSection>
 * </SidebarContent>
 * ```
 */
function SidebarSection({
  label,
  action,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
  children,
  ref,
  ...props
}: SidebarSectionProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const listId = useId();

  const toggle = () => {
    const next = !open;
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
  };

  return (
    <section
      ref={ref}
      data-sidebar="section"
      data-state={open ? 'open' : 'closed'}
      className={cn(
        'group/section flex flex-col gap-px',
        // SidebarContent's own 8px gap plus this: 16px under the nav rows,
        // 12px between two sections — the kit's two rhythms.
        'mt-2 [[data-sidebar=section]+&]:mt-1',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    >
      <div className="group/head flex h-6 items-center justify-between gap-2 px-2">
        <button
          aria-controls={listId}
          aria-expanded={open}
          className={cn(
            'group/label flex min-w-0 flex-1 items-center gap-1 rounded-sm text-left',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card'
          )}
          onClick={toggle}
          type="button"
        >
          <span
            className={cn(
              'truncate font-semibold text-xxs uppercase leading-4 tracking-caps',
              'text-ink-inactive transition-colors duration-fast',
              'group-hover/head:text-ink-primary'
            )}
          >
            {label}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'size-2.5 shrink-0 text-brand-tertiary',
              'opacity-0 transition-[opacity,transform] duration-fast',
              'group-hover/head:opacity-100 group-focus-visible/label:opacity-100',
              'group-data-[state=closed]/section:-rotate-90 group-data-[state=closed]/section:opacity-100',
              'max-lg:opacity-100 [@media(hover:none)]:opacity-100'
            )}
          />
        </button>
        {action ? (
          <span
            className={cn(
              'flex shrink-0 text-xs leading-4',
              'opacity-0 transition-opacity duration-fast',
              'focus-within:opacity-100 group-hover/head:opacity-100',
              'max-lg:opacity-100 [@media(hover:none)]:opacity-100'
            )}
          >
            {action}
          </span>
        ) : null}
      </div>
      {open ? (
        <div className="flex flex-col gap-px" id={listId}>
          {children}
        </div>
      ) : null}
    </section>
  );
}

export { SidebarSection };
