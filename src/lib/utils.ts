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
 * Lucide's default stroke is 2. At the sizes this library actually renders a
 * glyph — 14 to 20px beside 12 to 16px text — that reads a step heavier than
 * the text it sits next to, and an icon that out-weights its own label is the
 * most common way a control starts looking like a toolbar.
 *
 * 1.75 is the reference kit's value: it calls it "one step lighter than prod's
 * 2" and uses it for every menu glyph. The menu row was the only place the
 * package had picked it up; this is the same value hoisted so the controls
 * agree.
 *
 * Written as a descendant selector so it reaches a glyph the consumer passes
 * in, which is the whole icon surface — a component never renders the icon
 * itself. Both forms are enumerated in `gen-classlist.mjs`; without that the
 * rule exists in Storybook and not in the bundle.
 */
export const glyphStroke = '[&_svg]:stroke-[1.75]';

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

/**
 * The elevation lift: what a surface does when the pointer is over something
 * that will respond to a click.
 *
 * Three things move together — the border tints toward brand, the shadow grows,
 * and the box rises — and they are one gesture, so they belong in one place.
 * `Card variant="elevated"` and `DataSourceCard` had them written out
 * separately, which is two chances to change the shadow in one of them.
 *
 * The distance is the one part that legitimately differs: the kit lifts a
 * catalog tile 1px and a larger card 2px, because the same travel reads bigger
 * on a smaller box. Everything else is fixed.
 *
 * The transition is scoped rather than `transition-all`: a card that animates
 * every property also animates its own content reflowing.
 */
export const liftOnHover = (distance: 1 | 2 = 1) =>
  cn(
    'transition-[box-shadow,border-color,transform] duration-base',
    distance === 1 ? 'hover:-translate-y-px' : 'hover:-translate-y-0.5',
    'hover:border-card-lift-border hover:shadow-lift-hover'
  );
