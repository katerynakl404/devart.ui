'use client';

import { X } from 'lucide-react';
import type { HTMLAttributes, Ref } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { IconButton } from '../IconButton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

const metaRowVariants = cva(
  cn(
    'flex flex-wrap items-center',
    'gap-3 gap-y-2',
    // Its own vertical space and a 44px floor, so the list below does not
    // move when a selection brings the actions in. No outer margin.
    'min-h-11 py-1.5',
    'border-none',
    'text-sm leading-5'
  ),
  {
    variants: {
      align: {
        start: '',
        between: 'justify-between',
      },
      sticky: {
        false: 'bg-transparent',
        // Page colour, so the rows passing behind it do not show through.
        true: 'sticky z-10 bg-surface-page',
      },
    },
    defaultVariants: { align: 'start', sticky: false },
  }
);

const metaRowPartVariants = cva('', {
  variants: {
    part: {
      count: 'shrink-0 whitespace-nowrap',
      actions: 'ms-auto inline-flex shrink-0 items-center gap-1',
      // Right after the actions the ✕ joins them at their 4px.
      clear: 'ms-auto [[data-slot=meta-row-actions]+&]:-ms-1',
    },
  },
  defaultVariants: { part: 'count' },
});

export interface MetaRowProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metaRowVariants> {
  /** @default 'Clear selection' */
  clearLabel?: string;
  /** CSS length for the sticky `top`, e.g. a sticky header's height. Read only with `sticky`. @default 0 */
  stickyOffset?: string;
  ref?: Ref<HTMLDivElement>;
  /** Leave the selection: renders a ✕ at the end of the row. */
  onClear?: () => void;
}

/**
 * The line above a list: its count and the actions on a selection.
 *
 * It has its own 6px vertical padding and a 44px minimum height, and no outer
 * margin. The list below takes a 4px gap on the stack (`gap-1`).
 */
const MetaRow = ({
  align,
  sticky,
  stickyOffset,
  clearLabel = 'Clear selection',
  className,
  style,
  children,
  ref,
  onClear,
  ...props
}: MetaRowProps) => (
  <div
    ref={ref}
    data-slot="meta-row"
    className={cn(metaRowVariants({ align, sticky }), className)}
    style={sticky ? { top: stickyOffset ?? 0, ...style } : style}
    {...props}
  >
    {children}

    {onClear ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton
            aria-label={clearLabel}
            size="sm"
            variant="tertiary"
            data-slot="meta-row-clear"
            className={metaRowPartVariants({ part: 'clear' })}
            onClick={onClear}
          >
            <X />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>{clearLabel}</TooltipContent>
      </Tooltip>
    ) : null}
  </div>
);

MetaRow.displayName = 'MetaRow';

export { MetaRow, metaRowPartVariants, metaRowVariants };
