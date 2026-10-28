import type { ReactNode } from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';
import { GuideCardIcon } from './GuideCardIcon';

const guideCardTitleRowVariants = cva('flex items-center gap-2.5');

const guideCardTitleVariants = cva('m-0 text-base');

interface GuideCardTitleProps {
  id?: string;
  icon?: ReactNode;
  children: ReactNode;
}

const GuideCardTitle = ({ id, icon, children }: GuideCardTitleProps) => (
  <div
    data-slot="guide-card-title-row"
    className={cn(guideCardTitleRowVariants())}
  >
    {icon && <GuideCardIcon>{icon}</GuideCardIcon>}

    <Typography
      element="h3"
      variant="p"
      weight="semibold"
      id={id}
      data-slot="guide-card-title"
      className={cn(guideCardTitleVariants())}
    >
      {children}
    </Typography>
  </div>
);

export { GuideCardTitle, guideCardTitleRowVariants, guideCardTitleVariants };
