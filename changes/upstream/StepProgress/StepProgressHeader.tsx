/**
 * The developers' `StepProgressHeader.tsx` of `StepProgress`, frozen at their 1.4.0 —
 * `git show f69ebc9:src/components/StepProgress/StepProgressHeader.tsx`, import paths
 * alone changed. See `StepProgress.tsx` beside it. Not edited.
 */

import type { ReactNode } from 'react';
import { Typography } from '../../../src/components/Typography';
import { cva } from '../../../src/lib/cva';
import { cn } from '../../../src/lib/utils';

const stepProgressHeaderVariants = cva('flex min-w-0 items-center gap-3', {
  variants: {
    stretched: {
      true: 'justify-between',
      false: '',
    },
  },
  defaultVariants: {
    stretched: false,
  },
});

const stepProgressTitleVariants = cva('truncate text-xs');

interface StepProgressHeaderProps {
  label?: ReactNode;
  stepTitle?: string;
  isStretched: boolean;
}

const StepProgressHeader = ({
  label,
  stepTitle,
  isStretched,
}: StepProgressHeaderProps) => (
  <div
    data-slot="step-progress-header"
    className={cn(stepProgressHeaderVariants({ stretched: isStretched }))}
  >
    {label != null && (
      <Typography
        element="span"
        variant="p"
        textColor="secondary"
        noWrap
        aria-live="polite"
        data-slot="step-progress-label"
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
  stepProgressTitleVariants,
};
