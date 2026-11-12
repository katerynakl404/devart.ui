'use client';

import type { RefObject } from 'react';
import { useCallback } from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { Input, type InputProps } from '../Input';
import { useInputGroup } from './InputGroupContext';

const inputGroupInputVariants = cva(
  cn(
    'flex-1 text-ellipsis rounded-none border-0 px-0',
    'bg-transparent',
    'shadow-none',
    'focus-visible:ring-0'
  ),
  {
    variants: {
      variant: {
        outline: 'text-ink-primary placeholder:text-ink-inactive',
      },
      size: {
        xs: 'text-xs placeholder:text-xs',
        sm: 'text-sm placeholder:text-sm',
        md: 'text-sm placeholder:text-sm',
        lg: 'text-base placeholder:text-base',
        xl: 'text-base placeholder:text-base',
      },
    },
  }
);

/**
 * The core input field within an InputGroup.
 * It automatically consumes the parent group's styling (size/variant) and registers itself
 * via a ref so that clicking on the group container or addons can correctly focus this input.
 * Any external `ref` (e.g. react-hook-form) is merged with the group's internal ref.
 */
function InputGroupInput({
  id,
  className,
  ref: refProp,
  ...props
}: InputProps) {
  const { size, variant, inputRef, isInvalid, required, inputId } =
    useInputGroup();

  const mergedRef = useCallback(
    (el: HTMLInputElement | null) => {
      if (inputRef) {
        (inputRef as RefObject<HTMLInputElement | null>).current = el;
      }
      if (typeof refProp === 'function') {
        refProp(el);
      } else if (refProp) {
        (refProp as RefObject<HTMLInputElement | null>).current = el;
      }
    },
    [inputRef, refProp]
  );

  return (
    <Input
      ref={mergedRef}
      data-slot="input-group-control"
      className={cn(inputGroupInputVariants({ size, variant }), className)}
      {...props}
      id={id ?? inputId}
      aria-invalid={isInvalid}
      aria-required={required || undefined}
    />
  );
}

export { InputGroupInput, inputGroupInputVariants };
