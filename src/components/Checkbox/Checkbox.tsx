'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check } from 'lucide-react';
import { type ComponentPropsWithRef, type ReactNode, useId } from 'react';

import { cn, formFocusRing } from '../../lib/utils';

export type CheckedState = CheckboxPrimitive.CheckedState;

const checkboxVariants = cva(
  [
    'peer',
    'grid',
    'shrink-0',
    'place-content-center',
    'border-[1.5px]',
    // Focus state — neutral ring with a Surface/Card gap
    formFocusRing,
    // Disabled state — unified opacity recipe
    'disabled:pointer-events-none',
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
          'border-stroke-field-hover bg-surface-card',
          'enabled:hover:border-ink-secondary',
          // Checked state
          'data-[state=checked]:border-brand-primary',
          'data-[state=checked]:bg-brand-primary',
          'data-[state=checked]:text-content-on-solid',
          'enabled:data-[state=checked]:hover:border-brand-hover',
          'enabled:data-[state=checked]:hover:bg-brand-hover',
          // Indeterminate state
          'data-[state=indeterminate]:border-brand-primary',
          'data-[state=indeterminate]:bg-brand-primary',
          'data-[state=indeterminate]:text-content-on-solid',
          'enabled:data-[state=indeterminate]:hover:border-brand-hover',
          'enabled:data-[state=indeterminate]:hover:bg-brand-hover',
          // Error state — mirrors Input; error fill wins over checked
          'aria-invalid:border-input-error',
          'enabled:aria-invalid:hover:border-input-error',
          'aria-invalid:data-[state=checked]:border-input-error',
          'aria-invalid:data-[state=checked]:bg-input-error',
          'enabled:aria-invalid:data-[state=checked]:hover:border-input-error',
          'enabled:aria-invalid:data-[state=checked]:hover:bg-input-error',
          'aria-invalid:data-[state=indeterminate]:border-input-error',
          'aria-invalid:data-[state=indeterminate]:bg-input-error',
          'enabled:aria-invalid:data-[state=indeterminate]:hover:border-input-error',
          'enabled:aria-invalid:data-[state=indeterminate]:hover:bg-input-error'
        ),
      },
      size: {
        md: 'size-control',
      },
      rounded: {
        md: 'rounded',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'md',
    },
  }
);

const checkboxIndicatorVariants = cva(
  [
    'grid',
    'place-content-center',
    'text-current',
    'fade-in-0',
    'slide-in-from-bottom-1',
    'animate-in',
    'duration-fast',
  ],
  {
    variants: {
      size: {
        // Check mark is a 12x12 stroke-3 glyph, which renders at 1.5px;
        // the indeterminate bar is 10 x 1.5px, the same weight.
        md: '[&>svg]:size-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const checkboxContainerVariants = cva('flex w-fit items-center', {
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

export interface CheckboxProps
  extends ComponentPropsWithRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants>,
    VariantProps<typeof checkboxContainerVariants> {
  label?: ReactNode;
  labelClassName?: string;
}

function Checkbox({
  className,
  variant,
  size,
  rounded,
  label,
  labelPosition,
  gap,
  labelClassName,
  disabled,
  ...props
}: CheckboxProps) {
  const id = useId();

  const checkboxElement = (
    <CheckboxPrimitive.Root
      id={label ? id : props.id}
      disabled={disabled}
      className={cn(
        checkboxVariants({ variant, size, rounded }),
        !label && className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(checkboxIndicatorVariants({ size }), 'group/indicator')}
      >
        <Check
          className="group-data-[state=indeterminate]/indicator:hidden"
          strokeWidth={3}
        />
        {/* Drawn the way the tick is drawn, not as a box.

            A 1.5px `<span>` and a 1.5px stroke are the same number and not the
            same weight: the tick is a diagonal with round caps, which
            antialiases across more pixels and reads heavier, so the bar looked
            thinner at equal height. Same viewBox, same stroke-width, same cap
            — the two marks now go through one renderer.

            `M2 12h20` rather than lucide's `Minus` (`M5 12h14`): 20 of 24 units
            is 10px at this size, the kit's `.625rem` bar. Lucide's would be 7. */}
        <svg
          aria-hidden="true"
          className="hidden group-data-[state=indeterminate]/indicator:block"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={3}
          viewBox="0 0 24 24"
        >
          <path d="M2 12h20" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label) {
    return checkboxElement;
  }

  return (
    <div
      className={cn(
        checkboxContainerVariants({ labelPosition, gap }),
        className
      )}
    >
      {checkboxElement}
      <label
        htmlFor={id}
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
}

Checkbox.displayName = 'Checkbox';

export { Checkbox, checkboxVariants };
