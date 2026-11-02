'use client';

import { createContext, useContext } from 'react';

export type SegmentedControlSize = 'sm' | 'md';
export type SegmentedControlVariant = 'default';
export type SegmentedControlRounded =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';
export type SegmentedControlSemantics = 'tabs' | 'radio';

type SegmentedControlContextValue = {
  size: SegmentedControlSize;
  variant: SegmentedControlVariant;
  rounded: SegmentedControlRounded;
  /** `deselectable`: the value in effect, and the way back to none. */
  deselectable: boolean;
  /** What assistive technology is told the control is — see `SegmentedControlProps`. */
  semantics: SegmentedControlSemantics;
  value: string;
  clear: () => void;
};

const SegmentedControlContext =
  createContext<SegmentedControlContextValue | null>(null);

const useSegmentedControl = () => {
  const context = useContext(SegmentedControlContext);
  if (!context) {
    throw new Error(
      'SegmentedControl components must be used within a SegmentedControl root'
    );
  }
  return context;
};

export { SegmentedControlContext, useSegmentedControl };
