'use client';

import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn, focusRing, glyphStroke } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

/* IconHint — a glyph beside a name that says one thing on hover: a note
   (the ⓘ — a description, what a field is for), or a state (the triangle for
   a warning, the cross in a circle for an error, the tick for success).

   Not an `IconButton`: it does nothing when pressed, and a button's box
   would sit between the name and the mark. It takes focus only when it has
   a `tooltip` to show, so the hint is reachable without a pointer — the
   kit's focus ring, and its accessible name is `label`.

   The tones are `Alert`'s glyph tones, so a state reads the same in a banner
   and beside a name. `neutral` is the plain note: the icon ink, a step up on
   hover and focus — no fill, an icon that wanted a fill would be a button.

   Without a `tooltip` it is the glyph alone, hidden from assistive tech (the
   words beside it carry the meaning) — a status line's mark. */

const iconHintVariants = cva(
  cn('inline-flex shrink-0 rounded-sm', glyphStroke),
  {
    variants: {
      variant: {
        neutral: cn(
          'text-ink-icon transition-colors duration-fast',
          'hover:text-ink-icon-hover focus-visible:text-ink-icon-hover'
        ),
        info: 'text-brand-tertiary',
        warning: 'text-fb-attention',
        error: 'text-fb-red-text',
        success: 'text-fb-green',
      },
      size: {
        /** 14px — beside a 14px name: a row, a list, a tree. */
        sm: '[&_svg]:size-3.5',
        /** 16px — beside a 16px title. */
        md: '[&_svg]:size-4',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'sm' },
  }
);

const GLYPH = {
  neutral: Info,
  info: Info,
  warning: TriangleAlert,
  error: CircleX,
  success: CircleCheck,
} as const;

export interface IconHintProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof iconHintVariants> {
  /** Shown on hover and keyboard focus. Leave it out for the glyph alone. */
  tooltip?: ReactNode;
  /** The hint's accessible name — "About Finance warehouse", "Has grants that give nothing". Required with a `tooltip`. */
  label?: string;
  /** @default 'top' */
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
}

export function IconHint({
  variant,
  size,
  tooltip,
  label,
  tooltipSide = 'top',
  className,
  ...props
}: IconHintProps) {
  const Glyph = GLYPH[variant ?? 'neutral'];
  if (!tooltip) {
    return (
      <span
        data-slot="icon-hint"
        aria-hidden
        className={cn(iconHintVariants({ variant, size }), className)}
        {...props}
      >
        <Glyph />
      </span>
    );
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          data-slot="icon-hint"
          role="img"
          // biome-ignore lint/a11y/noNoninteractiveTabindex: the hint must be reachable by keyboard to show its tooltip
          tabIndex={0}
          aria-label={label}
          className={cn(
            iconHintVariants({ variant, size }),
            focusRing,
            className
          )}
          {...props}
        >
          <Glyph />
        </span>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export { iconHintVariants };
