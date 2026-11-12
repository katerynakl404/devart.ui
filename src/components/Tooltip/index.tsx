'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentProps } from 'react';
import { lastInteractionWasKeyboard } from '../../lib/focus-modality';
import { cn, focusRing } from '../../lib/utils';
import { TooltipContent } from './TooltipContent';

/**
 * Global wrapper that manages the delay and skip-delay for all tooltips in the application.
 */
const TooltipProvider = ({
  delayDuration = 300,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
);

TooltipProvider.displayName = TooltipPrimitive.Provider.displayName;

/**
 * The root component that manages the state and logic for an individual tooltip.
 */
const Tooltip = TooltipPrimitive.Root;

/**
 * The wrapper for element that triggers the tooltip on hover or focus.
 */
const TooltipTrigger = ({
  className,
  asChild,
  onFocus,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Trigger>) => (
  <TooltipPrimitive.Trigger
    asChild={asChild}
    className={asChild ? className : cn(focusRing, className)}
    // Keyboard focus only
    onFocus={(event) => {
      onFocus?.(event);
      if (!lastInteractionWasKeyboard()) event.preventDefault();
    }}
    {...props}
  />
);

TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
