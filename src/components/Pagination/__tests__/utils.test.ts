import { describe, expect, it } from 'vitest';
import {
  getPaginationRange,
  isEllipsisItem,
  type PaginationRangeItem,
  range,
} from '../utils';

const defaults = { siblingCount: 1, boundaryCount: 1 };

describe('range', () => {
  it('produces an inclusive ascending run', () => {
    expect(range({ start: 3, end: 6 })).toEqual([3, 4, 5, 6]);
    expect(range({ start: 2, end: 2 })).toEqual([2]);
  });

  it('produces nothing when the end precedes the start', () => {
    expect(range({ start: 5, end: 4 })).toEqual([]);
  });
});

describe('isEllipsisItem', () => {
  it('separates the two gap markers from page numbers', () => {
    expect(isEllipsisItem('dots-left')).toBe(true);
    expect(isEllipsisItem('dots-right')).toBe(true);
    expect(isEllipsisItem(1)).toBe(false);
  });
});

describe('getPaginationRange', () => {
  it('lists every page while they all fit', () => {
    expect(
      getPaginationRange({ ...defaults, currentPage: 1, totalPages: 7 })
    ).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('opens a gap on the right near the start', () => {
    expect(
      getPaginationRange({ ...defaults, currentPage: 1, totalPages: 20 })
    ).toEqual([1, 2, 3, 4, 5, 'dots-right', 20]);
  });

  it('opens a gap on the left near the end', () => {
    expect(
      getPaginationRange({ ...defaults, currentPage: 20, totalPages: 20 })
    ).toEqual([1, 'dots-left', 16, 17, 18, 19, 20]);
  });

  it('opens both gaps in the middle', () => {
    expect(
      getPaginationRange({ ...defaults, currentPage: 10, totalPages: 20 })
    ).toEqual([1, 'dots-left', 9, 10, 11, 'dots-right', 20]);
  });

  it('widens the window around the current page with siblingCount', () => {
    expect(
      getPaginationRange({
        currentPage: 10,
        totalPages: 20,
        siblingCount: 2,
        boundaryCount: 1,
      })
    ).toEqual([1, 'dots-left', 8, 9, 10, 11, 12, 'dots-right', 20]);
  });

  it('widens the pinned ends with boundaryCount', () => {
    expect(
      getPaginationRange({
        currentPage: 10,
        totalPages: 20,
        siblingCount: 1,
        boundaryCount: 2,
      })
    ).toEqual([1, 2, 'dots-left', 9, 10, 11, 'dots-right', 19, 20]);
  });

  it('copes with a single page', () => {
    expect(
      getPaginationRange({ ...defaults, currentPage: 1, totalPages: 1 })
    ).toEqual([1]);
  });

  /**
   * The concrete cases above pin the shape; this pins the rules the shape must
   * obey for every combination a consumer can reach. Off-by-one slips in the
   * window maths show up here long before anyone notices a duplicated or
   * missing page button in the UI.
   */
  it('always yields strictly ascending, in-range pages that include the current one', () => {
    const offenders: string[] = [];

    for (let totalPages = 1; totalPages <= 30; totalPages++) {
      for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        for (const siblingCount of [0, 1, 2]) {
          for (const boundaryCount of [1, 2]) {
            const items: PaginationRangeItem[] = getPaginationRange({
              currentPage,
              totalPages,
              siblingCount,
              boundaryCount,
            });
            const pages = items.filter(
              (item): item is number => typeof item === 'number'
            );

            const ascending = pages.every(
              (page, index) =>
                index === 0 || (pages[index - 1] as number) < page
            );
            const inRange = pages.every(
              (page) => page >= 1 && page <= totalPages
            );

            if (!ascending || !inRange || !pages.includes(currentPage)) {
              offenders.push(
                `total=${totalPages} current=${currentPage} sibling=${siblingCount} boundary=${boundaryCount} → ${JSON.stringify(items)}`
              );
            }
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
