'use client';

import { type ComponentProps, type ReactNode, useRef } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';
import { FieldLabel } from './FieldLabel';
import { InputGroupAction } from './InputGroupAction';
import {
  InputGroupAddon,
  type inputGroupAddonVariants,
} from './InputGroupAddon';
import { InputGroupContext } from './InputGroupContext';
import { InputGroupInput } from './InputGroupInput';

const inputGroupVariants = cva(
  cn(
    'group/input-group',
    'box-border',
    'relative flex w-full items-center rounded-md',
    'outline-none',
    'transition-[border,color,box-shadow]'
  ),
  {
    variants: {
      variant: {
        outline: cn(
          'border border-stroke bg-surface-card text-ink-secondary',
          //Hover (suppressed while focused, pressed or disabled)
          '[&:hover:not(:focus-within):not(:active):not(:has([data-slot=input-group-control]:disabled))]:border-stroke-field-hover',
          //Pressed — border swap only, no bg lift
          '[&:active:not(:has([data-slot=input-group-control]:disabled))]:border-input-focus',
          //On internal input focus state — neutral, no outer ring
          'has-[[data-slot=input-group-control]:focus-visible]:border-input-focus'
        ),
      },
      size: {
        xs: 'h-7 min-h-7 px-2',
        sm: 'h-8 min-h-8 px-3',
        md: 'h-9 min-h-9 px-3',
        lg: 'h-10 min-h-10 px-3',
        xl: 'h-11 min-h-11 px-3',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'outline',
    },
  }
);

interface InputGroupProps
  extends ComponentProps<'div'>,
    VariantProps<typeof inputGroupVariants> {
  isInvalid?: boolean;
  errorText?: string;
  label?: ReactNode;
  /** Marks the label with an asterisk and sets `aria-required` on the input. */
  required?: boolean;
  inputId?: string;
}

/**
 * A composite container that wraps an input and associated addons (icons, text, buttons)
 * to present them as a single visual unit.
 * Manages shared focus states, error styling propagation, and layout alignment for addons.
 */
function InputGroup({
  className,
  size = 'md',
  variant = 'outline',
  isInvalid = false,
  errorText,
  label,
  required = false,
  inputId,
  ...props
}: InputGroupProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resolvedSize = size ?? 'md';
  const resolvedVariant = variant ?? 'outline';

  return (
    <InputGroupContext.Provider
      value={{
        size: resolvedSize,
        variant: resolvedVariant,
        inputRef,
        isInvalid,
        errorText,
        required,
        inputId,
      }}
    >
      <div className="flex w-full flex-col gap-1">
        {label ? (
          <FieldLabel size={resolvedSize} required={required} htmlFor={inputId}>
            {label}
          </FieldLabel>
        ) : null}

        <div
          data-slot="input-group"
          className={cn(
            inputGroupVariants({
              size: resolvedSize,
              variant: resolvedVariant,
            }),

            'min-w-0 has-[>textarea]:h-auto',

            'has-[>[data-slot=input-group-action]]:pe-2',

            'has-[>[data-align=block-start]]:h-auto',
            'has-[>[data-align=block-start]]:flex-col',
            '[&:has(>[data-align=block-start])>input]:pb-3',

            'has-[>[data-align=block-end]]:h-auto',
            'has-[>[data-align=block-end]]:flex-col',
            '[&:has(>[data-align=block-end])>input]:pt-3',

            //Error state — red border in every state, no bg tint, no ring
            isInvalid &&
              cn(
                'border-input-error',
                '[&:hover:not(:focus-within):not(:active):not(:has([data-slot=input-group-control]:disabled))]:border-input-error',
                '[&:active:not(:has([data-slot=input-group-control]:disabled))]:border-input-error',
                'has-[[data-slot=input-group-control]:focus-visible]:border-input-error'
              ),

            //Disabled — real fill instead of opacity dimming
            'has-[[data-slot=input-group-control]:disabled]:select-none',
            'has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed',
            'has-[[data-slot=input-group-control]:disabled]:border-stroke',
            'has-[[data-slot=input-group-control]:disabled]:bg-state-disabled',
            'has-[[data-slot=input-group-control]:disabled]:text-ink-inactive',

            className
          )}
          {...props}
        />

        {isInvalid && errorText && (
          <Typography
            variant="span"
            textColor="destructive"
            className="font-medium text-fb-red-text text-xs"
          >
            {errorText}
          </Typography>
        )}
      </div>
    </InputGroupContext.Provider>
  );
}

export {
  InputGroup,
  InputGroupAction,
  InputGroupAddon,
  InputGroupInput,
  type InputGroupProps,
  type inputGroupAddonVariants,
  inputGroupVariants,
};
