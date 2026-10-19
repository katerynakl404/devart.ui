'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { type ComponentProps, useCallback, useMemo, useState } from 'react';
import {
  SegmentedControlContext,
  type SegmentedControlRounded,
  type SegmentedControlSize,
  type SegmentedControlVariant,
} from './SegmentedControlContext';

export interface SegmentedControlProps
  extends ComponentProps<typeof TabsPrimitive.Root> {
  size?: SegmentedControlSize;
  variant?: SegmentedControlVariant;
  rounded?: SegmentedControlRounded;
  className?: string;
  /**
   * Nothing selected is a state of its own — Inherit, Not set — and pressing
   * the selected option again returns to it (`onValueChange('')`, also on
   * Enter / Space). Off by default: a view switcher always has one segment
   * active. Pair with `tinted` on the triggers to show what is in effect
   * while none is chosen.
   */
  deselectable?: boolean;
}

const SegmentedControl = ({
  size = 'md',
  variant = 'default',
  rounded = 'md',
  deselectable = false,
  className,
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: SegmentedControlProps) => {
  // The value is held here as well as in Radix, so a trigger can tell it is
  // the selected one and clear it — Radix never reports a press on the
  // option that is already selected.
  const [inner, setInner] = useState(defaultValue ?? '');
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : inner;
  const change = useCallback(
    (next: string) => {
      if (!controlled) setInner(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange]
  );
  const clear = useCallback(() => change(''), [change]);

  const contextValue = useMemo(
    () => ({ size, variant, rounded, deselectable, value, clear }),
    [size, variant, rounded, deselectable, value, clear]
  );

  return (
    <SegmentedControlContext.Provider value={contextValue}>
      <TabsPrimitive.Root
        className={className}
        value={value}
        onValueChange={change}
        {...props}
      />
    </SegmentedControlContext.Provider>
  );
};

SegmentedControl.displayName = 'SegmentedControl';

export { SegmentedControl };
