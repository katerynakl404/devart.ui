import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        // The divider lives here, on the child selector, rather than only on
        // TableRow: a consumer that writes a plain <tr> — which is valid, and
        // what a generator tends to do — would otherwise get a table with no
        // row separation at all, and nothing would error. TableRow still
        // carries its own copy so a row used outside a TableBody is correct too.
        '[&>tr]:border-stroke [&>tr]:border-b',
        // The container's own border already closes the last row.
        '[&>tr:last-child]:border-0',
        className
      )}
      {...props}
    />
  );
}

export { TableBody };
