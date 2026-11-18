import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { lastInteractionWasKeyboard, restoreFocus } from '../focus-modality';

describe('restoreFocus', () => {
  it('shows the ring only after the keyboard and keeps the given options', () => {
    const element = document.createElement('button');
    const focus = vi.spyOn(element, 'focus');

    fireEvent.keyDown(document.body, { key: 'Escape' });
    restoreFocus(element, { preventScroll: true });
    fireEvent.pointerDown(document.body);
    restoreFocus(element);

    expect(focus.mock.calls).toEqual([
      [{ preventScroll: true, focusVisible: true }],
      [{ focusVisible: false }],
    ]);
  });
});

describe('lastInteractionWasKeyboard', () => {
  it('is true after a keystroke', () => {
    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(lastInteractionWasKeyboard()).toBe(true);
  });

  it('is false after a pointer press', () => {
    fireEvent.keyDown(document.body, { key: 'Escape' });
    fireEvent.pointerDown(document.body);

    expect(lastInteractionWasKeyboard()).toBe(false);
  });

  it('ignores a modifier held for a click', () => {
    fireEvent.pointerDown(document.body);
    fireEvent.keyDown(document.body, { key: 'Shift' });

    expect(lastInteractionWasKeyboard()).toBe(false);
  });
});
