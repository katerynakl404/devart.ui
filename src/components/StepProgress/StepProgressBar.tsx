import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
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

/** Extension of this package: where a step stands, on its `data-state`. */
const toStepState = (step: StepProgressStep, isCurrent: boolean) => {
  if (step.done) return 'done';

  return isCurrent ? 'current' : 'upcoming';
};

const StepProgressBar = ({
  step,
  isCurrent,
  isStretched,
  onSelect,
}: StepProgressBarProps) => {
  const isInteractive = onSelect != null;
  const isFilled = Boolean(step.done) || isCurrent;
  const state = toStepState(step, isCurrent);
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
        data-state={state}
        className={stepClassName}
      >
        {bar}
      </span>
    );
  }

  const button = (
    <button
      type="button"
      data-slot="step-progress-step"
      data-state={state}
      aria-label={step.ariaLabel ?? step.title}
      aria-current={isCurrent ? 'step' : undefined}
      className={stepClassName}
      onClick={onSelect}
    >
      {bar}
    </button>
  );

  /* Extension of this package: a step with no title has nothing to say in a
     tooltip, so it gets none rather than an empty bubble. */
  if (!step.title) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>

      <TooltipContent>{step.title}</TooltipContent>
    </Tooltip>
  );
};

export { StepProgressBar, stepProgressBarVariants, stepProgressStepVariants };
