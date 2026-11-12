'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, X } from 'lucide-react';
import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { lastInteractionWasKeyboard } from '../../lib/focus-modality';
import { usePortalContainer } from '../../lib/portal-container';
import { cn } from '../../lib/utils';
import { dropdownMenuContentVariants } from '../DropdownMenu/DropdownMenuContent';
import { dropdownMenuItemVariants } from '../DropdownMenu/DropdownMenuItem';
import { InputGroup, InputGroupAction } from '../InputGroup';

const selectTriggerVariants = cva(
  cn(
    'group/select flex h-full w-full min-w-0 items-center justify-between gap-2',
    'bg-transparent text-start text-ink-primary outline-none',
    'cursor-pointer data-[placeholder]:text-ink-inactive',
    'disabled:cursor-not-allowed disabled:text-ink-inactive'
  ),
  {
    variants: {
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

const selectItemVariants = cva(
  cn(
    'min-h-11 gap-2.5 rounded px-3 py-2.5',
    'text-ink-primary text-sm leading-normal',
    '[&_svg]:size-4 [&_svg]:stroke-[2.5]'
  )
);

const selectClearVariants = cva('absolute top-1/2 -translate-y-1/2', {
  variants: {
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

// Radix keeps '' for "nothing picked"; an option's own empty id goes by this
const EMPTY_ID = '__empty__';
const toRadix = (id: string) => (id === '' ? EMPTY_ID : id);
const fromRadix = (value: string) => (value === EMPTY_ID ? '' : value);

export interface SelectOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T extends { id: string } = SelectOption>
  extends VariantProps<typeof selectTriggerVariants> {
  options: readonly T[];
  /** The chosen option's `id`; `null` shows the placeholder. */
  value?: string | null;
  defaultValue?: string;
  /** Gets `null` when the value is cleared. */
  onValueChange?: (id: string | null) => void;
  /** Defaults to the option's `label`. */
  getOptionLabel?: (option: T) => string;
  getOptionDisabled?: (option: T) => boolean;
  placeholder?: string;
  label?: ReactNode;
  isInvalid?: boolean;
  errorText?: string;
  disabled?: boolean;
  /** Adds a clear button; Backspace and Delete clear too. */
  clearable?: boolean;
  clearLabel?: string;
  /** Asterisk on the label; the value can't be cleared, even with `clearable`. */
  required?: boolean;
  /** Submits the chosen `id` with a form. */
  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

const defaultLabel = (option: { id: string }) =>
  (option as { label?: string }).label ?? option.id;

const defaultDisabled = (option: { id: string }) =>
  Boolean((option as { disabled?: boolean }).disabled);

/**
 * Picks one value from a short, known list; nothing is typed. Use
 * `Autocomplete` when the list needs searching.
 */
function Select<T extends { id: string } = SelectOption>({
  options,
  value,
  defaultValue,
  onValueChange,
  getOptionLabel = defaultLabel,
  getOptionDisabled = defaultDisabled,
  placeholder,
  label,
  size = 'md',
  isInvalid = false,
  errorText,
  disabled,
  clearable = false,
  clearLabel = 'Clear selection',
  required = false,
  name,
  id,
  className,
  'aria-label': ariaLabel,
}: SelectProps<T>) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const container = usePortalContainer();
  const [ownValue, setOwnValue] = useState<string | null>(defaultValue ?? null);
  const current = value === undefined ? ownValue : value;
  const chosen = options.find((option) => option.id === current);
  const showClear = clearable && !required && !disabled && Boolean(chosen);

  const choose = (next: string | null) => {
    if (value === undefined) setOwnValue(next);
    onValueChange?.(next);
  };

  const handleClearPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    choose(null);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (showClear && (event.key === 'Backspace' || event.key === 'Delete')) {
      event.preventDefault();
      choose(null);
    }
  };

  const handleCloseAutoFocus = (event: Event) => {
    event.preventDefault();
    triggerRef.current?.focus({
      preventScroll: true,
      focusVisible: lastInteractionWasKeyboard(),
    });
  };

  return (
    <SelectPrimitive.Root
      value={current === null ? '' : toRadix(current)}
      onValueChange={(next) => choose(fromRadix(next))}
      disabled={disabled}
      required={required}
    >
      <InputGroup
        size={size}
        label={label}
        required={required}
        inputId={fieldId}
        isInvalid={isInvalid}
        errorText={errorText}
        className={cn(
          'px-0 has-[>[data-slot=input-group-action]]:pe-0',
          'has-[[data-slot=input-group-control][data-state=open]]:border-input-focus',
          className
        )}
      >
        <SelectPrimitive.Trigger
          ref={triggerRef}
          id={fieldId}
          data-slot="input-group-control"
          aria-label={ariaLabel}
          aria-invalid={isInvalid || undefined}
          className={selectTriggerVariants({ size })}
          onKeyDown={handleTriggerKeyDown}
        >
          <SelectPrimitive.Value
            placeholder={placeholder}
            className={selectValueVariants({ size, withClear: showClear })}
          >
            {chosen ? getOptionLabel(chosen) : undefined}
          </SelectPrimitive.Value>
          <SelectPrimitive.Icon asChild>
            <ChevronDown
              aria-hidden
              className="shrink-0 text-ink-secondary transition-transform duration-200 group-data-[state=open]/select:rotate-180"
            />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        {showClear && (
          <InputGroupAction
            tabIndex={-1}
            aria-label={clearLabel}
            onPointerDown={handleClearPointerDown}
            className={selectClearVariants({ size })}
          >
            <X aria-hidden />
          </InputGroupAction>
        )}
      </InputGroup>

      {name && <input type="hidden" name={name} value={current ?? ''} />}

      <SelectPrimitive.Portal container={container}>
        <SelectPrimitive.Content
          position="popper"
          align="start"
          sideOffset={5}
          alignOffset={-1}
          collisionPadding={8}
          onCloseAutoFocus={handleCloseAutoFocus}
          className={cn(
            dropdownMenuContentVariants(),
            'w-[calc(var(--radix-select-trigger-width)+2px)] min-w-0 max-w-none',
            // Above Modal (z-100)
            'z-[110] p-0',
            // 7.5 rows
            'max-h-[min(21.5rem,var(--radix-select-content-available-height))]',
            'origin-[--radix-select-content-transform-origin]'
          )}
        >
          <SelectPrimitive.Viewport
            className={cn(
              'p-2',
              // Radix hides the scrollbar
              '[&[data-radix-select-viewport]]:[scrollbar-width:auto]',
              '[&[data-radix-select-viewport]::-webkit-scrollbar]:block'
            )}
          >
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.id}
                value={toRadix(option.id)}
                disabled={getOptionDisabled(option)}
                className={cn(dropdownMenuItemVariants(), selectItemVariants())}
              >
                <span className="min-w-0 flex-1 truncate">
                  <SelectPrimitive.ItemText>
                    {getOptionLabel(option)}
                  </SelectPrimitive.ItemText>
                </span>
                <SelectPrimitive.ItemIndicator className="shrink-0 text-ink-highlight">
                  <Check aria-hidden />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export {
  Select,
  selectClearVariants,
  selectItemVariants,
  selectTriggerVariants,
  selectValueVariants,
};
