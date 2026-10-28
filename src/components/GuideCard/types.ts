import type { ComponentProps, ReactNode } from 'react';

export type GuideCardWidth = 'md' | 'lg';

export type GuideCardSide = 'top' | 'right' | 'bottom' | 'left';

export type GuideCardMotion = 'in' | 'nudge' | 'out';

export interface GuideCardProps extends Omit<ComponentProps<'div'>, 'title'> {
  header?: ReactNode;
  icon?: ReactNode;
  title?: ReactNode;
  titleId?: string;
  descriptionId?: string;
  footer?: ReactNode;
  width?: GuideCardWidth;
  side?: GuideCardSide;
  arrowOffset?: number | string;
  nudgeCount?: number;
  isLeaving?: boolean;
}
