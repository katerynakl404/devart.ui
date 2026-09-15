import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['xxs'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * The system's focus indicator: a 2px ring held off the control by a 2px gap
 * in the surface colour. Required by WCAG 2.4.7 Focus Visible (AA).
 *
 * One recipe for the whole kit — apply it to any control that can take focus
 * and does not already render a `Button` underneath. Components that do render
 * a `Button` inherit it and must not declare it again.
 */
export const focusRing = cn(
  'focus-visible:outline-none',
  'focus-visible:ring-2 focus-visible:ring-offset-2',
  'focus-visible:ring-offset-surface-card',
  'focus-visible:ring-focus-ring-brand'
);

/**
 * Focus indicator for FORM controls — checkbox, radio, switch and friends.
 *
 * Identical geometry to {@link focusRing}, but a neutral ring: brand colour
 * never visualises form-control focus in this system. Actionable controls
 * (buttons, triggers, links) use {@link focusRing} instead.
 */
export const formFocusRing = cn(
  'focus-visible:outline-none',
  'focus-visible:ring-2 focus-visible:ring-offset-2',
  'focus-visible:ring-offset-surface-card',
  'focus-visible:ring-state-focus-ring'
);
