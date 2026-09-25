'use client';

/**
 * Was the last interaction a keystroke, or a pointer?
 *
 * Radix returns focus to the trigger when an overlay closes, and it does so
 * programmatically — which Chrome treats as keyboard-ish and answers with the
 * `:focus-visible` ring. So a menu opened and closed with the mouse leaves a
 * focus ring painted on its trigger, on a row nobody is navigating with the
 * keyboard, and it stays there until the next click elsewhere.
 *
 * One listener pair on the document, capture phase, answers the only question
 * an overlay needs: should closing put focus back where it came from? For a
 * keyboard user, yes — losing your place is worse than a ring. For a pointer
 * user, no: they can see where they are, and the ring is a lie about how the
 * surface was reached.
 *
 * Deliberately not `:focus-visible` guesswork in CSS. The browser's own
 * heuristic is what is wrong here, and a stylesheet cannot tell the two cases
 * apart after the fact.
 */
let keyboard = false;

if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', () => {
    keyboard = false;
  }, true);
  document.addEventListener('keydown', (event) => {
    /* Modifier-only presses are not navigation: holding Shift before a click
       must not turn that click into a keyboard interaction. */
    if (event.key === 'Shift' || event.key === 'Control' || event.key === 'Alt' || event.key === 'Meta') {
      return;
    }
    keyboard = true;
  }, true);
}

/** True when the last input this document saw was a keystroke. */
export function lastInteractionWasKeyboard() {
  return keyboard;
}

/**
 * Default `onCloseAutoFocus` for an overlay: keep Radix's focus restore for the
 * keyboard, skip it for the pointer. Pass the consumer's own handler through
 * first — if it calls `preventDefault`, that decision stands.
 */
export function restoreFocusOnlyForKeyboard(
  event: Event,
  handler?: (event: Event) => void
) {
  handler?.(event);
  if (event.defaultPrevented) return;
  if (!lastInteractionWasKeyboard()) event.preventDefault();
}
