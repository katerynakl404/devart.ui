'use client';

import type {
  ComponentProps,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react';
import { onButtonKeyDown } from '../../lib/button-keyboard';
import { cva } from '../../lib/cva';
import { cn, focusRing, liftOnHover } from '../../lib/utils';
import { buttonVariants } from '../Button';
import { Card } from '../Card';
import { Typography } from '../Typography';
import {
  IconCardSkeleton,
  type IconCardSkeletonProps,
} from './IconCardSkeleton';

const iconCardVariants = cva(
  cn(
    'group/icon-card relative isolate',
    // The kit's approved catalog tile (`.ds-v3 .ds-card`): 8rem tall, 16px
    // inset, 8px between the mark and its name. The height is fixed rather
    // than square — the kit sizes the tile, the grid sizes the column.
    'h-32',
    'flex flex-col items-center justify-center gap-2 overflow-hidden p-4',
    '[contain-intrinsic-size:auto_8rem] [content-visibility:auto]',
    // A catalog tile lifts 1px; `Card variant="elevated"` lifts a larger box 2.
    liftOnHover(1),
    // The tile is the control, so it takes the system ring — offset against
    // the page it sits on, not a card.
    focusRing,
    'focus-visible:ring-offset-surface-page'
  ),
  {
    variants: {
      disabled: {
        true: cn(
          'cursor-not-allowed opacity-disabled',
          'hover:translate-y-0 hover:border-stroke hover:shadow-rest'
        ),
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

export interface IconCardProps extends Omit<ComponentProps<'div'>, 'children'> {
  /**
   * Gates activation as well as the overlay, so it is declared here rather than
   * inherited from the recipe — a style axis may be `null`, a behavioural prop
   * may not.
   */
  disabled?: boolean;
  /** Mark above the caption. Decorative — the card is named by `aria-label`. */
  icon: ReactNode;
  /** Caption under the icon; clamped to two lines. */
  label: string;
  /** Marker pinned to the icon's top-right corner, e.g. a "popular" flame. */
  badge?: ReactNode;
  /** Caption on the hover overlay. */
  actionLabel: string;
  /** Glyph before `actionLabel` on the overlay. */
  actionIcon?: ReactNode;
  /**
   * Semantic activation (connect, open, …). Skipped when `disabled`, or when a
   * composed `onClick` / `onKeyDown` calls `preventDefault` — so a parent can
   * intercept (e.g. plan-locked upgrade on click only) without the card
   * overwriting that handler.
   */
  onActivate?: () => void;
}

/**
 * A square icon + caption card with an action revealed on hover. The card
 * itself is the control — the overlay is decoration, which is why it holds a
 * styled `span` rather than a nested button.
 *
 * The overlay is a scrim: a sheet of the card's own surface that covers the
 * mark just enough to give the action a ground to sit on while the tile stays
 * recognisable underneath. Without it a button placed on the tile has the mark
 * and the caption showing through it and reads as floating, not pressable.
 *
 * `onClick` / `onKeyDown` compose with `onActivate`: callers run first and may
 * `preventDefault` to block activation (kit: locked catalog tiles answer the
 * click with an upgrade path, never the hover).
 */
const IconCard = ({
  icon,
  label,
  badge,
  actionLabel,
  actionIcon,
  disabled = false,
  className,
  onActivate,
  onClick,
  onKeyDown,
  ...props
}: IconCardProps) => {
  const handleActivate = () => {
    if (disabled) return;

    onActivate?.();
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    handleActivate();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    onButtonKeyDown(handleActivate)(event);
  };

  return (
    <Card
      {...props}
      aria-disabled={disabled}
      className={cn(iconCardVariants({ disabled }), className)}
      fullWidth
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      variant="elevated"
    >
      <div className="relative shrink-0">
        {icon}

        {badge && (
          <span className="absolute -top-2 -right-3 flex size-[1.125rem]">
            {badge}
          </span>
        )}
      </div>

      {/* Body M — 14/20 at regular weight, the kit's `.ds-card-name`. */}
      <Typography
        variant="p"
        textColor="primary"
        className="line-clamp-2 w-full min-w-0 break-words text-center text-sm"
      >
        {label}
      </Typography>

      {!disabled && (
        <div
          aria-hidden
          className={cn(
            // 8px either side of the action — the kit's gutter. A control
            // touching the edge of the surface it sits on reads as clipped.
            'absolute inset-0 hidden items-center justify-center px-2 lg:flex',
            'bg-ds-card-scrim',
            // Pointer-inert until it shows: an invisible overlay must not be
            // what a click lands on.
            'pointer-events-none opacity-0 transition-opacity duration-slow',
            'group-hover/icon-card:pointer-events-auto group-hover/icon-card:opacity-100',
            'group-focus-visible/icon-card:pointer-events-auto group-focus-visible/icon-card:opacity-100'
          )}
        >
          <span
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'sm' }),
              // Rises 6px into place as the scrim fades in.
              'max-w-full translate-y-1.5 transition-transform duration-slow',
              'group-hover/icon-card:translate-y-0 group-focus-visible/icon-card:translate-y-0'
            )}
          >
            {actionIcon}

            <span className="min-w-0 truncate">{actionLabel}</span>
          </span>
        </div>
      )}
    </Card>
  );
};

IconCard.displayName = 'IconCard';

export {
  IconCard,
  IconCardSkeleton,
  iconCardVariants,
  type IconCardSkeletonProps,
};
