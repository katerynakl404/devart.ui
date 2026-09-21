'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, Ref } from 'react';
import { cn, glyphStroke } from '../../lib/utils';
import { Spinner } from '../Spinner';

const iconButtonVariants = cva(
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
          'disabled:bg-state-disabled disabled:text-ink-inactive'
        ),
        secondary: cn(
          'border-btn-secondary-border bg-surface-card text-ink-body',
          // Opaque blends, not the translucent state washes — see Button.
          'hover:border-btn-secondary-border-hover hover:bg-btn-secondary-bg-hover',
          'pressed:border-btn-secondary-border pressed:bg-btn-secondary-bg-press',
          'focus-visible:ring-focus-ring-brand',
          // No disabled FILL. `secondary` rests on --surface-card, and
          // --state-disabled is a different opaque surface — swapping one for
          // the other reads as a different control rather than as this one
          // switched off. The border and the inactive label carry the state;
          // the chip keeps its own surface. (The kit specifies bg
          // State/Disabled here — deliberate divergence.)
          'disabled:border-btn-secondary-border disabled:text-ink-inactive'
        ),
        outline: cn(
          'border-brand-secondary bg-transparent text-ink-body',
          'hover:border-brand-hover hover:bg-btn-outline-bg-hover',
          'pressed:border-brand-hover pressed:bg-btn-outline-bg-press',
          'focus-visible:ring-focus-ring-brand',
          'disabled:border-ink-inactive disabled:bg-transparent disabled:text-ink-inactive'
        ),
        tertiary: cn(
          'border-transparent bg-transparent text-ink-body',
          'hover:bg-state-hover',
          'pressed:bg-state-pressed',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-transparent disabled:text-ink-inactive',
          'aria-disabled:pointer-events-none aria-disabled:bg-transparent aria-disabled:text-ink-inactive'
        ),
        // The same pill as `tertiary`, with a brand glyph. Its label — the
        // glyph — moves through the brand ramp; the surface does not.
        tertiaryBrand: cn(
          'border-transparent bg-transparent text-brand-primary',
          'hover:bg-state-hover hover:text-brand-hover',
          'pressed:bg-state-pressed pressed:text-brand-press',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-transparent disabled:text-ink-inactive',
          'aria-disabled:pointer-events-none aria-disabled:bg-transparent aria-disabled:text-ink-inactive'
        ),
        // Focus ring is the kit-wide brand teal on every variant, destructive
        // included — a red ring on a red control reads as noise.
        destructive: cn(
          'border-transparent bg-fb-red text-content-on-solid',
          'hover:bg-fb-error-hover',
          'pressed:bg-fb-error-press',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-state-disabled disabled:text-ink-inactive'
        ),
        destructiveOutline: cn(
          'border-outlineDestructive-border bg-transparent text-fb-red-text',
          'hover:border-outlineDestructive-border-hover hover:bg-outlineDestructive-bg-hover',
          'pressed:border-outlineDestructive-border-hover pressed:bg-outlineDestructive-bg-press',
          'focus-visible:ring-focus-ring-brand',
          'disabled:border-ink-inactive disabled:bg-transparent disabled:text-ink-inactive'
        ),
        // Low-emphasis destructive ghost: red icon, transparent fill, red-tinted
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
        transparent: cn(
          '!p-0 m-0 max-h-fit max-w-fit border-none bg-transparent text-ink-body',
          'focus-visible:ring-focus-ring-brand'
        ),
      },
      size: {
        // Box ladder mirrors Button step for step (28/32/36/40/44), so an
        // icon-only control lines up with a text button of the same size.
        // `2xs` (24px) sits one step BELOW that ladder: the row-action size,
        // which an icon-only control reaches on the padded box around a 14px
        // glyph. Glyph is 16px everywhere and 14px on the two smallest steps.
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
      // The radius tightens one step on the two smallest boxes so a 24/28px
      // square does not read as a pill. Scoped to the default `md` radius so an
      // explicit `rounded` prop still wins.
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
  /**
   * Required. An icon-only control has no visible text, so it must carry its
   * own accessible name or a screen reader announces only "button". Name the
   * ACTION it performs ("Remove file"), never its surrounding context.
   */
  'aria-label': string;
  asChild?: boolean;
  /**
   * Replaces the icon with a spinner and blocks pointer interaction while
   * keeping the variant fill. Sets `aria-busy`; does not toggle `disabled`.
   */
  isLoading?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function IconButton({
  className,
  variant,
  size,
  rounded,
  asChild = false,
  isLoading = false,
  ref,
  children,
  ...props
}: IconButtonProps) {
  const Comp = asChild ? Slot : 'button';

  // The spinner replaces the glyph, so it takes the glyph's size: one step
  // down on the two smallest boxes, 16px on every other step.
  const spinnerSize = size === '2xs' || size === 'xs' ? 'xs' : 'sm';

  return (
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
    >
      {isLoading ? (
        // Decorative: `aria-busy` on the control conveys the loading state.
        <Spinner aria-hidden color="inherit" size={spinnerSize} />
      ) : (
        children
      )}
    </Comp>
  );
}
