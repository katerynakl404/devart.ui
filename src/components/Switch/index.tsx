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
import { Typography } from '../Typography';

// Both variants share the redesigned form-control recipe: brand on-track,
// filled neutral off-track, brand focus ring.
//
// The off state keys on `data-disabled`, not `:disabled` / `:enabled`
// (2026-10-27). Radix stamps it on a disabled switch, and `Switch` stamps it
// on the focusable off form it renders for a `tooltip` (`aria-disabled`, no
// `disabled`), so the two look and behave the same: faded, the not-allowed
// cursor, no hover.
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
    // Focus state — the brand ring with a Surface/Card gap (kit `.swt`)
    focusRing,
    // Disabled states — unified opacity recipe
    // Not `pointer-events-none`: it hides the not-allowed cursor, and the
    // tooltip that says why the control is off. A disabled control fires
    // nothing either way.
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
        // The row around a switched-off switch: the cursor says so, and the
        // row neither lights nor presses (it used to take pointer events away,
        // which took the cursor with them). `data-disabled`, so the
        // focusable off form counts too.
        'has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:active:bg-transparent has-[[data-disabled]]:hover:bg-transparent'
      ),
    },
  },
  defaultVariants: {
    labelPosition: 'right',
    gap: 'md',
    variant: 'default',
  },
});

type SwitchTrackProps = ComponentPropsWithRef<typeof SwitchPrimitives.Root> & {
  /** Ids the track is described by: its `description`, the caller's own. */
  describedBy?: string;
  'data-state'?: string;
};

/**
 * The Radix root, safe to be a `TooltipTrigger`'s child. The trigger stamps
 * its own `data-state` (`closed`, `delayed-open`) on the element it wraps,
 * and Radix spreads it over the switch's `checked` / `unchecked` — which
 * every track colour keys on, so under a tooltip the switch lost its colour.
 * That is why pages put a span between the two. Here the switch's own state
 * wins, and the trigger's `aria-describedby` (the open tooltip) joins the
 * description's instead of replacing it.
 */
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

export interface SwitchProps
  extends ComponentPropsWithRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants>,
    Omit<VariantProps<typeof switchContainerVariants>, 'variant'> {
  label?: ReactNode;
  /**
   * A line under the label that says what switching does ("Inactive
   * connections stop syncing data but keep their configuration"). `body12`
   * in `--ink-secondary` — the field hint's scale under the 14px label, 2px
   * below it, as `ChoiceCard` sets its description — and the switch's
   * `aria-describedby`. With it the row aligns to the top, the switch on the
   * label's first line, so a two-line description hangs under the label
   * rather than centring the switch on the whole block. (2026-10-27)
   */
  description?: ReactNode;
  containerVariant?: VariantProps<typeof switchContainerVariants>['variant'];
  labelClassName?: string;
  /**
   * Shown on hover and keyboard focus: what switching does ("Deactivate"),
   * or why the switch is off. `true` shows the `aria-label`. With `disabled`
   * the switch is rendered `aria-disabled` instead, so the reason stays
   * reachable; it does not toggle. The prop and the code `IconButton` and
   * `Button` share (2026-10-27).
   */
  tooltip?: ReactNode | true;
  /** @default 'top' */
  tooltipSide?: TooltipSide;
}

const Switch = ({
  className,
  variant,
  size,
  rounded,
  label,
  description,
  labelPosition,
  gap,
  containerVariant,
  labelClassName,
  tooltip,
  tooltipSide = 'top',
  disabled,
  onClick,
  'aria-describedby': ariaDescribedBy,
  ...props
}: SwitchProps) => {
  const id = useId();
  const descriptionId = useId();
  const hasDescription = Boolean(description);
  const hasText = Boolean(label) || hasDescription;
  const tip = resolveTooltip(tooltip, props['aria-label']);
  const inert = inertForTooltip(disabled, tip !== undefined, onClick);
  const describedBy =
    [ariaDescribedBy, hasDescription ? descriptionId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;
  // A 16px `sm` track on a 20px label line: 2px down puts it on the line's
  // middle. Only beside the label — above or below it there is no line.
  const besideLabel = labelPosition !== 'top' && labelPosition !== 'bottom';

  const track = (
    <SwitchTrack
      id={hasText ? id : undefined}
      className={cn(
        switchVariants({ variant, size, rounded }),
        hasText
          ? hasDescription && size === 'sm' && besideLabel && 'mt-0.5'
          : className
      )}
      describedBy={describedBy}
      {...props}
      {...inert}
      // Only in the focusable off form: anywhere else an explicit
      // `undefined` would override the `data-disabled` Radix stamps itself.
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

  if (!hasText) return control;

  const labelElement = label ? (
    <label
      htmlFor={id}
      // Same recipe as Checkbox and RadioButton, the two sibling controls
      // with an inline label. It carried no ink token at all, so it
      // inherited whatever colour its container happened to have, and no
      // disabled treatment either.
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
        }),
        hasDescription && 'items-start',
        className
      )}
    >
      {control}
      {hasDescription ? (
        <div data-slot="switch-text" className="flex min-w-0 flex-col gap-0.5">
          {labelElement}
          <Typography
            id={descriptionId}
            data-slot="switch-description"
            element="span"
            textStyle="body12"
            textColor="secondary"
            className={cn(disabled && 'opacity-disabled')}
          >
            {description}
          </Typography>
        </div>
      ) : (
        labelElement
      )}
    </div>
  );
};

Switch.displayName = 'Switch';

export { Switch, switchContainerVariants, switchThumbVariants, switchVariants };
