'use client';

import type { ComponentProps } from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { cn } from '../../lib/utils';
import { type Button, buttonVariants } from '../Button';
import { CalendarChevron } from './CalendarChevron';
import { CalendarDayButton } from './CalendarDayButton';
import { CalendarRoot } from './CalendarRoot';
import { CalendarWeekNumber } from './CalendarWeekNumber';

/**
 * A flexible calendar component built on react-day-picker.
 *
 * Supports single date selection, date ranges, and multiple date selection modes.
 * Includes built-in styling for navigation, day cells, and range highlighting.
 *
 * @prop captionLayout - 'label' (month/year text) or 'dropdown' (selectable dropdowns).
 * @prop weekStartsOn - Day to start the week (0=Sunday, 1=Monday, etc.). Defaults to Monday.
 * @prop showOutsideDays - Whether to show days from adjacent months.
 * @prop buttonVariant - Variant for navigation buttons.
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'transparent',
  formatters,
  components,
  weekStartsOn = 1,
  ...props
}: ComponentProps<typeof DayPicker> & {
  buttonVariant?: ComponentProps<typeof Button>['variant'];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      weekStartsOn={weekStartsOn}
      className={cn(
        'group/calendar',
        'px-3 pt-3',
        '[--cell-radius:var(--radius-md)]',
        '[--cell-size:theme(spacing.7)]',
        '[[data-slot=card-content]_&]:bg-transparent',
        '[[data-slot=popover-content]_&]:bg-transparent',
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'relative flex flex-col gap-4 md:flex-row',
          defaultClassNames.months
        ),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-[--cell-size] select-none p-0 aria-disabled:opacity-50',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-[--cell-size] select-none p-0 aria-disabled:opacity-50',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'flex h-[--cell-size] w-full items-center justify-center gap-1.5 font-medium text-sm',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'cn-calendar-dropdown-root relative rounded-[--cell-radius]',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          'absolute inset-0 bg-surface-card opacity-0',
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          'select-none font-medium text-ink-primary',
          captionLayout === 'label'
            ? 'text-sm'
            : 'cn-calendar-caption-label flex items-center gap-1 rounded-[--cell-radius] text-sm [&>svg]:size-3.5 [&>svg]:text-ink-secondary',
          defaultClassNames.caption_label
        ),
        table: 'w-full border-collapse',
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'flex-1 select-none rounded-[--cell-radius] font-normal text-ink-secondary text-xs',
          defaultClassNames.weekday
        ),
        week: cn('mt-2 flex w-full', defaultClassNames.week),
        week_number_header: cn(
          'w-[--cell-size] select-none',
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          'select-none text-ink-secondary text-xs',
          defaultClassNames.week_number
        ),
        // The cell paints nothing by itself, so it carries NO base radius: a
        // base `rounded-[--cell-radius]` shorthand is not cancelled by the
        // `rounded-l-*` / `rounded-r-*` longhands the range modifiers add, so
        // every range cell ended up rounded on all four corners and the inner
        // edges of the range bar showed a notch. Each modifier now states its
        // own four corners outright.
        day: cn(
          'group/day relative aspect-square h-full w-full select-none p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-[--cell-radius]',
          // Hover on an unselected day — State/Hover. Scoped with :not() so it
          // can never tie with the range / selected fills.
          '[&:not([data-selected=true])]:hover:rounded-[--cell-radius] [&:not([data-selected=true])]:hover:bg-state-hover',
          props.showWeekNumber
            ? '[&:nth-child(2)[data-selected=true]_button]:rounded-l-[--cell-radius]'
            : '[&:first-child[data-selected=true]_button]:rounded-l-[--cell-radius]',
          defaultClassNames.day
        ),
        range_start: cn(
          'bg-state-hover',
          'rounded-r-none rounded-l-[--cell-radius]',
          defaultClassNames.range_start
        ),
        range_middle: cn(
          'rounded-none bg-state-hover',
          defaultClassNames.range_middle
        ),
        range_end: cn(
          'bg-state-hover',
          'rounded-r-[--cell-radius] rounded-l-none',
          defaultClassNames.range_end
        ),
        // Expressed as a :not() so it cannot tie with the range modifiers'
        // radius at equal specificity — a range that starts or ends on today
        // keeps its rounded outer corner.
        today: cn(
          'bg-state-hover text-ink-primary [&:not([data-selected=true])]:rounded-[--cell-radius]',
          defaultClassNames.today
        ),
        outside: cn(
          'text-ink-secondary aria-selected:text-ink-secondary',
          defaultClassNames.outside
        ),
        disabled: cn(
          'text-ink-secondary opacity-50',
          defaultClassNames.disabled
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: CalendarRoot,
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        WeekNumber: CalendarWeekNumber,
        ...components,
      }}
      {...props}
    />
  );
}
