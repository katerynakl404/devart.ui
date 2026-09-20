'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { IconButton } from '../IconButton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
import { Typography } from '../Typography';

const metaRowVariants = cva(
  cn(
    'flex flex-wrap items-center',
    // 12px between members, 8px when the row wraps.
    'gap-3 gap-y-2',
    // The row owns its own 6px of vertical air, and its floor is the height it
    // has WITH actions: a 32px `sm` button plus that padding is 44px, so a
    // shorter floor let the row grow the moment a selection appeared and the
    // list under it jumped. 44 is the row at its tallest, always.
    'min-h-11 py-1.5',
    // Transparent on purpose: no background, no border, no card. It belongs to
    // the list under it, and a surface of its own would make it a toolbar.
    'border-none bg-transparent',
    // One typographic group — the count, the link and the buttons all read at
    // the same Body level rather than as three separate things.
    'text-sm leading-5'
  ),
  {
    variants: {
      variant: {
        /**
         * The default. The count and the action next to it stay together, so
         * the link reads as belonging to the number — "10 conversations ·
         * Select all", not two things anchored to opposite edges.
         */
        cluster: '',
        /** The action belongs on the far edge. */
        split: 'justify-between',
      },
    },
    defaultVariants: { variant: 'cluster' },
  }
);

export interface MetaRowProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metaRowVariants> {
  /**
   * Leave the selection. Renders a ✕ at the very end of the row.
   *
   * Part of the component rather than something each page adds, because it is
   * part of the contract: once a selection changes what the row and its list
   * mean, there has to be a way out of it that is not "undo whatever you did".
   * Give it a handler whenever the row has a selection to leave.
   */
  onClear?: () => void;
  /** @default 'Clear selection' */
  clearLabel?: string;
}

/**
 * The line above a list: what it holds, and what can be done to a selection.
 *
 * ## Spacing — the one rule
 *
 * `MetaRow` supplies **its own** vertical space (6px top and bottom, **44px
 * minimum**) and **no outer margin**. Whatever follows it takes **4px**:
 *
 * ```jsx
 * <div className="flex flex-col gap-1">
 *   <MetaRow>…</MetaRow>
 *   <Table>…</Table>
 * </div>
 * ```
 *
 * A gap on the stack, not a margin on either — **never both**. A row with its
 * own padding, a margin under it and a stack gap around it is three answers to
 * one question, and it is why this distance drifts between pages.
 *
 * The 44px minimum is the other half of the contract, and it is not decoration:
 * the row is already that tall with nothing in it, so the list below does not
 * move when a selection appears and the actions arrive.
 *
 * ## What goes in it
 *
 * `MetaRow.Count` for the reading, a `Link` beside it for the action that
 * belongs to the count, and `MetaRow.End` for the cluster that acts on a
 * selection. Buttons in it are `size="sm"` and **tertiary** — the row is a
 * reading with actions attached, not a toolbar, and an outlined destructive
 * button here outweighs the list it sits above.
 */
function MetaRow({
  variant,
  onClear,
  clearLabel = 'Clear selection',
  className,
  children,
  ...props
}: MetaRowProps) {
  return (
    <div
      data-slot="meta-row"
      className={cn(metaRowVariants({ variant }), className)}
      {...props}
    >
      {children}
      {onClear ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton
              aria-label={clearLabel}
              /* `sm`, the same rung the row's action buttons sit on. They end
                 up side by side at the row's right edge, and two controls on
                 one line at two different box sizes read as a control and an
                 afterthought — which is not what leaving a selection is. */
              size="sm"
              variant="tertiary"
              /* Last in the row and outside `MetaRow.End`: leaving is not one
                 of the actions that act on the selection, it is the way out of
                 having one.

                 It claims the right edge only when `MetaRow.End` is not there
                 to claim it. Two flex items with `margin-inline-start:auto`
                 do not queue up at the edge — they SPLIT the free space
                 between them, which parked the Delete button in the middle of
                 the row with the ✕ out at the end.

                 This was `last:ms-auto`, meant as "only if nothing else took
                 the edge". It is not that: `:last-child` is true whenever the
                 ✕ is last in the row, which is always. The condition has to
                 look at what comes BEFORE it, so it is a sibling selector.

                 Beside the actions it also gives back half the row's gap. The
                 row spaces its MEMBERS 12px apart — the count, the link, the
                 action cluster — but the ✕ is not another member out at the
                 edge, it belongs to the cluster it follows. At 12px (plus the
                 button's own inset, so ~17px to the eye) it read as stranded;
                 at 8px it reads as the end of that group without collapsing
                 into it the way the cluster's own 4px would. */
              className="ms-auto [[data-slot=meta-row-end]+&]:-ms-1"
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
}

/** The reading: "5 connections", "3 selected". Never wraps. */
function MetaRowCount({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <Typography
      element="span"
      textStyle="body14"
      textColor="secondary"
      className={cn('shrink-0 whitespace-nowrap', className)}
      {...props}
    >
      {children}
    </Typography>
  );
}

/**
 * The right-edge cluster — the actions that apply to a selection.
 *
 * 4px between them, not the row's 12px: they are one group, and spacing them
 * like row members makes three buttons read as three unrelated things.
 */
function MetaRowEnd({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="meta-row-end"
      className={cn(
        'ms-auto inline-flex shrink-0 items-center gap-1',
        className
      )}
      {...props}
    />
  );
}

MetaRow.displayName = 'MetaRow';
MetaRowCount.displayName = 'MetaRow.Count';
MetaRowEnd.displayName = 'MetaRow.End';

MetaRow.Count = MetaRowCount;
MetaRow.End = MetaRowEnd;

export { MetaRow, MetaRowCount, MetaRowEnd, metaRowVariants };
