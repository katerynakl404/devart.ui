'use client';

import { ChevronDown, X } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, ReactNode, Ref } from 'react';
import { useCallback, useMemo } from 'react';
import { useAutocomplete } from '../../hooks/use-autocomplete';
import type { UseAutocompleteArgs } from '../../hooks/use-autocomplete/types';
import { cn } from '../../lib/utils';
import type { BadgeProps } from '../Badge';
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
import { Spinner } from '../Spinner';
import { Typography } from '../Typography';
import { BadgeList } from './BadgeList';
import { OptionItem } from './OptionItem';

export type {
  AutocompleteValue,
  ChangeDetails,
  ChangeReason,
  CloseReason,
  FilterOptionsState,
  HighlightReason,
  InputChangeReason,
  UseAutocompleteArgs,
} from '../../hooks/use-autocomplete/types';

/**
 * Attributes Radix stamps onto whatever `DropdownMenuTrigger asChild` renders.
 * None of them is allowed on a plain `div`, and the combobox semantics already
 * live where they belong: `getInputProps()` puts `role="combobox"`,
 * `aria-expanded` and `aria-controls` on the input itself, so repeating them on
 * the wrapper would declare a second combobox. Child props win over the ones
 * Radix injects, so spreading these removes them.
 */
const STRIPPED_TRIGGER_ARIA = {
  'aria-expanded': undefined,
  'aria-haspopup': undefined,
  'aria-controls': undefined,
} as const;

const TAGS_INSET_MAP: Record<NonNullable<InputGroupProps['size']>, string> = {
  xs: '-ms-[5px] [&>input]:ps-1',
  sm: '-ms-[9px] [&>input]:ps-1',
  md: '-ms-[9px] [&>input]:ps-1',
  lg: '-ms-[9px] [&>input]:ps-1',
  xl: '-ms-[9px] [&>input]:ps-1',
};

const BADGE_LIST_PADDING_MAP: Record<
  NonNullable<InputGroupProps['size']>,
  string
> = {
  xs: 'gap-1 py-[3px]',
  sm: 'gap-1 py-[3px]',
  md: 'gap-1 py-[3px]',
  lg: 'gap-1 py-[3px]',
  xl: 'gap-1 py-[3px]',
};

export interface AutocompleteProps<
  T extends { id: string },
  Multiple extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
> extends UseAutocompleteArgs<T, Multiple, FreeSolo> {
  ref?: Ref<HTMLInputElement>;
  size?: InputGroupProps['size'];
  badgeVariant?: BadgeProps['variant'];
  placeholder?: string;
  label?: ReactNode;
  className?: string;
  inputClassName?: string;
  listboxClassName?: string;
  noOptionsText?: ReactNode;
  loadingText?: ReactNode;
  /** Accessible name of the clear button. */
  clearLabel?: string;
  /** Accessible name of the button that opens the list. */
  popupIndicatorLabel?: string;
  isLoading?: boolean;
  startAddon?: ReactNode;
  endAddon?: ReactNode;
  disableFiltering?: boolean;
  renderOption?: (option: T, props: { selected: boolean }) => ReactNode;
  renderBadge?: (
    option: T,
    onDelete: (e: MouseEvent<HTMLButtonElement>) => void
  ) => ReactNode;
}

