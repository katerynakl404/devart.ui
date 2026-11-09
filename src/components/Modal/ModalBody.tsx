'use client';

import type { ComponentProps, PropsWithChildren } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

import { cn } from '../../lib/utils';
import { ScrollShadow, type ScrollShadowProps } from '../ScrollShadow';

interface ModalBodyProps extends PropsWithChildren<ComponentProps<'div'>> {
  shadowSize?: ScrollShadowProps['size'];
}

/**
 * The dialog's scrolling middle. It spans the dialog's full width (`-mx-4`,
 * out over `ModalContent`'s `p-4`) and puts the padding back inside, so the
 * scrollbar sits in the dialog's own right padding, against its edge — not
 * between the fields and that padding (§176).
 *
 * The gutter is reserved whether or not the body overflows
 * (`scrollbar-gutter: stable`), and the right padding is 16px LESS the bar's
 * width, measured: `scrollbar-thin` is 8px in Firefox, about 11px in Chrome on
 * Windows and 0 where scrollbars overlay (macOS). So the fields are inset 16px
 * on both sides, as the header and the footer are, with a bar or without one.
 */
export function ModalBody({
  ref,
  className,
  shadowSize = 40,
  style,
  children,
  ...props
}: ModalBodyProps) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [bar, setBar] = useState(0);

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const measure = () => {
      const cs = getComputedStyle(el);
      const border =
        Number.parseFloat(cs.borderLeftWidth) +
        Number.parseFloat(cs.borderRightWidth);
      setBar(Math.max(0, el.offsetWidth - el.clientWidth - border));
    };
    measure();
    // a browser zoom or a display-scale change re-sizes the bar in CSS px
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
  }, []);

  return (
    <ScrollShadow
      ref={(node) => {
        bodyRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      size={shadowSize}
      // `scrollbar-thin`: the bar the system draws on every list it ships
      // (DropdownMenu, Autocomplete, CodeBlock). Without it a dialog's body
      // scrolled with the platform's own — wide, and with arrows on Windows.
      className={cn(
        'scrollbar-thin -mx-4 flex min-h-0 flex-1 flex-col gap-3 px-4',
        className
      )}
      style={{
        scrollbarGutter: 'stable',
        paddingInlineEnd: `calc(1rem - ${bar}px)`,
        ...style,
      }}
      {...props}
    >
      {children}
    </ScrollShadow>
  );
}
