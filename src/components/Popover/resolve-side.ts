import type { PopoverSide } from './context';

type Rect = { top: number; right: number; bottom: number; left: number };
type Size = { width: number; height: number };
type CollisionPadding = number | Partial<Record<PopoverSide, number>>;

export interface ResolveSideInput {
  /** Priority order: the first entry is the preferred side. */
  sides: readonly PopoverSide[];
  triggerRect: Rect;
  contentSize: Size;
  viewport: Size;
  sideOffset: number;
  collisionPadding: CollisionPadding;
}

const normalisePadding = (
  padding: CollisionPadding
): Record<PopoverSide, number> =>
  typeof padding === 'number'
    ? { top: padding, right: padding, bottom: padding, left: padding }
    : {
        top: padding.top ?? 0,
        right: padding.right ?? 0,
        bottom: padding.bottom ?? 0,
        left: padding.left ?? 0,
      };

/** Distance from the trigger's edge to the viewport's edge on that side. */
const clearanceOnSide = (side: PopoverSide, trigger: Rect, viewport: Size) => {
  switch (side) {
    case 'right':
      return viewport.width - trigger.right;
    case 'left':
      return trigger.left;
    case 'bottom':
      return viewport.height - trigger.bottom;
    case 'top':
      return trigger.top;
  }
};

/**
 * Picks the first of `sides` where the content, its offset and that side's
 * collision padding all fit between the trigger and the viewport edge. When
 * none fits the last entry wins: the caller orders the list by priority, so
 * the last one is the axis on which Radix's own flip and shift take over.
 */
export const resolveSide = ({
  sides,
  triggerRect,
  contentSize,
  viewport,
  sideOffset,
  collisionPadding,
}: ResolveSideInput): PopoverSide => {
  const last = sides[sides.length - 1];
  // An empty list is a programmer error, not a layout the caller can recover from.
  if (last === undefined) throw new Error('resolveSide: `sides` is empty');

  const padding = normalisePadding(collisionPadding);
  const fits = (side: PopoverSide) => {
    const needed =
      side === 'left' || side === 'right'
        ? contentSize.width
        : contentSize.height;

    const clearance = clearanceOnSide(side, triggerRect, viewport);

    return clearance - sideOffset - padding[side] >= needed;
  };

  return sides.find(fits) ?? last;
};
