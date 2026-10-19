'use client';

import { Pin } from 'lucide-react';
import { useState } from 'react';
import { isButtonKey } from '../../lib/button-keyboard';
import { cn } from '../../lib/utils';
import { IconButton, type IconButtonProps } from '../IconButton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

export interface PinToggleProps
  extends Omit<
    IconButtonProps,
    | 'aria-label'
    | 'aria-pressed'
    | 'asChild'
    | 'children'
    | 'isLoading'
    | 'variant'
  > {
  /** Controlled state. Leave it out to let the toggle keep its own. */
  pressed?: boolean;
  /** @default false */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /**
   * The accessible name, and the tooltip while unpinned. It stays the same in
   * both states — `aria-pressed` says which one it is in, and a name that
   * flipped to "Unpin" would be read as "Unpin, pressed".
   * @default 'Pin'
   */
  pinLabel?: string;
  /** The tooltip while pinned: what a click will do now. @default 'Unpin' */
  unpinLabel?: string;
}

/**
 * Pins a thing to the top of its list — a chat, a report, a query.
 *
 * Off, it is the pin's outline on a `tertiary` IconButton. On, the glyph fills,
 * takes the brand colour (`primaryTertiary`) and tilts 30°, so a pinned row is
 * told apart at a glance from a row that merely offers to be pinned.
 *
 * `2xs` by default, the row-action size; it takes the rest of the IconButton
 * ladder through `size`. Its click and its activation keys stay its own, so it
 * can sit inside a clickable row without opening it.
 */
function PinToggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  pinLabel = 'Pin',
  unpinLabel = 'Unpin',
  size = '2xs',
  className,
  onClick,
  onKeyDown,
  ref,
  ...props
}: PinToggleProps) {
  const [ownPressed, setOwnPressed] = useState(defaultPressed);
  const isPressed = pressed ?? ownPressed;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton
          {...props}
          ref={ref}
          aria-label={pinLabel}
          aria-pressed={isPressed}
          data-slot="pin-toggle"
          variant={isPressed ? 'primaryTertiary' : 'tertiary'}
          size={size}
          className={cn(
            '[&_svg]:transition-transform [&_svg]:duration-base',
            'motion-reduce:[&_svg]:transition-none',
            // Read off the attribute rather than the prop, so the state the
            // eye sees and the state a screen reader hears are one fact.
            '[&[aria-pressed=true]_svg]:rotate-[30deg] [&[aria-pressed=true]_svg]:fill-current',
            className
          )}
          onClick={(event) => {
            event.stopPropagation();
            onClick?.(event);
            if (event.defaultPrevented) return;

            const next = !isPressed;
            if (pressed === undefined) setOwnPressed(next);
            onPressedChange?.(next);
          }}
          onKeyDown={(event) => {
            if (isButtonKey(event.key)) event.stopPropagation();
            onKeyDown?.(event);
          }}
        >
          <Pin />
        </IconButton>
      </TooltipTrigger>
      <TooltipContent>{isPressed ? unpinLabel : pinLabel}</TooltipContent>
    </Tooltip>
  );
}

PinToggle.displayName = 'PinToggle';

export { PinToggle };
