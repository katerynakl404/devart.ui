/**
 * The developers' `types.ts` of `StepProgress`, frozen at their 1.4.0 —
 * `git show f69ebc9:src/components/StepProgress/types.ts`, import paths
 * alone changed. See `StepProgress.tsx` beside it. Not edited.
 */

import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface StepProgressStep {
  title: string;
  done?: boolean;
  ariaLabel?: string;
}

export type StepProgressLabelPosition = 'top' | 'right' | 'bottom' | 'left';

export interface StepProgressProps
  extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'aria-label'> {
  steps: StepProgressStep[];
  current: number;
  label?: ReactNode;
  labelPosition?: StepProgressLabelPosition;
  showStepTitle?: boolean;
  'aria-label': string;
  onStepSelect?: (index: number) => void;
}
