'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ComponentPropsWithRef, type ReactNode, useId } from 'react';

import { cn, formFocusRing } from '../../lib/utils';

// Both variants share the redesigned form-control recipe: brand on-track,
// filled neutral off-track, neutral focus ring.
const switchTrackClasses = cn(
  // Checked states
  'data-[state=checked]:bg-brand-primary',
  'enabled:data-[state=checked]:hover:bg-brand-hover',
  // Unchecked states — filled medium-grey track, no outline
  'data-[state=unchecked]:bg-switch-off-bg',
  'enabled:data-[state=unchecked]:hover:bg-switch-off-bg-hover'
);

const switchVariants = cva(
  [
    'relative',
    'inline-flex',
    'justify-start',
    'items-center',
    'shrink-0',
    'cursor-pointer',
    'transition-colors',
    // Invisible 44x44 hit area (visual track stays 36x20) — WCAG 2.5.5/2.5.8
    'before:absolute',
    'before:-inset-x-1',
    'before:-inset-y-3',
    "before:content-['']",
    // Focus state — neutral ring with a Surface/Card gap
    formFocusRing,
    // Disabled states — unified opacity recipe
    'disabled:pointer-events-none',
    'disabled:cursor-not-allowed',
    'disabled:opacity-disabled',
  ],
  {
    variants: {
      variant: {
        accent: switchTrackClasses,
      },
      size: {
        default: 'h-5 w-9 px-0.5',
        sm: 'h-4 w-7 px-0.5',
      },
      rounded: {
        default: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'accent',
      size: 'default',
      rounded: 'default',
    },
  }
);

const switchThumbVariants = cva(
  [
    'pointer-events-none',
    'flex',
    'items-center',
    'justify-center',
    'origin-right',
    'rounded-full',
    'transition-all',
    // White thumb in both positions; drop-shadow + 0.5px hairline keeps the
    // edge perceivable against the medium-grey off-track.
    'bg-content-on-solid',
    'shadow-thumb',
    'ring-0',
    // Unchecked state — checked travel lives per-size (track geometry differs)
    'data-[state=unchecked]:ms-0',
  ],
  {
    variants: {
      variant: {
        accent: '',
      },
      size: {
        default: 'size-4 min-h-4 min-w-4 data-[state=checked]:ms-4',
        sm: 'size-3 min-h-3 min-w-3 data-[state=checked]:ms-3',
      },
    },
    defaultVariants: {
      variant: 'accent',
      size: 'default',
    },
  }
);

const switchContainerVariants = cva('flex items-center', {
  variants: {
    labelPosition: {
      left: 'flex-row',
      right: 'flex-row-reverse',
      top: 'flex-col-reverse',
      bottom: 'flex-col',
    },
    gap: {
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
    },
    variant: {
      default: null,
      tertiary: cn(
        'cursor-pointer rounded',
        'transition-colors duration-fast',
        'enabled:hover:bg-state-hover',
        'active:bg-state-pressed',
        'has-[:disabled]:pointer-events-none'
      ),
    },
  },
  defaultVariants: {
    labelPosition: 'right',
    gap: 'md',
    variant: 'default',
  },
});

export interface SwitchProps
  extends ComponentPropsWithRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants>,
    Omit<VariantProps<typeof switchContainerVariants>, 'variant'> {
  label?: ReactNode;
  containerVariant?: VariantProps<typeof switchContainerVariants>['variant'];
  labelClassName?: string;
}

const Switch = ({
  className,
  variant,
  size,
  rounded,
  label,
  labelPosition,
  gap,
  containerVariant,
  labelClassName,
  ...props
}: SwitchProps) => {
  const id = useId();

  if (!label) {
    return (
      <SwitchPrimitives.Root
        className={cn(switchVariants({ variant, size, rounded, className }))}
        {...props}
      >
        <SwitchPrimitives.Thumb
          className={cn(switchThumbVariants({ variant, size }))}
        />
      </SwitchPrimitives.Root>
    );
  }

  return (
    <div
      className={cn(
        switchContainerVariants({
          labelPosition,
          gap,
          variant: containerVariant,
        }),
        className
      )}
    >
      <SwitchPrimitives.Root
        id={id}
        className={cn(switchVariants({ variant, size, rounded }))}
        {...props}
      >
        <SwitchPrimitives.Thumb
          className={cn(switchThumbVariants({ variant, size }))}
        />
      </SwitchPrimitives.Root>
      <label
        htmlFor={id}
        // Same recipe as Checkbox and RadioButton, the two sibling controls
        // with an inline label. It carried no ink token at all, so it
        // inherited whatever colour its container happened to have, and no
        // disabled treatment either.
        className={cn(
          'font-medium text-ink-body text-sm',
          props.disabled
            ? 'cursor-not-allowed opacity-disabled'
            : 'cursor-pointer',
          labelClassName
        )}
      >
        {label}
      </label>
    </div>
  );
};

Switch.displayName = 'Switch';

export { Switch, switchVariants };
