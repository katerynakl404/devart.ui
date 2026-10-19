import type { ComponentProps } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';

const cardFooterVariants = cva('flex items-center', {
  variants: {
    variant: {
      default: 'gap-2',
      actions: cn('justify-end gap-2', '[&>*]:w-full'),
    },
    /* DRAFT. A card taller than the window keeps its actions in reach: the
       footer sticks to the bottom of the scroller and settles in place at the
       card's end. The card's own surface behind it, so content scrolling
       under the footer does not show through. */
    sticky: {
      true: 'sticky bottom-0 z-10 bg-surface-card',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    sticky: false,
  },
});

interface CardFooterProps
  extends ComponentProps<'div'>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = ({
  className,
  variant,
  sticky,
  ref,
  ...props
}: CardFooterProps) => (
  <div
    ref={ref}
    className={cn(cardFooterVariants({ variant, sticky }), className)}
    {...props}
  />
);

CardFooter.displayName = 'CardFooter';

export { CardFooter, cardFooterVariants };
