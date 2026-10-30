/**
 * The developers' `Card` folder, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/Card/CardSectionLabel.tsx`, import paths alone changed. The
 * Before halves of the Card page render `Card` from here, so it is the
 * component the developer storybook ships, not a drawing of it. Not edited:
 * replace the folder whole when the base moves.
 */

import type { ComponentProps } from 'react';
import { Typography } from '../../../src/components/Typography';
import { cn } from '../../../src/lib/utils';

const CardSectionLabel = ({
  className,
  ref,
  ...props
}: ComponentProps<'p'>) => (
  <Typography
    ref={ref}
    variant="p"
    textColor="secondary"
    weight="medium"
    className={cn('hidden text-xs', className)}
    {...props}
  />
);

CardSectionLabel.displayName = 'CardSectionLabel';

export { CardSectionLabel };
