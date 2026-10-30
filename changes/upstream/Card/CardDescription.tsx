/**
 * The developers' `Card` folder, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/Card/CardDescription.tsx`, import paths alone changed. The
 * Before halves of the Card page render `Card` from here, so it is the
 * component the developer storybook ships, not a drawing of it. Not edited:
 * replace the folder whole when the base moves.
 */

import type { ComponentProps } from 'react';
import { cn } from '../../../src/lib/utils';

/**
 * A sub-component for the Card used to display secondary or supporting text.
 * It provides reduced visual weight to distinguish it from the CardTitle.
 */
const CardDescription = ({
  className,
  ref,
  ...props
}: ComponentProps<'div'>) => (
  <div
    ref={ref}
    className={cn('text-sm', 'text-ink-secondary', className)}
    {...props}
  />
);

CardDescription.displayName = 'CardDescription';

export { CardDescription };
