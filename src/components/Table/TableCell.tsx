import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'h-9 whitespace-nowrap p-2 align-middle text-ink-body text-xs [&:has([role=checkbox])]:pr-0',
        'transition-[background-color] duration-fast [transition-timing-function:ease]',

        'group-data-[interactive]/row:group-hover/row:bg-tbl-row-hover',
        'group-data-[interactive]/row:group-focus-visible/row:bg-tbl-row-hover',
        'group-data-[interactive]/row:group-active/row:bg-tbl-row-pressed',
        'group-[.is-selected]/row:bg-tbl-row-pressed',

        'group-[.is-selected]/row:group-hover/row:!bg-tbl-row-selected-hover',
        'group-[.is-selected]/row:group-active/row:!bg-tbl-row-pressed',
        className
      )}
      {...props}
    />
  );
}

export { TableCell };
