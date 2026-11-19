'use client';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { type ComponentPropsWithRef, type ReactNode, useId } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn, focusRing } from '../../lib/utils';

const radioVariants = cva(
  [
    'peer',
    'grid',
    'shrink-0',
    'place-content-center',
    'border-[1.5px]',
    'rounded-full',

    // Focus state
    focusRing,

    // Disabled state
    'disabled:cursor-not-allowed',
    'disabled:opacity-disabled',

    // Transition
    'transition-colors',
    'duration-fast',
    'ease-in-out',
  ],
  {
    variants: {
      variant: {
        primary: cn(
          // Unchecked state
          'bg-surface-card',
          'border-stroke-field-hover',
          'enabled:hover:border-ink-secondary',
          // Checked state
          'data-[state=checked]:bg-brand-primary',
          'data-[state=checked]:text-content-on-solid',
          'data-[state=checked]:border-transparent',
          'enabled:data-[state=checked]:hover:bg-brand-hover',
          // Error state
          'aria-invalid:border-input-error',
          'enabled:aria-invalid:hover:border-input-error',
          'aria-invalid:data-[state=checked]:border-transparent',
          'aria-invalid:data-[state=checked]:bg-input-error',
          'enabled:aria-invalid:data-[state=checked]:hover:bg-input-error'
        ),
      },
      size: {
        md: 'size-[18px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const radioIndicatorVariants = cva(
  [
    'grid',
    'place-content-center',
    'text-current',
    'fade-in-0',
    'zoom-in-95',
    'animate-in',
    'duration-fast',
  ],
  {
    variants: {
      size: {
        md: '[&>svg]:size-2.5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const radioContainerVariants = cva('flex w-fit items-center', {
  variants: {
    labelPosition: {
      left: 'flex-row',
      right: 'flex-row-reverse',
      top: 'flex-col-reverse',
      bottom: 'flex-col',
    },
    gap: {
      sm: 'gap-1.5',
      md: 'gap-2',
      lg: 'gap-3',
    },
  },
  defaultVariants: {
    labelPosition: 'right',
    gap: 'md',
  },
});

export interface RadioButtonProps
  extends ComponentPropsWithRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioVariants>,
    VariantProps<typeof radioContainerVariants> {
  label?: ReactNode;
  labelClassName?: string;
}

const RadioButton = ({
  id,
  className,
  variant,
  size,
  label,
  labelPosition,
  gap,
  labelClassName,
  disabled,
  ...props
}: RadioButtonProps) => {
  const generatedId = useId();
  const radioId = id ?? generatedId;

  const radioElement = (
    <RadioGroupPrimitive.Item
      id={radioId}
      disabled={disabled}
      className={cn(radioVariants({ variant, size }), !label && className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={cn(radioIndicatorVariants({ size }))}
      >
        <Circle className="fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );

  if (!label) {
    return radioElement;
  }

  return (
    <div
      className={cn(radioContainerVariants({ labelPosition, gap }), className)}
    >
      {radioElement}
      <label
        htmlFor={radioId}
        className={cn(
          'font-medium text-ink-body text-sm',
          disabled ? 'cursor-not-allowed opacity-disabled' : 'cursor-pointer',
          labelClassName
        )}
      >
        {label}
      </label>
    </div>
  );
};

RadioButton.displayName = 'RadioButton';

export type { RadioGroupProps } from './RadioGroup';
export { RadioGroup } from './RadioGroup';
export {
  RadioButton,
  radioContainerVariants,
  radioIndicatorVariants,
  radioVariants,
};
