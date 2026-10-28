import { Children, isValidElement, type ReactNode } from 'react';

interface ChoiceCardChildProps {
  value?: string;
  disabled?: boolean;
}

export const firstEnabledValue = (children: ReactNode): string | undefined => {
  for (const child of Children.toArray(children)) {
    if (!isValidElement<ChoiceCardChildProps>(child)) continue;

    if (!child.props.disabled && child.props.value != null) {
      return child.props.value;
    }
  }

  return undefined;
};
