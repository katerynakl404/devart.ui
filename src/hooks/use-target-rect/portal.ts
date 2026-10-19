'use client';

import type { ReactNode, ReactPortal } from 'react';
import { createPortal } from 'react-dom';
import { usePortalContainer } from '../../lib/portal-container';

/**
 * Renders a tour layer into the nearest `PortalContainer` (scoped theming), or
 * `document.body`. On the server there is no body to portal into, so the
 * layer renders nothing — it is fixed-position chrome, never content.
 */
export function usePortal(
  portalContainer?: HTMLElement | null
): (node: ReactNode) => ReactPortal | null {
  const container = usePortalContainer(portalContainer);
  return (node) =>
    typeof document === 'undefined'
      ? null
      : createPortal(node, container ?? document.body);
}
