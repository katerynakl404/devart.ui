import { createContext } from 'react';

interface TooltipContextValue {
  /** Drives the root, so a long press can open the tooltip itself. */
  setOpen: (open: boolean) => void;
  /** Mirrors the root's `touchGestures`. */
  touchGestures: 'auto' | 'off';
}

/** `null` under a bare Radix root, where touch keeps Radix's own behaviour. */
const TooltipContext = createContext<TooltipContextValue | null>(null);

export { TooltipContext };
export type { TooltipContextValue };
