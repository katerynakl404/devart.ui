'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

// The action bar is separated from the body by a divider that runs the full
// width of the dialog, so it bleeds back out through ModalContent's padding
// before re-applying it.
const modalFooterVariants = cva(
  cn(
    'mt-4 flex flex-shrink-0 items-center gap-2',
    '-mx-4 border-stroke border-t px-4 pt-4'
  ),
  {
    variants: {
      align: {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
      },
      flexDirection: {
        row: 'flex-row',
        col: 'flex-col',
        'col-reverse': 'flex-col-reverse',
        'row-reverse': 'flex-row-reverse',
      },
    },
    defaultVariants: {
      align: 'right',
      flexDirection: 'row',
    },
  }
);

interface ModalFooterProps
  extends ComponentProps<'div'>,
    VariantProps<typeof modalFooterVariants> {}

export function ModalFooter({ className, align, ...props }: ModalFooterProps) {
  return (
    <div className={cn(modalFooterVariants({ align }), className)} {...props} />
  );
}

ModalFooter.displayName = 'ModalFooter';
