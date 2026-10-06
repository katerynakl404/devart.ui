'use client';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';

/**
 * A single-choice filter bar — the pill row that narrows a list:
 * All / Artifacts / Uploaded.
 *
 * Built on a radio group, not a toggle group, because that is the actual
 * semantic: exactly one chip is always active, arrow keys move between them,
 * and a screen reader announces "2 of 3". A row of buttons looks the same and
 * gives none of it.
 *
 * This is NOT a `SegmentedControl`. That switches how the *same* content is
 * presented (Table / Chart); this changes *which items* are shown. They look
 * alike and are not interchangeable.
 */

const filterChipVariants = cva(
  cn(
    'group inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border',
    'font-medium',
    'transition-colors duration-fast',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',
    'disabled:pointer-events-none disabled:opacity-disabled',

    // Rest
    'border-stroke bg-transparent text-ink-body',
    'enabled:hover:border-stroke-field-hover enabled:hover:bg-state-hover',

    // Selected — brand outline and ink over a light brand wash. The fill is an
    // alpha tint so the chip keeps working on any surface it is placed on.
    'data-[state=checked]:border-brand-primary',
    'data-[state=checked]:bg-brand-primary/8',
    'data-[state=checked]:text-brand-secondary',
    'enabled:data-[state=checked]:hover:bg-brand-primary/12'
  ),
  {
    variants: {
      size: {
        // Same box ladder as Button/IconButton, so a chip row lines up with a
        // button beside it.
        sm: 'h-7 px-2.5 text-xs [&_svg]:size-3.5',
        md: 'h-8 px-3 text-sm [&_svg]:size-4',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

export interface FilterChipsProps
  extends Omit<ComponentProps<typeof RadioGroupPrimitive.Root>, 'orientation'>,
    VariantProps<typeof filterChipVariants> {}

/**
 * The row. `value` / `onValueChange` behave like any controlled radio group;
 * `defaultValue` is normally the "all" chip.
 */
function FilterChips({ className, size, ...props }: FilterChipsProps) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="filter-chips"
      // Horizontal: arrow keys should move along the row, not up and down.
      orientation="horizontal"
      className={cn('flex flex-wrap items-center gap-2', className)}
      // `size` rides down on a CSS variable rather than context so a single
      // chip can still override it locally.
      data-size={size ?? 'md'}
      {...props}
    />
  );
}

export interface FilterChipProps
  extends ComponentProps<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof filterChipVariants> {
  /** Optional trailing count. `0` renders — only `undefined` hides it. */
  count?: number;
  children?: ReactNode;
}

/**
 * One chip. The count is optional and deliberately not a `Badge`: a badge
 * inside a chip reads as a second control and doubles the border noise.
 */
function FilterChip({
  className,
  size,
  count,
  children,
  ...props
}: FilterChipProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="filter-chip"
      className={cn(filterChipVariants({ size }), className)}
      {...props}
    >
      {children}
      {count !== undefined && (
        <span
          className={cn(
            'text-ink-secondary tabular-nums',
            'group-data-[state=checked]:text-brand-secondary'
          )}
          data-slot="filter-chip-count"
        >
          {count}
        </span>
      )}
    </RadioGroupPrimitive.Item>
  );
}

export { FilterChip, FilterChips, filterChipVariants };
