'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { BREAKPOINTS } from '../lib/breakpoints';

export { BREAKPOINTS, type Breakpoint } from '../lib/breakpoints';

const getServerSnapshot = () => false;

/**
 * Tracks whether the viewport is narrower than `maxWidth` (px), updating on
 * resize. Generic building block for responsive behavior — pair with a
 * {@link BREAKPOINTS} value to match a Tailwind screen. SSR-safe: renders as
 * `false` on the server and reconciles to the real value on hydration.
 */
export function useMaxWidth(maxWidth: number) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(`(max-width: ${maxWidth - 1}px)`);
      mql.addEventListener('change', onStoreChange);
      return () => mql.removeEventListener('change', onStoreChange);
    },
    [maxWidth]
  );
  const getSnapshot = useCallback(
    () => window.innerWidth < maxWidth,
    [maxWidth]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * True below `breakpoint` (px, default {@link BREAKPOINTS}.md = 768), matching
 * the `md:` utility because both read the same constant. Pass `breakpoint`
 * explicitly if a consumer overrides `screens` in its own Tailwind config.
 */
export function useIsMobile(breakpoint: number = BREAKPOINTS.md) {
  return useMaxWidth(breakpoint);
}
