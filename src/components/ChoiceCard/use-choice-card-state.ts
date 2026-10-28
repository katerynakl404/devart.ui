import { useChoiceGroup } from './context';
import type { ChoiceCardIndicator, ChoiceCardProps } from './types';

type ChoiceCardStateProps = Pick<
  ChoiceCardProps,
  'value' | 'indicator' | 'disabled' | 'selected' | 'onSelect' | 'name'
>;

const resolveIndicator = (
  indicator: ChoiceCardIndicator,
  groupType: 'single' | 'multiple' | undefined
): Exclude<ChoiceCardIndicator, 'auto'> => {
  if (indicator !== 'auto') return indicator;

  return groupType === 'multiple' ? 'checkbox' : 'none';
};

export const useChoiceCardState = ({
  value,
  indicator = 'auto',
  disabled: disabledFromProps = false,
  selected = false,
  name,
  onSelect,
}: ChoiceCardStateProps) => {
  const group = useChoiceGroup();
  const isSelected = group
    ? value != null && group.isSelected(value)
    : selected;
  const disabled = disabledFromProps || Boolean(group?.disabled);

  const toggle = (next = !isSelected) => {
    if (disabled) return;

    if (!group) {
      onSelect?.(next);
      return;
    }

    if (value != null) group.select(value);
  };

  const isSingleGroup = group?.type === 'single';
  let tabIndex: 0 | -1 | undefined;

  if (isSingleGroup) {
    const holdsTabStop = value != null && group.isTabStop(value);
    tabIndex = holdsTabStop ? 0 : -1;
  }

  return {
    isSelected,
    disabled,
    indicator: resolveIndicator(indicator, group?.type),
    isRadio: isSingleGroup,
    name: group ? group.name : name,
    tabIndex,
    toggle,
  };
};
