'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode, Ref } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';

const linkButtonVariants = cva(
  cn(
    'inline-flex items-center gap-1.5',
    'cursor-pointer',
    // A link takes the size of the text it sits in.
    'font-medium text-[length:inherit] leading-[inherit]',
    // Element reset: the same look whether it renders an <a> or a <button>.
    'm-0 appearance-none border-none bg-transparent p-0 text-start font-[family-name:inherit]',
    'transition-colors',
    'decoration-1 underline-offset-[25%]',
    '[&_svg]:size-4 [&_svg]:shrink-0',
    'focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',
    'aria-disabled:cursor-not-allowed aria-disabled:text-ink-inactive',
    'aria-disabled:no-underline aria-disabled:hover:text-ink-inactive'
  ),
  {
    variants: {
      variant: {
        primary: 'text-ink-highlight',
        secondary: 'text-ink-body hover:text-ink-highlight',
        white: 'text-content-on-solid',
      },
      inline: {
        // Standalone: nothing else around it, so the rule appears on hover.
        false: 'no-underline hover:underline',
        // Inside a sentence the rule is always there, at 25% of the ink so it
        // does not cut the line in half; hover brings it to full strength.
        true: 'underline decoration-link-underline hover:decoration-current',
      },
    },
    defaultVariants: { variant: 'primary', inline: false },
  }
);

export interface LinkButtonProps
  extends Omit<AnchorHTMLAttributes<HTMLElement>, 'type'>,
    VariantProps<typeof linkButtonVariants> {
  /** Render the child element instead of an `<a>` — a router link. */
  asChild?: boolean;
  disabled?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  ref?: Ref<HTMLElement>;
}

/**
 * A text link.
 *
 * It is not a `Button variant="transparent"`: a button is a control with a size
 * and a hit box, a link is a word inside text. Reaching for the button gave
 * every "Permissions →" in the product its own padding and its own font size,
 * which is why it never lined up with the heading beside it.
 *
 * **With `href` it is an `<a>`; without one it is a `<button type="button">`**
 * with the same look (2026-10-27). A link-styled control that ACTS rather than
 * goes somewhere — "Select all", "View more", "Set up" on a row — was an `<a>`
 * with an `onClick` and no `href`: not in the tab order, not a button to a
 * screen reader, and Enter did nothing. Pages wrapped a `<button>` in
 * `asChild` to get the semantics back. The element now follows the one fact
 * that decides it — whether there is somewhere to go. `asChild` still renders
 * whatever it is given.
 *
 * **`disabled` blocks the click, not only the colour.** The `<button>` gets the
 * native `disabled`. An `<a>` has no such attribute: it gets `aria-disabled`
 * and its click — mouse or Enter — is cancelled. With `asChild` the click is
 * cancelled too, but the child's own handlers still run first.
 */
const LinkButton = ({
  asChild = false,
  disabled = false,
  variant,
  inline,
  leftSlot = null,
  rightSlot = null,
  className,
  children,
  onClick,
  ref,
  ...props
}: LinkButtonProps) => {
  const classes = cn(linkButtonVariants({ variant, inline }), className);
  const ariaDisabled = disabled || undefined;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  };

  if (asChild) {
    return (
      <Slot
        ref={ref}
        data-slot="link-button"
        className={classes}
        aria-disabled={ariaDisabled}
        onClick={handleClick}
        {...props}
      >
        {leftSlot}
        <Slottable>{children}</Slottable>
        {rightSlot}
      </Slot>
    );
  }

  if (props.href === undefined) {
    return (
      <button
        type="button"
        ref={ref as Ref<HTMLButtonElement>}
        data-slot="link-button"
        className={classes}
        disabled={disabled}
        aria-disabled={ariaDisabled}
        onClick={handleClick}
        {...props}
      >
        {leftSlot}
        {children}
        {rightSlot}
      </button>
    );
  }

  return (
    <a
      ref={ref as Ref<HTMLAnchorElement>}
      data-slot="link-button"
      className={classes}
      href={props.href}
      aria-disabled={ariaDisabled}
      onClick={handleClick}
      {...props}
    >
      {leftSlot}
      {children}
      {rightSlot}
    </a>
  );
};

LinkButton.displayName = 'LinkButton';

export { LinkButton, linkButtonVariants };
