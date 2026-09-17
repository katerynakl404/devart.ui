import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The header row group. It paints **no background** — the header sits on the
 * card surface like the rows below it, separated by the divider alone.
 *
 * (`--tbl-header-bg` exists for a banded variant and is deliberately not used
 * here. A band equal to the row-hover step would also merge with a hovered
 * first row, since the header sits directly above it.)
 */
function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:border-stroke [&_tr]:border-b', className)}
      {...props}
    />
  );
}

export { TableHeader };
