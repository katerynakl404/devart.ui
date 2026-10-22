'use client';

import { Search } from 'lucide-react';
import {
  type Ref,
  type SyntheticEvent,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAutocomplete } from '../../hooks/use-autocomplete';
import { cn } from '../../lib/utils';
import { OptionItem } from '../Autocomplete/OptionItem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../InputGroup';
import { SearchInputClearButton } from './SearchInputClearButton';
import type { SearchInputProps } from './types';

interface SearchInputWithResultsProps<T extends { id: string }>
  extends Omit<SearchInputProps<T>, 'results' | 'clearLabel'> {
  results: readonly T[];
  clearLabel: string;
  /** `searchInputVariants()`, handed down so the recipe stays in `index.tsx`. */
  inputClassName: string;
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

/**
 * `SearchInput` with `results`: the same field, offering what matches in a
 * list under it while something is typed. Reuses the combobox mechanics
 * `Autocomplete` is built on (`useAutocomplete` — keys, highlight, ARIA) and its
 * option row, so the two lists look and behave alike; the states are a
 * search's — a query, not a value.
 */
function SearchInputWithResults<T extends { id: string }>({
  placeholder,
  value,
  clearLabel,
  size,
  className,
  inputClassName,
  ref,
  onValueChange,
  onClear,
  variant,
  'aria-label': ariaLabel,
  autoFocus,
  disabled,
  id,
  style,
  onKeyDown,
  results,
  getResultLabel,
  renderResult,
  onSelect,
  emptyText = 'No matches',
  maxVisibleResults = 5.5,
}: SearchInputWithResultsProps<T>) {
  const labelOf = useCallback(
    (r: T) =>
      getResultLabel
        ? getResultLabel(r)
        : String((r as { label?: unknown }).label ?? r.id),
    [getResultLabel]
  );
  /* Uncontrolled like the plain field when `value` is not given. */
  const [ownQuery, setOwnQuery] = useState('');
  const query = value ?? ownQuery;
  /* The last result picked: it is the hook's value, so the field shows its
     name once picked; typing on leaves it until another is picked. */
  const [picked, setPicked] = useState<T | null>(null);
  /* Open only while something is being typed — not on focus, not on a click
     into the field, not with the picked one's name still in it. */
  const [typing, setTyping] = useState(false);
  const shown =
    typing &&
    query.trim() !== '' &&
    !(picked !== null && query === labelOf(picked));

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
    inputValue: query,
    onInputChange: (_e, text, reason) => {
      setOwnQuery(text);
      onValueChange?.(text);
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

  const showClear =
    typeof value === 'string' && value !== '' && !!onClear && !disabled;

  const inputProps = getInputProps();
  const hookInputRef = inputProps.ref;
  const setInput = useCallback(
    (node: HTMLInputElement | null) => {
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
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure whenever the rows change
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
    <DropdownMenu open={open} modal={false} onOpenChange={setOpen}>
      {/* The trigger is the field itself, so the list takes the field's width
          and `className` lands where it does without `results`. */}
      <DropdownMenuTrigger asChild disabled={disabled}>
        <InputGroup
          {...STRIPPED_TRIGGER_ARIA}
          {...getRootProps()}
          size={size}
          variant={variant}
          className={className}
          style={style}
        >
          <InputGroupAddon align="inline-start">
            <Search aria-hidden />
          </InputGroupAddon>

          <InputGroupInput
            {...inputProps}
            ref={setInput}
            type="search"
            id={id ?? inputProps.id}
            placeholder={placeholder}
            aria-label={ariaLabel}
            autoFocus={autoFocus}
            enterKeyHint="search"
            className={inputClassName}
            onKeyDown={(e) => {
              // A space is text here, not the menu's select key.
              if (e.key === ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.stopPropagation();
              }
              inputProps.onKeyDown?.(e);
              onKeyDown?.(e);
            }}
          />

          {showClear && (
            <SearchInputClearButton
              label={clearLabel}
              onClear={() => {
                setPicked(null);
                setTyping(false);
                onClear();
              }}
            />
          )}
        </InputGroup>
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
  );
}

export { SearchInputWithResults };
