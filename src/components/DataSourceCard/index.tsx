'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Plus } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn, liftOnHover } from '../../lib/utils';
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
 *
 * The action does answer the pointer, though. It sits inside the scrim, and the
 * scrim is `pointer-events-none` so the tile stays the click target — which also
 * meant the button could never be hovered, and a control that stays flat under
 * the cursor is the one thing every other button in the system does not do. It
 * takes its own pointer events back; the click still bubbles to the tile.
 */
const dataSourceCardVariants = cva(
  cn(
    'group/ds-card grid text-center',
    // One cell, two layers: the content and the scrim both sit in `1/1`
    // rather than the scrim being `absolute`. That is what sets the tile's
    // minimum width — an absolutely positioned child contributes nothing to
    // intrinsic size, so the tile used to shrink under the Connect action and
    // clip it. Stacked, the tile can never be narrower than the action plus
    // the 8px the scrim keeps either side of it.
    //
    // Above that minimum the grid decides: `w-full` fills the track, and the
    // catalog's own `minmax()` floor takes over.
    // `min-w-fit` is what makes the stack a floor rather than a suggestion.
    // Tailwind's `grid-cols-N` is `minmax(0, 1fr)`, which lets a track shrink
    // below its item's min-content, so the intrinsic minimum alone does not
    // hold: the tile has to refuse.
    'h-32 w-full min-w-fit',
    'rounded-lg border border-stroke bg-surface-card',
    'shadow-rest',
    liftOnHover(),

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
      <span className="flex flex-col items-center justify-center gap-2 p-4 [grid-area:1/1]">
        <ConnectorLogo connector={connector} size="md" />

        <span className="line-clamp-2 text-ink-primary text-sm">{label}</span>
      </span>

      {/* The scrim. `pointer-events-none` so the tile itself stays the click
          target; the sheet only exists to give the action a ground. The action
          inside it takes its pointer events back — see the note on it. */}
      <span
        aria-hidden
        className={cn(
          // `relative` so the scrim is the layer that wins. Both children sit
          // in one grid cell, and among positioned siblings the later one
          // paints on top; a static scrim would fall behind anything in the
          // content layer that gains a position of its own.
          'relative flex items-center justify-center rounded-[inherit] [grid-area:1/1]',
          // 8px either side of the action, and this is the pair that decides
          // the tile's minimum width — see the note on the root. A control
          // touching the border of the surface it sits on reads as clipped.
          'px-2',
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
            'group-hover/ds-card:translate-y-0 group-focus-visible/ds-card:translate-y-0',
            // `pointer-events-auto`: the action answers the pointer itself.
            // Inside a `pointer-events-none` scrim it could not be hovered at
            // all, so the one control on the tile was the only button in the
            // system that stayed flat under the cursor — reported as "why is
            // there no hover on the buttons". It is still not the click target:
            // a click on it bubbles to the tile, which is the button.
            'pointer-events-auto'
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

export { DataSourceCard, dataSourceCardVariants };
