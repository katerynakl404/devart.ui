'use client';

import {
  type Ref,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  isPhoneViewport,
  type TargetRect,
  usePortal,
} from '../../hooks/use-target-rect';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import {
  GuideCard,
  type GuideCardProps,
  type GuideCardSide,
} from '../GuideCard';
import { type GuideCardPosition, placeGuideCard } from './place';

/** Where the card landed: its top and bottom edge (viewport px) and its side. */
export interface TourCardPlacement {
  top: number;
  bottom: number;
  side: GuideCardSide;
}

export interface TourCardProps
  extends Omit<GuideCardProps, 'side' | 'arrowOffset' | 'ref'> {
  /** The lit area; `null` while there is nothing to point at. */
  rect: TargetRect | null;
  /** The area the card is placed in. */
  bounds: TargetRect;
  /** Preferred sides, in order. */
  prefer: readonly GuideCardSide[];
  /** Where the card landed; `null` while it is a bottom sheet or has no target. */
  onPlace?: (placement: TourCardPlacement | null) => void;
  ref?: Ref<HTMLDivElement>;
}

/*
 * What the engine adds to a `GuideCard`: fixed over the tour's layer
 * (`--spotlight-z` + 2), 12px clear of the viewport's sides, gliding to the
 * next target on the family's one curve, and focusable without a ring (focus
 * moves to the card on every step; it is not a control).
 *
 * ≤ 640px it is a bottom sheet instead: inset 12px from the sides and the
 * bottom (plus the safe area), full width, no arrow. The breakpoint is
 * `max-width: 640px` on purpose — the same test the placement runs in JS
 * (`innerWidth <= 640`) — not Tailwind's `max-sm:`.
 */
const tourCardVariants = cva(
  cn(
    'fixed z-[calc(var(--spotlight-z)+2)] max-w-[calc(100vw-1.5rem)]',
    '[transition:top_var(--spotlight-move),left_var(--spotlight-move)]',
    'focus:outline-none motion-reduce:transition-none',
    '[@media(max-width:640px)]:!left-3 [@media(max-width:640px)]:right-3',
    '[@media(max-width:640px)]:!top-auto [@media(max-width:640px)]:bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))]',
    '[@media(max-width:640px)]:w-auto [@media(max-width:640px)]:max-w-none',
    '[@media(max-width:640px)]:[&>[data-slot=guide-card-arrow]]:hidden'
  ),
  {
    variants: {
      /* Rendered once invisible to learn its size, then placed. */
      measuring: { true: 'invisible top-0 left-0', false: '' },
    },
    defaultVariants: { measuring: false },
  }
);

const samePosition = (a: GuideCardPosition, b: GuideCardPosition) =>
  a.x === b.x &&
  a.y === b.y &&
  a.side === b.side &&
  a.arrowOffset === b.arrowOffset;

/**
 * The tour's `GuideCard`, placed: portalled, measured, put on the first
 * preferred side where it fits whole (see `placeGuideCard`), re-placed as the
 * page moves, and a bottom sheet ≤ 640px. The card draws itself and its
 * arrow; this passes it the side it landed on and the target's centre.
 */
function TourCard({
  rect,
  bounds,
  prefer,
  onPlace,
  className,
  ref,
  ...props
}: TourCardProps) {
  const portal = usePortal();
  const own = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<GuideCardPosition | null>(null);
  const reported = useRef('');

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      own.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  const report = (placement: TourCardPlacement | null) => {
    const key = JSON.stringify(placement);
    if (key === reported.current) return;
    reported.current = key;
    onPlace?.(placement);
  };

  /* Every render: measure the card, place it, report where it went. State
     only changes when the numbers do. */
  useLayoutEffect(() => {
    const el = own.current;
    if (!el) return;
    if (isPhoneViewport() || !rect) {
      setPos(null);
      report(null);
      return;
    }
    const next = placeGuideCard(
      rect,
      bounds,
      el.offsetWidth,
      el.offsetHeight,
      prefer
    );
    setPos((prev) => (prev && samePosition(prev, next) ? prev : next));
    report({ top: next.y, bottom: next.y + el.offsetHeight, side: next.side });
  });

  return portal(
    <GuideCard
      ref={setRef}
      tabIndex={-1}
      side={pos?.side}
      arrowOffset={pos?.arrowOffset}
      className={cn(
        tourCardVariants({ measuring: !pos && !isPhoneViewport() }),
        className
      )}
      style={pos ? { left: pos.x, top: pos.y } : undefined}
      {...props}
    />
  );
}

TourCard.displayName = 'TourCard';

export { TourCard, tourCardVariants };
