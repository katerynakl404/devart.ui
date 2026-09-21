'use client';

import { ChevronDown, ChevronsUpDown } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * How a column claims its width.
 *
 * Named by what the column holds, because that is the thing a page actually
 * knows. The numbers behind the names belong to the system.
 *
 * | | |
 * |---|---|
 * | `auto` | no width — takes whatever is left. The reading column: a name, a title, a description. Truncation here costs the user something, so this is the one that gets the slack. |
 * | `control` | 48px. A checkbox or a single toggle — a control has one correct size and does not benefit from more. |
 * | `actions` | 112px. The row's trailing cluster, matching `TableActionsCell`. |
 * | `sm` | 12% — a toggle with its label, a short flag. |
 * | `md` | 16% — a connector mark and a word, a status badge, a timestamp. |
 * | `lg` | 20% — a count with a disclosure, or text with a control beside it. |
 *
 * `sm`/`md`/`lg` are **shares of the table, not sizes**. That distinction is
 * the entire point and is why this ladder is allowed to exist where a pixel
 * ladder is not: 16% narrows when the table narrows, `w-48` does not.
 *
 * **Why the text columns are percentages and not pixels.** A table that loads,
 * filters or paginates must be `layout="fixed"` (see Table.md), or its columns
 * jump between the empty state, the loading row and every page of data. Under
 * `fixed` the specified widths are the whole algorithm: content does not size
 * anything, and — measured, not assumed — **`min-width` on a `th` is ignored
 * outright**, so a pixel width with a floor under it is a floor that never
 * holds. A percentage is the only width that narrows when the table narrows.
 *
 * An earlier version of this offered `fit` ("as wide as its contents") on the
 * reasoning that a fixed width is a reservation which cannot hand its pixels
 * back. The reasoning was right and the mechanism was wrong: content sizing
 * only exists under `auto` layout, and under `fixed` `width:0` means zero —
 * it collapsed four columns to their padding. A **share** is what that argument
 * was actually reaching for. A share is not a reservation; it shrinks.
 *
 * The percentages are set from measured content at the narrowest the table is
 * allowed to be (a 58rem container): 12% ≈ 111px, 16% ≈ 148px, 20% ≈ 186px,
 * against columns whose widest content measured 102, 142 and 157px.
 *
 * The floor belongs to the table, not to the column: give the scroll container
 * a `min-width` and every percentage column inherits a sensible minimum from
 * it. One number, in one place, instead of one per column.
 */
export type TableColumnWidth =
  | 'auto'
  | 'control'
  | 'actions'
  | 'sm'
  | 'md'
  | 'lg';

export type TableSortDirection = 'asc' | 'desc' | undefined;

interface TableHeadProps extends ComponentProps<'th'> {
  /**
   * Whether the column shares the leftover width or takes only what it needs.
   *
   * @default 'auto'
   */
  width?: TableColumnWidth;
  sortable?: boolean;
  sortDirection?: TableSortDirection;
  onSort?: () => void;
}

function SortIcon({ direction }: { direction: TableSortDirection }) {
  if (!direction) {
    /* The glyph hovers with the label. It rests a step quieter — an
       unsorted column should not shout — but the two move together, or the
       header reads as two controls, one of which answers the pointer. */
    return (
      <ChevronsUpDown className="size-3.5 text-ink-inactive transition-colors group-hover:text-ink-icon-hover" />
    );
  }

  return (
    <ChevronDown
      className={cn(
        'size-3.5 text-ink-body transition-[transform,color] duration-base',
        'group-hover:text-ink-icon-hover',
        direction === 'asc' && 'rotate-180'
      )}
    />
  );
}

function TableHead({
  className,
  children,
  width = 'auto',
  sortable,
  sortDirection = undefined,
  onSort,
  ...props
}: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      aria-sort={
        sortable
          ? sortDirection === 'asc'
            ? 'ascending'
            : sortDirection === 'desc'
              ? 'descending'
              : 'none'
          : undefined
      }
      className={cn(
        // Same 10px/16px padding as TableCell, deliberately duplicated rather
        // than shortened: a header inset that differs from its column's body
        // inset is the single most visible table defect there is.
        // 36px, fixed, and the vertical inset comes FROM that height rather
        // than from padding. Measured: a header row was 36.5px in a table with
        // no selection column and 38.5px in one with it, because an 18px
        // checkbox is taller than the 16px line the labels sit on and padding
        // adds to whatever is tallest. Two tables on the same screen, two
        // header heights, for a reason that has nothing to do with the header.
        //
        // `h-9` alone did not fix it — on a table cell `height` is a minimum,
        // so 20px of padding around an 18px control still won. The padding has
        // to yield: at `py-0` the cell is exactly 36px and `align-middle`
        // centres whatever is in it, which puts a 16px label at the same 10px
        // from the top it had before. The label does not move; only the extra
        // 2px under a checkbox goes.
        //
        // 36px is also what the kit's `table.tbl th` computes to (.625rem of
        // padding around a 16px line), so this is the height the header always
        // meant to be. Safe as a fixed height because a header never wraps —
        // `whitespace-nowrap` is right below — and nothing in one is taller
        // than the 18px control that caused this.
        //
        // `TableCell` keeps its padding and still grows with its content (§43):
        // a body row has to be able to hold two lines, a header does not.
        'h-9 px-4 py-0 align-middle',
        // The header tightens with the body — 28px against 36. **Draft**, with
        // `Table density="compact"`. A header that keeps its height over a
        // tightened body stops reading as that body's header.
        '[[data-density=compact]_&]:h-7',
        'whitespace-nowrap text-left',
        width === 'control' && 'w-12',
        width === 'actions' && 'w-28',
        width === 'sm' && 'w-[12%]',
        width === 'md' && 'w-[16%]',
        width === 'lg' && 'w-[20%]',
        'font-medium text-ink-secondary text-xs leading-4',
        '[&:has([role=checkbox])]:pe-0',
        className
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            'inline-flex items-center gap-1.5 rounded',
            /* The sort control is a label plus a standalone glyph — no box to
               fill — so hover and press are carried by colour alone, on the
               icon tokens. */
            /* Hover only. A sort header is not a press target — it commits on
               click and the result is the table reordering, which is feedback
               enough; a press colour on a control with no box reads as a
               flicker. */
            'group transition-colors hover:text-ink-icon-hover',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-table-header-bg',
            sortDirection && 'text-ink-body'
          )}
        >
          {children}
          <SortIcon direction={sortDirection} />
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export { TableHead };
