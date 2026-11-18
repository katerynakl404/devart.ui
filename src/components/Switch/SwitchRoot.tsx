'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import type { ComponentPropsWithRef } from 'react';

export const joinIds = (...ids: (string | undefined)[]) =>
  ids.filter(Boolean).join(' ') || undefined;

type SwitchRootProps = ComponentPropsWithRef<typeof SwitchPrimitives.Root> & {
  ownDescribedBy?: string;
  'data-state'?: string;
};

/**
 * `Switch.Root` that survives `<TooltipTrigger asChild>`. The trigger injects
 * its own `data-state` (`closed` / `delayed-open`) and `aria-describedby`, and
 * Radix spreads incoming props over its own — the switch would lose its
 * checked styling and its description id.
 */
export function SwitchRoot({
  'data-state': _tooltipState,
  'aria-describedby': tooltipDescribedBy,
  ownDescribedBy,
  ...props
}: SwitchRootProps) {
  return (
    <SwitchPrimitives.Root
      aria-describedby={joinIds(tooltipDescribedBy, ownDescribedBy)}
      {...props}
    />
  );
}
