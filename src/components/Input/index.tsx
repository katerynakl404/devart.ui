'use client';

import { type ChangeEvent, type ComponentProps, useMemo } from 'react';
import { composeRefs } from '../../lib/compose-refs';
import { cn } from '../../lib/utils';

export interface InputProps extends ComponentProps<'input'> {
  /** Takes digits only; a letter typed, pasted or dropped is dropped. */
  digitsOnly?: boolean;
}

// Stops a letter before it lands, so typing over a selection keeps it.
function onBeforeInput(e: InputEvent) {
  if (e.inputType !== 'insertText' && e.inputType !== 'insertFromPaste') return;
  if (!e.data || /^\d*$/.test(e.data)) return;
  e.preventDefault();
  const digits = e.data.replace(/\D+/g, '');
  // execCommand keeps the field's undo history.
  if (digits) document.execCommand('insertText', false, digits);
}

function blockNonDigits(el: HTMLInputElement | null) {
  el?.addEventListener('beforeinput', onBeforeInput);
  return () => el?.removeEventListener('beforeinput', onBeforeInput);
}

// Cleans what gets past beforeinput (a drop, autofill), keeping the caret.
function keepDigits(e: ChangeEvent<HTMLInputElement>) {
  const el = e.target;
  const raw = el.value;
  const clean = raw.replace(/\D+/g, '');
  if (clean === raw) return;
  const caret = el.selectionStart ?? raw.length;
  const before = raw.slice(0, caret).replace(/\D+/g, '').length;
  el.value = clean;
  el.setSelectionRange(before, before);
}

function Input({
  className,
  type,
  ref,
  digitsOnly = false,
  inputMode,
  onChange,
  ...props
}: InputProps) {
  const inputRef = useMemo(
    () => (digitsOnly ? composeRefs(ref, blockNonDigits) : ref),
    [digitsOnly, ref]
  );

  return (
    <input
      ref={inputRef}
      type={type}
      data-slot="input"
      inputMode={inputMode ?? (digitsOnly ? 'numeric' : undefined)}
      onChange={
        digitsOnly
          ? (e) => {
              keepDigits(e);
              onChange?.(e);
            }
          : onChange
      }
      className={cn(
        'h-full w-full min-w-0 px-1.5',
        'bg-transparent outline-none',
        'transition-[color,box-shadow]',

        // Hides the browser's own clear button in a search field
        '[&::-webkit-search-cancel-button]:hidden',
        '[&::-webkit-search-decoration]:hidden',

        //Disabled
        'disabled:cursor-not-allowed',
        'disabled:text-ink-inactive',
        'disabled:placeholder:text-ink-inactive',
        className
      )}
      {...props}
    />
  );
}

export { Input };
