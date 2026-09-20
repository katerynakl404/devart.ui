'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { cn, glyphStroke } from '../../lib/utils';

import { Spinner } from '../Spinner';

const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap font-medium',
    'cursor-pointer border',
    'transition-all duration-fast',

    // Focus: 2px ring + 2px surface-card gap; ring colour is set per variant
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',

    // Disabled — both forms. `disabled` blocks focus; `aria-disabled` keeps the
    // control focusable so a screen reader can announce why it is inert.
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
          'disabled:bg-state-disabled disabled:text-ink-inactive'
        ),
        // Card-tone fill with a thin neutral border.
        //
        // Hover and press are the PRE-COMPOSITED `--btn-secondary-bg-*` blends,
        // not `--state-hover` / `--state-pressed`. Those are translucent washes,
        // and `bg-*` replaces rather than layers: on hover this button would
        // stop being an opaque chip and show whatever sits behind it, so the
        // same button changed surface depending on what it was placed on. The
        // blends end opaque — brand at 5% and 8% over `--surface-card` — so the
        // chip stays a chip and only deepens.
        secondary: cn(
          'border-btn-secondary-border bg-surface-card text-ink-body',
          'hover:border-btn-secondary-border-hover hover:bg-btn-secondary-bg-hover',
          'pressed:bg-btn-secondary-bg-press',
          'focus-visible:ring-focus-ring-brand',
          // No disabled FILL. `secondary` rests on --surface-card, and
          // --state-disabled is a different opaque surface — swapping one for
          // the other reads as a different control rather than as this one
          // switched off. The border and the inactive label carry the state;
          // the chip keeps its own surface. (The kit specifies bg
          // State/Disabled here — deliberate divergence.)
          'disabled:border-btn-secondary-border disabled:text-ink-inactive'
        ),
        // Brand-bordered, transparent fill (previous Secondary look).
        outline: cn(
          'border-brand-secondary bg-transparent text-ink-body',
          'hover:border-brand-hover hover:bg-btn-outline-bg-hover',
          'pressed:border-brand-hover pressed:bg-btn-outline-bg-press',
          'focus-visible:ring-focus-ring-brand',
          'disabled:border-ink-inactive disabled:bg-transparent disabled:text-ink-inactive'
        ),
        // Lowest-emphasis ghost: Outlined minus the border — same brand-tinted
        // hover/press overlays.
        tertiary: cn(
          'border-transparent bg-transparent text-ink-body',
          'hover:bg-state-hover',
          'pressed:bg-state-pressed',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-transparent disabled:text-ink-inactive',
          'aria-disabled:pointer-events-none aria-disabled:bg-transparent aria-disabled:text-ink-inactive'
        ),
        // Destructive: theme-independent red fill; focus ring is the kit-wide
        // brand teal (red-on-red would be unreadable).
        destructive: cn(
          'border-transparent bg-fb-red text-content-on-solid',
          'hover:bg-fb-error-hover',
          'pressed:bg-fb-error-press',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-state-disabled disabled:text-ink-inactive'
        ),
        // Destructive outline: red-bordered, transparent fill with red-tinted
        // hover/press. The label is Feedback/Red too — a neutral label under a
        // red border read as an ordinary secondary button and lost the warning.
        destructiveOutline: cn(
          'border-outlineDestructive-border bg-transparent text-fb-red-text',
          'hover:border-outlineDestructive-border-hover hover:bg-outlineDestructive-bg-hover',
          'pressed:border-outlineDestructive-border-hover pressed:bg-outlineDestructive-bg-press',
          'focus-visible:ring-focus-ring-brand',
          'disabled:border-ink-inactive disabled:bg-transparent disabled:text-ink-inactive'
        ),
        // Low-emphasis destructive ghost: red label, transparent fill, red-tinted
        // hover/press. Tertiary sibling of destructiveOutline (no border).
        destructiveTertiary: cn(
          'border-transparent bg-transparent text-fb-red-text',
          // Shares the destructiveOutline fill tokens on light and goes a step
          // stronger on dark, where there is no border to carry the signal.
          'hover:bg-destructiveTertiary-bg-hover',
          'pressed:bg-destructiveTertiary-bg-press',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-transparent disabled:text-ink-inactive',
          'aria-disabled:pointer-events-none aria-disabled:bg-transparent aria-disabled:text-ink-inactive'
        ),
        // Bare utility (no box, fit-content) for inline/icon triggers.
        transparent: cn(
          'm-0 max-h-fit max-w-fit border-none bg-transparent text-ink-body',
          'focus-visible:ring-focus-ring-brand'
        ),
        transparentUnderline: cn(
          'border-none bg-transparent text-ink-body underline underline-offset-4',
          'focus-visible:ring-focus-ring-brand'
        ),
      },
      size: {
        // Padding ladder pairs with the height: 8/12/12/16/20. Input, TextArea
        // and Selector take the identical ladder, so a button and a field of
        // the same size share one edge. 12px repeats at sm and md deliberately
        // - those are the two sizes the product actually uses.
        // Glyph follows the label: 16px everywhere, 14px at xs — the one step
        // where the label also drops.
        xs: 'h-7 gap-1 px-2 text-xs [&_svg]:size-3.5',
        sm: 'h-8 px-3 text-sm [&_svg]:size-4',
        md: 'h-9 px-3 text-sm [&_svg]:size-4',
        lg: 'h-10 px-3 text-base [&_svg]:size-5',
        xl: 'h-11 px-3 text-base [&_svg]:size-5',
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
      {
        // The bare inline/icon trigger has no box, so it takes no padding from
        // the size ladder. Declared here rather than as an !important override
        // on the variant, so padding still resolves in one place.
        variant: 'transparent',
        class: 'p-0',
      },
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
  ref,
  leftSlot = null,
  rightSlot = null,
  children,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';
  // An empty label would otherwise add a 0px flex child and double the gap.
  const hasLabel =
    children !== undefined &&
    children !== null &&
    children !== false &&
    children !== '';

  return (
    <Comp
      data-variant={variant ?? undefined}
      className={cn(
        buttonVariants({ variant, size, rounded, fullWidth, align, className }),
        isLoading && 'pointer-events-none opacity-disabled'
      )}
      ref={ref}
      aria-busy={isLoading || undefined}
      {...props}
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
        // Only `fullWidth` needs a box of its own — it truncates and aligns
        // the label inside the stretched row. Everything else goes straight
        // into the button's own flex row: the gap and the icon alignment are
        // already there, and one less wrapper means the design tool selects
        // the Button itself rather than an anonymous inner span.
        (fullWidth ? (
          <span
            className={cn(
              'min-w-0 flex-1 truncate text-center',
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
};

Button.displayName = 'Button';

export { Button, buttonVariants };
