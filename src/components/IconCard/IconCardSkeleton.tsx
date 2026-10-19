'use client';

import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { Card } from '../Card';
import { Skeleton } from '../Skeleton';

interface IconCardSkeletonProps extends ComponentProps<'div'> {}

/**
 * One card's placeholder. Grids decide their own page size, so the count
 * belongs to the caller that renders it, not here.
 *
 * Same box as `IconCard` — 8rem tall, 16px inset, 8px gap — so a grid does
 * not jump when the real tiles replace it.
 */
const IconCardSkeleton = ({ className, ...props }: IconCardSkeletonProps) => (
  <Card
    variant="elevated"
    fullWidth
    className={cn(
      'flex h-32 flex-col items-center justify-center gap-2 p-4',
      className
    )}
    {...props}
  >
    <div className="flex flex-col items-center justify-center gap-2">
      <Skeleton className="size-10" rounded="md" />
      <Skeleton className="h-4 w-20" />
    </div>
  </Card>
);

IconCardSkeleton.displayName = 'IconCardSkeleton';

export { IconCardSkeleton, type IconCardSkeletonProps };
