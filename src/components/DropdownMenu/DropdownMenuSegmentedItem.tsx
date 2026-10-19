'use client';

import { Item } from '@radix-ui/react-dropdown-menu';
import { type ComponentProps, type ReactNode, useId, useState } from 'react';
import { cn } from '../../lib/utils';
import {
  SegmentedControl,
  SegmentedControlList,
  SegmentedControlTrigger,
} from '../SegmentedControl';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
import { dropdownMenuItemVariants } from './DropdownMenuItem';

export interface DropdownMenuSegmentedItemOption {
  value: string;
  /** Always spoken; drawn as well, unless `icon` takes its place. */
  label: string;
  /**
   * A glyph instead of the word. The segment then carries `label` as its
   * tooltip, so the page provides a `TooltipProvider` (`SidebarProvider`
   * already does).
   */
  icon?: ReactNode;
}

export interface DropdownMenuSegmentedItemProps
  extends Omit<
    ComponentProps<typeof Item>,
    'asChild' | 'children' | 'defaultValue' | 'onSelect'
  > {
  /** What is being chosen — "Theme". It may carry a leading glyph. */
  label: ReactNode;
  options: DropdownMenuSegmentedItemOption[];
  value?: string;
  /** The uncontrolled start; the first option when omitted. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** How to change it — read after the row's name. */
  hint?: string;
}

/**
 * One menu row holding a choice between two or three values — Light / Dark /
 * System: the label on the item rail, a `SegmentedControl` at the end.
 *
 * **It is one item, not a group of them.** ↑ / ↓ reach it like any other row;
 * ← / → change the value while it has focus, and Enter or Space step to the
 * next one, wrapping. None of them closes the menu — a setting is something
 * you adjust and watch take effect, not an action that is done once chosen.
 *
 * The segments are a pointer shortcut. A press on one chooses that one and
 * stops there, so the row never reads it as "select the item" and steps on;
 * focus stays on the row. They are hidden from assistive technology, which
 * reads the row instead: its name is the label and the current value
 * ("Theme: Light"), its description is `hint`.
 *
 * ```jsx
 * <DropdownMenuSegmentedItem
 *   label="Theme"
 *   value={theme}
 *   onValueChange={setTheme}
 *   options={[
 *     { value: 'light', label: 'Light', icon: <Sun /> },
 *     { value: 'dark', label: 'Dark', icon: <Moon /> },
 *     { value: 'system', label: 'System', icon: <Monitor /> },
 *   ]}
 * />
 * ```
 */
const DropdownMenuSegmentedItem = ({
  label,
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  hint = 'Left and right arrows change it.',
  disabled = false,
  className,
  onKeyDown,
  ref,
  ...props
}: DropdownMenuSegmentedItemProps) => {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value ?? '');
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : inner;
  const hintId = useId();

  const change = (next: string) => {
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };

  const index = options.findIndex((option) => option.value === value);
  const current = options[index];

  // Wraps at both ends, as a tab list does. With nothing chosen yet, → takes
  // the first option and ← the last.
  const step = (delta: 1 | -1) => {
    if (disabled || options.length === 0) return;
    const from = index === -1 ? (delta === 1 ? -1 : 0) : index;
    const next = options[(from + delta + options.length) % options.length];
    if (next) change(next.value);
  };

  return (
    <Item
      ref={ref}
      aria-describedby={hintId}
      data-slot="dropdown-menu-segmented-item"
      disabled={disabled}
      className={cn(
        dropdownMenuItemVariants({ variant: 'default' }),
        // 4px, not the rail's 6px: with the 26px control the row is 34px, 2px
        // over its 32px neighbours rather than 6px.
        'justify-between gap-3 py-1',
        // The control's own 12px glyph, not the item recipe's 16px one.
        '[&_[data-slot=dropdown-menu-segmented-control]_svg]:size-3',
        className
      )}
      onSelect={(event) => {
        // Enter, Space, or a press on the label: the next value, menu open.
        event.preventDefault();
        step(1);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          // Also keeps ← from closing the submenu this row may sit in.
          event.preventDefault();
          step(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2">
        {label}
        {current ? (
          <span className="sr-only">{`: ${current.label}`}</span>
        ) : null}
      </span>
      <span hidden id={hintId}>
        {hint}
      </span>
      <SegmentedControl
        data-slot="dropdown-menu-segmented-control"
        size="sm"
        value={value}
        onValueChange={change}
        // A press on a segment ends here, so the row never sees it…
        onPointerDown={(event) => event.stopPropagation()}
        onPointerUp={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        // …and focus stays on the row: the segment chose on mousedown already.
        onMouseDown={(event) => event.preventDefault()}
      >
        <SegmentedControlList aria-hidden="true" tabIndex={-1}>
          {options.map((option) => {
            const trigger = (
              <SegmentedControlTrigger
                disabled={disabled}
                key={option.value}
                tabIndex={-1}
                value={option.value}
              >
                {option.icon ?? option.label}
              </SegmentedControlTrigger>
            );
            if (!option.icon) return trigger;
            // The tooltip hangs on a wrapper: on the segment itself its own
            // `data-state` would overwrite `active`, and the selected pill
            // would never paint.
            return (
              <Tooltip key={option.value}>
                <TooltipTrigger asChild>
                  <span className="flex">{trigger}</span>
                </TooltipTrigger>
                <TooltipContent>{option.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </SegmentedControlList>
      </SegmentedControl>
    </Item>
  );
};

DropdownMenuSegmentedItem.displayName = 'DropdownMenuSegmentedItem';

export { DropdownMenuSegmentedItem };
