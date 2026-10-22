'use client';

import { Check, ChevronDown, X } from 'lucide-react';
import { type KeyboardEvent, type ReactNode, useRef, useState } from 'react';
import { cn, focusRing } from '../../lib/utils';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../DropdownMenu';

export interface FilterMenuOption {
  value: string;
  label: string;
  /** Rendered as `(n)` after the label, a step below it; `0` still shows. */
  count?: number;
  /** A group's mark (a connector logo) — sits in a fixed 20px slot. */
  icon?: ReactNode;
  /** One level of nested options under a group — their labels start where the group's does. */
  children?: FilterMenuOption[];
}

export interface FilterMenuProps {
  /** What the filter is about — the pill reads "Label: Value". */
  label: string;
  value: string;
  options: FilterMenuOption[];
  onValueChange: (value: string) => void;
  /**
   * The value that means "no filter". While another is chosen, the pill carries
   * a ✕ that puts this one back.
   * @default the first option's value
   */
  defaultValue?: string;
  /** @default `Clear ${label}` */
  clearLabel?: string;
  defaultOpen?: boolean;
  align?: 'start' | 'end';
  className?: string;
}

function find(options: FilterMenuOption[], value: string): FilterMenuOption | undefined {
  for (const o of options) {
    if (o.value === value) return o;
    const c = o.children ? find(o.children, value) : undefined;
    if (c) return c;
  }
  return undefined;
}

/**
 * A filter as a pill — "Type: All ▾", "Provider: Main CRM ✕ ▾" — and its menu:
 * plain choices, or a hierarchy (sources, their connections under them). Each
 * choice can carry its count, so the menu says what a choice holds before it is
 * picked; the chosen one has a check.
 *
 * A chosen filter is easy to undo: the pill names what is chosen and gains a ✕
 * before its chevron — the chevron stays, the pill still opens its menu. A press
 * on the ✕ never opens the menu.
 *
 * The pill is `Button` `secondary` `xs` `rounded="full"`, the size of the
 * `FilterChips` chip it stands beside; the menu is `DropdownMenu`'s.
 */
const FilterMenu = ({
  label,
  value,
  options,
  onValueChange,
  defaultValue,
  clearLabel,
  defaultOpen = false,
  align = 'start',
  className,
}: FilterMenuProps) => {
  const [open, setOpen] = useState(defaultOpen);
  /* a press on ✕ marks this first, so the trigger it sits in does not open the menu */
  const skip = useRef(false);
  const base = defaultValue ?? options[0]?.value;
  const current = find(options, value) ?? options[0];
  const isSet = value !== base;
  const tree = options.some((o) => o.icon || o.children?.length);

  const clear = () => {
    if (base !== undefined) onValueChange(base);
  };
  const onClearKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      clear();
    }
  };

  const item = (o: FilterMenuOption, nested: boolean) => {
    const on = o.value === value;
    return (
      <DropdownMenuItem
        key={o.value}
        role="menuitemradio"
        aria-checked={on}
        onSelect={() => onValueChange(o.value)}
      >
        {/* one 20px slot for a mark on every row of a tree: a nested label starts exactly under its group's */}
        {tree && (o.icon || nested) ? (
          <span
            className="flex size-5 shrink-0 items-center justify-center overflow-hidden"
            aria-hidden="true"
          >
            {o.icon ?? null}
          </span>
        ) : null}
        <span
          className={cn(
            'min-w-0 flex-1 truncate',
            nested ? 'text-ink-body' : 'font-medium text-ink-primary'
          )}
        >
          {o.label}
          {o.count !== undefined ? (
            <span className="text-xs font-normal tabular-nums text-ink-secondary"> ({o.count})</span>
          ) : null}
        </span>
        <Check className={cn('size-4 shrink-0 text-ink-highlight', !on && 'opacity-0')} aria-hidden="true" />
      </DropdownMenuItem>
    );
  };

  return (
    <DropdownMenu
      open={open}
      modal={defaultOpen ? false : undefined}
      onOpenChange={(v) => {
        if (v && skip.current) {
          skip.current = false;
          return;
        }
        setOpen(v);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="xs"
          rounded="full"
          type="button"
          className={cn('min-w-0 max-w-64 shrink px-3', className)}
          rightSlot={
            isSet ? (
              <span className="inline-flex items-center gap-1">
                {/* biome-ignore lint/a11y/useSemanticElements: a button inside the trigger button is invalid HTML */}
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={clearLabel ?? `Clear ${label}`}
                  className={cn('inline-flex rounded-full', focusRing)}
                  onPointerDown={(e) => {
                    skip.current = true;
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    clear();
                  }}
                  onKeyDown={onClearKey}
                >
                  <X className="size-3.5" aria-hidden="true" />
                </span>
                <ChevronDown className="size-3.5" aria-hidden="true" />
              </span>
            ) : (
              <ChevronDown className="size-3.5" aria-hidden="true" />
            )
          }
        >
          <span className="min-w-0 truncate">
            {label}: {current?.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn('max-h-80 overflow-y-auto', tree && 'w-72')}>
        {tree
          ? options.map((o, i) => (
              <FilterMenuGroup key={o.value} first={i === 0 && !o.icon && !o.children?.length}>
                {item(o, false)}
                {(o.children ?? []).map((c) => item(c, true))}
              </FilterMenuGroup>
            ))
          : options.map((o) => item(o, false))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* the first plain option of a tree ("All") stands apart from the groups by a rule */
const FilterMenuGroup = ({ first, children }: { first: boolean; children: ReactNode }) => (
  <>
    {children}
    {first ? <DropdownMenuSeparator /> : null}
  </>
);

export { FilterMenu };
