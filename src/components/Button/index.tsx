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
    //
    // Every variant below also switches its OWN hover recipe off again, because
    // `:hover` still matches a disabled button: without that, a switched-off
    // control lit up under the pointer and read as pressable. It is done per
    // variant rather than once with `disabled:pointer-events-none`, because a
    // disabled button is exactly the one that needs a tooltip saying why it is
    // disabled, and a control with no pointer events cannot open one.
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
          'disabled:hover:bg-state-disabled'
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
          /* No disabled fill at all — not `--state-disabled` and not its own
             `--surface-card` either. A switched-off control should read as
             absent, and a white chip on a white card is invisible while the
             same chip on a tinted one reads as a card of its own. Transparent
             is the one answer that holds on every surface, and it is what
             `outline` already does; the border and the inactive label are
             what carry the state.

             The kit paints `--state-disabled` here (`.s-disabled.btn-secondary`).
             Deliberate divergence. */
          'disabled:border-btn-secondary-border disabled:bg-transparent disabled:text-ink-inactive',
          'disabled:hover:border-btn-secondary-border disabled:hover:bg-transparent'
        ),
        // Brand-bordered, transparent fill (previous Secondary look).
        outline: cn(
          'border-brand-secondary bg-transparent text-ink-body',
          'hover:border-brand-hover hover:bg-btn-outline-bg-hover',
          'pressed:border-brand-hover pressed:bg-btn-outline-bg-press',
          'focus-visible:ring-focus-ring-brand',
          'disabled:border-ink-inactive disabled:bg-transparent disabled:text-ink-inactive',
          'disabled:hover:border-ink-inactive disabled:hover:bg-transparent'
        ),
        // Lowest-emphasis ghost: Outlined minus the border — same brand-tinted
        // hover/press overlays.
        tertiary: cn(
          'border-transparent bg-transparent text-ink-body',
          'hover:bg-state-hover',
          'pressed:bg-state-pressed',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-transparent disabled:text-ink-inactive',
          'disabled:hover:bg-transparent',
          'aria-disabled:pointer-events-none aria-disabled:bg-transparent aria-disabled:text-ink-inactive'
        ),
        // Tertiary with a brand label: the pill, the focus ring and the
        // disabled recipe are the neutral tertiary's, and only the label moves
        // through the brand ramp. The kit ships it as `.btn-tertiary.is-brand`
        // for standalone brand text actions — "Test Connection" in a side
        // panel — where a bordered button would outweigh what it sits next to.
        tertiaryBrand: cn(
          'border-transparent bg-transparent text-brand-primary',
          'hover:bg-state-hover hover:text-brand-hover',
          'pressed:bg-state-pressed pressed:text-brand-press',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-transparent disabled:text-ink-inactive',
          'disabled:hover:bg-transparent disabled:hover:text-ink-inactive',
          'aria-disabled:pointer-events-none aria-disabled:bg-transparent aria-disabled:text-ink-inactive'
        ),
        // Destructive: theme-independent red fill; focus ring is the kit-wide
        // brand teal (red-on-red would be unreadable).
        destructive: cn(
          'border-transparent bg-fb-red text-content-on-solid',
          'hover:bg-fb-error-hover',
          'pressed:bg-fb-error-press',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-state-disabled disabled:text-ink-inactive',
          'disabled:hover:bg-state-disabled'
        ),
        // Destructive outline: red-bordered, transparent fill with red-tinted
        // hover/press. The label is Feedback/Red too — a neutral label under a
        // red border read as an ordinary secondary button and lost the warning.
        destructiveOutline: cn(
          'border-outlineDestructive-border bg-transparent text-fb-red-text',
          'hover:border-outlineDestructive-border-hover hover:bg-outlineDestructive-bg-hover',
          'pressed:border-outlineDestructive-border-hover pressed:bg-outlineDestructive-bg-press',
          'focus-visible:ring-focus-ring-brand',
          'disabled:border-ink-inactive disabled:bg-transparent disabled:text-ink-inactive',
          'disabled:hover:border-ink-inactive disabled:hover:bg-transparent'
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
          'disabled:hover:bg-transparent disabled:hover:text-ink-inactive',
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
        // Four ladders, and only the first one is flat:
        //
        //   padding   8  / 12 / 12 / 16 / 20
        //   gap       4  /  6 /  8 /  8 /  8
        //   label    12  / 14 / 14 / 16 / 16
        //   glyph    14  / 16 / 16 / 20 / 20
        //
        // The padding ladder is the UX audit's (#15, #36) and it is the spec:
        // 12px repeats at sm and md because those are the two sizes the
        // product actually uses, and only the rare large steps open up.
        //
        // A FIELD DOES NOT FOLLOW IT PAST md. Input, InputGroup, Autocomplete
        // and TextArea hold 12px at lg and xl, so the two share an edge at the
        // three steps the product actually uses and part company above them:
        // a button's inset is what makes its label read as a target, while a
        // field is a place to put text and only reads tighter as its value
        // starts further from the edge.
        //
        // The glyph holds 16 from sm through lg. 20px at lg made the icon the
        // loudest thing in a 40px control, next to a 16px label; only xl, where
        // the box is 44, carries it.
        //
        // The glyph repeats at both ends the way the label does — 16 across
        // sm and md, 20 across lg and xl. The kit's 24px `--icon-xl` is taken
        // by nothing: in a 44px control it outgrows its own box.
        //
        // The gap is the one axis with three steps rather than two. 8px is the
        // kit's `.btn` value and holds from `md` up; `xs` tightens to 4,
        // because at 28px a 14px glyph with 8px either side is most of the
        // remaining width; and `sm` sits at 6 — the step the product uses most
        // and the one the published package shipped at every size.
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
