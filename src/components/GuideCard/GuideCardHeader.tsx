import type { ReactNode } from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';

const guideCardHeaderVariants = cva('mb-3');

const GuideCardHeader = ({ children }: { children: ReactNode }) => (
  <div data-slot="guide-card-header" className={cn(guideCardHeaderVariants())}>
    {children}
  </div>
);

export { GuideCardHeader, guideCardHeaderVariants };
