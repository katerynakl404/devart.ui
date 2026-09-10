'use client';

import { ChevronRight } from 'lucide-react';
import { NavButton } from './NavButton';

interface Props {
  isDisabled: boolean;
  onClick: () => void;
  /** Accessible label for the button. */
  label?: string;
}

const NextButton = ({ onClick, isDisabled, label = 'Next page' }: Props) => (
  <NavButton onClick={onClick} isDisabled={isDisabled} label={label}>
    <ChevronRight />
  </NavButton>
);

NextButton.displayName = 'NextButton';

export { NextButton };
