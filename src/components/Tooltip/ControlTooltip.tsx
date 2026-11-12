'use client';

import type { MouseEvent, ReactElement, ReactNode } from 'react';
import { Tooltip, TooltipTrigger } from './index';
import { TooltipContent } from './TooltipContent';

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

/** Content for a `tooltip` prop; `true` uses the label. */
export function resolveTooltip(
  tooltip: ReactNode | true | undefined,
  label: ReactNode
): ReactNode | undefined {
  const content = tooltip === true ? label : tooltip;
  const empty =
    content === undefined ||
    content === null ||
    content === false ||
    content === '';
  return empty ? undefined : content;
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

/** Keeps a disabled control with a tooltip focusable. */
export function inertForTooltip<E extends Element>(
  disabled: boolean | undefined,
  hasTooltip: boolean,
  onClick: ((event: MouseEvent<E>) => void) | undefined
): {
  disabled: boolean | undefined;
  'aria-disabled'?: true;
  onClick: ((event: MouseEvent<E>) => void) | undefined;
} {
  if (!disabled || !hasTooltip) return { disabled, onClick };
  return {
    disabled: undefined,
    'aria-disabled': true,
    onClick: (event) => {
      event.preventDefault();
      event.stopPropagation();
    },
  };
}
