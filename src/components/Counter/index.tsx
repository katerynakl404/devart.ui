'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, Ref } from 'react';
import { cn } from '../../lib/utils';

/* Counter — one small round count, for wherever the product says "N of these are
   waiting". It is NOT Badge: a badge labels a thing ("Recommended", "Beta",
   "12 sources") and sizes itself to its label, so it is a pill. This holds a
   number, the number is the whole content, and it keeps a 1:1 box — a column of
   them has to read as a column, which a row of differently-wide pills does not.

   Two states and no more. Default is the quiet surface with Text/Body on it: a
   count is content, not a status, and most of the time nothing is happening to
   it. `active` fills with the primary button's own pair, and the only thing it
   ever means is "this is moving on its own right now".

   Why Button/Primary's pair rather than Brand/Primary raw: white on
   Brand/Primary measures 3.93:1 on dark, under the floor for 12px text. The
   button's fill and ink are maintained to stay legible in both themes, and this
   tracks them if the brand ever moves. */
const counterVariants = cva(
  cn(
    'inline-flex shrink-0 items-center justify-center',
    'box-border rounded-full',
    'font-medium leading-none tabular-nums'
  ),
  {
    variants: {
      active: {
        false: 'bg-surface-card2 text-ink-body',
        true: 'bg-btn-primary-bg text-btn-primary-text',
      },
      /* Two steps, because the same count sits beside two different line heights.
         md is right next to 14px body text in a list row; beside a 14px nav label
         it reads as a token dropped on the row, and sm is the size the nav badge
         next to it already uses. */
      size: {
        md: 'size-5 text-xs',
        sm: 'size-4 text-xxs',
      },
    },
    defaultVariants: { active: false, size: 'md' },
  }
);

export interface CounterProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof counterVariants> {
  ref?: Ref<HTMLSpanElement>;
}

const Counter = ({ active, size, className, children, ref, ...props }: CounterProps) => (
  <span
    ref={ref}
    className={cn(counterVariants({ active, size }), className)}
    {...props}
  >
    {children}
  </span>
);

Counter.displayName = 'Counter';

export { Counter, counterVariants };
