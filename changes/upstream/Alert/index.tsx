'use client';

/**
 * The developers' `Alert`, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/Alert/index.tsx`, import paths alone changed. The
 * Before half of the Alert page renders this file, so it is the component the
 * developer storybook ships, not a drawing of it. Not edited: replace it whole
 * when the base moves.
 */

import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cva, type VariantProps } from '../../../src/lib/cva';
import { cn } from '../../../src/lib/utils';

const alertVariants = cva(
  cn('flex items-start max-sm:flex-wrap', 'rounded-lg border'),
  {
    variants: {
      variant: {
        success: 'border-alert-border-success bg-alert-bg-success',
        info: 'border-alert-border-info bg-alert-bg-info',
        warning: 'border-alert-border-warning bg-alert-bg-warning',
        error: 'border-alert-border-error bg-alert-bg-error',
        neutral: 'border-stroke bg-surface-card2',
      },
      size: {
        sm: 'gap-2.5 px-3 py-2.5',
        md: 'gap-3 px-3.5 py-3',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'sm' },
  }
);

const alertIconVariants = cva('flex shrink-0', {
  variants: {
    variant: {
      success: 'text-fb-green',
      info: 'text-brand-tertiary',
      warning: 'text-fb-attention',
      error: 'text-fb-red-text',
      neutral: 'text-ink-secondary',
    },
    size: {
      sm: '[&_svg]:size-4',
      md: '[&_svg]:size-5',
    },
  },
  defaultVariants: { variant: 'neutral', size: 'sm' },
});

const alertTextVariants = cva('', {
  variants: {
    part: {
      title: 'font-semibold text-ink-primary',
      description: 'font-normal text-ink-secondary',
    },
    size: {
      sm: 'text-xs leading-4',
      md: 'text-sm leading-5',
    },
  },
  defaultVariants: { part: 'title', size: 'sm' },
});

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title: string;
  description?: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  icon?: ReactNode;
  iconClassName?: string;
  actions?: ReactNode;
  actionsClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

const Alert = ({
  title,
  description,
  titleClassName,
  descriptionClassName,
  icon,
  iconClassName,
  actions,
  actionsClassName,
  variant,
  size,
  className,
  ref,
  ...props
}: AlertProps) => (
  // biome-ignore lint/a11y/useSemanticElements: <output> is a phrasing-only form result, not a block notice
  <div
    ref={ref}
    role="status"
    className={cn(alertVariants({ variant, size }), className)}
    {...props}
  >
    {icon ? (
      <span
        aria-hidden="true"
        className={cn(alertIconVariants({ variant, size }), iconClassName)}
      >
        {icon}
      </span>
    ) : null}

    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span
        className={cn(
          alertTextVariants({ part: 'title', size }),
          titleClassName
        )}
      >
        {title}
      </span>

      {description ? (
        <span
          className={cn(
            alertTextVariants({ part: 'description', size }),
            descriptionClassName
          )}
        >
          {description}
        </span>
      ) : null}
    </div>

    {actions ? (
      <div
        className={cn(
          'flex shrink-0 items-center gap-1.5 self-center',
          'max-sm:w-full max-sm:self-start max-sm:pl-6',
          actionsClassName
        )}
      >
        {actions}
      </div>
    ) : null}
  </div>
);

Alert.displayName = 'Alert';

export { Alert, alertIconVariants, alertTextVariants, alertVariants };
