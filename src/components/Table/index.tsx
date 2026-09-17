'use client';

import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { TableActionsCell } from './TableActionsCell';
import type { TableActionsCellProps } from './TableActionsCell';
import { TableBody } from './TableBody';
import { TableCaption } from './TableCaption';
import { TableCell } from './TableCell';
import { TableFooter } from './TableFooter';
import type { TableSortDirection } from './TableHead';
import { TableHead } from './TableHead';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

interface TableProps extends ComponentProps<'table'> {
  wrapperClassName?: string;
  /**
   * `auto` (the default) sizes every column from its own content, so the
   * layout shifts whenever the data does — a longer status, a page of wider
   * values, an empty or loading row spanning all columns. That is what makes
   * columns appear to jump between renders.
   *
   * `fixed` takes the widths from the first row instead and never re-measures.
   * Give each `TableHead` in that row a width (`className="w-40"`, or
   * `w-[45%]`) and the columns are then stable across every state the table
   * can be in. Prefer it for anything that loads, paginates or filters.
   */
  layout?: 'auto' | 'fixed';
}

function Table({
  className,
  wrapperClassName,
  layout = 'auto',
  ...props
}: TableProps) {
  return (
    <div
      data-slot="table-container"
      // `overflow-x-auto` doubles as the clip that keeps the header band inside
      // the rounded corners.
      className={cn(
        'relative w-full overflow-x-auto rounded-lg border border-stroke bg-surface-card',
        wrapperClassName
      )}
    >
      <table
        data-slot="table"
        data-layout={layout}
        className={cn(
          'caption-bottom text-sm',
          // A fixed table fills the frame; an auto table is allowed to outgrow
          // it and scroll, which is the whole point of the container.
          layout === 'fixed' ? 'w-full table-fixed' : 'w-auto min-w-full',
          className
        )}
        {...props}
      />
    </div>
  );
}

export {
  Table,
  TableActionsCell,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableActionsCellProps,
  type TableProps,
  type TableSortDirection,
};
