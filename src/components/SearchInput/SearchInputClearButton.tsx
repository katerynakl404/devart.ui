'use client';

import { X } from 'lucide-react';
import { InputGroupAction } from '../InputGroup';
import { useInputGroup } from '../InputGroup/InputGroupContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

interface SearchInputClearButtonProps {
  label: string;
  onClear: () => void;
}

/**
 * Trailing clear control for SearchInput. Must sit inside an InputGroup so it
 * can return focus to the field. Carries a tooltip — consumer needs a
 * TooltipProvider above it.
 */
function SearchInputClearButton({
  label,
  onClear,
}: SearchInputClearButtonProps) {
  const { inputRef } = useInputGroup();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <InputGroupAction
          aria-label={label}
          onClick={() => {
            onClear();
            inputRef?.current?.focus();
          }}
        >
          <X aria-hidden />
        </InputGroupAction>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

export { SearchInputClearButton, type SearchInputClearButtonProps };
