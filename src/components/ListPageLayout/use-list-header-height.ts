'use client';

import { type RefObject, useLayoutEffect } from 'react';
import { useMaxWidth } from '../../hooks/use-mobile';
import { BREAKPOINTS } from '../../lib/breakpoints';

/** CSS var for sticky header height — consumers offset with `var(--list-header-height, 0px)`. */
export const LIST_HEADER_HEIGHT_CSS_VAR = '--list-header-height';

/**
 * Writes header height onto `target` below `lg` (sticky range).
 * Above `lg` removes the var so fallback `0px` applies.
 *
 * `hasHeader` is the caller's render condition for the header. A ref going from
 * an element to `null` re-runs nothing by itself, so without it a header removed
 * after mount would leave its last height published.
 *
 * Returns whether the viewport is in that sticky range, so the layout condenses
 * the header only where it stays on screen.
 */
export const useListHeaderHeight = (
  headerRef: RefObject<HTMLDivElement | null>,
  targetRef: RefObject<HTMLDivElement | null>,
  hasHeader: boolean
) => {
  const isBelowLg = useMaxWidth(BREAKPOINTS.lg);

  useLayoutEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const header = hasHeader ? headerRef.current : null;
    if (!header || !isBelowLg) {
      target.style.removeProperty(LIST_HEADER_HEIGHT_CSS_VAR);
      return;
    }

    const updateHeaderHeight = () => {
      target.style.setProperty(
        LIST_HEADER_HEIGHT_CSS_VAR,
        `${header.offsetHeight}px`
      );
    };

    updateHeaderHeight();

    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(updateHeaderHeight);

    observer?.observe(header);

    return () => {
      observer?.disconnect();
      target.style.removeProperty(LIST_HEADER_HEIGHT_CSS_VAR);
    };
  }, [hasHeader, isBelowLg, headerRef, targetRef]);

  return isBelowLg;
};
