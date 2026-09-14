'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentProps } from 'react';
import { cn, focusRing } from '../../lib/utils';
import { TooltipContent } from './TooltipContent';

/**
 * Global wrapper that manages the delay and skip-delay for all tooltips in the application.
 */
const TooltipProvider = TooltipPrimitive.Provider;

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
  ...props
}: ComponentProps<typeof TooltipPrimitive.Trigger>) => (
  <TooltipPrimitive.Trigger
    asChild={asChild}
    className={asChild ? className : cn(focusRing, className)}
    {...props}
  />
);

TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
