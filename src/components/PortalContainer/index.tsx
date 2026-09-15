'use client';

import { type ReactNode, useState } from 'react';
import { PortalContainerContext } from '../../lib/portal-container';
import { cn } from '../../lib/utils';

export interface PortalContainerProviderProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Renders portalled content (menus, popovers, tooltips, dialogs, sheets)
 * *inside* this element instead of `document.body`.
 *
 * Radix portals to the body by default, which is right for an app but breaks
 * two things:
 *
 * - **Scoped theming.** A `.dark` class on a subtree never reaches the body, so
 *   a dropdown opened from a dark panel renders light. Wrap the subtree in this
 *   and the overlay re-themes with it.
 * - **Containment.** An overlay that escapes its container paints over whatever
 *   is beside it — a real problem inside a grid, a card, or a preview cell.
 *
 * The element is `position: relative` so Radix's absolute positioning resolves
 * against it, and it carries a transform so it becomes a **containing block**:
 * without that, `position: fixed` descendants (a modal, a sheet, Radix's popper)
 * resolve against the viewport no matter which node they are portalled into,
 * and escape anyway. Components still accept an explicit `portalContainer`
 * prop, which always wins over this context.
 */
export function PortalContainerProvider({
  children,
  className,
}: PortalContainerProviderProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  return (
    <div className={cn('relative transform-gpu', className)} ref={setContainer}>
      <PortalContainerContext.Provider value={container}>
        {children}
      </PortalContainerContext.Provider>
    </div>
  );
}

export {
  PortalContainerContext,
  usePortalContainer,
} from '../../lib/portal-container';
