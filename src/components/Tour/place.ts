import type { TargetRect } from '../../hooks/use-target-rect';
import type { GuideCardSide } from '../GuideCard';

export interface GuideCardPosition {
  /** The card's left edge, viewport px. */
  x: number;
  /** The card's top edge, viewport px. */
  y: number;
  /** The side of the target the card sits on — `GuideCard`'s `side`. */
  side: GuideCardSide;
  /**
   * The arrow's centre along the card's edge facing the target, px from the
   * card's top (`left` / `right`) or left (`top` / `bottom`) —
   * `GuideCard`'s `arrowOffset`.
   */
  arrowOffset: number;
}

/** Card ↔ target. */
export const GUIDE_CARD_GAP = 14;
/** Card ↔ edge of the bounds. */
export const GUIDE_CARD_EDGE = 8;
/** The arrow's centre ↔ the card's corners: 16px clear plus half the 12px arrow. */
const ARROW_INSET = 22;

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/**
 * Where a `w` × `h` card goes next to `r`, inside `b`.
 *
 * It takes the first preferred side where it fits whole without covering the
 * target. When none does, it takes the first preferred side with at least 75%
 * of the card's size free (else the roomiest side) and pins the card to that
 * side's edge of the bounds — it may then overlap the target, which beats
 * hanging off the screen. The arrow points at the target's centre and stays
 * 16px clear of the card's corners.
 */
export function placeGuideCard(
  r: TargetRect,
  b: TargetRect,
  w: number,
  h: number,
  prefer: readonly GuideCardSide[]
): GuideCardPosition {
  const cx = (r.left + r.right) / 2;
  const cy = (r.top + r.bottom) / 2;
  const c: Record<GuideCardSide, { x: number; y: number; fits: boolean }> = {
    right: {
      x: r.right + GUIDE_CARD_GAP,
      y: clamp(
        cy - h / 2,
        b.top + GUIDE_CARD_EDGE,
        b.bottom - h - GUIDE_CARD_EDGE
      ),
      fits: r.right + GUIDE_CARD_GAP + w <= b.right - GUIDE_CARD_EDGE,
    },
    left: {
      x: r.left - GUIDE_CARD_GAP - w,
      y: clamp(
        cy - h / 2,
        b.top + GUIDE_CARD_EDGE,
        b.bottom - h - GUIDE_CARD_EDGE
      ),
      fits: r.left - GUIDE_CARD_GAP - w >= b.left + GUIDE_CARD_EDGE,
    },
    bottom: {
      x: clamp(
        cx - w / 2,
        b.left + GUIDE_CARD_EDGE,
        b.right - w - GUIDE_CARD_EDGE
      ),
      y: r.bottom + GUIDE_CARD_GAP,
      fits: r.bottom + GUIDE_CARD_GAP + h <= b.bottom - GUIDE_CARD_EDGE,
    },
    top: {
      x: clamp(
        cx - w / 2,
        b.left + GUIDE_CARD_EDGE,
        b.right - w - GUIDE_CARD_EDGE
      ),
      y: r.top - GUIDE_CARD_GAP - h,
      fits: r.top - GUIDE_CARD_GAP - h >= b.top + GUIDE_CARD_EDGE,
    },
  };

  let side = prefer.find((s) => c[s]?.fits);
  if (!side) {
    const room: Record<GuideCardSide, number> = {
      top: r.top - b.top,
      bottom: b.bottom - r.bottom,
      left: r.left - b.left,
      right: b.right - r.right,
    };
    side =
      prefer.find(
        (s) => room[s] >= (s === 'top' || s === 'bottom' ? h : w) * 0.75
      ) ??
      (Object.keys(room) as GuideCardSide[]).sort(
        (x, y) => room[y] - room[x]
      )[0] ??
      'bottom';
    c.top.y = b.top + GUIDE_CARD_EDGE;
    c.bottom.y = b.bottom - h - GUIDE_CARD_EDGE;
    c.left.x = b.left + GUIDE_CARD_EDGE;
    c.right.x = b.right - w - GUIDE_CARD_EDGE;
  }

  const pos = c[side];
  const arrowOffset =
    side === 'left' || side === 'right'
      ? clamp(cy - pos.y, ARROW_INSET, h - ARROW_INSET)
      : clamp(cx - pos.x, ARROW_INSET, w - ARROW_INSET);

  return { x: Math.round(pos.x), y: Math.round(pos.y), side, arrowOffset };
}
