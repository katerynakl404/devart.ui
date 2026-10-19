import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BREAKPOINTS } from '../../lib/breakpoints';
import { useIsMobile, useMaxWidth } from '../use-mobile';

/**
 * jsdom ships no `matchMedia`, so the hook's subscription side needs a stand-in.
 * This one records the query string it was asked for and exposes the registered
 * listeners, which is what lets a test simulate a viewport change.
 */
const listeners = new Map<string, Set<() => void>>();
let queries: string[] = [];

const setViewport = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    value: width,
    configurable: true,
    writable: true,
  });
};

const emitChange = () => {
  for (const set of listeners.values()) {
    for (const listener of set) listener();
  }
};

beforeEach(() => {
  listeners.clear();
  queries = [];
  window.matchMedia = vi.fn((query: string) => {
    queries.push(query);
    return {
      matches: false,
      media: query,
      addEventListener: (_: string, listener: () => void) => {
        const set = listeners.get(query) ?? new Set();
        set.add(listener);
        listeners.set(query, set);
      },
      removeEventListener: (_: string, listener: () => void) => {
        listeners.get(query)?.delete(listener);
      },
    } as unknown as MediaQueryList;
  }) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useMaxWidth', () => {
  it('is true below the width and false at or above it', () => {
    setViewport(500);
    expect(renderHook(() => useMaxWidth(768)).result.current).toBe(true);

    setViewport(768);
    expect(renderHook(() => useMaxWidth(768)).result.current).toBe(false);

    setViewport(1200);
    expect(renderHook(() => useMaxWidth(768)).result.current).toBe(false);
  });

  /**
   * The subscription asks for `max-width: n - 1` while the value itself comes
   * from `innerWidth < n`. The two agree only because both treat `n` as the
   * first width that is *not* mobile — keep them in step if either changes.
   */
  it('subscribes one pixel below the width it reports on', () => {
    setViewport(500);
    renderHook(() => useMaxWidth(768));
    expect(queries).toContain('(max-width: 767px)');
  });

  it('re-reads the viewport when the media query changes', () => {
    setViewport(1200);
    const { result } = renderHook(() => useMaxWidth(768));
    expect(result.current).toBe(false);

    setViewport(500);
    act(() => emitChange());
    expect(result.current).toBe(true);
  });

  it('detaches its listener on unmount', () => {
    setViewport(500);
    const { unmount } = renderHook(() => useMaxWidth(768));
    expect(listeners.get('(max-width: 767px)')?.size).toBe(1);

    unmount();
    expect(listeners.get('(max-width: 767px)')?.size).toBe(0);
  });
});

describe('useIsMobile', () => {
  it('defaults to the md breakpoint, the same constant the md: utility uses', () => {
    setViewport(BREAKPOINTS.md - 1);
    expect(renderHook(() => useIsMobile()).result.current).toBe(true);

    setViewport(BREAKPOINTS.md);
    expect(renderHook(() => useIsMobile()).result.current).toBe(false);
  });

  it('accepts an explicit breakpoint', () => {
    setViewport(900);
    expect(renderHook(() => useIsMobile(1024)).result.current).toBe(true);
    expect(renderHook(() => useIsMobile(768)).result.current).toBe(false);
  });
});
