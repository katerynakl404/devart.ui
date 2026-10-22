'use client';

import { type ComponentPropsWithRef, Fragment, type ReactNode } from 'react';
import { cva } from '../../lib/cva';
import { cn, focusRing } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

export interface StepProgressStep {
  /** The step's short name: its bar's tooltip, and the bar's name without `ariaLabel`. */
  title: string;
  /** Fills the bar. The current step's bar is filled either way. */
  done?: boolean;
  /** The bar button's accessible name. @default title */
  ariaLabel?: string;
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

/* The button is the 28×24 target; the 24×4 bar inside it is the mark. The 2px
   side padding of neighbouring buttons is what spaces the bars 4px apart.
   Filling the width, the bars sit 6px apart and a button keeps a 16px target
   by bleeding its padding back out with a negative margin. Read-only (no
   `onStepSelect`), a step is a plain span: no pointer, no focus ring. */
const stepProgressStepVariants = cva(
  'group/step flex flex-none items-center rounded border-0 bg-transparent',
  {
    variants: {
      fill: { false: 'px-0.5 py-2.5', true: 'p-0' },
      interactive: { true: cn('cursor-pointer', focusRing), false: '' },
    },
    compoundVariants: [
      { fill: true, interactive: true, class: '-my-1.5 px-0 py-1.5' },
    ],
    defaultVariants: { fill: false, interactive: true },
  }
);

/* Done and current share Brand/Primary; the rest is the hairline colour. A bar
   that is a button answers the pointer: the brand ones Brand/Hover, the empty
   ones the card hover border. */
const stepProgressBarVariants = cva(
  [
    'h-1 rounded-full',
    'transition-colors duration-fast motion-reduce:transition-none',
  ],
  {
    variants: {
      filled: { true: 'bg-brand-primary', false: 'bg-stroke' },
      fill: { false: 'w-6', true: 'w-full' },
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
    defaultVariants: { filled: false, fill: false, interactive: true },
  }
);

/* The position in words — Body/M on Text/Secondary, never wrapping; `sm`
   steps the type down. */
const stepProgressLabelVariants = cva('whitespace-nowrap text-ink-secondary', {
  variants: { size: { md: 'text-sm', sm: 'text-xs' } },
  defaultVariants: { size: 'md' },
});

/* The current step's title is a caption at every size — Text/Secondary 400 at
   12px, beside the label. At 14px it read brighter than the same name in a
   coachmark (user, 2026-10-16), so the size no longer follows `size`. The
   `size` key stays so call sites keep one shape for both parts. */
const stepProgressTitleVariants = cva(
  'truncate font-normal text-ink-secondary text-xs',
  {
    variants: { size: { md: '', sm: '' } },
    defaultVariants: { size: 'md' },
  }
);

export interface StepProgressProps
  extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'aria-label'> {
  steps: StepProgressStep[];
  /** 0-based index of the step on screen. Its bar is filled. */
  current: number;
  /**
   * The position in words beside the bars ("Question 2 of 4"), announced
   * politely. `null` renders none; left out, `counter` writes it.
   */
  label?: ReactNode;
  /** Names the group of bars. */
  'aria-label': string;
  /**
   * Called with a bar's index when it is pressed. Without it the bars are
   * read-only: plain marks hidden from assistive tech, with no tooltips.
   */
  onStepSelect?: (index: number) => void;
  /**
   * Writes the label when `label` is left out.
   * @default (n, total) => `Step ${n} of ${total}`
   */
  counter?: (n: number, total: number) => ReactNode;
  /** The current step's `title` — at the end of the header (`fill`) or after the label. */
  showStepTitle?: boolean;
  /** Bars share the full width, with the label above them. Default: 24px bars inline. */
  fill?: boolean;
  /** `sm` is the compact read-out a coachmark carries. @default 'md' */
  size?: 'md' | 'sm';
}

const defaultCounter = (n: number, total: number) => `Step ${n} of ${total}`;

/**
 * A short bar per step with the position in words beside them. A bar fills
 * once its step is done or while it is the current one; with `onStepSelect`
 * every bar is a button that selects its step and names it in a tooltip.
 *
 * Unlike the headless `Stepper`, this only draws progress — the consumer owns
 * which step is current and renders its content. Interactive, it needs a
 * `TooltipProvider` above it.
 *
 * One atom for a question card's stepper, a setup wizard's header and a
 * tour's coachmark: `fill` puts the label over bars that share the width,
 * `size="sm"` is the coachmark's compact read-out, and without
 * `onStepSelect` the bars are decoration and the label speaks.
 */
const StepProgress = ({
  className,
  steps,
  current,
  label,
  'aria-label': ariaLabel,
  ref,
  onStepSelect,
  counter = defaultCounter,
  showStepTitle = false,
  fill = false,
  size = 'md',
  ...props
}: StepProgressProps) => {
  const total = steps.length;
  const interactive = Boolean(onStepSelect);
  const currentTitle = steps[current]?.title;
  const stepClass = stepProgressStepVariants({ fill, interactive });

  const bars = (
    <fieldset
      aria-label={ariaLabel}
      data-slot="step-progress-steps"
      className={stepProgressStepsVariants({ fill, size })}
      style={
        fill
          ? {
              gridTemplateColumns: `repeat(${Math.max(total, 1)}, minmax(0, 1fr))`,
            }
          : undefined
      }
    >
      {steps.map((step, index) => {
        const done = Boolean(step.done);
        const isCurrent = index === current;
        const state = done ? 'done' : isCurrent ? 'current' : 'upcoming';
        const bar = (
          <span
            aria-hidden
            data-slot="step-progress-bar"
            className={stepProgressBarVariants({
              filled: done || isCurrent,
              fill,
              interactive,
            })}
          />
        );

        let node: ReactNode;

        if (!onStepSelect) {
          node = (
            <span
              data-slot="step-progress-step"
              data-state={state}
              aria-hidden="true"
              className={stepClass}
            >
              {bar}
            </span>
          );
        } else {
          const button = (
            <button
              type="button"
              data-slot="step-progress-step"
              data-state={state}
              aria-label={step.ariaLabel ?? step.title}
              aria-current={isCurrent ? 'step' : undefined}
              className={stepClass}
              onClick={() => onStepSelect(index)}
            >
              {bar}
            </button>
          );

          node = step.title ? (
            <Tooltip>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent side="top">{step.title}</TooltipContent>
            </Tooltip>
          ) : (
            button
          );
        }

        // biome-ignore lint/suspicious/noArrayIndexKey: position is the identity
        return <Fragment key={index}>{node}</Fragment>;
      })}
    </fieldset>
  );

  const labelNode =
    label === null ? null : (
      <span
        data-slot="step-progress-label"
        aria-live="polite"
        className={stepProgressLabelVariants({ size })}
      >
        {label === undefined ? counter(current + 1, total) : label}
      </span>
    );

  const titleNode =
    showStepTitle && currentTitle ? (
      <span
        data-slot="step-progress-title"
        className={stepProgressTitleVariants({ size })}
      >
        {currentTitle}
      </span>
    ) : null;

  const rootClass = cn(stepProgressVariants({ fill, size }), className);

  if (fill) {
    return (
      <div ref={ref} data-slot="step-progress" className={rootClass} {...props}>
        {labelNode || titleNode ? (
          <div
            data-slot="step-progress-head"
            className="flex min-w-0 items-center justify-between gap-3"
          >
            {labelNode}
            {titleNode}
          </div>
        ) : null}
        {bars}
      </div>
    );
  }

  return (
    <div ref={ref} data-slot="step-progress" className={rootClass} {...props}>
      {bars}
      {labelNode}
      {titleNode}
    </div>
  );
};

StepProgress.displayName = 'StepProgress';

export {
  StepProgress,
  stepProgressBarVariants,
  stepProgressLabelVariants,
  stepProgressStepsVariants,
  stepProgressStepVariants,
  stepProgressTitleVariants,
  stepProgressVariants,
};
