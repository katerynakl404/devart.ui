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
        // A nested row is 8px instead of 10px — see `TableRow nested`. It is a
        // rule of the table, not a property of any one screen: it used to exist
        // only as a local override on a metrics table, which meant every other
        // place that nested rows either invented its own number or did not
        // tighten at all. Horizontal padding does not change; indentation of
        // the first cell belongs to the consumer.
        'group-data-[nested]/row:py-2',
        // `density="compact"` on the table — 6px instead of 10. **Draft.**
        // Stamped on the table and read here for the same reason `layout` is:
        // the row's air is a decision about the whole table, and a cell that
        // took its own would let two columns disagree.
        '[[data-density=compact]_&]:py-1.5',
        // Positioning context for a row link. A navigable row is one real
        // anchor in one cell, stretched over the row with `after:absolute
        // after:inset-0` — see Table.md. The anchor needs a positioned
        // ancestor, and a <tr> cannot be one reliably: `position: relative` on
        // a table row is ignored by some engines, so the cell carries it.
        'relative',
        // The row grows with its content — the cell wraps, and the height comes
        // from the padding plus however many lines the text takes. The kit's
        // `table.tbl td` carries padding, a border and a colour and nothing
        // else, and truncation there is opt-in per column (the Connections
        // description cell) or per variant (the horizontally scrolling table).
        //
        // This used to read `overflow-hidden text-ellipsis whitespace-nowrap`
        // on every cell, with a comment claiming it "only bites under
        // `layout=fixed`". It bit everywhere: `whitespace-nowrap` stops the
        // text wrapping whatever the table-layout is, so under `auto` the
        // column widened instead and the table scrolled sideways. A two-line
        // cell was unreachable in either mode.
        //
        // `fixed` is where a long value genuinely must not blow its column
        // open, because the widths are taken from the first row and never
        // re-measured — so the clamp is scoped to it, keyed off the
        // `data-layout` the table already stamps.
        '[[data-layout=fixed]_&]:overflow-hidden',
        '[[data-layout=fixed]_&]:text-ellipsis',
        '[[data-layout=fixed]_&]:whitespace-nowrap',
        'text-ink-body text-sm',
        '[&:has([role=checkbox])]:pe-0',
        'transition-[background-color] duration-fast [transition-timing-function:ease]',

        // Row fills paint on the cells, not the row: a <tr> background renders
        // *below* every <td>, so a cell with any background of its own would
        // punch a hole through the row state.
        'group-data-[interactive]/row:group-hover/row:bg-tbl-row-hover',
        'group-data-[interactive]/row:group-focus-visible/row:bg-tbl-row-hover',
        // Pressed belongs to whatever was actually pressed. `:active` fires
        // while the pointer is held ANYWHERE inside the row, so pressing a
        // toggle, a kebab or a disclosure inside a clickable row painted the
        // whole row as though the row had been clicked — and an open menu kept
        // it painted afterwards. In a table the click target is the object,
        // not the row; the row takes the pressed fill only when the row itself
        // is what went down. Same guard `Card variant="row"` already carries.
        'group-[[data-interactive]:active:not(:has(button:active)):not(:has(a:active)):not(:has([data-state=open]))]/row:bg-tbl-row-pressed',

        // Selected is not gated on `data-interactive` — a row can be selected
        // without being clickable. Both spellings are supported: the
        // `is-selected` class and Radix-style `data-state="selected"`.
        'group-[.is-selected]/row:bg-tbl-row-pressed',
        'group-data-[state=selected]/row:bg-tbl-row-pressed',

        // A selected row keeps its own surface under the pointer — there is no
        // combined selected+hover colour any more, and no `--tbl-row-selected-hover`
        // to name. Pointing at a selected row used to repaint it, which read as
        // the row becoming *less* selected the moment you touched it.
        //
        // These two still carry `!` because Tailwind emits the `.is-selected`
        // variants before the `data-interactive` ones, so at equal specificity
        // plain hover would win and the selection would visibly disappear. The
        // row still answers the pointer: the controls inside it keep their own
        // hover, which now composites on top of the selected surface.
        'group-[.is-selected]/row:group-hover/row:!bg-tbl-row-pressed',
        'group-[.is-selected]/row:group-active/row:!bg-tbl-row-pressed',
        'group-data-[state=selected]/row:group-hover/row:!bg-tbl-row-pressed',
        'group-data-[state=selected]/row:group-active/row:!bg-tbl-row-pressed',
        className
      )}
      {...props}
    />
  );
}

export { TableCell };
