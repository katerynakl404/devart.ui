'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentProps } from 'react';
import { cn, focusRing } from '../../lib/utils';
import { TooltipContent } from './TooltipContent';

/**
 * Global wrapper that manages the delay and skip-delay for every tooltip below
 * it.
 *
 * `delayDuration` defaults to **300ms**, the kit's value —
 * `[data-tip]` opens on `transition: opacity .12s .3s`. Radix's own default is
 * 700, which reads as a tooltip that never comes; the 200 this package used at
 * three call sites reads as one that fires while the pointer is still moving
 * across the row.
 *
 * A consumer that wants a different pace passes its own: the sidebar rail uses
 * 500, because there the pointer crosses eight icons on the way to one.
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
