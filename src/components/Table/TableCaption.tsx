import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('mt-3 text-ink-secondary text-sm', className)}
      {...props}
    />
  );
}

export { TableCaption };
