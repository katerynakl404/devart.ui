'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentProps } from 'react';
import { TooltipContent } from './TooltipContent';
import { Tooltip, type TooltipProps } from './TooltipRoot';
import { TooltipTrigger } from './TooltipTrigger';

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

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
export type { TooltipProps };
