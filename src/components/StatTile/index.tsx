'use client';

import type { ComponentProps, ReactNode } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { Card } from '../Card';
import { Typography } from '../Typography';

const statTileVariants = cva(
  cn(
    'flex flex-col',
    // The kit's outline tile is filled and does not react to hover; the
    // package's Card outline is unfilled and darkens its border on hover.
    'bg-surface-card hover:border-stroke'
  ),
  {
    variants: {
      size: {
        sm: 'gap-1 p-4',
        md: 'gap-1.5 p-5',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

const statTileValueVariants = cva('font-semibold tabular-nums', {
  variants: {
    size: {
      sm: 'text-xl',
      md: 'text-2xl',
    },
  },
  defaultVariants: { size: 'md' },
});

const statTilePartVariants = cva('', {
  variants: {
    part: {
      header: 'flex items-start justify-between gap-3',
      // Overline: a caption, not a heading.
      label: 'font-semibold text-xxs uppercase leading-4 tracking-caps',
      description: 'font-normal text-xs',
    },
  },
  defaultVariants: { part: 'header' },
});

export interface StatTileProps
  extends Omit<ComponentProps<'div'>, 'children'>,
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
const StatTile = ({
  label,
  value,
  description,
  rightSlot,
  size,
  className,
  ...props
}: StatTileProps) => (
  <Card
    variant="outline"
    data-slot="stat-tile"
    className={cn(statTileVariants({ size }), className)}
    {...props}
  >
    <div
      data-slot="stat-tile-header"
      className={statTilePartVariants({ part: 'header' })}
    >
      <Typography
        variant="span"
        textColor="secondary"
        data-slot="stat-tile-label"
        className={statTilePartVariants({ part: 'label' })}
      >
        {label}
      </Typography>
      {rightSlot}
    </div>

    <Typography
      variant="span"
      textColor="primary"
      data-slot="stat-tile-value"
      className={statTileValueVariants({ size })}
    >
      {value}
    </Typography>

    {description ? (
      <Typography
        variant="span"
        textColor="secondary"
        data-slot="stat-tile-description"
        className={statTilePartVariants({ part: 'description' })}
      >
        {description}
      </Typography>
    ) : null}
  </Card>
);

StatTile.displayName = 'StatTile';

export {
  StatTile,
  statTilePartVariants,
  statTileValueVariants,
  statTileVariants,
};
