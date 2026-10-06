'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
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

export interface LinkButtonProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkButtonVariants> {
  /** Render the child element instead of an `<a>` — a router link, a button. */
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
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      className={cn(linkButtonVariants({ tone, variant }), className)}
      {...props}
    >
      {leftSlot}
      {/* `Slottable` marks which child the slotted element replaces. Without
          it, `asChild` with a left or right slot hands Slot three children and
          it throws — the same composition `Button` already uses. */}
      {asChild ? <Slottable>{children}</Slottable> : children}
      {rightSlot}
    </Comp>
  );
}

LinkButton.displayName = 'LinkButton';

export { LinkButton, linkButtonVariants };
