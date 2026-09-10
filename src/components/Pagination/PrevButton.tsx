'use client';

import { ChevronLeft } from 'lucide-react';
import { NavButton } from './NavButton';

interface Props {
  isDisabled: boolean;
  onClick: () => void;
  /** Accessible label for the button. */
  label?: string;
}

const PrevButton = ({
  isDisabled,
  onClick,
  label = 'Previous page',
}: Props) => (
  <NavButton onClick={onClick} isDisabled={isDisabled} label={label}>
    <ChevronLeft />
  </NavButton>
);

PrevButton.displayName = 'PrevButton';

export { PrevButton };
