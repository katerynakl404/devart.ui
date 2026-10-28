import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { toArrowPosition } from './arrow-position';
import type { GuideCardSide } from './types';

const guideCardArrowVariants = cva(
  'absolute size-3 rotate-45 border border-stroke bg-surface-card',
  {
    variants: {
      side: {
        right: cn(
          '-left-px -translate-x-1/2 -translate-y-1/2',
          'border-t-0 border-r-0'
        ),
        left: cn(
          '-right-px translate-x-1/2 -translate-y-1/2',
          'border-b-0 border-l-0'
        ),
        bottom: cn(
          '-top-px -translate-x-1/2 -translate-y-1/2',
          'border-r-0 border-b-0'
        ),
        top: cn(
          '-bottom-px -translate-x-1/2 translate-y-1/2',
          'border-t-0 border-l-0'
        ),
      },
      centered: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        side: ['top', 'bottom'],
        centered: true,
        class: 'left-1/2',
      },
      {
        side: ['left', 'right'],
        centered: true,
        class: 'top-1/2',
      },
    ],
    defaultVariants: {
      side: 'bottom',
      centered: true,
    },
  }
);

interface GuideCardArrowProps {
  side: GuideCardSide;
  offset?: number | string;
}

const GuideCardArrow = ({ side, offset }: GuideCardArrowProps) => {
  const isCentered = offset == null;
  const position = isCentered ? undefined : toArrowPosition(side, offset);

  return (
    <span
      data-slot="guide-card-arrow"
      aria-hidden="true"
      className={cn(guideCardArrowVariants({ side, centered: isCentered }))}
      style={position}
    />
  );
};

export { GuideCardArrow, guideCardArrowVariants };
