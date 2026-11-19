'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { useId, useRef, useState } from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { InputGroup } from '../InputGroup';
import { fromRadix, toRadix } from './radix-value';
import { SelectClearButton } from './SelectClearButton';
import { SelectItem } from './SelectItem';
import { SelectList } from './SelectList';
import { SelectTrigger } from './SelectTrigger';
import type { SelectOption, SelectOptionBase, SelectProps } from './types';

// The open list holds focus in a portal, so the group's focus rules don't fire
const selectGroupVariants = cva(
  'px-0 has-[>[data-slot=input-group-action]]:pe-0',
  {
    variants: {
      isInvalid: {
        false:
          'has-[[data-slot=input-group-control][data-state=open]]:border-input-focus',
        true: 'has-[[data-slot=input-group-control][data-state=open]]:border-input-error',
      },
    },
    defaultVariants: {
      isInvalid: false,
    },
  }
);

/**
 * Picks one value from a short, known list; nothing is typed. Use
 * `Autocomplete` when the list needs searching.
 */
function Select<T extends SelectOptionBase = SelectOption>({
  options,
  value,
  defaultValue,
  id,
  name,
  label,
  'aria-label': ariaLabel,
  placeholder,
  required = false,
  disabled,
  isInvalid = false,
  errorText,
  clearable = false,
  clearLabel = 'Clear selection',
  size = 'md',
  className,
  onValueChange,
  getOptionLabel = (option) => option.label ?? option.id,
  getOptionDisabled = (option) => Boolean(option.disabled),
}: SelectProps<T>) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [ownValue, setOwnValue] = useState<string | null>(defaultValue ?? null);
  const current = value === undefined ? ownValue : value;
  const chosen = options.find((option) => option.id === current);
  const showClear = clearable && !required && !disabled && Boolean(chosen);

  const onValueChangeHandler = (next: string | null) => {
    if (value === undefined) setOwnValue(next);
    onValueChange?.(next);
  };

  const clear = () => onValueChangeHandler(null);

  return (
    <SelectPrimitive.Root
      value={chosen ? toRadix(chosen.id) : ''}
      onValueChange={(next) =>
        onValueChangeHandler(next === '' ? null : fromRadix(next))
      }
      required={required}
      disabled={disabled}
    >
      <InputGroup
        size={size}
        label={label}
        required={required}
        inputId={fieldId}
        isInvalid={isInvalid}
        errorText={errorText}
        className={cn(selectGroupVariants({ isInvalid }), className)}
      >
        <SelectTrigger
          ref={triggerRef}
          id={fieldId}
          valueText={chosen ? getOptionLabel(chosen) : undefined}
          placeholder={placeholder}
          aria-label={ariaLabel}
          isInvalid={isInvalid}
          clearable={showClear}
          size={size}
          onClear={clear}
        />
        {showClear && (
          <SelectClearButton label={clearLabel} size={size} onClear={clear} />
        )}
      </InputGroup>

      {name && <input type="hidden" name={name} value={chosen?.id ?? ''} />}

      <SelectList triggerRef={triggerRef}>
        {options.map((option) => (
          <SelectItem
            key={option.id}
            id={option.id}
            label={getOptionLabel(option)}
            disabled={getOptionDisabled(option)}
          />
        ))}
      </SelectList>
    </SelectPrimitive.Root>
  );
}

export { Select, selectGroupVariants };
