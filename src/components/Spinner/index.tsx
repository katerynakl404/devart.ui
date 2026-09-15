'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircleIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils';

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      xs: 'size-3',
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
      xl: 'size-8',
    },
    color: {
      primary: 'text-brand-secondary',
      secondary: 'text-ink-secondary',
      muted: 'text-ink-inactive',
      accent: 'text-brand-primary',
      success: 'text-fb-green',
      destructive: 'text-fb-red-text',
      warning: 'text-fb-attention',
      white: 'text-content-on-solid',
      inherit: 'text-inherit',
    },
  },
  defaultVariants: {
    size: 'sm',
    color: 'primary',
  },
});

export interface SpinnerProps
  extends Omit<ComponentProps<'svg'>, 'color'>,
    VariantProps<typeof spinnerVariants> {
  /** Accessible label announced while the spinner is visible. */
  label?: string;
}

function Spinner({
  className,
  size,
  color,
  label = 'Loading',
  ...props
}: SpinnerProps) {
  return (
    <LoaderCircleIcon
      role="status"
      aria-label={label}
      strokeLinecap="butt"
      // reference draws the arc at 2.5, not lucide's default 2
      strokeWidth={2.5}
      className={cn(spinnerVariants({ size, color }), className)}
      {...props}
    />
  );
}

export { Spinner, spinnerVariants };
