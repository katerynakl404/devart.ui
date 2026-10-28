import type { RefObject } from 'react';
import type { ChoiceGroupContextValue } from './context';
import { firstEnabledValue } from './first-enabled-value';
import type {
  ChoiceGroupMultipleProps,
  ChoiceGroupProps,
  ChoiceGroupSingleProps,
} from './types';
import { useArrowNavigation } from './use-arrow-navigation';

type Selection = Pick<
  ChoiceGroupContextValue,
  'isSelected' | 'isTabStop' | 'select'
>;

const toggle = (values: string[], value: string) =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];

const singleSelection = (
  { value, children, onValueChange, onPick }: ChoiceGroupSingleProps,
  isArrowNavigating: RefObject<boolean>
): Selection => {
  const tabStopValue = value || firstEnabledValue(children);

  return {
    isSelected: (optionValue) => optionValue === value,
    isTabStop: (optionValue) => optionValue === tabStopValue,
    select: (optionValue) => {
      onValueChange?.(optionValue);

      if (!isArrowNavigating.current) onPick?.(optionValue);
    },
  };
};

const multipleSelection = ({
  value = [],
  onValueChange,
}: ChoiceGroupMultipleProps): Selection => ({
  isSelected: (optionValue) => value.includes(optionValue),
  isTabStop: () => true,
  select: (optionValue) => onValueChange?.(toggle(value, optionValue)),
});

export const useChoiceGroupState = (props: ChoiceGroupProps) => {
  const isMultiple = props.type === 'multiple';
  const { isArrowNavigating, onKeyDown } = useArrowNavigation(!isMultiple);

  const context: ChoiceGroupContextValue = {
    type: isMultiple ? 'multiple' : 'single',
    name: props.name,
    disabled: props.disabled ?? false,
    ...(props.type === 'multiple'
      ? multipleSelection(props)
      : singleSelection(props, isArrowNavigating)),
  };

  return { context, onKeyDown };
};
