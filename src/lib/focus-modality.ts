let keyboard = false;

if (typeof document !== 'undefined') {
  document.addEventListener(
    'pointerdown',
    () => {
      keyboard = false;
    },
    true
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return;
      keyboard = true;
    },
    true
  );
}

export const lastInteractionWasKeyboard = () => keyboard;
