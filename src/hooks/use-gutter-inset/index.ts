'use client';

import type { CSSProperties, RefObject } from 'react';
import { useLayoutEffect, useState } from 'react';

/**
 * The style a scrolling body needs so its scrollbar costs the content nothing
 * on one side only (§176, §178).
 *
 * The gutter is reserved whether or not the body overflows
 * (`scrollbar-gutter: stable`), so the content does not change width as it
 * begins to scroll; and the right padding is the body's LEFT padding less the
 * bar's width, both measured. The bar is whatever the platform draws —
 * `scrollbar-thin` is 8px in Firefox, about 11px in Chrome on Windows, 0 where
 * scrollbars overlay — so the content is inset alike on both sides, with a bar
 * or without one, whatever padding the body was given.
 *
 * Re-measured on resize: a zoom or a display-scale change re-sizes the bar in
 * CSS px. Until the first measure, no padding is set and the class's own holds.
 */
export function useGutterInset(
  ref: RefObject<HTMLElement | null>
): CSSProperties {
  const [bar, setBar] = useState(0);
  const [start, setStart] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const cs = getComputedStyle(el);
      const border =
        (Number.parseFloat(cs.borderLeftWidth) || 0) +
        (Number.parseFloat(cs.borderRightWidth) || 0);
      setBar(Math.max(0, el.offsetWidth - el.clientWidth - border));
      setStart(Number.parseFloat(cs.paddingLeft) || 0);
    };
    measure();
    window.addEventListener('resize', measure);
    const ro =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(measure);
    ro?.observe(el);
    return () => {
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [ref]);

  return {
    scrollbarGutter: 'stable',
    paddingInlineEnd:
      start == null ? undefined : `${Math.max(0, start - bar)}px`,
  };
}
