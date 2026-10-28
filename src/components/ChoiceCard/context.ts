import { createContext, useContext } from 'react';

export interface ChoiceGroupContextValue {
  type: 'single' | 'multiple';
  name?: string;
  disabled: boolean;
  isSelected: (value: string) => boolean;
  isTabStop: (value: string) => boolean;
  select: (value: string) => void;
}

export const ChoiceGroupContext = createContext<ChoiceGroupContextValue | null>(
  null
);

export const useChoiceGroup = () => useContext(ChoiceGroupContext);
