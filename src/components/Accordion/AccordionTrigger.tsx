'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn, focusRing } from '../../lib/utils';

/**
 * `size` — how loudly the row names its section. **Draft.**
 *
 * `sm` (the default, 14px) is a row in a list of foldables: a settings group,
 * a FAQ entry, a details strip. `md` (16px) is a row that is the HEADING of a
 * section, where each item is its own card and the accordion is the page's
 * structure rather than a widget inside it — there 14px medium reads as a
 * label on a box instead of as the name of the part you are filling in.
 *
 * It is a step on the type scale, not a font size the consumer picks: a page
 * reaching for `className="text-base"` here is a page deciding typography,
 * which is the thing the rest of this system exists to prevent.
 */
const AccordionTrigger = ({
  className,
  children,
  size = 'sm',
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger> & {
  size?: 'sm' | 'md';
}) => {
  return (
    <AccordionPrimitive.Header data-testid="accordion-header" className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'group/accordion-trigger',
          'relative flex flex-1 items-center justify-between gap-3',
          'rounded-lg p-3',
          'text-ink-primary',
          size === 'md' ? 'text-base' : 'text-sm',
          'font-medium',
          focusRing,
          'transition-all',
          'disabled:pointer-events-none',
          'disabled:cursor-not-allowed',
          'disabled:opacity-disabled',
          '[&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="pointer-events-none size-4 shrink-0 text-ink-secondary transition-transform duration-base" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export { AccordionTrigger };
