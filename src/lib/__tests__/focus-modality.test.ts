import { fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { lastInteractionWasKeyboard } from '../focus-modality';

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
