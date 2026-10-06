'use client';

import { ChevronsLeft } from 'lucide-react';
import { NavButton } from './NavButton';
import type { PaginationSize } from './size';

interface Props {
  isDisabled: boolean;
  onClick: () => void;
  /** Accessible label for the button. */
  label?: string;
  size?: PaginationSize;
}

const FirstButton = ({ onClick, isDisabled, label = 'First page', size }: Props) => (
  <NavButton onClick={onClick} isDisabled={isDisabled} label={label} size={size}>
    <ChevronsLeft />
  </NavButton>
);

FirstButton.displayName = 'FirstButton';

export { FirstButton };
