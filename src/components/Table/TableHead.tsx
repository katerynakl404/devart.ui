'use client';

import { ChevronDown, ChevronsUpDown } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';

/**
 * How a column claims its width, named by what the column holds.
 *
 * | | |
 * |---|---|
 * | `auto` | no width — takes whatever is left. The reading column. |
 * | `control` | 48px. A checkbox or a single toggle. |
 * | `actions` | 112px, the label at the trailing edge, matching `TableActionsCell`. |
 * | `sm` | 12% — a toggle with its label, a short flag. |
 * | `md` | 16% — a connector mark and a word, a status badge, a timestamp. |
 * | `lg` | 20% — a count with a disclosure, or text with a control beside it. |
 *
 * `sm`/`md`/`lg` are shares of the table, not sizes: 16% narrows when the
 * table narrows, `w-48` does not. A floor belongs to the scroll container, not
 * to the column — under `layout="fixed"` a `min-width` on a `th` is ignored.
 */
export type TableColumnWidth =
  | 'auto'
  | 'control'
  | 'actions'
  | 'sm'
  | 'md'
  | 'lg';

export type TableSortDirection = 'asc' | 'desc' | undefined;

const tableHeadVariants = cva(
  cn(
    // 36px fixed, the inset coming from the height rather than from padding:
    // at `py-0` an 18px checkbox no longer makes this header 2px taller than
    // the next table's. Safe as a fixed height because a header never wraps.
    'h-9 px-4 py-0 align-middle',
    // The header tightens with the body under `Table density="compact"`.
    '[[data-density=compact]_&]:h-7',
    'whitespace-nowrap text-left',
    // Under `layout="fixed"` the label is cut with an ellipsis, as the body's
    // cells are: a head narrower than its word ran on over the next column.
    '[[data-layout=fixed]_&]:overflow-hidden',
    '[[data-layout=fixed]_&]:text-ellipsis',
    'font-medium text-ink-secondary text-xs leading-4',
    '[&:has([role=checkbox])]:pe-0'
  ),
  {
    variants: {
      width: {
        auto: '',
        control: 'w-12',
        // Over the cluster it names, which `TableActionsCell` sets right.
        actions: 'w-28 text-right',
        sm: 'w-[12%]',
        md: 'w-[16%]',
        lg: 'w-[20%]',
      },
    },
    defaultVariants: { width: 'auto' },
  }
);

const tableHeadSortVariants = cva(
  cn(
    'inline-flex max-w-full items-center gap-1.5 rounded',
    // A label and a standalone glyph — no box to fill — so hover is carried by
    // colour alone. Hover only: the header commits on click and the table
    // reordering is the feedback.
    'group transition-colors hover:text-ink-icon-hover',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-table-header-bg'
  ),
  {
    variants: {
      sorted: { true: 'text-ink-body', false: '' },
    },
    defaultVariants: { sorted: false },
  }
);

const tableHeadSortIconVariants = cva(
  cn(
    'size-3.5 text-ink-body transition-[transform,color] duration-base',
    'group-hover:text-ink-icon-hover'
  ),
  {
    variants: {
      direction: { asc: 'rotate-180', desc: '' },
    },
    defaultVariants: { direction: 'desc' },
  }
);

interface TableHeadProps
  extends ComponentProps<'th'>,
    VariantProps<typeof tableHeadVariants> {
  sortable?: boolean;
  sortDirection?: TableSortDirection;
  onSort?: () => void;
}

function SortIcon({ direction }: { direction: TableSortDirection }) {
  if (!direction) {
    // The glyph hovers with the label: an unsorted column rests a step
    // quieter, but the two move together or the header reads as two controls.
    return (
      <ChevronsUpDown className="size-3.5 text-ink-inactive transition-colors group-hover:text-ink-icon-hover" />
    );
  }

  return <ChevronDown className={tableHeadSortIconVariants({ direction })} />;
}

function TableHead({
  className,
  children,
  width,
  sortable,
  sortDirection = undefined,
  onSort,
  ...props
}: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      aria-sort={
        sortable
          ? sortDirection === 'asc'
            ? 'ascending'
            : sortDirection === 'desc'
              ? 'descending'
              : 'none'
          : undefined
      }
      className={cn(tableHeadVariants({ width }), className)}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={tableHeadSortVariants({ sorted: Boolean(sortDirection) })}
        >
          <span className="min-w-0 truncate">{children}</span>
          <SortIcon direction={sortDirection} />
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export { TableHead, tableHeadSortVariants, tableHeadVariants };
