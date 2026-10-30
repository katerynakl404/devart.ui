'use client';

/**
 * The developers' `SearchInput`, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/SearchInput/index.tsx`, import paths alone changed.
 * `SearchInputClearButton` is imported from `src/`: it has not changed since
 * the base. The field is the live `InputGroup`, so what differs from the live
 * `SearchInput` is this file and nothing else. Not edited: replace it whole
 * when the base moves.
 */

import { Search } from 'lucide-react';
import type { Ref } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  type inputGroupVariants,
} from '../../src/components/InputGroup';
import { SearchInputClearButton } from '../../src/components/SearchInput/SearchInputClearButton';
import { cva, type VariantProps } from '../../src/lib/cva';
import { cn } from '../../src/lib/utils';

const DEFAULT_CLEAR_LABEL = 'Clear search';

const searchInputVariants = cva(
  cn(
    '[&::-webkit-search-cancel-button]:appearance-none',
    '[&::-webkit-search-cancel-button]:hidden',
    '[&::-webkit-search-decoration]:hidden'
  )
);

interface SearchInputProps {
  placeholder: string;
  value?: string;
  clearLabel?: string;
  size?: VariantProps<typeof inputGroupVariants>['size'];
  className?: string;
  ref?: Ref<HTMLInputElement>;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
}

/**
 * Search field: an InputGroup with a leading search icon and a trailing clear
 * button that appears once `value` is non-empty and `onClear` is provided.
 * `onClear` is expected to reset `value`; the field then gets focus back.
 * The clear button carries a tooltip, so the consumer must render a
 * TooltipProvider above it.
 */
function SearchInput({
  placeholder,
  value,
  clearLabel = DEFAULT_CLEAR_LABEL,
  size = 'lg',
  className,
  ref,
  onValueChange,
  onClear,
}: SearchInputProps) {
  const showClear = typeof value === 'string' && value !== '' && !!onClear;

  return (
    <InputGroup size={size} className={className}>
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
        className={searchInputVariants()}
      />

      {showClear && (
        <SearchInputClearButton label={clearLabel} onClear={onClear} />
      )}
    </InputGroup>
  );
}

export { SearchInput, type SearchInputProps, searchInputVariants };
