'use client';

import { Search } from 'lucide-react';
import {
  type Ref,
  type SyntheticEvent,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useAutocomplete } from '../../hooks/use-autocomplete';
import { composeRefs } from '../../lib/compose-refs';
import { cn } from '../../lib/utils';
import { OptionItem } from '../Autocomplete/OptionItem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../InputGroup';
import { SearchInputClearButton } from './SearchInputClearButton';
import type { SearchInputProps, SearchResultBase } from './types';

const MAX_VISIBLE_ROWS = 7.5;

interface SearchInputWithResultsProps<T extends SearchResultBase>
  extends Omit<SearchInputProps<T>, 'results' | 'clearLabel'> {
  results: readonly T[];
  clearLabel: string;
  inputClassName: string;
}

// The combobox semantics live on the input, as in Autocomplete
const STRIPPED_TRIGGER_ARIA = {
  'aria-expanded': undefined,
  'aria-haspopup': undefined,
  'aria-controls': undefined,
} as const;

/**
 * `SearchInput` with `results`: lists the matches under the field while
 * something is typed, with `Autocomplete`'s keys and option row.
 */
function SearchInputWithResults<T extends SearchResultBase>({
  placeholder,
  value,
  clearLabel,
  size,
  variant,
  className,
  inputClassName,
  ref,
  'aria-label': ariaLabel,
  autoFocus,
  onValueChange,
  onClear,
  results,
  getResultLabel,
  renderResult,
  onSelect,
  emptyText = 'No matches',
}: SearchInputWithResultsProps<T>) {
  const labelOf = useCallback(
    (r: T) => (getResultLabel ? getResultLabel(r) : (r.label ?? r.id)),
    [getResultLabel]
  );
  const [ownQuery, setOwnQuery] = useState('');
  const query = value ?? ownQuery;
  const [picked, setPicked] = useState<T | null>(null);
  // Open only while typing: not on focus, nor with the picked label in the field
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
      if (event.type === 'keydown') setTyping(true);
    },
    onClose: () => setTyping(false),
    filterOptions: (options) => options,
    getOptionLabel: labelOf,
    getOptionKey: (r) => r.id,
    isOptionEqualToValue: (a, b) => a.id === b.id,
  });

  const showClear = typeof value === 'string' && value !== '' && !!onClear;

  const inputProps = getInputProps();
  const hookInputRef = inputProps.ref;
  const setInput = useMemo(
    () => composeRefs(hookInputRef as Ref<HTMLInputElement> | undefined, ref),
    [hookInputRef, ref]
  );

  const listboxProps = getListboxProps();
  const hookListboxRef = listboxProps.ref;
  // State, not a ref: the portal mounts the list a render after `open`
  const [listboxNode, setListboxNode] = useState<HTMLDivElement | null>(null);
  const setListbox = useMemo(
    () =>
      composeRefs(
        setListboxNode,
        hookListboxRef as Ref<HTMLDivElement> | undefined
      ),
    [hookListboxRef]
  );
  // Measured, not fixed: `renderResult` rows can be taller
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure whenever the rows change
  useLayoutEffect(() => {
    const node = listboxNode;
    if (!open || !node) return;
    const rows = node.querySelectorAll<HTMLElement>('[role="option"]');
    const [row0, row1] = [rows[0], rows[1]];
    if (rows.length <= MAX_VISIBLE_ROWS || !row0 || !row1) {
      node.style.maxHeight = '';
      return;
    }
    const box = node.getBoundingClientRect();
    const first = row0.getBoundingClientRect();
    const pitch = row1.getBoundingClientRect().top - first.top;
    const above = first.top - box.top + node.scrollTop;
    const cap = Math.round(above + pitch * MAX_VISIBLE_ROWS);
    node.style.maxHeight = `min(${cap}px, var(--radix-dropdown-menu-content-available-height, 100vh))`;
  }, [open, filteredOptions, listboxNode]);

  const rows = useMemo(() => {
    if (filteredOptions.length === 0) {
      return (
        <div
          role="option"
          aria-disabled="true"
          aria-selected="false"
          tabIndex={-1}
          className="flex min-h-11 items-center px-3 py-2.5 text-ink-secondary text-sm"
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
      <DropdownMenuTrigger asChild>
        <InputGroup
          {...STRIPPED_TRIGGER_ARIA}
          {...getRootProps()}
          size={size}
          variant={variant}
          className={className}
        >
          <InputGroupAddon align="inline-start">
            <Search aria-hidden />
          </InputGroupAddon>

          <InputGroupInput
            {...inputProps}
            ref={setInput}
            type="search"
            placeholder={placeholder}
            aria-label={ariaLabel}
            autoFocus={autoFocus}
            className={inputClassName}
            onKeyDown={(e) => {
              // A space is text here, not the menu's select key
              if (e.key === ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.stopPropagation();
              }
              inputProps.onKeyDown?.(e);
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
            // Above Modal (z-100)
            'z-[110] overflow-y-auto p-2'
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
