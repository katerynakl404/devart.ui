'use client';

import type { MouseEvent, ReactElement, ReactNode } from 'react';
import { Tooltip, TooltipTrigger } from './index';
import { TooltipContent } from './TooltipContent';

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * What a control's `tooltip` prop shows: `true` reuses the `aria-label`;
 * an empty value means no tooltip.
 */
export function resolveTooltip(
  tooltip: ReactNode | true | undefined,
  ariaLabel: ReactNode
): ReactNode | undefined {
  const content = tooltip === true ? ariaLabel : tooltip;
  if (content == null || content === false || content === '') return undefined;
  return content;
}

/** Wraps a control in a tooltip when there is content. */
export function ControlTooltip({
  content,
  side = 'top',
  children,
}: {
  content: ReactNode | undefined;
  side?: TooltipSide;
  children: ReactElement;
}) {
  if (content === undefined) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </Tooltip>
  );
}

function swallowClick(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * Props for a disabled control. A native `disabled` button gets no hover or
 * focus, so its tooltip would never open. With a tooltip the control is
 * soft-disabled instead: `aria-disabled`, still focusable, clicks swallowed.
 * Spread after the consumer's props so `onClick` is replaced.
 */
export function disabledProps(
  disabled: boolean | undefined,
  hasTooltip: boolean
) {
  if (!disabled) return {};

  if (!hasTooltip) return { disabled: true };

  return {
    'aria-disabled': true,
    'data-disabled': '',
    onClick: swallowClick,
  } as const;
}
