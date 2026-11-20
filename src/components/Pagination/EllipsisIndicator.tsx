import { Ellipsis } from 'lucide-react';

import { cn } from '../../lib/utils';
import { type PaginationSize, paginationBoxVariants } from './size';

const EllipsisIndicator = ({ size = 'sm' }: { size?: PaginationSize }) => (
  <span
    aria-hidden
    className={cn(
      paginationBoxVariants({ size }),
      'flex cursor-default items-center justify-center text-ink-inactive [&_svg]:size-4'
    )}
  >
    <Ellipsis />
  </span>
);

EllipsisIndicator.displayName = 'EllipsisIndicator';

export { EllipsisIndicator };
