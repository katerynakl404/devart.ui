import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { metaRowPartVariants } from './MetaRow';

/** The actions that apply to a selection, 4px apart, at the end of the row. */
const MetaRowActions = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <span
    data-slot="meta-row-actions"
    className={cn(metaRowPartVariants({ part: 'actions' }), className)}
    {...props}
  />
);

MetaRowActions.displayName = 'MetaRowActions';

export { MetaRowActions };
