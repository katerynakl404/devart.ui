'use client';

import { X } from 'lucide-react';
import type { PointerEvent } from 'react';
import { cva } from '../../lib/cva';
import { InputGroupAction } from '../InputGroup';
import type { SelectSize } from './SelectTrigger';

// The clear button sits over the trigger, left of the chevron
const selectClearVariants = cva('absolute top-1/2 -translate-y-1/2', {
  variants: {
    // Chevron width + its gap per field size
    size: {
      xs: 'end-6',
      sm: 'end-[34px]',
      md: 'end-[34px]',
      lg: 'end-[38px]',
      xl: 'end-[38px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface SelectClearButtonProps {
  /** The button's accessible name. */
  label: string;
  size: SelectSize;
  onClear: () => void;
}

/** Empties the field without opening the list. */
function SelectClearButton({ label, size, onClear }: SelectClearButtonProps) {
  // Keeps focus on the trigger; the clear itself waits for a click, so a
  // right-click, a scroll that starts on the button or a screen-reader
  // activation behave as on any button
  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <InputGroupAction
      tabIndex={-1}
      aria-label={label}
      className={selectClearVariants({ size })}
      onPointerDown={handlePointerDown}
      onClick={onClear}
    >
      <X aria-hidden />
    </InputGroupAction>
  );
}

export { SelectClearButton, selectClearVariants };
