'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { type ComponentPropsWithRef, type ReactNode, useId } from 'react';
import { cva, type VariantProps } from '../../lib/cva';

import { cn, focusRing } from '../../lib/utils';

export type CheckedState = CheckboxPrimitive.CheckedState;

const checkboxVariants = cva(
  [
    'peer',
    'grid',
    'shrink-0',
    'place-content-center',
    'border-[1.5px]',
    // Focus state — the brand ring with a Surface/Card gap (kit `.cbx`)
    focusRing,
    // Disabled state — unified opacity recipe
    // Not `pointer-events-none`: it hides the not-allowed cursor, and the
    // tooltip that says why the control is off. A disabled control fires
    // nothing either way.
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
        // Both marks are drawn in a 10px glyph box (see the glyphs below).
        // 10 in 18 leaves 4px a side, which is a whole device pixel at 100,
        // 125, 150 and 200% — at 12px the 3px offset fell on 3.75 and 4.5
        // device px, and the snapped glyph slid up to a third of a pixel.
        md: '[&>svg]:size-2.5',
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
        {/* Both marks are drawn here, at their own size, in one 10px grid:
            1 unit = 1px, stroke 1.5px, round caps — one weight, one renderer.
            Not a 24-unit icon halved, whose coordinates fall where the halving
            puts them.

            The tick is centred on its frame — the halved lucide tick sat 0.25px
            high and read high and to the right. The bar is 8px including its
            round caps, 5px clear of the box on each side — at the kit's 10px
            (and `M2 12h20`'s 11.5px) it crowded the sides. DESIGN-SYSTEM-CHANGES §57. */}
        <svg
          aria-hidden="true"
          className="group-data-[state=indeterminate]/indicator:hidden"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          viewBox="0 0 10 10"
        >
          <path d="M9 2.25 3.5 7.75 1 5.25" />
        </svg>
        <svg
          aria-hidden="true"
          className="hidden group-data-[state=indeterminate]/indicator:block"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={1.5}
          viewBox="0 0 10 10"
        >
          <path d="M1.75 5h6.5" />
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
