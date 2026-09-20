import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

interface TableRowProps extends ComponentProps<'tr'> {
  /**
   * This row belongs to the row above it — a metric under its provider, a
   * schema under its connection, a child under its group.
   *
   * It tightens the row to 8px of vertical padding against a top-level row's
   * 10px. That is the whole difference, and it is deliberately the only one: a
   * nested row set at the same height as its parent reads as its sibling, and
   * the tighter rhythm is what says it is not. Anything louder — an indent
   * rule, a tint, a smaller type size — makes a child row look like a
   * different kind of object rather than the same object one level down.
   *
   * Indentation of the first cell is a separate decision and stays with the
   * consumer: how far in a child sits depends on what is in the parent's first
   * cell (a chevron, a logo, both), which the table cannot know.
   */
  nested?: boolean;
}

function TableRow({ className, nested, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      // `group/row` is the hook every row-scoped rule hangs off: the cell fills
      // in TableCell and the hover/focus reveal in TableActionsCell.
      //
      // `nested` is an attribute rather than a class for the same reason: the
      // cells are what carry the padding, and they read it back off the row
      // through the group.
      data-nested={nested ? '' : undefined}
      className={cn('group/row border-stroke border-b', className)}
      {...props}
    />
  );
}

export { TableRow };
