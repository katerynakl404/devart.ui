'use client';

import { useMemo } from 'react';
import { EllipsisIndicator } from './EllipsisIndicator';
import { FirstButton } from './FirstButton';
import { LastButton } from './LastButton';
import { NextButton } from './NextButton';
import { PageButton } from './PageButton';
import { PrevButton } from './PrevButton';
import { getPaginationRange, isEllipsisItem } from './utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  siblingCount: number;
  boundaryCount: number;
  showFirstLast: boolean;
  showPrevNext: boolean;
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
    <div className="flex items-center gap-2">
      {showFirstLast && (
        <FirstButton
          onClick={() => onPageChange(1)}
          isDisabled={isFirstPage}
          label={labels?.first}
        />
      )}

      {showPrevNext && (
        <PrevButton
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={isFirstPage}
          label={labels?.previous}
        />
      )}

      {paginationRange.map((item) =>
        isEllipsisItem(item) ? (
          <EllipsisIndicator key={item} />
        ) : (
          <PageButton
            key={item}
            page={item}
            isActive={currentPage === item}
            onClick={() => onPageChange(item)}
          />
        )
      )}

      {showPrevNext && (
        <NextButton
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={isLastPage}
          label={labels?.next}
        />
      )}

      {showFirstLast && (
        <LastButton
          onClick={() => onPageChange(totalPages)}
          isDisabled={isLastPage}
          label={labels?.last}
        />
      )}
    </div>
  );
};

Pagination.displayName = 'Pagination';

export { Pagination };
