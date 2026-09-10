'use client';

import { ChevronsLeft } from 'lucide-react';
import { NavButton } from './NavButton';

interface Props {
  isDisabled: boolean;
  onClick: () => void;
  /** Accessible label for the button. */
  label?: string;
}

const FirstButton = ({ onClick, isDisabled, label = 'First page' }: Props) => (
  <NavButton onClick={onClick} isDisabled={isDisabled} label={label}>
    <ChevronsLeft />
  </NavButton>
);

FirstButton.displayName = 'FirstButton';

export { FirstButton };
