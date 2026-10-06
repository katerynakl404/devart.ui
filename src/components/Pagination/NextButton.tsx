'use client';

import { ChevronRight } from 'lucide-react';
import { NavButton } from './NavButton';
import type { PaginationSize } from './size';

interface Props {
  isDisabled: boolean;
  onClick: () => void;
  /** Accessible label for the button. */
  label?: string;
  size?: PaginationSize;
}

const NextButton = ({
  onClick,
  isDisabled,
  label = 'Next page',
  size,
}: Props) => (
  <NavButton
    onClick={onClick}
    isDisabled={isDisabled}
    label={label}
    size={size}
  >
    <ChevronRight />
  </NavButton>
);

NextButton.displayName = 'NextButton';

export { NextButton };
