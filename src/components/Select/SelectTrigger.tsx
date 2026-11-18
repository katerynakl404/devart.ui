'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import type { KeyboardEvent, Ref } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';

const selectTriggerVariants = cva(
  cn(
    'group/select flex h-full w-full min-w-0 items-center justify-between gap-2',
    'cursor-pointer bg-transparent text-start text-ink-primary outline-none',

    // Placeholder
    'data-[placeholder]:text-ink-inactive',
    // Disabled
    'disabled:cursor-not-allowed disabled:text-ink-inactive'
  ),
  {
    variants: {
      // Padding, text and chevron size per field size
      size: {
        xs: 'px-2 text-xs [&>svg]:size-3.5',
        sm: 'px-3 text-sm [&>svg]:size-4',
        md: 'px-3 text-sm [&>svg]:size-4',
        lg: 'px-3 text-base [&>svg]:size-5',
        xl: 'px-3 text-base [&>svg]:size-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// Long labels truncate; with a clear button the text stops before it
const selectValueVariants = cva('min-w-0 flex-1 truncate', {
  variants: {
    size: { xs: '', sm: '', md: '', lg: '', xl: '' },
    withClear: { true: '', false: '' },
  },
  compoundVariants: [
    { withClear: true, size: 'xs', class: 'me-2' },
    { withClear: true, size: 'sm', class: 'me-[22px]' },
    { withClear: true, size: 'md', class: 'me-[22px]' },
    { withClear: true, size: 'lg', class: 'me-[22px]' },
    { withClear: true, size: 'xl', class: 'me-[22px]' },
  ],
  defaultVariants: {
    size: 'md',
    withClear: false,
  },
});

type SelectSize = VariantProps<typeof selectTriggerVariants>['size'];

interface SelectTriggerProps {
  ref: Ref<HTMLButtonElement>;
  id: string;
  /** The chosen option's text; without it the placeholder shows. */
  valueText?: string;
  placeholder?: string;
  'aria-label'?: string;
  isInvalid: boolean;
  /** Backspace and Delete clear the value. */
  clearable: boolean;
  size: SelectSize;
  onClear: () => void;
}

/** The field's button: the chosen value or the placeholder, and the chevron. */
function SelectTrigger({
  ref,
  id,
  valueText,
  placeholder,
  'aria-label': ariaLabel,
  isInvalid,
  clearable,
  size,
  onClear,
}: SelectTriggerProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (clearable && (event.key === 'Backspace' || event.key === 'Delete')) {
      event.preventDefault();
      onClear();
    }
  };

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      id={id}
      data-slot="input-group-control"
      aria-label={ariaLabel}
      aria-invalid={isInvalid || undefined}
      aria-keyshortcuts={clearable ? 'Backspace Delete' : undefined}
      className={selectTriggerVariants({ size })}
      onKeyDown={handleKeyDown}
    >
      <SelectPrimitive.Value
        placeholder={placeholder}
        className={selectValueVariants({ size, withClear: clearable })}
      >
        {valueText}
      </SelectPrimitive.Value>
      <SelectPrimitive.Icon asChild>
        <ChevronDown
          aria-hidden
          className="shrink-0 text-ink-secondary transition-transform duration-200 group-disabled/select:text-ink-inactive group-data-[state=open]/select:rotate-180"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export { SelectTrigger, selectTriggerVariants, selectValueVariants };
export type { SelectSize };
