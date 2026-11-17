'use client';

import type { ComponentProps } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { useModalHasCloseButton } from './ModalContext';

const modalHeaderVariants = cva('mb-3 flex flex-shrink-0 flex-col gap-1.5', {
  variants: {
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    align: 'left',
  },
});

interface ModalHeaderProps
  extends ComponentProps<'div'>,
    VariantProps<typeof modalHeaderVariants> {}

/**
 * The close button is drawn over the dialog, not in the flow, so nothing in
 * the header knows it is there: a long title ran underneath it (measured: 32px
 * under, 2026-11-17). The header reserves its end padding while the button is
 * shown —  carried that reserve by hand, and the product
 * kits patched the title with  beside it.
 *
 * Reserved only while the button is there, so a dialog without one keeps a
 * centred title centred.
 */
export function ModalHeader({ className, align, ...props }: ModalHeaderProps) {
  const hasCloseButton = useModalHasCloseButton();

  return (
    <div
      className={cn(
        modalHeaderVariants({ align }),
        hasCloseButton && 'pe-8',
        className
      )}
      {...props}
    />
  );
}

ModalHeader.displayName = 'ModalHeader';
