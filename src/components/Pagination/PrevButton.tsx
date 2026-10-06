'use client';

import { ChevronLeft } from 'lucide-react';
import { NavButton } from './NavButton';
import type { PaginationSize } from './size';

interface Props {
  isDisabled: boolean;
  onClick: () => void;
  /** Accessible label for the button. */
  label?: string;
  size?: PaginationSize;
}

const PrevButton = ({
  isDisabled,
  onClick,
  label = 'Previous page',
  size,
}: Props) => (
  <NavButton
    onClick={onClick}
    isDisabled={isDisabled}
    label={label}
    size={size}
  >
    <ChevronLeft />
  </NavButton>
);

PrevButton.displayName = 'PrevButton';

export { PrevButton };
