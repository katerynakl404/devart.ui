import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'group/row border-stroke border-b transition-colors',
        className
      )}
      {...props}
    />
  );
}

export { TableRow };
