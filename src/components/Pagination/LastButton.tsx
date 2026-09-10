'use client';

import { ChevronsRight } from 'lucide-react';
import { NavButton } from './NavButton';

interface Props {
  isDisabled: boolean;
  onClick: () => void;
  /** Accessible label for the button. */
  label?: string;
}

const LastButton = ({ onClick, isDisabled, label = 'Last page' }: Props) => (
  <NavButton onClick={onClick} isDisabled={isDisabled} label={label}>
    <ChevronsRight />
  </NavButton>
);

LastButton.displayName = 'LastButton';

export { LastButton };
