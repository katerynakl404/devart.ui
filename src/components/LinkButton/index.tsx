'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';

const linkButtonVariants = cva(
  cn(
    'inline-flex items-center gap-1.5',
    'cursor-pointer',
    // A link takes the size of the text it sits in. That is the whole point of
    // it being a link and not a button: it belongs to a sentence, or to a card
    // heading, and giving it a size ladder of its own would let it disagree
    // with its own line.
    // `font-medium` only. `font-[inherit]` was here to inherit the FAMILY, but
    // Tailwind reads it as a font-WEIGHT arbitrary value, so tailwind-merge
    // dropped `font-medium` as the loser of the same group and every link
    // rendered at 400 — the kit's `.link` is 500. An anchor inherits its family
    // anyway, so the class was buying nothing and costing the weight.
    'font-medium text-[length:inherit] leading-[inherit]',
    'border-none bg-transparent p-0',
    'transition-colors',
    // The rule sits a quarter of the font-size below the baseline so it clears
    // descenders, and is pinned to 1px so it does not thicken as the text it
    // inherits grows.
    '[text-decoration-thickness:1px] [text-underline-offset:25%]',
    '[&_svg]:size-4 [&_svg]:shrink-0',
    'focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',
    'aria-disabled:text-ink-inactive',
    'aria-disabled:hover:text-ink-inactive aria-disabled:hover:no-underline'
  ),
  {
    variants: {
      /**
       * `standalone` is a link that sits on its own — a row action, a "See
       * all", the end of a card. It carries no rule until the pointer is on
       * it, because in a column of them a permanent underline reads as a
       * table of contents.
       *
       * `inline` is a link inside a sentence, where there is nothing else to
       * mark it: the rule is always there, at 25% of the ink so it reads as a
       * link without cutting the line of text in half. Hover brings it to full
       * strength rather than adding it.
       */
      variant: {
        standalone: 'no-underline hover:underline',
        inline:
          'underline [text-decoration-color:color-mix(in_srgb,currentColor_25%,transparent)] hover:[text-decoration-color:currentColor]',
      },
      tone: {
        /** The default — Brand-600 on light, Tertiary-400 on dark, AA in both. */
        brand: 'text-ink-highlight',
        /** A link inside body copy that must not outshout the sentence. */
        body: 'text-ink-body hover:text-ink-highlight',
        /** On a solid or brand fill, where the highlight ink would vanish. */
        onSolid: 'text-content-on-solid',
      },
    },
    defaultVariants: { tone: 'brand', variant: 'standalone' },
  }
);

/**
 * What a `<button>` brings that a link must not show: the platform's centred
 * label (a wrapped "View more" centred its second line), its own font family
 * and, in Safari, a margin. Tailwind's preflight resets the family; these hold
 * where it does not run. Applied to the button form only — on an `<a>` the
 * alignment is the sentence's to decide. (2026-10-27)
 */
const buttonReset = 'm-0 appearance-none text-start [font-family:inherit]';

export interface LinkButtonProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkButtonVariants> {
  /** Render the child element instead of an `<a>` — a router link. */
  asChild?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
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
 */
function LinkButton({
  asChild,
  tone,
  variant,
  leftSlot,
  rightSlot,
  className,
  children,
  ...props
}: LinkButtonProps) {
  const classes = cn(linkButtonVariants({ tone, variant }), className);

  if (asChild) {
    return (
      <Slot className={classes} {...props}>
        {leftSlot}
        {/* `Slottable` marks which child the slotted element replaces. Without
            it, `asChild` with a left or right slot hands Slot three children
            and it throws — the same composition `Button` already uses. */}
        <Slottable>{children}</Slottable>
        {rightSlot}
      </Slot>
    );
  }

  if (props.href === undefined) {
    return (
      <button
        type="button"
        className={cn(classes, buttonReset)}
        // The anchor's attribute set, on a button: the handlers and the ARIA
        // are the same attributes on either element; only their element type
        // differs.
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {leftSlot}
        {children}
        {rightSlot}
      </button>
    );
  }

  return (
    <a className={classes} {...props}>
      {leftSlot}
      {children}
      {rightSlot}
    </a>
  );
}

LinkButton.displayName = 'LinkButton';

export { LinkButton, linkButtonVariants };
