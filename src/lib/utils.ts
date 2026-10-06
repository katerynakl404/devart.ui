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
 * The page’s FLOOR — the air under the last thing on a scrolling page, so
 * nothing ever finishes flush against the bottom of the window.
 *
 * Apply it to the element that GROWS with the content. Not to the scroller,
 * and not to a `min-h-0 flex-1` box: those are sized to the scrollport, so
 * their padding is drawn at the bottom of the WINDOW and the content scrolls
 * straight past it. The padding looks present in the markup and does nothing,
 * which is how this gets "fixed" twice.
 *
 * Padding on the scroll container is the other wrong answer: it moves the
 * sticky constraint rectangle with it, and a `sticky bottom-0` commit bar then
 * stops short of the window edge with the form scrolling visibly underneath.
 * A bar like that owns its own inset instead.
 *
 * 32px: one step above the 24px page gutter, because the end of a page is the
 * one edge a reader can mistake for "there is nothing more".
 */
export const pageFloor = 'pb-8';
/**
 * One weight for every ordinary UI glyph — a button icon, an icon button, a
 * field addon, a menu row: 2, Lucide's own default and the kit's
 * `--icon-stroke`. Production draws every glyph at 2 in a 24 viewBox, at 16px
 * and at 14px alike; the box does the scaling, not the stroke.
 *
 * 1.75 was the value here until 2026-10-06. The kit tried it the same day and
 * reverted it: it made the identical glyph 12% lighter than in prod.
 *
 * The rule is still worth stating although it equals the default. A CSS
 * `stroke-width` beats the attribute on the `<svg>`, so a glyph passed in with
 * its own `strokeWidth`, or from a set whose default is not 2, comes out at the
 * same weight as its neighbours.
 *
 * `Alert` takes it too, at both sizes: its 16px glyph used to draw at 1.5,
 * which made it the one 16px glyph lighter than its neighbours. The one place
 * that keeps a weight of its own is `Checkbox` (a 12px tick at 3). Below ~16px
 * a stroke has to stay heavy enough to survive rasterisation, so a smaller mark
 * takes its component's weight, not a ratio.
 *
 * Written as a descendant selector so it reaches a glyph the consumer passes
 * in, which is the whole icon surface — a component never renders the icon
 * itself. It is enumerated in `gen-classlist.mjs`; without that the rule exists
 * in Storybook and not in the bundle.
 */
export const glyphStroke = '[&_svg]:stroke-2';

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
