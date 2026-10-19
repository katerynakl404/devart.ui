'use client';

import { Search, X } from 'lucide-react';
import type { CSSProperties, KeyboardEvent, ReactNode, Ref, SyntheticEvent } from 'react';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useAutocomplete } from '../../hooks/use-autocomplete';
import { cn } from '../../lib/utils';
import { OptionItem } from '../Autocomplete/OptionItem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import {
  InputGroup,
  InputGroupAction,
  InputGroupAddon,
  InputGroupInput,
  type InputGroupProps,
} from '../InputGroup';

/*
 * A search field — its own component, not an Autocomplete with parts switched
 * off. It holds a query, not a value: what is typed is the state, the ✕
 * empties it, and nothing is "selected" in it.
 *
 * Alone it is the field every list, tree and catalog filters with: the search
 * glyph in the placeholder's grey, the input, and the ✕ while there is text
 * (`Clear search`). With `results` it also offers what matches — a short list
 * under the field that opens only while something is typed (there is no whole
 * list to browse, so there is no chevron), at most five and a half rows (the
 * half says there are more; typing on narrows them), picked with the pointer
 * or the keys. Picking puts the result's name in the field and calls
 * `onSelect`.
 *
 * The results list reuses the combobox mechanics `Autocomplete` is built on
 * (`useAutocomplete`: keys, highlight, ARIA) and its option row, so the two
 * lists look and behave alike; the API and the states are a search's.
 */

interface SearchFieldOwnProps {
  /** The query. */
  value: string;
  onValueChange: (value: string) => void;
  /** The ✕ was pressed (after `onValueChange('')`). */
  onClear?: () => void;
  placeholder?: string;
  /** Accessible name for the ✕. */
  clearLabel?: string;
  /** Accessible name for the field; defaults to the placeholder. */
  'aria-label'?: string;
  size?: InputGroupProps['size'];
  variant?: InputGroupProps['variant'];
  autoFocus?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  /** On the field itself — for a transition of its height, say. */
  style?: CSSProperties;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  ref?: Ref<HTMLInputElement>;
}

export interface SearchFieldProps<T extends { id: string } = { id: string }>
  extends SearchFieldOwnProps {
  /**
   * What matches the query — given by the caller, already matched: the field
   * does not filter. Without it the field is a plain search.
   */
  results?: readonly T[];
  /** The name a result is read and announced by; it fills the field when picked. */
  getResultLabel?: (result: T) => string;
  /** The row; the name alone when omitted. */
  renderResult?: (result: T) => ReactNode;
  onSelect?: (result: T) => void;
  /** Said when the query matches nothing. */
  emptyText?: ReactNode;
  /** Rows before the list scrolls; a fraction leaves part of the next showing. */
  maxVisibleResults?: number;
}

const assignRef = <E,>(ref: Ref<E> | undefined, node: E | null) => {
  if (typeof ref === 'function') ref(node);
  else if (ref) (ref as { current: E | null }).current = node;
};

/** Attributes Radix stamps on what `DropdownMenuTrigger asChild` renders — the
 * combobox semantics live on the input (see `Autocomplete`). */
const STRIPPED_TRIGGER_ARIA = {
  'aria-expanded': undefined,
  'aria-haspopup': undefined,
  'aria-controls': undefined,
} as const;

export function SearchField<T extends { id: string } = { id: string }>(
  props: SearchFieldProps<T>
) {
  return props.results ? (
    <SearchFieldWithResults {...props} results={props.results} />
  ) : (
    <PlainSearchField {...props} />
  );
}

function PlainSearchField({
  value,
  onValueChange,
  onClear,
  placeholder = 'Search…',
  clearLabel = 'Clear search',
  'aria-label': ariaLabel,
  size = 'md',
  variant = 'outline',
  autoFocus,
  disabled,
  id,
  className,
  style,
  onKeyDown,
  ref,
}: SearchFieldOwnProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setInput = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      assignRef(ref, node);
    },
    [ref]
  );
  return (
    <InputGroup size={size} variant={variant} className={className} style={style}>
      <InputGroupAddon align="inline-start">
        <Search aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        ref={setInput}
        id={id}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        enterKeyHint="search"
        autoComplete="off"
      />
      {value && !disabled ? (
        <InputGroupAction
          aria-label={clearLabel}
          onClick={() => {
            onValueChange('');
            onClear?.();
            inputRef.current?.focus();
          }}
        >
          <X />
        </InputGroupAction>
      ) : null}
    </InputGroup>
  );
}

