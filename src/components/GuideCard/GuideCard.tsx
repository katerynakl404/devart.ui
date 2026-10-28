'use client';

import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { GuideCardArrow } from './GuideCardArrow';
import { GuideCardBody } from './GuideCardBody';
import { GuideCardFooter } from './GuideCardFooter';
import { GuideCardHeader } from './GuideCardHeader';
import { GuideCardTitle } from './GuideCardTitle';
import type { GuideCardProps } from './types';
import { useGuideCardMotion } from './use-guide-card-motion';

const guideCardVariants = cva(
  cn(
    'relative max-w-full p-4',
    'rounded-lg border border-stroke bg-surface-card text-ink-primary shadow-dropdown'
  ),
  {
    variants: {
      width: {
        md: 'w-[22rem]',
        lg: 'w-[29rem]',
      },
      motion: {
        in: cn('animate-guide-card-in', 'motion-reduce:animate-none'),
        nudge: cn('animate-guide-card-nudge', 'motion-reduce:animate-none'),
        out: cn(
          'pointer-events-none animate-guide-card-out',
          'motion-reduce:[animation-duration:1ms]'
        ),
      },
    },
    defaultVariants: {
      width: 'md',
      motion: 'in',
    },
  }
);

function GuideCard({
  header,
  icon,
  title,
  titleId,
  descriptionId,
  footer,
  width = 'md',
  side,
  arrowOffset,
  nudgeCount,
  isLeaving = false,
  className,
  children,
  ref,
  ...props
}: GuideCardProps) {
  const motion = useGuideCardMotion({ nudgeCount, isLeaving });

  return (
    <div
      ref={ref}
      data-slot="guide-card"
      data-side={side}
      data-state={isLeaving ? 'leaving' : 'open'}
      className={cn(guideCardVariants({ width, motion }), className)}
      {...props}
    >
      {side ? <GuideCardArrow side={side} offset={arrowOffset} /> : null}

      {header ? <GuideCardHeader>{header}</GuideCardHeader> : null}

      {title ? (
        <GuideCardTitle id={titleId} icon={icon}>
          {title}
        </GuideCardTitle>
      ) : null}

      {children ? (
        <GuideCardBody id={descriptionId}>{children}</GuideCardBody>
      ) : null}

      {footer ? <GuideCardFooter>{footer}</GuideCardFooter> : null}
    </div>
  );
}

GuideCard.displayName = 'GuideCard';

export { GuideCard, guideCardVariants };
