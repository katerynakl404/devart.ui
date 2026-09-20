'use client';

import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';

/**
 * One step on the rail. `id` is the key and the `aria-controls` target when the
 * rail drives a tab set; `label` is what the user reads.
 */
export interface StepperIndicatorStep {
  id: string;
  label: ReactNode;
}

export interface StepperIndicatorProps {
  steps: StepperIndicatorStep[];
  /** Index of the active step (0-based). */
  current: number;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Which steps can be jumped to.
   *
   * `completed` (the default) is the create-flow rule: going back to correct a
   * port is normal, going forward is not — offering a step you have not reached
   * turns the sequence into a suggestion, and the reason the sequence exists is
   * that the later steps depend on the earlier ones. `all` suits an edit flow,
   * `none` a progress read-out with no navigation at all.
   *
   * @default 'completed'
   */
  navigable?: 'completed' | 'all' | 'none';
  onStepSelect?: (index: number) => void;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** Names the rail for assistive tech. @default 'Progress' */
  'aria-label'?: string;
  className?: string;
}

const MARKER = {
  sm: 'size-5 text-xs',
  md: 'size-7 text-sm',
} as const;

const GLYPH = { sm: 12, md: 14 } as const;

/**
 * The visual rail for `Stepper`.
 *
 * `Stepper` is headless — it owns the index and hands it to a render function —
 * so until now every consumer drew its own numbered circles out of raw
 * utilities, including the package's own story. Three products drawing the same
 * three states from scratch is three chances to pick a different fill for
 * "done". This is that rail, once, on system tokens.
 *
 * Deliberately uncoupled from `Stepper`: it takes `current` and reports a
 * selection, so it also sits on top of a tab set or any other index the page
 * already owns.
 */
function StepperIndicator({
  steps,
  current,
  orientation = 'horizontal',
  navigable = 'completed',
  onStepSelect,
  size = 'md',
  'aria-label': ariaLabel = 'Progress',
  className,
}: StepperIndicatorProps) {
  return (
    <ol
      aria-label={ariaLabel}
      className={cn(
        'flex gap-2',
        orientation === 'vertical'
          ? 'flex-col items-start'
          : 'flex-row flex-wrap items-center',
        className
      )}
    >
      {steps.map((step, index) => {
        const isDone = index < current;
        const isActive = index === current;
        const canGo =
          navigable === 'all' ||
          (navigable === 'completed' && (isDone || isActive));
        const interactive = canGo && Boolean(onStepSelect) && !isActive;

        return (
          <li key={step.id} className="flex items-center gap-2">
            {index > 0 ? (
              <span
                aria-hidden
                className={cn(
                  'bg-stroke',
                  orientation === 'vertical' ? 'ms-3 h-4 w-px' : 'h-px w-6'
                )}
              />
            ) : null}

            <button
              type="button"
              disabled={!interactive}
              aria-current={isActive ? 'step' : undefined}
              onClick={() => interactive && onStepSelect?.(index)}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1',
                'transition-colors duration-fast',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page',
                interactive
                  ? 'cursor-pointer hover:bg-state-hover'
                  : // A step you cannot go to is not a broken button — it is
                    // not a button. No dimming, because the marker and the
                    // label already carry the state.
                    'cursor-default disabled:pointer-events-none'
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-full font-medium',
                  MARKER[size],
                  isActive && 'bg-brand-primary text-content-on-solid',
                  isDone && 'bg-state-pressed text-ink-body',
                  !isActive && !isDone && 'bg-state-disabled text-ink-inactive'
                )}
              >
                {isDone ? <Check size={GLYPH[size]} /> : index + 1}
              </span>

              <Typography
                element="span"
                textStyle="label14"
                // `light` IS ink-inactive. There is no `inactive` key —
                // Typography silently emits no colour class for one, which is
                // how an upcoming step ended up simply inheriting its parent.
                textColor={isActive ? 'primary' : isDone ? 'body' : 'light'}
              >
                {step.label}
              </Typography>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

StepperIndicator.displayName = 'StepperIndicator';

export { StepperIndicator };
