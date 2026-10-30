/**
 * The developers' `Card` folder, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/Card/CardHeader.tsx`, import paths alone changed. The
 * Before halves of the Card page render `Card` from here, so it is the
 * component the developer storybook ships, not a drawing of it. Not edited:
 * replace the folder whole when the base moves.
 */

import type { ComponentProps, ReactNode } from 'react';
import { cva, type VariantProps } from '../../../src/lib/cva';
import { cn } from '../../../src/lib/utils';

const cardHeaderVariants = cva('', {
  variants: {
    layout: {
      vertical: cn('flex flex-col space-y-1.5'),
      horizontal: cn('flex items-center gap-3.5'),
    },
  },
  defaultVariants: {
    layout: 'vertical',
  },
});

interface CardHeaderProps
  extends ComponentProps<'div'>,
    VariantProps<typeof cardHeaderVariants> {
  leftSlot?: ReactNode;
}

const CardHeader = ({
  className,
  layout,
  leftSlot,
  children,
  ref,
  ...props
}: CardHeaderProps) => (
  <div
    ref={ref}
    className={cn(cardHeaderVariants({ layout }), className)}
    {...props}
  >
    {leftSlot}
    {layout === 'horizontal' ? (
      <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        {children}
      </div>
    ) : (
      children
    )}
  </div>
);

CardHeader.displayName = 'CardHeader';

export { CardHeader, cardHeaderVariants };
