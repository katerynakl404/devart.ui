'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentProps } from 'react';
import { useContext, useEffect, useRef } from 'react';
import { composeEventHandlers } from '../../lib/compose-event-handlers';
import { lastInteractionWasKeyboard } from '../../lib/focus-modality';
import { cn, focusRing } from '../../lib/utils';
import { TooltipContext } from './context';

/* A touch screen has no hover, and Radix's trigger ignores a `touch` pointer
   in its own `onPointerMove` by design — so without what is below, every
   tooltip in this library is silent on a phone.

   THE GESTURE IS A LONG PRESS, NOT A TAP, and the reason is the tap already
   belongs to the trigger: a `Badge` that opens a log, a `Button` that runs
   its action, a row's ⋮ that opens its menu. Opening on tap would race every
   one of them. A long press collides with nothing, which is why both MUI
   (`enterTouchDelay` 700ms, `leaveTouchDelay` 1500ms) and Angular Material
   (`touchGestures`, `touchLongPressShowDelay`) settled on it, and why the
   delays below are theirs.

   It lives here rather than in any one component so that every tooltip in the
   kit gets it at once — the control tooltips on `Button`, `IconButton` and
   `Switch` included, which a per-component fix could never reach without
   racing their press.

   Known limit, the same one MUI has: on iOS a long press over text can still
   start a selection. The native context menu is suppressed once our press
   has fired; a trigger whose own long press means something takes
   `touchGestures="off"`. */

/** MUI's `enterTouchDelay`. */
const LONG_PRESS_MS = 700;
/** MUI's `leaveTouchDelay` — the words stay after the finger lifts. */
const LEAVE_TOUCH_MS = 1500;

/** The wrapper for the element that triggers the tooltip on hover, keyboard focus, or a long press. */
export function TooltipTrigger({
  className,
  asChild,
  onFocus,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onContextMenu,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Trigger>) {
  const tooltip = useContext(TooltipContext);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  /** Did OUR long press open it — the only thing that may eat the context menu. */
  const firedRef = useRef(false);

  useEffect(
    () => () => {
      clearTimeout(pressTimer.current);
      clearTimeout(leaveTimer.current);
    },
    []
  );

  const touchOn = tooltip !== null && tooltip.touchGestures === 'auto';

  return (
    <TooltipPrimitive.Trigger
      asChild={asChild}
      className={asChild ? className : cn(focusRing, className)}
      // Keyboard focus only
      onFocus={(event) => {
        onFocus?.(event);
        if (!lastInteractionWasKeyboard()) event.preventDefault();
      }}
      onContextMenu={composeEventHandlers(onContextMenu, (event) => {
        if (firedRef.current) event.preventDefault();
      })}
      onPointerCancel={composeEventHandlers(onPointerCancel, () => {
        clearTimeout(pressTimer.current);
      })}
      onPointerDown={composeEventHandlers(onPointerDown, (event) => {
        if (!touchOn || event.pointerType !== 'touch') return;

        firedRef.current = false;
        clearTimeout(leaveTimer.current);
        pressTimer.current = setTimeout(() => {
          firedRef.current = true;
          tooltip?.setOpen(true);
        }, LONG_PRESS_MS);
      })}
      onPointerUp={composeEventHandlers(onPointerUp, (event) => {
        if (!touchOn || event.pointerType !== 'touch') return;

        clearTimeout(pressTimer.current);
        if (!firedRef.current) return;

        leaveTimer.current = setTimeout(() => {
          firedRef.current = false;
          tooltip?.setOpen(false);
        }, LEAVE_TOUCH_MS);
      })}
      {...props}
    />
  );
}

TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;
