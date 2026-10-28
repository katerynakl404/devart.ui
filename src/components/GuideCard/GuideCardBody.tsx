import type { ReactNode } from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';

const guideCardBodyVariants = cva(
  cn(
    'mt-2 font-normal text-ink-secondary text-sm leading-relaxed',
    '[&_p+p]:mt-3 [&_p]:m-0',
    '[&_b]:font-semibold [&_b]:text-ink-body',
    '[&_strong]:font-semibold [&_strong]:text-ink-body'
  )
);

interface GuideCardBodyProps {
  id?: string;
  children: ReactNode;
}

const GuideCardBody = ({ id, children }: GuideCardBodyProps) => (
  <div
    id={id}
    data-slot="guide-card-body"
    className={cn(guideCardBodyVariants())}
  >
    {children}
  </div>
);

export { GuideCardBody, guideCardBodyVariants };