export function Autocomplete<
  T extends { id: string },
  Multiple extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>(props: AutocompleteProps<T, Multiple, FreeSolo>) {
  const {
    placeholder = 'Search...',
    noOptionsText = 'No options',
    loadingText = 'Loading...',
    isLoading = false,
    size = 'lg',
    badgeVariant = 'secondary',
    startAddon,
    endAddon,
    clearLabel = 'Clear selection',
    popupIndicatorLabel = 'Show suggestions',
    label,
    className,
    inputClassName,
    listboxClassName,
    options = [],
    isMultipleSelect = false,
    disableClearable = false,
    disableFiltering = false,
    renderOption,
    renderBadge,
    getOptionLabel: getOptionLabelProp,
    filterOptions: filterOptionsProp,
    ...restProps
  } = props;

  const filterOptions = useMemo(() => {
    if (disableFiltering) return (options: T[]) => options;
    return filterOptionsProp || undefined;
  }, [disableFiltering, filterOptionsProp]);

  const {
    value,
    open,
    isDirty,
    disabled,
    readOnly,
    filteredOptions,
    setOpen,
    getOptionLabel,
    getRootProps,
    getInputProps,
    getInputLabelProps,
    getListboxProps,
    getOptionProps,
    getBadgeProps,
    getClearProps,
    getPopupIndicatorProps,
  } = useAutocomplete<T, Multiple, FreeSolo>({
    options: options as T[],
    isMultipleSelect: isMultipleSelect as Multiple,
    disableClearable,
    getOptionLabel: getOptionLabelProp,
    filterOptions,
    ...restProps,
    disableCloseOnSelect:
      restProps.disableCloseOnSelect ?? Boolean(isMultipleSelect),
  });

  const inputProps = getInputProps();
  const listboxProps = getListboxProps();

  const tags = useMemo(
    () => (isMultipleSelect ? ((value || []) as T[]) : []),
    [isMultipleSelect, value]
  );

  const memoizedOptions = useMemo(() => {
    if (filteredOptions.length === 0) {
      return (
        <div
          role="option"
          aria-disabled="true"
          aria-selected="false"
          tabIndex={-1}
          className="flex min-h-11 items-center px-3 py-2.5 text-ink-secondary text-sm"
        >
          {noOptionsText}
        </div>
      );
    }

    return filteredOptions.map((option, index) => (
      <OptionItem
        key={option.id}
        option={option}
        index={index}
        getOptionProps={getOptionProps}
        getOptionLabel={getOptionLabel}
        renderOption={renderOption}
      />
    ));
  }, [
    filteredOptions,
    noOptionsText,
    getOptionProps,
    getOptionLabel,
    renderOption,
  ]);

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.stopPropagation();
      }
      inputProps.onKeyDown?.(e);
    },
    [inputProps.onKeyDown]
  );

  const hasTags = tags.length > 0;
  const showClear = !disableClearable && !disabled && !readOnly && isDirty;

  return (
    <div className={cn('relative w-full', className)}>
      {label && (
        <Typography
          element="label"
          variant="span"
          textColor="body"
          weight="medium"
          className="mb-1 block"
          {...getInputLabelProps()}
        >
          {label}
        </Typography>
      )}

      <DropdownMenu open={open} modal={false} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <div {...STRIPPED_TRIGGER_ARIA} {...getRootProps()}>
            <InputGroup
              size={size}
              variant="outline"
              className={cn('group h-auto', hasTags && 'flex-wrap')}
            >
              {startAddon && (
                <InputGroupAddon align="inline-start">
                  {startAddon}
                </InputGroupAddon>
              )}

              <div
                className={cn(
                  'flex flex-1 flex-wrap items-center',
                  BADGE_LIST_PADDING_MAP[size ?? 'lg'],
                  hasTags && TAGS_INSET_MAP[size ?? 'lg']
                )}
              >
                <BadgeList<T>
                  tags={tags}
                  inputGroupSize={size}
                  variant={badgeVariant}
                  getOptionLabel={getOptionLabel}
                  getBadgeProps={getBadgeProps}
                  renderBadge={renderBadge}
                />

                <InputGroupInput
                  {...inputProps}
                  placeholder={placeholder}
                  className={cn(
                    'min-w-8 flex-1 bg-transparent',
                    hasTags && 'px-0',
                    inputClassName
                  )}
                  onKeyDown={handleInputKeyDown}
                />
              </div>

              {endAddon && (
                <InputGroupAddon align="inline-end">{endAddon}</InputGroupAddon>
              )}

              {showClear && (
                <InputGroupAction {...getClearProps()} aria-label={clearLabel}>
                  <X aria-hidden />
                </InputGroupAction>
              )}

              <InputGroupAction
                {...getPopupIndicatorProps()}
                aria-label={popupIndicatorLabel}
                className="ms-0.5"
              >
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'transition-transform',
                    'duration-200',
                    open && 'rotate-180'
                  )}
                />
              </InputGroupAction>
            </InputGroup>
          </div>
        </DropdownMenuTrigger>

        {open && (
          <DropdownMenuContent
            {...listboxProps}
            className={cn(
              'w-[--radix-dropdown-menu-trigger-width] max-w-none',
              // z-[110]: is used so the dropdown menu is rendered on top of Modal (z-100)
              'z-[110] overflow-y-auto p-2',
              'max-h-[min(21.5rem,var(--radix-dropdown-menu-content-available-height))]',
              listboxClassName
            )}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onFocusOutside={(e) => e.preventDefault()}
          >
            {isLoading ? (
              <div
                role="option"
                aria-disabled="true"
                aria-selected="false"
                tabIndex={-1}
                className="flex min-h-11 items-center gap-2 px-3 py-2.5 text-ink-secondary text-sm"
              >
                <Spinner size="sm" color="inherit" aria-hidden />
                {loadingText}
              </div>
            ) : (
              memoizedOptions
            )}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}
