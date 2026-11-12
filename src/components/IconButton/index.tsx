'use client';

import { Slot } from '@radix-ui/react-slot';
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import {
  cn,
  ghostDisabled,
  glyphStroke,
  secondaryDisabled,
} from '../../lib/utils';
import { Spinner } from '../Spinner';
import {
  ControlTooltip,
  inertForTooltip,
  resolveTooltip,
  type TooltipSide,
} from '../Tooltip/ControlTooltip';

export const iconButtonVariants = cva(
  cn(
    'inline-flex items-center justify-center',
    'cursor-pointer border',
    'transition-all duration-fast',

    // Focus: 2px ring + 2px surface-card gap; ring colour is set per variant
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',

    'disabled:cursor-not-allowed',
    'aria-disabled:cursor-not-allowed',

    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    glyphStroke
  ),
  {
    variants: {
      // Shares the Button variant scale (Button.md: IconButton uses the same variants).
      variant: {
        primary: cn(
          'border-transparent bg-btn-primary-bg text-btn-primary-text',
          'hover:bg-btn-primary-bg-hover',
          'pressed:bg-btn-primary-bg-press',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-state-disabled disabled:text-ink-inactive',
          'disabled:hover:bg-state-disabled',
          'aria-disabled:bg-state-disabled aria-disabled:text-ink-inactive',
          'aria-disabled:pressed:bg-state-disabled aria-disabled:hover:bg-state-disabled'
        ),
        primaryTertiary: cn(
          'border-transparent bg-transparent text-btn-primary-tertiary-text',
          'hover:bg-state-hover hover:text-btn-primary-tertiary-text-hover',
          'pressed:bg-state-pressed pressed:text-btn-primary-tertiary-text-press',
          'focus-visible:ring-focus-ring-brand',
          ghostDisabled
        ),
        secondary: cn(
          'border-btn-secondary-border bg-surface-card text-ink-body',
          'hover:border-btn-secondary-border-hover hover:bg-btn-secondary-bg-hover',
          'pressed:bg-btn-secondary-bg-press',
          'focus-visible:ring-focus-ring-brand',
          secondaryDisabled
        ),
        outline: cn(
          'border-brand-secondary bg-transparent text-ink-body',
          'hover:border-brand-hover hover:bg-btn-outline-bg-hover',
          'pressed:border-brand-hover pressed:bg-btn-outline-bg-press',
          'focus-visible:ring-focus-ring-brand',
          secondaryDisabled
        ),
        tertiary: cn(
          'border-transparent bg-transparent text-ink-body',
          'hover:bg-state-hover',
          'pressed:bg-state-pressed',
          'focus-visible:ring-focus-ring-brand',
          ghostDisabled
        ),
        destructive: cn(
          'border-transparent bg-fb-red text-content-on-solid',
          'hover:bg-fb-error-hover',
          'pressed:bg-fb-error-press',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-state-disabled disabled:text-ink-inactive',
          'disabled:hover:bg-state-disabled',
          'aria-disabled:bg-state-disabled aria-disabled:text-ink-inactive',
          'aria-disabled:pressed:bg-state-disabled aria-disabled:hover:bg-state-disabled'
        ),
        destructiveOutline: cn(
          'border-outlineDestructive-border bg-transparent text-fb-red-text',
          'hover:border-outlineDestructive-border-hover hover:bg-outlineDestructive-bg-hover',
          'pressed:border-outlineDestructive-border-hover pressed:bg-outlineDestructive-bg-press',
          'focus-visible:ring-focus-ring-brand',
          secondaryDisabled
        ),
        // Low-emphasis destructive ghost: red icon, transparent fill, red-tinted
        // hover/press. Tertiary sibling of destructiveOutline (no border).
        destructiveTertiary: cn(
          'border-transparent bg-transparent text-fb-red-text',
          'hover:bg-destructiveTertiary-bg-hover',
          'pressed:bg-destructiveTertiary-bg-press',
          'focus-visible:ring-focus-ring-brand',
          ghostDisabled
        ),
        transparent: cn(
          'm-0 max-h-fit max-w-fit border-none bg-transparent text-ink-body',
          'focus-visible:ring-focus-ring-brand',
          ghostDisabled
        ),
      },
      size: {
        // Same boxes as Button (28–44px); 2xs (24px) is the row-action size.
        // 3xs (20px): the expand toggle of a tree row.
        '3xs': 'size-5 [&_svg]:size-3',
        '2xs': 'size-6 [&_svg]:size-3.5',
        xs: 'size-7 [&_svg]:size-3.5',
        sm: 'size-8 [&_svg]:size-4',
        md: 'size-9 [&_svg]:size-4',
        lg: 'size-10 [&_svg]:size-5',
        xl: 'size-11 [&_svg]:size-5',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        rounded: 'rounded',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    compoundVariants: [
      { size: '3xs', rounded: 'md', class: 'rounded' },
      { size: '2xs', rounded: 'md', class: 'rounded' },
      { size: 'xs', rounded: 'md', class: 'rounded' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'md',
    },
  }
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** The control's name; it has no visible text. */
  'aria-label': string;
  asChild?: boolean;
  /**
   * Replaces the icon with a spinner and blocks pointer interaction while
   * keeping the variant fill. Sets `aria-busy`; does not toggle `disabled`.
   */
  isLoading?: boolean;
  /**
   * Shown on hover and focus; `true` shows the `aria-label`. A disabled button
   * with a tooltip is rendered `aria-disabled`, so the tooltip still opens.
   */
  tooltip?: ReactNode | true;
  tooltipSide?: TooltipSide;
  ref?: Ref<HTMLButtonElement>;
}

export function IconButton({
  className,
  variant,
  size,
  rounded,
  asChild = false,
  isLoading = false,
  tooltip,
  tooltipSide = 'top',
  disabled,
  onClick,
  ref,
  children,
  ...props
}: IconButtonProps) {
  const Comp = asChild ? Slot : 'button';

  const spinnerSize =
    size === '3xs' || size === '2xs' || size === 'xs' ? 'xs' : 'sm';
  const tip = resolveTooltip(tooltip, props['aria-label']);
  const inert = inertForTooltip(disabled, tip !== undefined, onClick);

  const button = (
    <Comp
      data-variant={variant ?? undefined}
      ref={ref}
      className={cn(
        iconButtonVariants({ variant, size, rounded }),
        className,
        isLoading && 'pointer-events-none opacity-disabled'
      )}
      aria-busy={isLoading || undefined}
      {...props}
      {...inert}
    >
      {isLoading ? (
        // Decorative: `aria-busy` on the control conveys the loading state.
        <Spinner aria-hidden color="inherit" size={spinnerSize} />
      ) : (
        children
      )}
    </Comp>
  );

  return (
    <ControlTooltip content={tip} side={tooltipSide}>
      {button}
    </ControlTooltip>
  );
}
