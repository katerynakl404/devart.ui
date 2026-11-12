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
 * With `results` it lists the matches under the field while something is typed.
 */
function SearchInput<T extends { id: string } = { id: string }>({
  placeholder,
  value,
  clearLabel = DEFAULT_CLEAR_LABEL,
  size = 'lg',
  variant,
  className,
  ref,
  'aria-label': ariaLabel,
  autoFocus,
  onValueChange,
  onClear,
  results,
  getResultLabel,
  renderResult,
  onSelect,
  emptyText,
}: SearchInputProps<T>) {
  if (results) {
    return (
      <SearchInputWithResults
        placeholder={placeholder}
        value={value}
        clearLabel={clearLabel}
        size={size}
        variant={variant}
        className={className}
        inputClassName={searchInputVariants()}
        ref={ref}
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        onValueChange={onValueChange}
        onClear={onClear}
        results={results}
        getResultLabel={getResultLabel}
        renderResult={renderResult}
        onSelect={onSelect}
        emptyText={emptyText}
      />
    );
  }

  const showClear = typeof value === 'string' && value !== '' && !!onClear;

  return (
    <InputGroup size={size} variant={variant} className={className}>
      <InputGroupAddon align="inline-start">
        <Search aria-hidden />
      </InputGroupAddon>

      <InputGroupInput
        ref={ref}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={
          onValueChange && ((event) => onValueChange(event.target.value))
        }
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        className={searchInputVariants()}
      />

      {showClear && (
        <SearchInputClearButton label={clearLabel} onClear={onClear} />
      )}
    </InputGroup>
  );
}

export { SearchInput, type SearchInputProps, searchInputVariants };
