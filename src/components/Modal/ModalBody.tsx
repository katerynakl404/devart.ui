'use client';

import type { ComponentProps, PropsWithChildren } from 'react';
import { useRef } from 'react';

import { useGutterInset } from '../../hooks/use-gutter-inset';
import { cn } from '../../lib/utils';
import { ScrollShadow, type ScrollShadowProps } from '../ScrollShadow';

interface ModalBodyProps extends PropsWithChildren<ComponentProps<'div'>> {
  shadowSize?: ScrollShadowProps['size'];
}

/**
 * The dialog's scrolling middle. It spans the dialog's full width (`-mx-4`,
 * out over `ModalContent`'s `p-4`) and puts the padding back inside, so the
 * scrollbar sits in the dialog's own right padding, against its edge — not
 * between the fields and that padding.
 *
 * `useGutterInset` reserves the gutter and pads the right by the measured left
 * padding less the bar, so the content is inset alike on both sides, with a bar
 * or without one — 16px in a plain dialog, 20px in `ConfirmationDialog`
 * (`mx-0 px-5`: its dialog has no padding of its own to reach over).
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
  const inset = useGutterInset(bodyRef);

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
      style={{ ...inset, ...style }}
      {...props}
    >
      {children}
    </ScrollShadow>
  );
}
