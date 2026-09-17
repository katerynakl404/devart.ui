import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/** Totals row. Like the header, it paints no band — only a divider above it. */
function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'border-stroke border-t font-medium',
        '[&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  );
}

export { TableFooter };
