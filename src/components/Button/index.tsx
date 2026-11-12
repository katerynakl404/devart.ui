'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
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

const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap font-medium',
    'cursor-pointer border',
    'transition-all duration-fast',

    // Focus: 2px ring + 2px surface-card gap; ring colour is set per variant
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',

    // Disabled. `:hover` still matches a disabled button, so each variant
    // switches its own hover off.
    'disabled:cursor-not-allowed',
    'aria-disabled:cursor-not-allowed',

    // Child icon styles
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    glyphStroke
  ),
  {
    variants: {
      variant: {
        // Solid brand fill, theme-independent.
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
        // Card-tone fill with a thin neutral border. Hover and press are
        // opaque blends, so the button keeps its own surface.
        secondary: cn(
          'border-btn-secondary-border bg-surface-card text-ink-body',
          'hover:border-btn-secondary-border-hover hover:bg-btn-secondary-bg-hover',
          'pressed:bg-btn-secondary-bg-press',
          'focus-visible:ring-focus-ring-brand',
          secondaryDisabled
        ),
        // Brand-bordered, transparent fill (previous Secondary look).
        outline: cn(
          'border-brand-secondary bg-transparent text-ink-body',
          'hover:border-brand-hover hover:bg-btn-outline-bg-hover',
          'pressed:border-brand-hover pressed:bg-btn-outline-bg-press',
          'focus-visible:ring-focus-ring-brand',
          secondaryDisabled
        ),
        // Lowest-emphasis ghost: Outlined minus the border — same brand-tinted
        // hover/press overlays.
        tertiary: cn(
          'border-transparent bg-transparent text-ink-body',
          'hover:bg-state-hover',
          'pressed:bg-state-pressed',
          'focus-visible:ring-focus-ring-brand',
          ghostDisabled
        ),
        // Destructive: theme-independent red fill, neutral focus ring.
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
        // Destructive outline: red-bordered, transparent fill with red-tinted
        // hover/press.
        destructiveOutline: cn(
          'border-outlineDestructive-border bg-transparent text-fb-red-text',
          'hover:border-outlineDestructive-border-hover hover:bg-outlineDestructive-bg-hover',
          'pressed:border-outlineDestructive-border-hover pressed:bg-outlineDestructive-bg-press',
          'focus-visible:ring-focus-ring-brand',
          secondaryDisabled
        ),
        // Low-emphasis destructive ghost: red label, transparent fill, red-tinted
        // hover/press. Tertiary sibling of destructiveOutline (no border).
        destructiveTertiary: cn(
          'border-transparent bg-transparent text-fb-red-text',
          'hover:bg-destructiveTertiary-bg-hover',
          'pressed:bg-destructiveTertiary-bg-press',
          'focus-visible:ring-focus-ring-brand',
          ghostDisabled
        ),
        // Bare utility (no box, fit-content) for inline/icon triggers.
        transparent: cn(
          'm-0 max-h-fit max-w-fit border-none bg-transparent text-ink-body',
          'focus-visible:ring-focus-ring-brand',
          ghostDisabled
        ),
        transparentUnderline: cn(
          'border-none bg-transparent text-ink-body underline underline-offset-4',
          'focus-visible:ring-focus-ring-brand',
          ghostDisabled
        ),
      },
      size: {
        xs: 'h-7 gap-1 px-2 text-xs [&_svg]:size-3.5',
        sm: 'h-8 gap-1.5 px-3 text-sm [&_svg]:size-4',
        md: 'h-9 px-3 text-sm [&_svg]:size-4',
        lg: 'h-10 px-4 text-base [&_svg]:size-5',
        xl: 'h-11 px-5 text-base [&_svg]:size-5',
      },
      align: {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
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
      fullWidth: {
        true: 'w-full',
        false: 'w-fit',
      },
    },
    compoundVariants: [
      { variant: 'transparent', class: 'p-0' },
      { size: 'xs', rounded: 'md', class: 'rounded' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  /**
   * Shows a spinner and blocks pointer interaction while keeping the variant
   * fill (the label is retained). Sets `aria-busy`; does not toggle `disabled`.
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

const Button = ({
  className,
  variant,
  size,
  rounded,
  fullWidth,
  align,
  asChild = false,
  isLoading = false,
  tooltip,
  tooltipSide = 'top',
  disabled,
  onClick,
  ref,
  leftSlot = null,
  rightSlot = null,
  children,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';
  const hasLabel =
    children !== undefined &&
    children !== null &&
    children !== false &&
    children !== '';
  // The label stretches only where that keeps `leftSlot` beside it.
  const stretchLabel =
    (align !== undefined || Boolean(rightSlot)) &&
    (align === 'left' || !(isLoading || leftSlot));
  const tip = resolveTooltip(tooltip, props['aria-label']);
  const inert = inertForTooltip(disabled, tip !== undefined, onClick);

  const button = (
    <Comp
      data-variant={variant ?? undefined}
      className={cn(
        buttonVariants({ variant, size, rounded, fullWidth, align, className }),
        isLoading && 'pointer-events-none opacity-disabled'
      )}
      ref={ref}
      aria-busy={isLoading || undefined}
      {...props}
      {...inert}
    >
      {isLoading ? (
        <Spinner
          aria-hidden
          color="inherit"
          size={size === 'xs' ? 'xs' : 'sm'}
        />
      ) : (
        leftSlot
      )}

      {asChild ? (
        <Slottable>{children}</Slottable>
      ) : (
        hasLabel &&
        (fullWidth ? (
          <span
            className={cn(
              'min-w-0 truncate text-center',
              stretchLabel && 'flex-1',
              align === 'left' && 'text-left',
              align === 'right' && 'text-right'
            )}
          >
            {children}
          </span>
        ) : (
          children
        ))
      )}

      {rightSlot}
    </Comp>
  );

  return (
    <ControlTooltip content={tip} side={tooltipSide}>
      {button}
    </ControlTooltip>
  );
};

Button.displayName = 'Button';

export { Button, buttonVariants };
