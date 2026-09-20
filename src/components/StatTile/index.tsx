'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Card } from '../Card';
import { Typography } from '../Typography';

const statTileVariants = cva('flex flex-col', {
  variants: {
    // The two rungs the rest of the system uses for a padded surface: `sm` is
    // a dense row of tiles under a heading, `md` a dashboard's own top row.
    size: {
      sm: 'gap-1 p-4',
      md: 'gap-1.5 p-5',
    },
  },
  defaultVariants: { size: 'md' },
});

const VALUE_STYLE = { sm: 'title20', md: 'title24' } as const;

export interface StatTileProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof statTileVariants> {
  /** What is being counted. Overline — it is a caption, not a heading. */
  label: ReactNode;
  value: ReactNode;
  /** The sentence that makes the number mean something. */
  description?: ReactNode;
  /** A badge, a trend, a link — anything that qualifies the value. */
  rightSlot?: ReactNode;
}

/**
 * One number and what it counts.
 *
 * Three lines in a fixed order, because the order is the reading: the label
 * says what you are looking at, the value answers it, the description says why
 * the answer matters. A tile that puts the number first and the label under it
 * reads as a score.
 *
 * The value is `tabular-nums` — a row of tiles whose digits are different
 * widths shifts as the data refreshes.
 */
function StatTile({
  label,
  value,
  description,
  rightSlot,
  size,
  className,
  ...props
}: StatTileProps) {
  return (
    <Card
      variant="outline"
      className={cn(statTileVariants({ size }), className)}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <Typography element="span" textStyle="overline" textColor="secondary">
          {label}
        </Typography>
        {rightSlot}
      </div>
      <Typography
        element="span"
        textStyle={VALUE_STYLE[size ?? 'md']}
        textColor="primary"
        className="tabular-nums"
      >
        {value}
      </Typography>
      {description ? (
        <Typography element="span" textStyle="body12" textColor="secondary">
          {description}
        </Typography>
      ) : null}
    </Card>
  );
}

StatTile.displayName = 'StatTile';

export { StatTile, statTileVariants };
