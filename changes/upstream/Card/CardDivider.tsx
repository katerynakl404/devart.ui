/**
 * The developers' `Card` folder, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/Card/CardDivider.tsx`, import paths alone changed. The
 * Before halves of the Card page render `Card` from here, so it is the
 * component the developer storybook ships, not a drawing of it. Not edited:
 * replace the folder whole when the base moves.
 */

import type { ComponentProps } from 'react';
import { cn } from '../../../src/lib/utils';

const CardDivider = ({ className, ref, ...props }: ComponentProps<'hr'>) => (
  <hr
    ref={ref}
    className={cn('hidden border-0 border-stroke border-t', className)}
    {...props}
  />
);

CardDivider.displayName = 'CardDivider';

export { CardDivider };
