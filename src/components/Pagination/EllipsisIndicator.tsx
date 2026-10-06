import { Ellipsis } from 'lucide-react';

import { PAGINATION_BOX, type PaginationSize } from './size';

const EllipsisIndicator = ({ size = 'sm' }: { size?: PaginationSize }) => (
  <span
    aria-hidden
    className={`flex ${PAGINATION_BOX[size]} cursor-default items-center justify-center text-ink-inactive [&_svg]:size-4`}
  >
    <Ellipsis />
  </span>
);

EllipsisIndicator.displayName = 'EllipsisIndicator';

export { EllipsisIndicator };
