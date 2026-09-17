'use client';

import { ChevronDown, ChevronsUpDown } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

export type TableSortDirection = 'asc' | 'desc' | undefined;

interface TableHeadProps extends ComponentProps<'th'> {
  sortable?: boolean;
  sortDirection?: TableSortDirection;
  onSort?: () => void;
}

function SortIcon({ direction }: { direction: TableSortDirection }) {
  if (!direction) {
    return <ChevronsUpDown className="size-3.5 text-ink-inactive" />;
  }

  return (
    <ChevronDown
      className={cn(
        'size-3.5 text-ink-body transition-transform duration-base',
        direction === 'asc' && 'rotate-180'
      )}
    />
  );
}

function TableHead({
  className,
  children,
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
      className={cn(
        // Same 10px/16px padding as TableCell, deliberately duplicated rather
        // than shortened: a header inset that differs from its column's body
        // inset is the single most visible table defect there is.
        'px-4 py-2.5 align-middle',
        'whitespace-nowrap text-left',
        'font-medium text-ink-secondary text-xs leading-4',
        '[&:has([role=checkbox])]:pe-0',
        className
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            'inline-flex items-center gap-1.5 rounded',
            'transition-colors hover:text-ink-body',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-table-header-bg',
            sortDirection && 'text-ink-body'
          )}
        >
          {children}
          <SortIcon direction={sortDirection} />
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export { TableHead };
