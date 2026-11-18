import { createContext, type RefObject } from 'react';

interface DropdownMenuContextValue {
  triggerRef: RefObject<HTMLElement | null>;
  /**
   * Mirrors the root's `modal`; decides whether an outside interaction leaves focus
   * where it landed.
   */
  modal: boolean;
}

/** `null` under a bare Radix root, where Radix's own close-focus restore applies. */
const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(
  null
);

export { DropdownMenuContext };
export type { DropdownMenuContextValue };
