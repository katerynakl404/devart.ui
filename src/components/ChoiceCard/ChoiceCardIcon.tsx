import type { ReactNode } from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';

const choiceCardIconVariants = cva(
  cn(
    'flex size-9 flex-none items-center justify-center rounded-full',
    'bg-brand-primary/5 text-ink-highlight [&_svg]:size-4'
  )
);

const ChoiceCardIcon = ({ children }: { children: ReactNode }) => (
  <span
    data-slot="choice-card-icon"
    aria-hidden="true"
    className={cn(choiceCardIconVariants())}
  >
    {children}
  </span>
);

export { ChoiceCardIcon, choiceCardIconVariants };
