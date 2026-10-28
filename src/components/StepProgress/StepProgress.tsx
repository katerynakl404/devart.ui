'use client';

import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { StepProgressBar } from './StepProgressBar';
import { StepProgressHeader } from './StepProgressHeader';
import type { StepProgressLabelPosition, StepProgressProps } from './types';

const STRETCHED_POSITIONS: readonly StepProgressLabelPosition[] = [
  'top',
  'bottom',
];

/* `size` is this package's extension: `sm` tightens the gap between the bars
   and the label one step — 12 → 8 beside them, 8 → 6 above or below. */
const stepProgressVariants = cva('flex min-w-0', {
  variants: {
    labelPosition: {
      right: 'h-5 flex-row items-center gap-3',
      left: 'h-5 flex-row-reverse items-center justify-end gap-3',
      top: 'flex-col-reverse gap-2',
      bottom: 'flex-col gap-2',
    },
    size: {
      md: '',
      sm: '',
    },
  },
  compoundVariants: [
    { labelPosition: ['right', 'left'], size: 'sm', class: 'gap-2' },
    { labelPosition: ['top', 'bottom'], size: 'sm', class: 'gap-1.5' },
  ],
  defaultVariants: {
    labelPosition: 'right',
    size: 'md',
  },
});

/* `size="sm"` (extension): stretched bars sit 4px apart instead of 6. */
const stepProgressStepsVariants = cva('flex', {
  variants: {
    stretched: {
      true: 'w-full gap-1.5',
      false: 'flex-none',
    },
    size: {
      md: '',
      sm: '',
    },
  },
  compoundVariants: [{ stretched: true, size: 'sm', class: 'gap-1' }],
  defaultVariants: {
    stretched: false,
    size: 'md',
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
  size = 'md',
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
      className={cn(stepProgressVariants({ labelPosition, size }), className)}
      {...props}
    >
      <fieldset
        aria-label={ariaLabel}
        data-slot="step-progress-steps"
        className={cn(
          stepProgressStepsVariants({ stretched: isStretched, size })
        )}
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
          size={size}
        />
      )}
    </div>
  );
};

StepProgress.displayName = 'StepProgress';

export { StepProgress, stepProgressStepsVariants, stepProgressVariants };
