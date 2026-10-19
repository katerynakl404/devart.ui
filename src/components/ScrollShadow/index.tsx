'use client';

import type { ComponentProps, Ref } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useScrollShadow } from '../../hooks/use-scroll-shadow';
import type { ScrollShadowVisibility } from '../../hooks/use-scroll-shadow/types';
import { cn, focusRing } from '../../lib/utils';

export type { ScrollShadowVisibility } from '../../hooks/use-scroll-shadow/types';

export interface ScrollShadowProps extends Omit<ComponentProps<'div'>, 'size'> {
  ref?: Ref<HTMLDivElement>;
  size?: number;
  offset?: number;
  orientation?: 'vertical' | 'horizontal';
  visibility?: ScrollShadowVisibility;
  isEnabled?: boolean;
  onVisibilityChange?: (visibility: ScrollShadowVisibility) => void;
}

/**
 * A scrollable container component that automatically displays fade-in/fade-out shadows
 * at the edges when content overflows, providing visual feedback for scrollable content.
 */
export function ScrollShadow({
  ref,
  children,
  className,
  size = 40,
  offset = 0,
  orientation = 'vertical',
  visibility = 'auto',
  isEnabled = true,
  style,
  onVisibilityChange,
  ...props
}: ScrollShadowProps) {
  const internalRef = useRef<HTMLDivElement | null>(null);

  /* Whether this region can be scrolled AT ALL.

     `tabIndex={0}` is here because a scroll container with no focusable child
     cannot be reached by keyboard, and then its overflow is unreachable too.
     But it was unconditional, and a region that does not overflow has nothing
     to reach: it still took focus, and in a dialog — where `ModalBody` IS a
     ScrollShadow — the first thing focused on open was the body text, which the
     browser then outlined. A paragraph with a focus ring round it reads as a
     field somebody is about to type in.

     So the tab stop appears with the overflow and goes with it. Measured on the
     element, re-measured when it or its content resizes, because content
     arriving later is exactly when this changes. */
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const node = internalRef.current;
    if (!node) return;

    const measure = () => {
      setIsScrollable(
        orientation === 'vertical'
          ? node.scrollHeight > node.clientHeight + 1
          : node.scrollWidth > node.clientWidth + 1
      );
    };

    measure();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    for (const child of Array.from(node.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [orientation, children]);

  useScrollShadow({
    containerRef: internalRef,
    orientation,
    size,
    offset,
    visibility,
    isEnabled,
    onVisibilityChange,
  });

  const scrollPaddingStyle =
    orientation === 'vertical'
      ? { scrollPaddingBlock: `${size}px` }
      : { scrollPaddingInline: `${size}px` };

  return (
    <div
      ref={(node) => {
        internalRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={cn(
        orientation === 'vertical' ? 'overflow-y-auto' : 'overflow-x-auto',
        /* The kit's own ring, not the browser's outline. `focusRing` is the
           one recipe the kit has left — the neutral  is gone —
           and it is only painted when this region is a tab stop at all. */
        isScrollable && focusRing,
        className
      )}
      // A scroll container with no focusable child cannot be scrolled by
      // keyboard at all — but only once there is something to scroll.
      // biome-ignore lint/a11y/noNoninteractiveTabindex: see the note above
      tabIndex={isScrollable ? 0 : undefined}
      style={{ ...scrollPaddingStyle, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

ScrollShadow.displayName = 'ScrollShadow';
