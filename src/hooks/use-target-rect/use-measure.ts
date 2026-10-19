'use client';

import {
  type DependencyList,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

/** How long after a dependency change the page is re-measured every frame. */
const SETTLE_MS = 900;

/**
 * Layout effect in the browser, plain effect on the server (where there is no
 * layout to read). Also the reason the dependency list below may be the
 * caller's own: this hook is a pass-through for it.
 */
const useBrowserLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Runs `measure` now and again whenever the page could have moved under it:
 * a resize, any scroll (capture phase, so nested scrollers count), a size
 * change of the document, a DOM change, the web fonts arriving — and every
 * frame for a moment after the dependencies change, while the page settles.
 *
 * State changes only when the numbers do (compared as JSON), so a component
 * built on it re-renders when something actually moved and not per event.
 * `measure` may change every render; the latest one is always the one called.
 */
export function useMeasure<T>(measure: () => T, deps: DependencyList) {
  const [value, setValue] = useState<T | null>(null);
  const fn = useRef(measure);
  fn.current = measure;

  /* The caller names what the measurement depends on; `measure` itself is
     read through the ref, so it never needs to be a dependency. */
  useBrowserLayoutEffect(() => {
    let raf = 0;
    let alive = true;
    let last = '';

    const run = () => {
      raf = 0;
      if (!alive) return;
      const next = fn.current();
      const key = JSON.stringify(next);
      if (key !== last) {
        last = key;
        setValue(next);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };

    run();
    const t0 = Date.now();
    const settle = () => {
      if (!alive) return;
      run();
      if (Date.now() - t0 < SETTLE_MS) requestAnimationFrame(settle);
    };
    settle();

    window.addEventListener('resize', schedule);
    document.addEventListener('scroll', schedule, true);
    const ro =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(schedule);
    ro?.observe(document.documentElement);
    const mo =
      typeof MutationObserver === 'undefined'
        ? null
        : new MutationObserver(schedule);
    mo?.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'data-state', 'hidden'],
    });
    document.fonts?.ready.then(schedule);

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('scroll', schedule, true);
      ro?.disconnect();
      mo?.disconnect();
    };
  }, deps);

  return value;
}
