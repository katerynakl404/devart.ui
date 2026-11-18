'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import type { ReactNode, RefObject } from 'react';
import { cva } from '../../lib/cva';
import { restoreFocus } from '../../lib/focus-modality';
import { usePortalContainer } from '../../lib/portal-container';
import { cn } from '../../lib/utils';
import { dropdownMenuContentVariants } from '../DropdownMenu/DropdownMenuContent';

// Built on the DropdownMenu list; the --radix-select-* variables are set by
// Radix on the content while it is open
const selectContentVariants = cva(
  cn(
    dropdownMenuContentVariants(),
    // As wide as the field, border included
    'w-[calc(var(--radix-select-trigger-width)+2px)] min-w-0 max-w-none',
    // Above Modal (z-100)
    'z-[110] p-0',
    // 7.5 rows
    'max-h-[min(21.5rem,var(--radix-select-content-available-height))]',
    'origin-[--radix-select-content-transform-origin]'
  )
);

const selectViewportVariants = cva(
  cn(
    'p-2',
    // Radix hides the scrollbar
    '[&[data-radix-select-viewport]]:[scrollbar-width:auto]',
    '[&[data-radix-select-viewport]::-webkit-scrollbar]:block'
  )
);

interface SelectListProps {
  /** Gets focus back when the list closes. */
  triggerRef: RefObject<HTMLButtonElement | null>;
  children: ReactNode;
}

/** The options popup, in a portal, anchored under the field. */
function SelectList({ triggerRef, children }: SelectListProps) {
  const container = usePortalContainer();

  const handleCloseAutoFocus = (event: Event) => {
    event.preventDefault();

    if (triggerRef.current) {
      restoreFocus(triggerRef.current, { preventScroll: true });
    }
  };

  return (
    <SelectPrimitive.Portal container={container}>
      <SelectPrimitive.Content
        position="popper"
        align="start"
        sideOffset={5}
        alignOffset={-1}
        collisionPadding={8}
        className={selectContentVariants()}
        onCloseAutoFocus={handleCloseAutoFocus}
      >
        <SelectPrimitive.Viewport className={selectViewportVariants()}>
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export { SelectList, selectContentVariants, selectViewportVariants };
