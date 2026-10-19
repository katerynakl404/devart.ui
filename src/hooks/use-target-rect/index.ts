'use client';

import {
  boundsOf,
  radiusOf,
  resolveTargets,
  type TargetRect,
  type TourTarget,
  targetKey,
  unionRect,
} from './geometry';
import { useMeasure } from './use-measure';

export {
  boundsOf,
  isPhoneViewport,
  PHONE_MAX_WIDTH,
  radiusOf,
  resolveTargets,
  type TargetRect,
  type TourTarget,
  targetKey,
  unionRect,
} from './geometry';
export { usePortal } from './portal';
export { useMeasure } from './use-measure';

export interface UseTargetRectOptions {
  /** Grows the rect on every side. @default 8 */
  padding?: number;
  /** The area the rect is clipped to. Default: the viewport. */
  boundary?: TourTarget;
}

export interface TargetGeometry {
  /** The padded union of the target's boxes, clipped to `bounds`; `null` when nothing is visible. */
  rect: TargetRect | null;
  /** The boundary's box, clipped to the viewport. */
  bounds: TargetRect;
  /**
   * The corner a frame around `rect` needs to stay concentric with the
   * targets: their own radius (see `radiusOf`) + `padding`. `0` with no rect.
   */
  radius: number;
  /** Viewport width and height at the time of the measurement. */
  vw: number;
  vh: number;
}

const viewport = () =>
  typeof window === 'undefined'
    ? { vw: 0, vh: 0 }
    : { vw: window.innerWidth, vh: window.innerHeight };

/**
 * Where a target is on screen right now, kept current as the page moves.
 *
 * The geometry under `Spotlight`, `Coachmark`, `AnnotationGroup` and `Tour`,
 * exported so a page can position its own furniture against the same rect the
 * tour lights. Pass `null` as the target to measure only the bounds.
 */
export function useTargetRect(
  target: TourTarget,
  { padding, boundary }: UseTargetRectOptions = {}
): TargetGeometry {
  const pad = padding ?? 8;
  const measured = useMeasure<TargetGeometry>(() => {
    const elements = resolveTargets(target);
    const bounds = boundsOf(boundary);
    let rect = unionRect(elements, pad);
    if (rect) {
      rect = {
        left: Math.max(bounds.left, rect.left),
        top: Math.max(bounds.top, rect.top),
        right: Math.min(bounds.right, rect.right),
        bottom: Math.min(bounds.bottom, rect.bottom),
      };
    }
    if (rect && (rect.right <= rect.left || rect.bottom <= rect.top)) {
      rect = null;
    }
    const radius = rect ? radiusOf(elements) + pad : 0;
    return { rect, bounds, radius, ...viewport() };
  }, [targetKey(target), pad, targetKey(boundary)]);

  return (
    measured ?? {
      rect: null,
      bounds: boundsOf(boundary),
      radius: 0,
      ...viewport(),
    }
  );
}
