'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

const badgeVariants = cva(
  cn(
    // The hairline is the BASE, not a variant. `--badge-border` mixes from
    // `currentColor`, so the border is the chip's own hue on every variant, and
    // a chip stays defined on a surface its fill happens to match — a Secondary
    // badge is `--surface-card2`, which is also what a hovered or selected
    // table row lands on. `flat` is the opt-out.
    // No `gap` here — it steps with the size, below. A flat 8px meant the
    // space between the glyph and the label was wider than the chip's own 6px
    // edge inset at `sm`, which is what makes a small pill read as two things
    // in a box rather than one chip.
    'inline-flex items-center border border-badge-border',
    // The height is fixed by `size`, so the label must never wrap: a second
    // line does not make the pill taller, it spills out of it — the text runs
    // over the border and the chip reads as broken. `Badge.md` already said a
    // chip is one or two words; this is that rule in CSS rather than in prose,
    // for the cases the author cannot see (a narrow column, a long locale, a
    // count that reaches three digits).
    //
    // `overflow-hidden` is the other half of it, and it is what makes the pill
    // shrinkable at all: a flex item's automatic minimum size is its content
    // width until the item hides its overflow, at which point it becomes 0. So
    // a badge with too little room narrows and ellipsises INSIDE its own
    // border, instead of either wrapping or running out across its neighbour.
    'whitespace-nowrap overflow-hidden',
    // reference: `.badge .b-ic { width:14px; height:14px; flex:none }`
    '[&_svg]:shrink-0',
    'font-medium',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-focus-ring-brand',
    'focus:ring-offset-2'
  ),
  {
    variants: {
      variant: {
        primary: 'bg-badge-primary-bg text-badge-primary-text',
        secondary: 'bg-badge-secondary-bg text-badge-secondary-text',
        attention: 'bg-fb-attention/15 text-fb-attention',
        success: 'bg-fb-green/15 text-fb-green',
        error: 'bg-fb-red/15 text-fb-red-text',
        // `brand` and `green` are fill choices, not "the bordered ones": they
        // keep their own opaque border token because their fill is opaque too.
        brand:
          'border-badge-brand-border bg-badge-brand-bg text-badge-brand-text',
        green:
          'border-badge-green-border bg-badge-green-bg text-badge-green-text',
      },
      // Height, inset, gap and glyph step together. The kit sets the base at
      // 28px / 8px gap / 14px glyph and `badge-sm` at 20px / 6px inset / 4px
      // gap / 12px glyph, with the reason written next to it: "a 14px glyph in
      // a 20px pill leaves 3px of air — step down".
      size: {
        xs: 'h-5 gap-1 px-2 text-xs [&_svg]:size-3',
        sm: 'h-5 gap-1 px-1.5 text-xs [&_svg]:size-3',
        md: 'h-7 gap-2 px-2.5 text-xs [&_svg]:size-3.5',
        lg: 'h-8 gap-2 px-2.5 text-sm [&_svg]:size-4',
        xl: 'h-9 gap-2 px-2.5 text-sm [&_svg]:size-4',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        rounded: 'rounded',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
      flat: {
        true: 'border-transparent',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'md',
      flat: false,
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  withDot?: boolean;
  removeLabel?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  onDelete?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Text shown on hover and on keyboard focus.
   *
   * A badge is a STATUS, never a control: it carries no action, and a tooltip
   * is the only behaviour it is allowed to have. Without this prop every page
   * that wanted the tooltip wrapped the badge in a `<button>` — which gives it
   * `role="button"`, a press state and a promise of an action it does not
   * keep. Here the trigger stays the badge itself, made reachable with
   * `tabIndex` and nothing else.
   */
  tooltip?: ReactNode;
  /** @default 'top' */
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
}

function Badge({
  withDot,
  removeLabel = 'Remove',
  variant,
  size,
  rounded,
  flat,
  leftSlot,
  rightSlot,
  onDelete,
  tooltip,
  tooltipSide = 'top',
  className,
  children,
  ...props
}: BadgeProps) {
  const badge = (
    <div
      className={cn(badgeVariants({ variant, rounded, size, flat }), className)}
      tabIndex={tooltip ? 0 : undefined}
      {...props}
    >
      {withDot && (
        <span
          aria-hidden
          className="size-1.5 shrink-0 rounded-full bg-current"
        />
      )}

      {leftSlot ? <span className="inline-flex shrink-0">{leftSlot}</span> : null}

      {/* `min-w-0` + `truncate`: the label is the part that gives way. The dot,
          the slots and the delete control are `shrink-0`, so a squeezed badge
          loses characters from its text and keeps its glyphs — a chip reading
          `Not config…` still says what it is, one with half a glyph does not. */}
      <span className="inline-block min-w-0 truncate align-text-top leading-none">
        {children}
      </span>

      {rightSlot ? <span className="inline-flex shrink-0">{rightSlot}</span> : null}

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-sm',
            'opacity-70 transition-opacity',
            'hover:opacity-100',
            'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card'
          )}
        >
          <X />
          <span className="sr-only">{removeLabel}</span>
        </button>
      )}
    </div>
  );

  if (!tooltip) return badge;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export { Badge, badgeVariants };
