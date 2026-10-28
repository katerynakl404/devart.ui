import type { ScrollShadowOrientation } from '../../hooks/use-scroll-shadow/types';

/**
 * Matches elements that already take a Tab stop. The scroll container must not
 * add another one on top of these.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** True when the element scrolls along `orientation` (1px tolerance for subpixels). */
export function hasOverflow(
  element: HTMLElement,
  orientation: ScrollShadowOrientation
): boolean {
  if (orientation === 'vertical') {
    return element.scrollHeight > element.clientHeight + 1;
  }

  return element.scrollWidth > element.clientWidth + 1;
}

/** True when a descendant (not the root) is already a Tab stop. */
export function hasFocusableDescendant(root: HTMLElement): boolean {
  return root.querySelector(FOCUSABLE_SELECTOR) != null;
}

/**
 * Keyboard scroll needs a Tab stop only when the region overflows and nothing
 * inside can already receive focus.
 */
export function shouldBeTabStop(
  element: HTMLElement,
  orientation: ScrollShadowOrientation
): boolean {
  return hasOverflow(element, orientation) && !hasFocusableDescendant(element);
}
