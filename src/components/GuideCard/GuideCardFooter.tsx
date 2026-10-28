import type { ReactNode } from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';

const guideCardFooterVariants = cva('mt-4 flex items-center gap-2');

const GuideCardFooter = ({ children }: { children: ReactNode }) => (
  <div data-slot="guide-card-footer" className={cn(guideCardFooterVariants())}>
    {children}
  </div>
);

export { GuideCardFooter, guideCardFooterVariants };
