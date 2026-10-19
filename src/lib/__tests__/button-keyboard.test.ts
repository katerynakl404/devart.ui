import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { isButtonKey, onButtonKeyDown } from '../button-keyboard';

const keyEvent = (key: string) =>
  ({
    key,
    preventDefault: vi.fn(),
  }) as unknown as KeyboardEvent<HTMLElement> & {
    preventDefault: ReturnType<typeof vi.fn>;
  };

describe('isButtonKey', () => {
  it.each(['Enter', ' '])('accepts %j', (key) => {
    expect(isButtonKey(key)).toBe(true);
  });

  it.each([
    'Escape',
    'Tab',
    'ArrowDown',
    'Spacebar',
    'a',
  ])('rejects %j', (key) => {
    expect(isButtonKey(key)).toBe(false);
  });
});

describe('onButtonKeyDown', () => {
  it.each(['Enter', ' '])('activates on %j', (key) => {
    const onActivate = vi.fn();
    const event = keyEvent(key);

    onButtonKeyDown(onActivate)(event);

    expect(onActivate).toHaveBeenCalledOnce();
  });

  it('leaves other keys to the browser', () => {
    const onActivate = vi.fn();
    const event = keyEvent('Escape');

    onButtonKeyDown(onActivate)(event);

    expect(onActivate).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  /** Space scrolls the page by default; swallowing that is the point. */
  it('prevents the default on Space even with nothing to activate', () => {
    const event = keyEvent(' ');

    onButtonKeyDown()(event);

    expect(event.preventDefault).toHaveBeenCalledOnce();
  });
});
