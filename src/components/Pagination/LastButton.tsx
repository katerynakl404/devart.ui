'use client';

import { ChevronsRight } from 'lucide-react';
import { NavButton } from './NavButton';
import type { PaginationSize } from './size';

interface Props {
  isDisabled: boolean;
  onClick: () => void;
  /** Accessible label for the button. */
  label?: string;
  size?: PaginationSize;
}

const LastButton = ({ onClick, isDisabled, label = 'Last page', size }: Props) => (
  <NavButton onClick={onClick} isDisabled={isDisabled} label={label} size={size}>
    <ChevronsRight />
  </NavButton>
);

LastButton.displayName = 'LastButton';

export { LastButton };