function SearchFieldWithResults<T extends { id: string }>({
  value,
  onValueChange,
  onClear,
  placeholder = 'Search…',
  clearLabel = 'Clear search',
  'aria-label': ariaLabel,
  size = 'md',
  variant = 'outline',
  autoFocus,
  disabled,
  id,
  className,
  style,
  onKeyDown,
  ref,
  results,
  getResultLabel,
  renderResult,
  onSelect,
  emptyText = 'No matches',
  maxVisibleResults = 5.5,
}: SearchFieldProps<T> & { results: readonly T[] }) {
  const labelOf = useCallback(
    (r: T) =>
      getResultLabel
        ? getResultLabel(r)
        : String((r as { label?: unknown }).label ?? r.id),
    [getResultLabel]
  );
  /* The last result picked: it is the hook's value, so the field shows its
     name once picked; typing on leaves it until another is picked. */
  const [picked, setPicked] = useState<T | null>(null);
  /* Open only while something is being typed — not on focus, not on a click
     into the field, not with the picked one's name still in it. */
  const [typing, setTyping] = useState(false);
  const shown =
    typing &&
    value.trim() !== '' &&
    !(picked !== null && value === labelOf(picked));

  const {
    open,
    setOpen,
    filteredOptions,
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
  } = useAutocomplete<T, false, false>({
    options: results,
    value: picked,
    inputValue: value,
    onInputChange: (_e, text, reason) => {
      onValueChange(text);
      if (reason === 'input') setTyping(true);
      if (text === '' && reason !== 'reset') setPicked(null);
    },
    onChange: (_e, next) => {
      setPicked(next);
      setTyping(false);
      if (next) onSelect?.(next);
    },
    open: shown,
    onOpen: (event: SyntheticEvent) => {
      // The keys may open it (ArrowDown over a query); a click may not.
      if (event.type === 'keydown') setTyping(true);
    },
    onClose: () => setTyping(false),
    filterOptions: (options) => options,
    getOptionLabel: labelOf,
    getOptionKey: (r) => r.id,
    isOptionEqualToValue: (a, b) => a.id === b.id,
    disabled,
  });

  const inputProps = getInputProps();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hookInputRef = inputProps.ref;
  const setInput = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      assignRef(hookInputRef as Ref<HTMLInputElement> | undefined, node);
      assignRef(ref, node);
    },
    [hookInputRef, ref]
  );

  /* The list's cap in its own rows: the space above the first row (border
     and padding) plus the pitch from one row to the next, times the count —
     read off the rendered rows, so it holds for whatever `renderResult`
     draws. Never taller than the room the menu has. */
  const listboxProps = getListboxProps();
  const hookListboxRef = listboxProps.ref;
  const listboxNode = useRef<HTMLDivElement | null>(null);
  const setListbox = useCallback(
    (node: HTMLDivElement | null) => {
      listboxNode.current = node;
      assignRef(hookListboxRef as Ref<HTMLDivElement> | undefined, node);
    },
    [hookListboxRef]
  );
  useLayoutEffect(() => {
    const node = listboxNode.current;
    if (!open || !node) return;
    const rows = node.querySelectorAll<HTMLElement>('[role="option"]');
    const [row0, row1] = [rows[0], rows[1]];
    if (rows.length <= maxVisibleResults || !row0 || !row1) {
      node.style.maxHeight = '';
      return;
    }
    const box = node.getBoundingClientRect();
    const first = row0.getBoundingClientRect();
    const pitch = row1.getBoundingClientRect().top - first.top;
    const above = first.top - box.top + node.scrollTop;
    const cap = Math.round(above + pitch * maxVisibleResults);
    node.style.maxHeight = `min(${cap}px, var(--radix-dropdown-menu-content-available-height, 100vh))`;
  }, [open, maxVisibleResults, filteredOptions]);

  const rows = useMemo(() => {
    if (filteredOptions.length === 0) {
      // A `listbox` must own options: the empty state announces as one that
      // cannot be picked, as `Autocomplete`'s does.
      return (
        <div
          role="option"
          aria-disabled="true"
          aria-selected="false"
          tabIndex={-1}
          className="px-4 py-5 text-center text-ink-secondary text-sm"
        >
          {emptyText}
        </div>
      );
    }
    return filteredOptions.map((option, index) => (
      <OptionItem
        key={option.id}
        option={option}
        index={index}
        getOptionProps={getOptionProps}
        getOptionLabel={labelOf}
        renderOption={renderResult ? (r) => renderResult(r) : undefined}
      />
    ));
  }, [filteredOptions, emptyText, getOptionProps, labelOf, renderResult]);

  return (
    <div className={cn('relative w-full', className)}>
      <DropdownMenu open={open} modal={false} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <div {...STRIPPED_TRIGGER_ARIA} {...getRootProps()}>
            <InputGroup size={size} variant={variant} style={style}>
              <InputGroupAddon align="inline-start">
                <Search aria-hidden />
              </InputGroupAddon>
              <InputGroupInput
                {...inputProps}
                ref={setInput}
                id={id ?? inputProps.id}
                placeholder={placeholder}
                aria-label={ariaLabel ?? placeholder}
                autoFocus={autoFocus}
                enterKeyHint="search"
                onKeyDown={(e) => {
                  // A space is text here, not the menu's select key.
                  if (e.key === ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    e.stopPropagation();
                  }
                  inputProps.onKeyDown?.(e);
                  onKeyDown?.(e);
                }}
              />
              {value && !disabled ? (
                <InputGroupAction
                  aria-label={clearLabel}
                  onClick={() => {
                    setPicked(null);
                    setTyping(false);
                    onValueChange('');
                    onClear?.();
                    inputRef.current?.focus();
                  }}
                >
                  <X />
                </InputGroupAction>
              ) : null}
            </InputGroup>
          </div>
        </DropdownMenuTrigger>

        {open && (
          <DropdownMenuContent
            {...listboxProps}
            ref={setListbox}
            className={cn(
              'w-[--radix-dropdown-menu-trigger-width] max-w-none',
              // Above a Modal (z-100), as Autocomplete's list is.
              'z-[110] overflow-y-auto p-2',
              'scrollbar-thin'
            )}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onFocusOutside={(e) => e.preventDefault()}
          >
            {rows}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}
