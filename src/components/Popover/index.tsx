'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ComponentProps } from 'react';
import { cn, focusRing } from '../../lib/utils';
import { PopoverContent } from './PopoverContent';

/**
 * The root component that manages the open/closed state of the popover.
 */
const Popover = PopoverPrimitive.Root;

/**
 * An optional element used as the positioning reference for the popover.
 */
const PopoverAnchor = PopoverPrimitive.Anchor;

/**
 * The element (usually a button) that toggles the popover when clicked.
 */
const PopoverTrigger = ({
  className,
  asChild,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Trigger>) => (
  <PopoverPrimitive.Trigger
    asChild={asChild}
    className={asChild ? className : cn(focusRing, className)}
    {...props}
  />
);

PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
