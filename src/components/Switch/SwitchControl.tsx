'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn, focusRing } from '../../lib/utils';
import {
  ControlTooltip,
  disabledProps,
  resolveTooltip,
  type TooltipSide,
} from '../Tooltip/ControlTooltip';
import { joinIds, SwitchRoot } from './SwitchRoot';

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

export interface SwitchControlProps
  extends ComponentPropsWithRef<typeof SwitchPrimitives.Root>,
    Omit<VariantProps<typeof switchVariants>, 'withDescription'> {
  /** Tooltip text; `true` uses the `aria-label`. */
  tooltip?: ReactNode | true;
  tooltipSide?: TooltipSide;
  /** Id of the description under the label; also aligns the track with it. */
  descriptionId?: string;
  /**
   * The label is beside the switch, not above or below it. Only then does the
   * `sm` track step down to the label's first line; above or below there is no
   * first line to meet and the 2px would only push the track off centre.
   */
  besideLabel?: boolean;
}

/** The track and thumb, with an optional tooltip. */
function SwitchControl({
  className,
  variant,
  size,
  rounded,
  tooltip,
  tooltipSide = 'top',
  descriptionId,
  besideLabel = true,
  disabled,
  name,
  'aria-describedby': ariaDescribedBy,
  ...props
}: SwitchControlProps) {
  const tip = resolveTooltip(tooltip, props['aria-label']);
  const hasTooltip = tip !== undefined;
  const softDisabled = Boolean(disabled) && hasTooltip;

  return (
    <ControlTooltip content={tip} side={tooltipSide}>
      <SwitchRoot
        ownDescribedBy={joinIds(ariaDescribedBy, descriptionId)}
        className={cn(
          switchVariants({
            variant,
            size,
            rounded,
            withDescription: Boolean(descriptionId) && besideLabel,
          }),
          className
        )}
        // Radix's hidden form input stays enabled when soft-disabled
        name={softDisabled ? undefined : name}
        {...props}
        {...disabledProps(disabled, hasTooltip)}
      >
        <SwitchPrimitives.Thumb
          className={cn(switchThumbVariants({ variant, size }))}
        />
      </SwitchRoot>
    </ControlTooltip>
  );
}

export { SwitchControl, switchThumbVariants, switchVariants };
