'use client';

import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn, focusRing } from '../../lib/utils';
import { StatusMark, type statusMarkVariants } from '../StatusMark';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

/* IconHint — the glyph beside a name that explains itself: a note (the ⓘ — a
   description, what a field is for), or a state that needs a reason.

   It is a glyph and nothing more. Not a button: on a desktop pressing it does
   nothing, so it must not be marked or painted as a control. The words arrive
   on hover, on keyboard focus (focus is the keyboard's hover), and on a long
   press where there is no hover — and that last part is NOT here. It belongs
   to `Tooltip` itself (`TooltipTrigger`), so every tooltip in the kit gets it
   at once rather than this one glyph getting a private rule.

   The glyph and its tones are `StatusMark`, which is also the whole component
   where there is nothing to explain. */

const iconHintVariants = cva(
  cn('group/icon-hint inline-flex shrink-0 rounded-sm', focusRing)
);

export interface IconHintProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>,
    Pick<VariantProps<typeof statusMarkVariants>, 'variant' | 'size'> {
  /**
   * The words it exists to show — on hover, on keyboard focus, and on a long
   * press. Required: a mark with nothing to say is a `StatusMark`, not a hint.
   */
  tooltip: ReactNode;
  /** The hint's accessible name — "About Finance warehouse". Required. */
  label: string;
  /** @default 'top' */
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  ref?: Ref<HTMLSpanElement>;
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
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          aria-label={label}
          className={cn(iconHintVariants(), className)}
          data-slot="icon-hint"
          role="img"
          // biome-ignore lint/a11y/noNoninteractiveTabindex: the hint must be reachable by keyboard to show its words — focus is the keyboard's hover
          tabIndex={0}
          {...props}
        >
          <StatusMark interactive size={size} variant={variant} />
        </span>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export { iconHintVariants };
