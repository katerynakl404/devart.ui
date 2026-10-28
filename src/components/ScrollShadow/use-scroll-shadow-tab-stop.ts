'use client';

import type { RefObject } from 'react';
import { useLayoutEffect, useState } from 'react';

import type { ScrollShadowOrientation } from '../../hooks/use-scroll-shadow/types';
import { shouldBeTabStop } from './focusable';

export type ScrollShadowFocusable = boolean | 'auto';

interface UseScrollShadowTabStopOptions {
  containerRef: RefObject<HTMLElement | null>;
  orientation: ScrollShadowOrientation;
  focusable: ScrollShadowFocusable;
}

/**
 * Whether the scroll container itself should be a Tab stop.
 * `false` / `true` are fixed; `'auto'` tracks overflow and focusable children.
 */
export function useScrollShadowTabStop({
  containerRef,
  orientation,
  focusable,
}: UseScrollShadowTabStopOptions): boolean {
  const [isAutoTabStop, setIsAutoTabStop] = useState(false);

  useLayoutEffect(() => {
    if (focusable === false) {
      setIsAutoTabStop(false);
      return;
    }

    if (focusable === true) {
      setIsAutoTabStop(true);
      return;
    }

    const element = containerRef.current;

    if (!element) {
      return;
    }

    const update = () => {
      setIsAutoTabStop(shouldBeTabStop(element, orientation));
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(element);

    /* This package's addition: the direct children are observed too. A
       container at its height cap does not resize when its content grows — new
       text in an existing node, a web font arriving, an image loading — and
       none of those is a child-list mutation, so the region would never learn
       it now overflows. A child that grows does resize. Re-observed whenever
       the child list changes. */
    const observeChildren = () => {
      for (const child of Array.from(element.children)) {
        resizeObserver.observe(child);
      }
    };

    observeChildren();

    const mutationObserver = new MutationObserver(() => {
      observeChildren();
      update();
    });
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        'disabled',
        'tabindex',
        'href',
        'contenteditable',
        'type',
      ],
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [containerRef, orientation, focusable]);

  if (focusable === false) {
    return false;
  }

  if (focusable === true) {
    return true;
  }

  return isAutoTabStop;
}
