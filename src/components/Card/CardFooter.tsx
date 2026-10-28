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
       under the footer does not show through — and the card's own bottom
       corners (`inherit`), or the content shows through those instead. */
    sticky: {
      true: 'sticky bottom-0 z-10 rounded-b-[inherit] bg-surface-card',
      false: '',
    },
    /* A rule across the top: the footer as a band of its own under the
       content, not a row of it — the commit apart from what it commits. */
    divided: {
      true: 'border-stroke border-t',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    sticky: false,
    divided: false,
  },
});

interface CardFooterProps
  extends ComponentProps<'div'>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = ({
  className,
  variant,
  sticky,
  divided,
  ref,
  ...props
}: CardFooterProps) => (
  <div
    ref={ref}
    className={cn(cardFooterVariants({ variant, sticky, divided }), className)}
    {...props}
  />
);

CardFooter.displayName = 'CardFooter';

export { CardFooter, cardFooterVariants };
