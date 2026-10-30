/**
 * The developers' `Card` folder, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/Card/CardTitle.tsx`, import paths alone changed. The
 * Before halves of the Card page render `Card` from here, so it is the
 * component the developer storybook ships, not a drawing of it. Not edited:
 * replace the folder whole when the base moves.
 */

import {
  Typography,
  type TypographyProps,
} from '../../../src/components/Typography';
import { cn } from '../../../src/lib/utils';

/**
 * The main heading for a Card component.
 * It builds upon the Typography primitive to provide standardized bold,
 * primary-colored text with tight letter spacing.
 */
const CardTitle = ({ className, ref, ...props }: TypographyProps) => (
  <Typography
    ref={ref}
    className={cn(
      'font-semibold text-base text-ink-primary tracking-tight',
      className
    )}
    {...props}
  />
);

CardTitle.displayName = 'CardTitle';

export { CardTitle };
