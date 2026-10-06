'use client';

import { useMemo } from 'react';
import { EllipsisIndicator } from './EllipsisIndicator';
import { FirstButton } from './FirstButton';
import { LastButton } from './LastButton';
import { NextButton } from './NextButton';
import { PageButton } from './PageButton';
import { PrevButton } from './PrevButton';
import type { PaginationSize } from './size';
import { getPaginationRange, isEllipsisItem } from './utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  siblingCount: number;
  boundaryCount: number;
  showFirstLast: boolean;
  showPrevNext: boolean;
  /**
   * Draw the numbered page buttons. **Draft.**
   *
   * On for everything that is paged by the reader: a page number is a
   * destination, and a list somebody searches through needs to be able to jump.
   *
   * Off for a stream that is read in order — a log, a transcript, an audit
   * trail — where "page 3" names nothing the reader was looking for. There the
   * numbers are three buttons that all do the same thing as Next, and the one
   * of them that is already current does nothing at all. The range beside the
   * control ("Showing 51–100 of 118") keeps the reader's place; Prev and Next
   * move it. Pair it with `showFirstLast={false}`, or First and Last are jumps
   * of their own.
   */
  showPageNumbers?: boolean;
  /**
   * The rung the whole control is drawn on. **Draft.**
   *
   * `sm` (32px) is the default and is right when the pager is the page's own
   * control. `xs` (24px) is for a pager inside a TABLE's footer, where it
   * shares a band with the range it annotates — "Showing 1–20 of 300" at
   * `body12` — and a 32px control beside 12px text is the loudest thing in a
   * footer whose whole job is to be quiet.
   */
  size?: PaginationSize;
  onPageChange: (page: number) => void;
  /** Accessible labels for the navigation buttons, overriding their defaults. */
  labels?: {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
  };
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  showPageNumbers = true,
  size = 'sm',
  labels,
}: PaginationProps) => {
  const paginationRange = useMemo(
    () =>
      getPaginationRange({
        currentPage,
        totalPages,
        siblingCount,
        boundaryCount,
      }),
    [currentPage, totalPages, siblingCount, boundaryCount]
  );

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className={`flex items-center ${size === 'xs' ? 'gap-1' : 'gap-2'}`}>
      {showFirstLast && (
        <FirstButton
          onClick={() => onPageChange(1)}
          isDisabled={isFirstPage}
          label={labels?.first}
          size={size}
        />
      )}

      {showPrevNext && (
        <PrevButton
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={isFirstPage}
          label={labels?.previous}
          size={size}
        />
      )}

      {showPageNumbers &&
        paginationRange.map((item) =>
          isEllipsisItem(item) ? (
            <EllipsisIndicator key={item} size={size} />
          ) : (
            <PageButton
              key={item}
              page={item}
              isActive={currentPage === item}
              onClick={() => onPageChange(item)}
              size={size}
            />
          )
        )}

      {showPrevNext && (
        <NextButton
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={isLastPage}
          label={labels?.next}
          size={size}
        />
      )}

      {showFirstLast && (
        <LastButton
          onClick={() => onPageChange(totalPages)}
          isDisabled={isLastPage}
          label={labels?.last}
          size={size}
        />
      )}
    </div>
  );
};

Pagination.displayName = 'Pagination';

export { Pagination };
