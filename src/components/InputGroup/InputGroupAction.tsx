'use client';

import type { ComponentProps } from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { useInputGroup } from './InputGroupContext';

const inputGroupActionVariants = cva(
  cn(
    'inline-flex shrink-0 items-center justify-center',
    'p-0',
    'rounded-sm border-none bg-transparent',
    'cursor-pointer',
    'text-ink-secondary transition-colors enabled:hover:text-ink-primary',
    '[&>svg]:shrink-0',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',
    'disabled:pointer-events-none disabled:text-ink-inactive'
  ),
  {
    variants: {
      size: {
        xs: 'size-3.5 [&>svg]:size-3.5',
        sm: 'size-6 [&>svg]:size-4',
        md: 'size-6 [&>svg]:size-4',
        lg: 'size-6 [&>svg]:size-4',
        xl: 'size-6 [&>svg]:size-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Trailing action of a field, such as clear or reveal: a bare button with a
 * 24px hit area around a 16px glyph that reacts by colour only.
 * Place it as a direct child of InputGroup, after the input — not inside an addon.
 */
function InputGroupAction({
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'>) {
  const { size } = useInputGroup();

  return (
    <button
      type={type}
      data-slot="input-group-action"
      className={cn(inputGroupActionVariants({ size }), className)}
      {...props}
    />
  );
}

export { InputGroupAction, inputGroupActionVariants };
