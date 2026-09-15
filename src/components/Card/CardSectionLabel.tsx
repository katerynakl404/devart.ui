import type { ComponentProps } from 'react';
import { Typography } from '../Typography';

/**
 * Small-caps uppercase section label inside a Card ("Available metrics" in the
 * provider-card reference): `--ink-inactive`, the `overline` type style.
 */
const CardSectionLabel = ({
  className,
  ref,
  ...props
}: ComponentProps<'p'>) => (
  <Typography
    className={className}
    element="p"
    ref={ref}
    textColor="light"
    textStyle="overline"
    {...props}
  />
);

CardSectionLabel.displayName = 'CardSectionLabel';

export { CardSectionLabel };
