'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check } from 'lucide-react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { dropdownMenuItemVariants } from '../DropdownMenu/DropdownMenuItem';
import { toRadix } from './radix-value';

// On top of the DropdownMenu item: taller rows and a bolder check
const selectItemVariants = cva(
  cn(
    // Layout: 44px touch target
    'min-h-11 gap-2.5 rounded px-3 py-2.5',
    // Text
    'text-ink-primary text-sm leading-normal',
    // Check icon
    '[&_svg]:size-4 [&_svg]:stroke-[2.5]'
  )
);

interface SelectItemProps {
  /** The option's `id`; Radix submits it as the value. */
  id: string;
  label: string;
  disabled: boolean;
}

/** One option row: its text, and a check when it is chosen. */
function SelectItem({ id, label, disabled }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      value={toRadix(id)}
      disabled={disabled}
      className={cn(dropdownMenuItemVariants(), selectItemVariants())}
    >
      <span className="min-w-0 flex-1 truncate">
        <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
      </span>
      <SelectPrimitive.ItemIndicator className="shrink-0 text-ink-highlight">
        <Check aria-hidden />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export { SelectItem, selectItemVariants };
