'use client';

import { Button } from '../Button';
import { PAGINATION_BOX, type PaginationSize } from './size';

interface Props {
  page: number;
  isActive: boolean;
  onClick: () => void;
  size?: PaginationSize;
}

const PageButton = ({ page, isActive, onClick, size = 'sm' }: Props) => (
  <Button
    type="button"
    variant={isActive ? 'primary' : 'secondary'}
    size={size}
    rounded="md"
    onClick={onClick}
    aria-current={isActive ? 'page' : undefined}
    /* A SQUARE, not a button sized by its label: `px-0` and an explicit box,
       so "1" and "15" are the same width and the row does not reflow as the
       reader pages through it. */
    className={`${PAGINATION_BOX[size]} px-0`}
  >
    {page}
  </Button>
);

PageButton.displayName = 'PageButton';

export { PageButton };
