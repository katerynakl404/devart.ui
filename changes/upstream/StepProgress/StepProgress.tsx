'use client';

/**
 * The developers' `StepProgress`, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/StepProgress/StepProgress.tsx`, import paths alone
 * changed; its three siblings here are copied the same way. The Before half of
 * the StepProgress page renders these files, so it is the component the
 * developer storybook ships, not a drawing of it. Not edited: replace them
 * whole when the base moves.
 */

import { cva } from '../../../src/lib/cva';
import { cn } from '../../../src/lib/utils';
import { StepProgressBar } from './StepProgressBar';
import { StepProgressHeader } from './StepProgressHeader';
import type { StepProgressLabelPosition, StepProgressProps } from './types';

const STRETCHED_POSITIONS: readonly StepProgressLabelPosition[] = [
  'top',
  'bottom',
];

const stepProgressVariants = cva('flex min-w-0', {
  variants: {
    labelPosition: {
      right: 'h-5 flex-row items-center gap-3',
      left: 'h-5 flex-row-reverse items-center justify-end gap-3',
      top: 'flex-col-reverse gap-2',
      bottom: 'flex-col gap-2',
    },
  },
  defaultVariants: {
    labelPosition: 'right',
  },
});

const stepProgressStepsVariants = cva('flex', {
  variants: {
    stretched: {
      true: 'w-full gap-1.5',
      false: 'flex-none',
    },
  },
  defaultVariants: {
    stretched: false,
  },
});

const StepProgress = ({
  steps,
  current,
  label,
  labelPosition = 'right',
  showStepTitle = false,
  'aria-label': ariaLabel,
  className,
  ref,
  onStepSelect,
  ...props
}: StepProgressProps) => {
  const isStretched = STRETCHED_POSITIONS.includes(labelPosition);
  const stepTitle = showStepTitle ? steps[current]?.title : undefined;
  const hasHeader = label != null || Boolean(stepTitle);

  return (
    <div
      ref={ref}
      data-slot="step-progress"
      data-label-position={labelPosition}
      className={cn(stepProgressVariants({ labelPosition }), className)}
      {...props}
    >
      <fieldset
        aria-label={ariaLabel}
        data-slot="step-progress-steps"
        className={cn(stepProgressStepsVariants({ stretched: isStretched }))}
      >
        {steps.map((step, index) => (
          <StepProgressBar
            // biome-ignore lint/suspicious/noArrayIndexKey: position is the identity
            key={index}
            step={step}
            isCurrent={index === current}
            isStretched={isStretched}
            onSelect={onStepSelect ? () => onStepSelect(index) : undefined}
          />
        ))}
      </fieldset>

      {hasHeader && (
        <StepProgressHeader
          label={label}
          stepTitle={stepTitle}
          isStretched={isStretched}
        />
      )}
    </div>
  );
};

StepProgress.displayName = 'StepProgress';

export { StepProgress, stepProgressStepsVariants, stepProgressVariants };
