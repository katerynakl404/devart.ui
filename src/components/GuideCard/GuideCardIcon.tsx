import type { ReactNode } from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';

const guideCardIconVariants = cva(
  cn(
    'flex size-8 flex-none items-center justify-center rounded-full',
    'bg-brand-primary/10 text-ink-highlight [&_svg]:size-4'
  )
);

const GuideCardIcon = ({ children }: { children: ReactNode }) => (
  <span
    data-slot="guide-card-icon"
    aria-hidden="true"
    className={cn(guideCardIconVariants())}
  >
    {children}
  </span>
);

export { GuideCardIcon, guideCardIconVariants };
