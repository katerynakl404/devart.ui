'use client';

import type { MouseEventHandler, PropsWithChildren } from 'react';
import { IconButton } from '../IconButton';
import type { PaginationSize } from './size';

interface Props {
  label: string;
  isDisabled: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  size?: PaginationSize;
}

const NavButton = ({
  isDisabled,
  label,
  children,
  onClick,
  size = 'sm',
}: PropsWithChildren<Props>) => (
  <IconButton
    type="button"
    variant="secondary"
    size={size}
    rounded="md"
    onClick={onClick}
    disabled={isDisabled}
    aria-label={label}
  >
    {children}
  </IconButton>
);

NavButton.displayName = 'NavButton';

export { NavButton };
