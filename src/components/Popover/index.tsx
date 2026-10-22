'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ComponentProps } from 'react';
import { PopoverContext } from './context';
import { PopoverContent } from './PopoverContent';
import { PopoverTrigger } from './PopoverTrigger';
import { usePopoverRoot } from './use-popover-root';

interface PopoverProps extends ComponentProps<typeof PopoverPrimitive.Root> {
  /** Also open on mouse hover (pointerType 'mouse' only); tap and pen open by press. */
  openOnHover?: boolean;
  /** ms the pointer must stay on the trigger before a hover opens it. */
  delay?: number;
  /** ms after the pointer leaves trigger or content before a hover-open closes; long enough to travel between them. */
  closeDelay?: number;
  /**
   * When `openOnHover` is on: after a click, pointer-leave no longer closes
   * the popover (default). Set `false` so leave still dismisses after a click;
   * a second click closes either way.
   */
  pinOnClick?: boolean;
  /** Close on window scroll (outside the content) or resize. */
  closeOnViewportChange?: boolean;
}

/**
 * The root component that manages the open/closed state of the popover.
 */
const Popover = ({
  open,
  defaultOpen,
  modal = false,
  openOnHover = false,
  delay,
  closeDelay,
  pinOnClick = true,
  closeOnViewportChange = false,
  onOpenChange,
  ...rest
}: PopoverProps) => {
  const root = usePopoverRoot({
    open,
    defaultOpen,
    modal,
    openOnHover,
    delay,
    closeDelay,
    pinOnClick,
    closeOnViewportChange,
    onOpenChange,
  });

  return (
    <PopoverContext.Provider value={root.context}>
      <PopoverPrimitive.Root
        open={root.open}
        onOpenChange={root.onOpenChange}
        modal={root.modal}
        {...rest}
      />
    </PopoverContext.Provider>
  );
};

/**
 * An optional element used as the positioning reference for the popover.
 */
const PopoverAnchor = PopoverPrimitive.Anchor;

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
export type { PopoverProps };
export type { PopoverContentProps } from './PopoverContent';
