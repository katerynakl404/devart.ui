/**
 * The developers' `StepProgressBar.tsx` of `StepProgress`, frozen at their 1.4.0 —
 * `git show f69ebc9:src/components/StepProgress/StepProgressBar.tsx`, import paths
 * alone changed. See `StepProgress.tsx` beside it. Not edited.
 */

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../src/components/Tooltip';
import { cva } from '../../../src/lib/cva';
import { cn } from '../../../src/lib/utils';
import type { StepProgressStep } from './types';

const stepProgressStepVariants = cva(
  'group/step flex items-center rounded border-0 bg-transparent p-0',
  {
    variants: {
      stretched: {
        true: 'flex-1',
        false: 'flex-none px-0.5 py-2.5',
      },
      interactive: {
        true: cn(
          'cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',
          'focus-visible:ring-focus-ring-brand'
        ),
        false: '',
      },
    },
    compoundVariants: [
      { stretched: true, interactive: true, class: '-my-1.5 py-1.5' },
    ],
    defaultVariants: {
      stretched: false,
      interactive: true,
    },
  }
);

const stepProgressBarVariants = cva(
  [
    'h-1 rounded-full',
    'transition-colors duration-fast motion-reduce:transition-none',
  ],
  {
    variants: {
      filled: {
        true: 'bg-brand-primary',
        false: 'bg-stroke',
      },
      stretched: {
        true: 'w-full',
        false: 'w-6',
      },
      interactive: {
        true: '',
        false: '',
      },
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
    defaultVariants: {
      filled: false,
      stretched: false,
      interactive: true,
    },
  }
);

interface StepProgressBarProps {
  step: StepProgressStep;
  isCurrent: boolean;
  isStretched: boolean;
  onSelect?: () => void;
}

const StepProgressBar = ({
  step,
  isCurrent,
  isStretched,
  onSelect,
}: StepProgressBarProps) => {
  const isInteractive = onSelect != null;
  const isFilled = Boolean(step.done) || isCurrent;
  const stepClassName = cn(
    stepProgressStepVariants({
      stretched: isStretched,
      interactive: isInteractive,
    })
  );
  const bar = (
    <span
      aria-hidden
      data-slot="step-progress-bar"
      className={cn(
        stepProgressBarVariants({
          filled: isFilled,
          stretched: isStretched,
          interactive: isInteractive,
        })
      )}
    />
  );

  if (!isInteractive) {
    return (
      <span
        aria-hidden
        data-slot="step-progress-step"
        className={stepClassName}
      >
        {bar}
      </span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          data-slot="step-progress-step"
          aria-label={step.ariaLabel ?? step.title}
          aria-current={isCurrent ? 'step' : undefined}
          className={stepClassName}
          onClick={onSelect}
        >
          {bar}
        </button>
      </TooltipTrigger>

      <TooltipContent>{step.title}</TooltipContent>
    </Tooltip>
  );
};

export { StepProgressBar, stepProgressBarVariants, stepProgressStepVariants };
