'use client';

import { Fragment, type ReactNode, type Ref } from 'react';
import { cva } from '../../lib/cva';
import { cn, focusRing } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

/** One step. `label` is its short name: the bar's tooltip and the current step's read-out. */
export interface StepProgressStep {
  id: string;
  label?: string;
}

export interface StepProgressProps {
  steps: StepProgressStep[];
  /** 0-based index of the step on screen. @default 0 */
  current?: number;
  /** Which bars count as done. A filled bar = done OR current. @default i < current */
  isStepDone?: (index: number) => boolean;
  /** The read-out. @default (n, total) => `Step ${n} of ${total}` */
  counter?: (n: number, total: number) => ReactNode;
  /** The current step's label — at the end of the header (`fill`) or after the counter. */
  showStepLabel?: boolean;
  /** Bars share the full width with the header above them. Default: 24px bars inline. */
  fill?: boolean;
  /** Makes every bar a button (its tooltip is the step's label). */
  onStepSelect?: (index: number) => void;
  /** A bar button's accessible name. */
  getStepAriaLabel?: (
    index: number,
    state: { done: boolean; current: boolean }
  ) => string;
  /** `sm` is the compact read-out a coachmark carries. @default 'md' */
  size?: 'md' | 'sm';
  /** Names the bar group. @default 'Steps' */
  'aria-label'?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

/* Gaps: 12 inline / 8 over the bars (fill); `sm` one step tighter in both. */
const stepProgressVariants = cva('flex min-w-0', {
  variants: {
    fill: {
      false: 'h-5 items-center gap-3',
      true: 'flex-col items-stretch gap-2',
    },
    size: { md: '', sm: '' },
  },
  compoundVariants: [
    { fill: false, size: 'sm', class: 'gap-2' },
    { fill: true, size: 'sm', class: 'gap-1.5' },
  ],
  defaultVariants: { fill: false, size: 'md' },
});

const stepProgressStepsVariants = cva('flex-none', {
  variants: {
    fill: { false: 'flex', true: 'grid gap-1.5' },
    size: { md: '', sm: '' },
  },
  compoundVariants: [{ fill: true, size: 'sm', class: 'gap-1' }],
  defaultVariants: { fill: false, size: 'md' },
});

/* A 24px-tall target per step (10 + 4 + 10); the 4px bar inside it is the
   mark. Filling the width, the bars sit 6px apart and a button keeps a 16px
   target by bleeding its padding back out with a negative margin. */
const stepProgressStepVariants = cva(
  'group/step flex flex-none items-center rounded-md border-0 bg-transparent',
  {
    variants: {
      fill: { false: 'px-0.5 py-2.5', true: 'p-0' },
      interactive: { true: cn('cursor-pointer', focusRing), false: '' },
    },
    compoundVariants: [
      { fill: true, interactive: true, class: '-my-1.5 px-0 py-1.5' },
    ],
    defaultVariants: { fill: false, interactive: false },
  }
);

/* Done and current share Brand/Primary; the rest is the hairline colour. A bar
   that is a button answers the pointer: the brand ones a step deeper, the
   empty ones with the card hover border. */
const stepProgressBarVariants = cva(
  'h-1 rounded-full transition-colors duration-fast',
  {
    variants: {
      filled: { true: 'bg-brand-primary', false: 'bg-stroke' },
      fill: { true: 'w-full', false: 'w-6' },
      interactive: { true: '', false: '' },
    },
    compoundVariants: [
      {
        filled: true,
        interactive: true,
        class: 'group-hover/step:bg-brand-hover',
      },
      {
        filled: false,
        interactive: true,
        class: 'group-hover/step:bg-card-border-hover',
      },
    ],
    defaultVariants: { filled: false, fill: false, interactive: false },
  }
);

const stepProgressCounterVariants = cva(
  'whitespace-nowrap text-ink-secondary',
  {
    variants: { size: { md: 'text-sm', sm: 'text-xs' } },
    defaultVariants: { size: 'md' },
  }
);

/* The current step's name is a caption at every size — Text/Secondary 400 at
   12px, beside the counter. At 14px it read brighter than the same name in a
   coachmark (user, 2026-10-16), so the size no longer follows `size`. The
   `size` key stays so call sites keep one shape for both parts. */
const stepProgressLabelVariants = cva(
  'truncate font-normal text-ink-secondary text-xs',
  {
    variants: { size: { md: '', sm: '' } },
    defaultVariants: { size: 'md' },
  }
);

const defaultCounter = (n: number, total: number) => `Step ${n} of ${total}`;

/**
 * A bar per step and "Step N of M": where a multi-step flow stands.
 *
 * One atom for a question card's stepper, a setup wizard's header and a
 * tour's coachmark. Read-only by default — the bars are decoration and the
 * counter speaks (`aria-live="polite"`). With `onStepSelect` each bar becomes
 * a button named by `getStepAriaLabel`, with the step's label as its tooltip
 * (the page provides the `TooltipProvider`).
 */
function StepProgress({
  steps,
  current = 0,
  isStepDone,
  counter = defaultCounter,
  showStepLabel = false,
  fill = false,
  onStepSelect,
  getStepAriaLabel,
  size = 'md',
  'aria-label': ariaLabel = 'Steps',
  className,
  ref,
}: StepProgressProps) {
  const total = steps.length;
  const isDone = isStepDone ?? ((index: number) => index < current);
  const interactive = Boolean(onStepSelect);
  const currentLabel = steps[current]?.label;

  const bars = (
    // biome-ignore lint/a11y/useSemanticElements: an inline run of bars inside a flex row — a `<fieldset>` would bring form semantics and UA chrome
    <span
      data-slot="step-progress-steps"
      role="group"
      aria-label={ariaLabel}
      className={cn(stepProgressStepsVariants({ fill, size }))}
      style={
        fill
          ? {
              gridTemplateColumns: `repeat(${Math.max(total, 1)}, minmax(0, 1fr))`,
            }
          : undefined
      }
    >
      {steps.map((step, index) => {
        const done = Boolean(isDone(index));
        const isCurrent = index === current;
        const bar = (
          <span
            data-slot="step-progress-bar"
            className={cn(
              stepProgressBarVariants({
                filled: done || isCurrent,
                fill,
                interactive,
              })
            )}
          />
        );
        const stepClass = cn(stepProgressStepVariants({ fill, interactive }));

        if (!onStepSelect) {
          return (
            <span
              key={step.id || index}
              data-slot="step-progress-step"
              data-state={done ? 'done' : isCurrent ? 'current' : 'upcoming'}
              aria-hidden="true"
              className={stepClass}
            >
              {bar}
            </span>
          );
        }

        const name = getStepAriaLabel
          ? getStepAriaLabel(index, { done, current: isCurrent })
          : `${step.label ? `${step.label}, ` : ''}step ${index + 1} of ${total}${
              done ? ', completed' : ''
            }`;
        const button = (
          <button
            type="button"
            data-slot="step-progress-step"
            data-state={done ? 'done' : isCurrent ? 'current' : 'upcoming'}
            aria-current={isCurrent ? 'step' : undefined}
            aria-label={name}
            className={stepClass}
            onClick={() => onStepSelect(index)}
          >
            {bar}
          </button>
        );

        return (
          <Fragment key={step.id || index}>
            {step.label ? (
              <Tooltip>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="top">{step.label}</TooltipContent>
              </Tooltip>
            ) : (
              button
            )}
          </Fragment>
        );
      })}
    </span>
  );

  const count = (
    <span
      data-slot="step-progress-counter"
      aria-live="polite"
      className={cn(stepProgressCounterVariants({ size }))}
    >
      {counter(current + 1, total)}
    </span>
  );

  const label =
    showStepLabel && currentLabel ? (
      <span
        data-slot="step-progress-label"
        className={cn(stepProgressLabelVariants({ size }))}
      >
        {currentLabel}
      </span>
    ) : null;

  const rootClass = cn(stepProgressVariants({ fill, size }), className);

  if (fill) {
    return (
      <div ref={ref} data-slot="step-progress" className={rootClass}>
        <div
          data-slot="step-progress-head"
          className="flex min-w-0 items-center justify-between gap-3"
        >
          {count}
          {label}
        </div>
        {bars}
      </div>
    );
  }

  return (
    <div ref={ref} data-slot="step-progress" className={rootClass}>
      {bars}
      {count}
      {label}
    </div>
  );
}

StepProgress.displayName = 'StepProgress';

export {
  StepProgress,
  stepProgressBarVariants,
  stepProgressCounterVariants,
  stepProgressLabelVariants,
  stepProgressStepsVariants,
  stepProgressStepVariants,
  stepProgressVariants,
};
