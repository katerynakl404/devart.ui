import type { ReactNode } from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';
import type { StepProgressSize } from './types';

/* `size="sm"` (extension): beside the bars, the label and the step's title
   sit 8px apart instead of 12. */
const stepProgressHeaderVariants = cva('flex min-w-0 items-center gap-3', {
  variants: {
    stretched: {
      true: 'justify-between',
      false: '',
    },
    size: {
      md: '',
      sm: '',
    },
  },
  compoundVariants: [{ stretched: false, size: 'sm', class: 'gap-2' }],
  defaultVariants: {
    stretched: false,
    size: 'md',
  },
});

/* Extension of this package: `sm` steps the label down from Body/M (14px) to
   12px. Merged over the label's `Typography` classes. */
const stepProgressLabelVariants = cva('', {
  variants: {
    size: {
      md: '',
      sm: 'text-xs',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const stepProgressTitleVariants = cva('truncate text-xs');

interface StepProgressHeaderProps {
  label?: ReactNode;
  stepTitle?: string;
  isStretched: boolean;
  size?: StepProgressSize;
}

const StepProgressHeader = ({
  label,
  stepTitle,
  isStretched,
  size = 'md',
}: StepProgressHeaderProps) => (
  <div
    data-slot="step-progress-header"
    className={cn(stepProgressHeaderVariants({ stretched: isStretched, size }))}
  >
    {label != null && (
      <Typography
        element="span"
        variant="p"
        textColor="secondary"
        noWrap
        aria-live="polite"
        data-slot="step-progress-label"
        className={cn(stepProgressLabelVariants({ size }))}
      >
        {label}
      </Typography>
    )}

    {stepTitle && (
      <Typography
        element="span"
        variant="p"
        textColor="secondary"
        data-slot="step-progress-title"
        className={cn(stepProgressTitleVariants())}
      >
        {stepTitle}
      </Typography>
    )}
  </div>
);

export {
  StepProgressHeader,
  stepProgressHeaderVariants,
  stepProgressLabelVariants,
  stepProgressTitleVariants,
};
