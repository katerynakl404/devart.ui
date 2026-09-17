'use client';

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
  const optionProps = getOptionProps({ option, index });
  const isSelected = optionProps['aria-selected'];

  const content = (
    <>
      <span className="flex-1 truncate">{getOptionLabel(option)}</span>
    </>
  );

  return (
    <DropdownMenuItem
      {...optionProps}
      onSelect={(e) => e.preventDefault()}
      asChild={!!renderOption}
      className={cn(
        'min-h-11 cursor-pointer gap-2.5 rounded-md px-4 py-2.5',
        'text-ink-primary text-sm leading-normal',
        // Highlighted (pointer or keyboard) and selected are different states
        // and must not share a fill: with both on State/Hover you cannot tell
        // which option is the current value once the pointer is anywhere in the
        // list. Selected takes the deeper step the system already uses for a
        // chosen item — State/Pressed plus Text/Highlight — so it still reads
        // as selected while another option is highlighted, and reads deeper
        // still when it is the highlighted one.
        'data-[highlighted=true]:bg-state-hover',
        'aria-selected:bg-state-pressed',
        'aria-selected:font-medium',
        'aria-selected:text-ink-highlight',
        'aria-disabled:pointer-events-none',
        'aria-disabled:opacity-50',
        '[&_svg]:size-4'
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
