/**
 * Returns focus to an element (e.g. a trigger after its popup closes) with the
 * focus ring only when the user was on the keyboard.
 *
 * A plain `focus()` leaves the ring to the browser's `:focus-visible`
 * heuristics, which often show it after a mouse pick (Chrome: any key since
 * the last click; Safari on macOS). Radix tracks the same thing internally but
 * does not export it.
 */

type Interaction = 'keyboard' | 'pointer';

// Held for Shift/Ctrl+click — not keyboard navigation.
const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta']);

let lastInteraction: Interaction = 'pointer';

function trackLastInteraction() {
  if (typeof document === 'undefined') return;

  document.addEventListener(
    'pointerdown',
    () => {
      lastInteraction = 'pointer';
    },
    true
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (!MODIFIER_KEYS.has(event.key)) lastInteraction = 'keyboard';
    },
    true
  );
}

trackLastInteraction();

export const lastInteractionWasKeyboard = () => lastInteraction === 'keyboard';

// `focusVisible` is missing from TypeScript's DOM lib (Chrome 145+,
// Firefox 104+, Safari 18.4+); older browsers ignore it.
type FocusOptionsWithVisible = FocusOptions & { focusVisible?: boolean };

export function restoreFocus(element: HTMLElement, options?: FocusOptions) {
  const focusOptions: FocusOptionsWithVisible = {
    ...options,
    focusVisible: lastInteractionWasKeyboard(),
  };
  element.focus(focusOptions);
}
