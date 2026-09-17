import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      // `group/row` is the hook every row-scoped rule hangs off: the cell fills
      // in TableCell and the hover/focus reveal in TableActionsCell.
      className={cn('group/row border-stroke border-b', className)}
      {...props}
    />
  );
}

export { TableRow };
