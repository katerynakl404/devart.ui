import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';
import { metaRowPartVariants } from './MetaRow';

/** The reading: "5 connections", "3 selected". Never wraps. */
const MetaRowCount = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <Typography
    variant="span"
    weight="normal"
    textColor="secondary"
    data-slot="meta-row-count"
    className={cn(metaRowPartVariants({ part: 'count' }), className)}
    {...props}
  >
    {children}
  </Typography>
);

MetaRowCount.displayName = 'MetaRowCount';

export { MetaRowCount };
