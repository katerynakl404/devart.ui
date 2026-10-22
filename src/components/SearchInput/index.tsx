'use client';

import { Search } from 'lucide-react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../InputGroup';
import { SearchInputClearButton } from './SearchInputClearButton';
import { SearchInputWithResults } from './SearchInputWithResults';
import type { SearchInputProps } from './types';

const DEFAULT_CLEAR_LABEL = 'Clear search';

const searchInputVariants = cva(
  cn(
    '[&::-webkit-search-cancel-button]:appearance-none',
    '[&::-webkit-search-cancel-button]:hidden',
    '[&::-webkit-search-decoration]:hidden'
  )
);

/**
 * Search field: an InputGroup with a leading search icon and a trailing clear
 * button that appears once `value` is non-empty and `onClear` is provided.
 * `onClear` is expected to reset `value`; the field then gets focus back.
 * The clear button carries a tooltip, so the consumer must render a
 * TooltipProvider above it.
 *
 * With `results` it also offers what matches — a short list under the field
 * that opens only while something is typed (not on focus, not on a click into
 * the field, not with the picked name still in it; there is no whole list to
 * browse, so there is no chevron), at most `maxVisibleResults` rows, picked
 * with the pointer or the keys. Picking puts the result's name in the field
 * and calls `onSelect`. The caller matches; the field shows what it is given,
 * or `emptyText`. The list reuses the combobox mechanics `Autocomplete` is
 * built on and its option row.
 */
function SearchInput<T extends { id: string } = { id: string }>({
  placeholder,
  value,
  clearLabel = DEFAULT_CLEAR_LABEL,
  size = 'lg',
  className,
  ref,
  onValueChange,
  onClear,
  results,
  ...extension
}: SearchInputProps<T>) {
  if (results) {
    return (
      <SearchInputWithResults
        {...extension}
        placeholder={placeholder}
        value={value}
        clearLabel={clearLabel}
        size={size}
        className={className}
        inputClassName={searchInputVariants()}
        ref={ref}
        onValueChange={onValueChange}
        onClear={onClear}
        results={results}
      />
    );
  }

  const {
    variant,
    'aria-label': ariaLabel,
    autoFocus,
    disabled,
    id,
    style,
    onKeyDown,
  } = extension;
  const showClear =
    typeof value === 'string' && value !== '' && !!onClear && !disabled;

  return (
    <InputGroup
      size={size}
      variant={variant}
      className={className}
      style={style}
    >
      <InputGroupAddon align="inline-start">
        <Search aria-hidden />
      </InputGroupAddon>

      <InputGroupInput
        ref={ref}
        type="search"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={
          onValueChange && ((event) => onValueChange(event.target.value))
        }
        onKeyDown={onKeyDown}
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        disabled={disabled}
        enterKeyHint="search"
        autoComplete="off"
        className={searchInputVariants()}
      />

      {showClear && (
        <SearchInputClearButton label={clearLabel} onClear={onClear} />
      )}
    </InputGroup>
  );
}

export { SearchInput, type SearchInputProps, searchInputVariants };
