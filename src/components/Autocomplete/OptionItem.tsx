'use client';

import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import type { GetOptionProps } from '../../hooks/use-autocomplete/types';
import { cn } from '../../lib/utils';
import { DropdownMenuItem } from '../DropdownMenu';

interface OptionItemProps<T extends { id: string }> {
  option: T;
  index: number;
  getOptionProps: GetOptionProps<T>;
  getOptionLabel: (option: T) => string;
  renderOption?: (option: T, props: { selected: boolean }) => ReactNode;
}

const OptionItem = <T extends { id: string }>({
  option,
  index,
  getOptionProps,
  getOptionLabel,
  renderOption,
}: OptionItemProps<T>) => {
  const { key, ...optionProps } = getOptionProps({ option, index });
  const isSelected = optionProps['aria-selected'];

  const content = (
    <>
      <span className="flex-1 truncate">{getOptionLabel(option)}</span>
      {isSelected && (
        <Check aria-hidden className="shrink-0 text-ink-highlight" />
      )}
    </>
  );

  return (
    <DropdownMenuItem
      key={key}
      {...optionProps}
      onSelect={(e) => e.preventDefault()}
      asChild={!!renderOption}
      className={cn(
        'min-h-11 cursor-pointer gap-2.5 rounded px-3 py-2.5',
        'text-ink-primary text-sm leading-normal',
        'data-[highlighted=true]:bg-state-hover',
        'aria-disabled:pointer-events-none',
        'aria-disabled:opacity-50',
        '[&_svg]:size-4 [&_svg]:stroke-[2.5]'
      )}
    >
      {renderOption
        ? renderOption(option, {
            selected: !!isSelected,
          })
        : content}
    </DropdownMenuItem>
  );
};

OptionItem.displayName = 'AutocompleteOptionItem';

export { OptionItem };
