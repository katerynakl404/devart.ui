'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { useSegmentedControl } from './SegmentedControlContext';

// Base holds only cross-variant primitives (layout, focus, disabled). The pill
// track's fill/shadow lives in the `default` variant so `underline` — a flat,
// content-width tab — doesn't inherit the raised-pill background or stretch.
const segmentedControlTriggerVariants = cva(
  cn(
    'inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap',
    'font-medium text-ink-secondary',
    'transition-[background-color,color,box-shadow] duration-fast',
    // Icon follows currentColor — no per-state icon override.
    '[&_svg]:shrink-0',

    // Hover (inactive only): half-step lift + neutral rim + primary text.
    'data-[state=inactive]:hover:bg-segctrl-hover-bg',
    'data-[state=inactive]:hover:text-ink-primary',
    'data-[state=inactive]:hover:shadow-segctrl-hover',

    // Active / selected: raised pill (Surface/Card light, Chips dark) + rim.
    'data-[state=active]:bg-surface-card',
    'dark:data-[state=active]:bg-surface-chips',
    'data-[state=active]:text-ink-primary',
    'data-[state=active]:shadow-segctrl-active',

    // Focus — brand-tinted ring with a Surface/Card gap.
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',

    // Disabled — unified opacity recipe.
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-disabled'
  ),
  {
    variants: {
      size: {
        sm: 'h-5 px-1 text-xs [&_svg]:size-3',
        md: 'h-8 px-3 text-sm [&_svg]:size-3.5',
      },
      // Inset one step from the track so the raised pill follows its corners.
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded',
        lg: 'rounded-md',
        xl: 'rounded-lg',
        full: 'rounded-full',
      },
      /**
       * DRAFT. What the selected half MEANS, for a control whose two options
       * are not equivalent.
       *
       * `neutral` is the default and the only one that existed: the selected
       * half is a raised card-tone pill, and which half that is carries no
       * meaning beyond "this one". Right for Read / Read & write, Light / Dark,
       * Create / Edit — alternatives of the same kind.
       *
       * `positive` and `negative` are for a control that states a FACT with a
       * consequence: included or excluded, allowed or blocked, on or off. A
       * column of these is read down at a glance, and a neutral pill makes the
       * reader parse the label on every row to find the exceptions; a green or
       * red fill is read without parsing. The tone belongs to the TRIGGER, not
       * to the control: only the option itself knows whether it is the
       * permissive one.
       *
       * Unselected, both are the same neutral text as any other trigger. The
       * colour is the answer, not the offer.
       */
      tone: {
        neutral: '',
        positive: cn(
          // Theme-independent fills, like the destructive button: one green
          // and one red in both themes, so there is no `dark:` pair to keep in
          // step (and no stacked variant for the bundle to miss).
          'data-[state=active]:bg-fb-green',
          'data-[state=active]:text-content-on-solid',
          'data-[state=active]:shadow-none'
        ),
        negative: cn(
          'data-[state=active]:bg-fb-red',
          'data-[state=active]:text-content-on-solid',
          'data-[state=active]:shadow-none'
        ),
      },
    },
    defaultVariants: {
      size: 'md',
      rounded: 'md',
      tone: 'neutral',
    },
  }
);

const SegmentedControlTrigger = ({
  className,
  tone,
  ref,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger> &
  VariantProps<typeof segmentedControlTriggerVariants>) => {
  /* `size` and `rounded` come from the control, because the track and its pills
     have to agree. `tone` does not: it is a property of the one option, so it
     is passed per trigger. */
  const { size, rounded } = useSegmentedControl();
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        segmentedControlTriggerVariants({ size, rounded, tone }),
        className
      )}
      {...props}
    />
  );
};

SegmentedControlTrigger.displayName = TabsPrimitive.Trigger.displayName;

export { SegmentedControlTrigger, segmentedControlTriggerVariants };
