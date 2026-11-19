'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentProps } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { TooltipContext } from './context';

export interface TooltipProps
  extends ComponentProps<typeof TooltipPrimitive.Root> {
  /**
   * What touch does. `auto` opens the tooltip on a LONG PRESS, leaving the tap
   * to whatever the trigger is for; `off` leaves touch alone, for a trigger
   * whose own long press means something (a text selection, a drag).
   *
   * @default 'auto'
   */
  touchGestures?: 'auto' | 'off';
}

/**
 * The tooltip's root.
 *
 * It keeps the open state so a long press can drive the tooltip directly:
 * Radix's trigger ignores a `touch` pointer in its own `onPointerMove` by
 * design, so without this a tooltip is simply unreachable on a phone. A
 * consumer's own `open` / `onOpenChange` still win.
 */
export function Tooltip({
  open,
  defaultOpen,
  onOpenChange,
  touchGestures = 'auto',
  ...props
}: TooltipProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen ?? false);
  const isControlled = open !== undefined;
  const resolved = isControlled ? open : uncontrolled;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const value = useMemo(
    () => ({ setOpen, touchGestures }),
    [setOpen, touchGestures]
  );

  return (
    <TooltipContext.Provider value={value}>
      <TooltipPrimitive.Root
        onOpenChange={setOpen}
        open={resolved}
        {...props}
      />
    </TooltipContext.Provider>
  );
}

Tooltip.displayName = TooltipPrimitive.Root.displayName;
