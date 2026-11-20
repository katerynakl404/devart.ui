'use client';

import * as SeparatorPrimitive from '@radix-ui/react-separator';
import type * as React from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';

/* The line is a border on a box of no size, not a 1px box filled with the
   colour: a border is snapped to whole device pixels, a fill is not. At 125%
   display scaling the fill is 1.25 device pixels, smeared over two rows
   wherever the layout lands it on a fraction. */
const separatorVariants = cva('shrink-0', {
  variants: {
    variant: {
      primary: 'border-brand-secondary',
      secondary: 'border-brand-tertiary',
      border: 'border-stroke',
    },
    orientation: {
      horizontal: 'h-0 w-full border-t',
      vertical: 'h-full w-0 border-s',
    },
  },
  defaultVariants: {
    variant: 'border',
    orientation: 'horizontal',
  },
});

export interface SeparatorProps
  extends Omit<
      React.ComponentPropsWithRef<typeof SeparatorPrimitive.Root>,
      'orientation'
    >,
    VariantProps<typeof separatorVariants> {}

const Separator = ({
  className,
  orientation,
  variant,
  decorative = true,
  ref,
  ...props
}: SeparatorProps) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation || 'horizontal'}
    className={cn(separatorVariants({ orientation, variant }), className)}
    {...props}
  />
);
Separator.displayName = 'Separator';

export { Separator, separatorVariants };
