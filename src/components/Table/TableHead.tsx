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
        'px-4 py-2.5 align-middle',
        // 36px, fixed — the header's height is the component's, never a
        // consequence of what a column happens to hold.
        //
        // Without it the row measured itself from its contents, and a sortable
        // head renders an `inline-flex` button where a plain one renders a
        // text node. An inline-level box sits on the baseline, so the line box
        // around it reserves descender space that bare text does not use: the
        // same header was ~4px taller with sorting than without. Tables that
        // turn sorting off when there is nothing to sort — correctly, a sort
        // control that cannot reorder anything is a control that lies — got a
        // header that changed height the moment a search stopped matching.
        //
        // 36px is what the non-sortable header already was, and what the kit's
        // `table.tbl th` computes to (.625rem padding + a 16px line). Safe as
        // a fixed height because the header never wraps — `whitespace-nowrap`
        // is right below.
        'h-9',
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
