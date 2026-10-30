/**
 * The developers' `Card` folder, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/Card/CardContent.tsx`, import paths alone changed. The
 * Before halves of the Card page render `Card` from here, so it is the
 * component the developer storybook ships, not a drawing of it. Not edited:
 * replace the folder whole when the base moves.
 */

import type { ComponentProps } from 'react';
import { cn } from '../../../src/lib/utils';

/**
 * The primary container for the body text or main elements within a Card.
 * It applies standard body text styling and serves as the main layout area for card data.
 */
const CardContent = ({ className, ref, ...props }: ComponentProps<'div'>) => (
  <div ref={ref} className={cn('text-ink-body', className)} {...props} />
);

CardContent.displayName = 'CardContent';

export { CardContent };
