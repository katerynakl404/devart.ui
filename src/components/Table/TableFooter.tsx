import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn('border-t font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  );
}

export { TableFooter };
