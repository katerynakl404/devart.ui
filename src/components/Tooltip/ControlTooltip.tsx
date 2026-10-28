'use client';

import type { MouseEvent, ReactElement, ReactNode } from 'react';
import { Tooltip, TooltipTrigger } from './index';
import { TooltipContent } from './TooltipContent';

/** Where a control's own tooltip opens. */
export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * What a control's `tooltip` prop shows: `true` → the control's accessible
 * name (`aria-label`), a node → that node. `undefined` when there is nothing
 * to show, so the control renders without a tooltip at all.
 */
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

/**
 * The one implementation behind `tooltip` on `IconButton`, `Button` and
 * `Switch` (2026-10-27): the control is the trigger itself (`asChild`), so
 * hover and keyboard focus open the tooltip and Radix points the control's
 * `aria-describedby` at it while it is open. Without `content` it returns the
 * control untouched. Needs a `TooltipProvider` above it, as every `Tooltip`
 * does.
 */
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

/**
 * A switched-off control that has a tooltip keeps it (2026-10-27).
 *
 * `disabled` takes a button out of the tab order and, in the browsers the
 * products run in, out of hover too — so the tooltip saying WHY the control
 * is off reached nobody, and pages wrapped the control in a focusable span to
 * hold the tooltip instead. With a tooltip the control is rendered
 * `aria-disabled` rather than `disabled`: it stays in the tab order, a screen
 * reader announces it as unavailable and reads the reason, and every recipe
 * paints `aria-disabled` as it paints `disabled`. The click is swallowed here
 * — default prevented (no form submit, no Radix toggle) and propagation
 * stopped (no row behind it opens) — so it still does nothing, as `disabled`
 * did.
 *
 * Returns what to render in place of the caller's `disabled` and `onClick`;
 * unchanged when the control is enabled or has no tooltip.
 */
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
