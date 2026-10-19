import { BREAKPOINTS } from '../../lib/breakpoints';

/**
 * Shared geometry of the tour family — `Spotlight`, `Coachmark`,
 * `AnnotationGroup` and `Tour` all measure the same way.
 *
 * A target is a selector, an element, a ref (`{ current }`) or an array of
 * them; the rect is the union of every visible match. `boundary` (selector,
 * element or ref) is the area a tour may use — a page's review strip above it
 * stays uncovered. Without one the area is the viewport.
 */
export type TourTarget =
  | string
  | Element
  | { current: Element | null }
  | null
  | undefined
  | readonly TourTarget[];

/** Viewport coordinates, already padded where a padding applies. */
export interface TargetRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * ≤ 640px the coachmark is a bottom sheet and annotations fold into it. One
 * pixel wider than Tailwind's `max-sm:` on purpose: the CSS says
 * `max-width: 640px`, and this has to agree with it.
 */
export const PHONE_MAX_WIDTH = BREAKPOINTS.sm;

export const isPhoneViewport = () =>
  typeof window !== 'undefined' && window.innerWidth <= PHONE_MAX_WIDTH;

/** Every element a target names, in order. */
export function resolveTargets(target: TourTarget): Element[] {
  if (!target) return [];
  if (Array.isArray(target)) {
    return (target as readonly TourTarget[]).flatMap(resolveTargets);
  }
  if (typeof target === 'string') {
    return Array.from(document.querySelectorAll(target));
  }
  if ('current' in target) return target.current ? [target.current] : [];
  return typeof (target as Element).getBoundingClientRect === 'function'
    ? [target as Element]
    : [];
}

/**
 * The union of the elements' boxes, grown by `padding`. Elements with no box
 * (display: none, detached) are ignored; none left → `null`.
 */
export function unionRect(elements: Element[], padding = 0): TargetRect | null {
  const rects = elements
    .map((element) => element.getBoundingClientRect())
    .filter((r) => r.width > 0 || r.height > 0);
  if (!rects.length) return null;
  return {
    left: Math.round(Math.min(...rects.map((r) => r.left)) - padding),
    top: Math.round(Math.min(...rects.map((r) => r.top)) - padding),
    right: Math.round(Math.max(...rects.map((r) => r.right)) + padding),
    bottom: Math.round(Math.max(...rects.map((r) => r.bottom)) + padding),
  };
}

/**
 * The corner radius of the targets — the largest of them. A part with square
 * corners (a table row) takes the radius of the nearest rounded box around it,
 * up to four levels up. A frame drawn `p` px outside the targets stays
 * concentric with them at this radius + `p`.
 */
export function radiusOf(elements: Element[]): number {
  let best = 0;
  for (const element of elements) {
    let node: Element | null = element;
    for (let level = 0; node && level < 4; level++) {
      const r =
        Number.parseFloat(getComputedStyle(node).borderTopLeftRadius) || 0;
      if (r) {
        best = Math.max(best, r);
        break;
      }
      node = node.parentElement;
    }
  }
  return best;
}

/** The boundary's box clipped to the viewport; no boundary → the viewport. */
export function boundsOf(boundary?: TourTarget): TargetRect {
  if (typeof window === 'undefined') {
    return { left: 0, top: 0, right: 0, bottom: 0 };
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const element = boundary ? resolveTargets(boundary)[0] : null;
  const r = element ? element.getBoundingClientRect() : null;
  return {
    left: Math.max(0, r ? Math.round(r.left) : 0),
    top: Math.max(0, r ? Math.round(r.top) : 0),
    right: Math.min(vw, r ? Math.round(r.right) : vw),
    bottom: Math.min(vh, r ? Math.round(r.bottom) : vh),
  };
}

/**
 * A stable dependency key for a target. Selectors key by their text; elements
 * and refs all key as `el`, so an inline array of refs does not re-subscribe
 * on every render — the measurement still follows them on the next resize,
 * scroll or DOM change.
 */
export function targetKey(target: TourTarget): string {
  if (!target) return '';
  if (Array.isArray(target)) {
    return (target as readonly TourTarget[]).map(targetKey).join('|');
  }
  return typeof target === 'string' ? target : 'el';
}
