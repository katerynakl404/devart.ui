'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

const accordionItemVariants = cva('', {
  variants: {
    variant: {
      /** Items stacked inside one surface, separated by a hairline. */
      divided: 'not-last:border-stroke not-last:border-b',
      /**
       * The item IS the surface — one `Card` per section, spaced by the
       * accordion's own gap. No divider: the card edges already separate them,
       * and a rule inside the last-but-one card reads as a defect.
       */
      standalone: '',
    },
  },
  defaultVariants: { variant: 'divided' },
});

const AccordionItem = ({
  className,
  variant,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item> &
  VariantProps<typeof accordionItemVariants>) => {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(accordionItemVariants({ variant }), className)}
      {...props}
    />
  );
};

AccordionItem.displayName = 'AccordionItem';

export { AccordionItem, accordionItemVariants };
