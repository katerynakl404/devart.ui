'use client';

import { createContext, useContext } from 'react';

/**
 * Where portalled content (menus, popovers, tooltips, dialogs, sheets) should
 * render.
 *
 * Radix portals to `document.body` by default, which is right for an app but
 * breaks **scoped theming**: a `.dark` class on a subtree never reaches the
 * portal, so a dropdown opened from a dark panel renders light. Provide a
 * container inside the themed subtree and the portal re-themes with it.
 *
 * `null` (the default) keeps Radix's own behaviour.
 */
export const PortalContainerContext = createContext<HTMLElement | null>(null);

/**
 * The container portalled content should mount into, or `null` for
 * `document.body`. An explicit `portalContainer` prop always wins over this.
 */
export function usePortalContainer(
  override?: HTMLElement | null
): HTMLElement | undefined {
  const fromContext = useContext(PortalContainerContext);
  return (override ?? fromContext) || undefined;
}
