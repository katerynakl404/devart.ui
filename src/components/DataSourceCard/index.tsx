'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Plus } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../Button';
import { ConnectorLogo } from '../ConnectorLogo';

/**
 * The connector catalog tile: a mark, a name, and a Connect action that is
 * revealed on hover rather than sitting on the tile at rest.
 *
 * The reveal is the whole point of the component, and it is why this is a
 * component rather than a `Card` composition. A button placed directly on the
 * tile lands on top of the connector mark, and both the mark and the label show
 * through it — the button reads as floating rather than as pressable. The tile
 * therefore fades in a **scrim**: a full-bleed sheet of the card's own surface
 * at 80%, which covers the mark just enough to give the button a ground to sit
 * on while the tile stays recognisable underneath.
 *
 * Nothing about that can be expressed by giving the button a different variant,
 * which is the shape the problem kept being mistaken for: the button is fine,
 * it simply had no surface beneath it.
 */
const dataSourceCardVariants = cva(
  cn(
    'group/ds-card relative flex flex-col items-center justify-center text-center',
    'h-32 gap-2 p-4',
    'rounded-lg border border-stroke bg-surface-card',
    'shadow-rest',
    'transition-[box-shadow,border-color,transform] duration-base',

    // Elevation lift, the same recipe `Card` `elevated` uses.
    'hover:-translate-y-px hover:border-card-lift-border hover:shadow-lift-hover',

    // The tile is a button, so it takes the shared focus ring.
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page',

    'disabled:pointer-events-none disabled:opacity-disabled'
  ),
  {
    variants: {
      /**
       * `tile` is the catalog layout and the only one the kit approved. The
       * variant axis exists so a second layout has somewhere to go rather than
       * arriving as a pile of overrides at the call site.
       */
      variant: { tile: '' },
    },
    defaultVariants: { variant: 'tile' },
  }
);

export interface DataSourceCardProps
  extends Omit<ComponentProps<'button'>, 'onClick' | 'children' | 'name'>,
    VariantProps<typeof dataSourceCardVariants> {
  /** Connector name or slug — resolved by {@link ConnectorLogo}. */
  connector: string;
  /** Overrides the visible name. Defaults to `connector`. */
  name?: ReactNode;
  /** Marks the tile with the "popular" flame. */
  isPopular?: boolean;
  /** Label on the revealed action. */
  connectLabel?: string;
  onConnect?: () => void;
}

/**
 * A catalog tile for a data source that is not connected yet.
 *
 * Connected sources never appear in the catalog, so there is no connected
 * state here — a tile that has been connected leaves the grid.
 */
function DataSourceCard({
  className,
  connector,
  name,
  isPopular = false,
  connectLabel = 'Connect',
  onConnect,
  variant,
  ...props
}: DataSourceCardProps) {
  const label = name ?? connector;

  return (
    <button
      data-slot="data-source-card"
      type="button"
      className={cn(dataSourceCardVariants({ variant }), className)}
      onClick={onConnect}
      {...props}
    >
      <span className="relative flex shrink-0 items-center justify-center">
        <ConnectorLogo connector={connector} size="md" />
        {isPopular ? (
          // The ring is the card surface, not white: on dark the badge has to
          // punch out of the mark the same way, and a white ring there would
          // read as a sticker.
          <span
            aria-hidden
            className={cn(
              'absolute -top-1 -right-1 flex size-[18px] items-center justify-center',
              'rounded-full border-[1.5px] border-surface-card bg-surface-card',
              'text-fb-red [&_svg]:size-3'
            )}
          >
            <FlameMark />
          </span>
        ) : null}
      </span>

      <span className="line-clamp-2 text-ink-primary text-sm">{label}</span>

      {/* The scrim. `pointer-events-none` at rest so the tile itself stays the
          click target; the sheet only exists to give the action a ground. */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 flex items-center justify-center rounded-[inherit]',
          'bg-ds-card-scrim',
          'pointer-events-none opacity-0',
          'transition-opacity duration-slow',
          'group-hover/ds-card:opacity-100 group-focus-visible/ds-card:opacity-100'
        )}
      >
        <Button
          asChild
          leftSlot={<Plus />}
          size="sm"
          tabIndex={-1}
          variant="secondary"
          className={cn(
            'translate-y-1.5 transition-transform duration-slow',
            'group-hover/ds-card:translate-y-0 group-focus-visible/ds-card:translate-y-0'
          )}
        >
          {/* A span, not a nested button: the tile is already the control, and
              a button inside a button is invalid and unreachable. */}
          <span>{connectLabel}</span>
        </Button>
      </span>
    </button>
  );
}

/** The "popular" flame, inlined so the tile carries no icon dependency. */
function FlameMark() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2c.7 3.2-1.2 4.6-2.5 6C8 9.6 7 11 7 13.3 7 16.9 9.9 20 13 20s5-2.6 5-6c0-2.4-1.3-4.3-2.6-5.7-.5 1-1.2 1.6-1.9 1.9.4-2.9-.6-6-1.5-8.2Z" />
    </svg>
  );
}

export { DataSourceCard, dataSourceCardVariants };
