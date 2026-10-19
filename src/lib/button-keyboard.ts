import type { KeyboardEvent } from 'react';

/**
 * The two keys a native `<button>` answers to.
 *
 * `role="button"` grants the semantics and never the behaviour, so every
 * element that borrows the role has to answer these itself. Keeping the pair in
 * one place is what stops the list drifting per component.
 */
const BUTTON_KEYS = new Set<string>(['Enter', ' ']);

export const isButtonKey = (key: string) => BUTTON_KEYS.has(key);

/**
 * Builds the `onKeyDown` handler for an element carrying `role="button"`.
 *
 * `preventDefault` runs before the callback rather than inside it: Space
 * scrolls the page by default, and swallowing that is the point of the handler
 * whether or not there is anything to activate.
 */
export const onButtonKeyDown =
  <T extends HTMLElement>(onActivate?: () => void) =>
  (event: KeyboardEvent<T>) => {
    if (!isButtonKey(event.key)) return;

    event.preventDefault();
    onActivate?.();
  };
