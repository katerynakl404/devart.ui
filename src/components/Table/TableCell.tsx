import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        // One padding recipe, shared verbatim with TableHead: 10px/16px. The two
        // must stay identical or every column's header sits off its own body
        // text. Height comes from the padding, never from an `h-*` lock — a
        // two-line cell has to be free to grow.
        'px-4 py-2.5 align-middle',
        // Truncate rather than wrap. In an auto-layout table the column just
        // widens, so this only bites under `layout="fixed"` — which is exactly
        // where a long value must not blow its column open.
        'overflow-hidden text-ellipsis whitespace-nowrap',
        'text-ink-body text-sm',
        '[&:has([role=checkbox])]:pe-0',
        'transition-[background-color] duration-fast [transition-timing-function:ease]',

        // Row fills paint on the cells, not the row: a <tr> background renders
        // *below* every <td>, so a cell with any background of its own would
        // punch a hole through the row state.
        'group-data-[interactive]/row:group-hover/row:bg-tbl-row-hover',
        'group-data-[interactive]/row:group-focus-visible/row:bg-tbl-row-hover',
        'group-data-[interactive]/row:group-active/row:bg-tbl-row-pressed',

        // Selected is not gated on `data-interactive` — a row can be selected
        // without being clickable. Both spellings are supported: the
        // `is-selected` class and Radix-style `data-state="selected"`.
        'group-[.is-selected]/row:bg-tbl-row-pressed',
        'group-data-[state=selected]/row:bg-tbl-row-pressed',

        // Hover/press *while selected* has to out-specify plain hover, and
        // Tailwind emits the `.is-selected` variants first in the stylesheet, so
        // same-specificity ordering would otherwise hand the win to hover.
        'group-[.is-selected]/row:group-hover/row:!bg-tbl-row-selected-hover',
        'group-[.is-selected]/row:group-active/row:!bg-tbl-row-pressed',
        'group-data-[state=selected]/row:group-hover/row:!bg-tbl-row-selected-hover',
        'group-data-[state=selected]/row:group-active/row:!bg-tbl-row-pressed',
        className
      )}
      {...props}
    />
  );
}

export { TableCell };
