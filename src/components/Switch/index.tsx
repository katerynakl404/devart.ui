'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import { type ComponentPropsWithRef, type ReactNode, useId } from 'react';
import { cva, type VariantProps } from '../../lib/cva';

import { cn, focusRing } from '../../lib/utils';
import {
  ControlTooltip,
  inertForTooltip,
  resolveTooltip,
  type TooltipSide,
} from '../Tooltip/ControlTooltip';

// Both variants share the redesigned form-control recipe: brand on-track,
// filled neutral off-track, neutral focus ring.
const switchTrackClasses = cn(
  // Checked states
  'data-[state=checked]:bg-brand-primary',
  '[&:not([data-disabled])]:data-[state=checked]:hover:bg-brand-hover',
  // Unchecked states — filled medium-grey track, no outline
  'data-[state=unchecked]:bg-switch-off-bg',
  '[&:not([data-disabled])]:data-[state=unchecked]:hover:bg-switch-off-bg-hover'
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
    focusRing,
    // Disabled states — unified opacity recipe
    'data-[disabled]:cursor-not-allowed',
    'data-[disabled]:opacity-disabled',
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
      withDescription: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Aligns the sm track with the label's first line
      { size: 'sm', withDescription: true, class: 'mt-0.5' },
    ],
    defaultVariants: {
      variant: 'accent',
      size: 'default',
      rounded: 'default',
      withDescription: false,
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
        'hover:bg-state-hover',
        'active:bg-state-pressed',
        'has-[[data-disabled]]:cursor-not-allowed',
        'has-[[data-disabled]]:hover:bg-transparent',
        'has-[[data-disabled]]:active:bg-transparent'
      ),
    },
    withDescription: {
      true: 'items-start',
      false: null,
    },
  },
  defaultVariants: {
    labelPosition: 'right',
    gap: 'md',
    variant: 'default',
    withDescription: false,
  },
});

export interface SwitchProps
  extends ComponentPropsWithRef<typeof SwitchPrimitives.Root>,
    Omit<VariantProps<typeof switchVariants>, 'withDescription'>,
    Omit<
      VariantProps<typeof switchContainerVariants>,
      'variant' | 'withDescription'
    > {
  label?: ReactNode;
  /** Secondary text under the label. */
  description?: ReactNode;
  /** Tooltip text; `true` uses the `aria-label`. */
  tooltip?: ReactNode | true;
  tooltipSide?: TooltipSide;
  containerVariant?: VariantProps<typeof switchContainerVariants>['variant'];
  labelClassName?: string;
}

type SwitchTrackProps = ComponentPropsWithRef<typeof SwitchPrimitives.Root> & {
  describedBy?: string;
  'data-state'?: string;
};

/** Keeps the switch's own `data-state` under a `TooltipTrigger`. */
function SwitchTrack({
  'data-state': _triggerState,
  'aria-describedby': triggerDescribedBy,
  describedBy,
  ...props
}: SwitchTrackProps) {
  const ids = [triggerDescribedBy, describedBy].filter(Boolean).join(' ');
  return (
    <SwitchPrimitives.Root aria-describedby={ids || undefined} {...props} />
  );
}

const Switch = ({
  className,
  variant,
  size,
  rounded,
  label,
  description,
  tooltip,
  tooltipSide = 'top',
  onClick,
  labelPosition,
  gap,
  containerVariant,
  labelClassName,
  disabled,
  'aria-describedby': ariaDescribedBy,
  ...props
}: SwitchProps) => {
  const id = useId();
  const descriptionId = useId();
  const withDescription = Boolean(description);
  // The sm track lines up with the label's first line only beside it
  const besideLabel = labelPosition !== 'top' && labelPosition !== 'bottom';
  const tip = resolveTooltip(tooltip, props['aria-label']);
  const inert = inertForTooltip(disabled, tip !== undefined, onClick);

  const track = (
    <SwitchTrack
      id={label || description ? id : undefined}
      describedBy={
        [ariaDescribedBy, withDescription ? descriptionId : undefined]
          .filter(Boolean)
          .join(' ') || undefined
      }
      className={cn(
        switchVariants({
          variant,
          size,
          rounded,
          withDescription: withDescription && besideLabel,
        }),
        !label && !description && className
      )}
      {...props}
      {...inert}
      {...(inert['aria-disabled'] ? { 'data-disabled': '' } : {})}
    >
      <SwitchPrimitives.Thumb
        className={cn(switchThumbVariants({ variant, size }))}
      />
    </SwitchTrack>
  );

  const control = (
    <ControlTooltip content={tip} side={tooltipSide}>
      {track}
    </ControlTooltip>
  );

  if (!label && !description) {
    return control;
  }

  const labelElement = label ? (
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
  ) : null;

  return (
    <div
      className={cn(
        switchContainerVariants({
          labelPosition,
          gap,
          variant: containerVariant,
          withDescription,
        }),
        className
      )}
    >
      {control}
      {withDescription ? (
        <div data-slot="switch-text" className="flex min-w-0 flex-col gap-0.5">
          {labelElement}
          <span
            id={descriptionId}
            data-slot="switch-description"
            className={cn(
              'font-normal text-ink-secondary text-xs',
              disabled ? 'opacity-disabled' : undefined
            )}
          >
            {description}
          </span>
        </div>
      ) : (
        labelElement
      )}
    </div>
  );
};

Switch.displayName = 'Switch';

export { Switch, switchContainerVariants, switchThumbVariants, switchVariants };
