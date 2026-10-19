import type { TargetRect } from '../../hooks/use-target-rect';

export type CoachmarkSide = 'top' | 'right' | 'bottom' | 'left';

export interface CoachmarkPosition {
  /** The card's left edge, viewport px. */
  x: number;
  /** The card's top edge, viewport px. */
  y: number;
  side: CoachmarkSide;
  /** Where the arrow sits along the card's edge facing the target. */
  arrow: { top: number } | { left: number };
}

/** Card ↔ target. */
export const COACHMARK_GAP = 14;
/** Card ↔ edge of the bounds. */
export const COACHMARK_EDGE = 8;

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/**
 * Where a `w` × `h` card goes next to `r`, inside `b`.
 *
 * It takes the first preferred side where it fits whole without covering the
 * target. When none does, it takes the first preferred side with at least 75%
 * of the card's size free (else the roomiest side) and pins the card to that
 * side's edge of the bounds — it may then overlap the target, which beats
 * hanging off the screen. The arrow stays 16px clear of the card's corners.
 */
export function placeCoachmark(
  r: TargetRect,
  b: TargetRect,
  w: number,
  h: number,
  prefer: readonly CoachmarkSide[]
): CoachmarkPosition {
  const cx = (r.left + r.right) / 2;
  const cy = (r.top + r.bottom) / 2;
  const c: Record<CoachmarkSide, { x: number; y: number; fits: boolean }> = {
    right: {
      x: r.right + COACHMARK_GAP,
      y: clamp(
        cy - h / 2,
        b.top + COACHMARK_EDGE,
        b.bottom - h - COACHMARK_EDGE
      ),
      fits: r.right + COACHMARK_GAP + w <= b.right - COACHMARK_EDGE,
    },
    left: {
      x: r.left - COACHMARK_GAP - w,
      y: clamp(
        cy - h / 2,
        b.top + COACHMARK_EDGE,
        b.bottom - h - COACHMARK_EDGE
      ),
      fits: r.left - COACHMARK_GAP - w >= b.left + COACHMARK_EDGE,
    },
    bottom: {
      x: clamp(
        cx - w / 2,
        b.left + COACHMARK_EDGE,
        b.right - w - COACHMARK_EDGE
      ),
      y: r.bottom + COACHMARK_GAP,
      fits: r.bottom + COACHMARK_GAP + h <= b.bottom - COACHMARK_EDGE,
    },
    top: {
      x: clamp(
        cx - w / 2,
        b.left + COACHMARK_EDGE,
        b.right - w - COACHMARK_EDGE
      ),
      y: r.top - COACHMARK_GAP - h,
      fits: r.top - COACHMARK_GAP - h >= b.top + COACHMARK_EDGE,
    },
  };

  let side = prefer.find((s) => c[s]?.fits);
  if (!side) {
    const room: Record<CoachmarkSide, number> = {
      top: r.top - b.top,
      bottom: b.bottom - r.bottom,
      left: r.left - b.left,
      right: b.right - r.right,
    };
    side =
      prefer.find(
        (s) => room[s] >= (s === 'top' || s === 'bottom' ? h : w) * 0.75
      ) ??
      (Object.keys(room) as CoachmarkSide[]).sort(
        (x, y) => room[y] - room[x]
      )[0] ??
      'bottom';
    c.top.y = b.top + COACHMARK_EDGE;
    c.bottom.y = b.bottom - h - COACHMARK_EDGE;
    c.left.x = b.left + COACHMARK_EDGE;
    c.right.x = b.right - w - COACHMARK_EDGE;
  }

  const pos = c[side];
  const arrow =
    side === 'left' || side === 'right'
      ? { top: clamp(cy - pos.y - 6, 16, h - 28) }
      : { left: clamp(cx - pos.x - 6, 16, w - 28) };

  return { x: Math.round(pos.x), y: Math.round(pos.y), side, arrow };
}
