'use client';

import type { ComponentProps, Ref } from 'react';
import { useRef } from 'react';

import { useScrollShadow } from '../../hooks/use-scroll-shadow';
import type { ScrollShadowVisibility } from '../../hooks/use-scroll-shadow/types';
import { cn, focusRing } from '../../lib/utils';
import type { ScrollShadowFocusable } from './use-scroll-shadow-tab-stop';
import { useScrollShadowTabStop } from './use-scroll-shadow-tab-stop';

export type { ScrollShadowVisibility } from '../../hooks/use-scroll-shadow/types';
export type { ScrollShadowFocusable } from './use-scroll-shadow-tab-stop';

const DEFAULT_SCROLL_REGION_LABEL = 'Scrollable content';

export interface ScrollShadowProps extends Omit<ComponentProps<'div'>, 'size'> {
  ref?: Ref<HTMLDivElement>;
  size?: number;
  offset?: number;
  orientation?: 'vertical' | 'horizontal';
  visibility?: ScrollShadowVisibility;
  isEnabled?: boolean;
  /**
   * Whether this container is itself a Tab stop.
   * - `'auto'` (default) — only when content overflows and no descendant is
   *   already focusable, so a keyboard user can still scroll text-only regions
   * - `false` — never
   * - `true` — always; pass `aria-label` (or `aria-labelledby`) for the name
   */
  focusable?: ScrollShadowFocusable;
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
  focusable = 'auto',
  style,
  tabIndex: tabIndexProp,
  role: roleProp,
  'aria-label': ariaLabelProp,
  'aria-labelledby': ariaLabelledByProp,
  onVisibilityChange,
  ...props
}: ScrollShadowProps) {
  const internalRef = useRef<HTMLDivElement | null>(null);

  useScrollShadow({
    containerRef: internalRef,
    orientation,
    size,
    offset,
    visibility,
    isEnabled,
    onVisibilityChange,
  });

  const isTabStop = useScrollShadowTabStop({
    containerRef: internalRef,
    orientation,
    focusable,
  });

  const scrollPaddingStyle =
    orientation === 'vertical'
      ? { scrollPaddingBlock: `${size}px` }
      : { scrollPaddingInline: `${size}px` };

  const resolvedTabIndex = tabIndexProp ?? (isTabStop ? 0 : undefined);
  const resolvedRole = roleProp ?? (isTabStop ? 'region' : undefined);
  const hasRole = resolvedRole != null;

  const needsDefaultLabel =
    isTabStop && ariaLabelProp == null && ariaLabelledByProp == null;

  const resolvedAriaLabel = needsDefaultLabel
    ? DEFAULT_SCROLL_REGION_LABEL
    : ariaLabelProp;

  /* This package's addition: while the region is in the Tab order it draws the
     system's `focusRing` rather than the browser's outline, and only then — a
     container that is not a stop never shows a ring. */
  const isInTabOrder = resolvedTabIndex != null && resolvedTabIndex >= 0;

  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: the name is set only together with a role
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
        isInTabOrder && focusRing,
        className
      )}
      tabIndex={resolvedTabIndex}
      role={resolvedRole}
      aria-label={hasRole ? resolvedAriaLabel : undefined}
      aria-labelledby={hasRole ? ariaLabelledByProp : undefined}
      style={{ ...scrollPaddingStyle, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

ScrollShadow.displayName = 'ScrollShadow';
