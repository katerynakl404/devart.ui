import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface StepProgressStep {
  title: string;
  done?: boolean;
  ariaLabel?: string;
}

export type StepProgressLabelPosition = 'top' | 'right' | 'bottom' | 'left';

/**
 * Extension of this package: `sm` is the compact read-out a tour's card
 * carries — the label one type step down, the gaps one step tighter.
 */
export type StepProgressSize = 'md' | 'sm';

export interface StepProgressProps
  extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'aria-label'> {
  steps: StepProgressStep[];
  current: number;
  label?: ReactNode;
  labelPosition?: StepProgressLabelPosition;
  showStepTitle?: boolean;
  'aria-label': string;
  onStepSelect?: (index: number) => void;
  /** Extension of this package. @default 'md' */
  size?: StepProgressSize;
}
