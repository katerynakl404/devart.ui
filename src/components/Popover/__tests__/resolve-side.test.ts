import { describe, expect, it } from 'vitest';
import type { PopoverSide } from '../context';
import { type ResolveSideInput, resolveSide } from '../resolve-side';

// Mirrors the app's UpgradePopover: `w-72` content (18rem) beside a 200px
// wide trigger, with 8px offset and 8px collision padding, so 304px is needed.
const CONTENT = { width: 288, height: 120 };
const OFFSET = 8;
const PADDING = 8;
const NEEDED = CONTENT.width + OFFSET + PADDING;

const triggerEndingAt = (right: number, top = 100) => ({
  top,
  right,
  bottom: top + 32,
  left: right - 200,
});

const resolve = (overrides: Partial<ResolveSideInput>) =>
  resolveSide({
    sides: ['right', 'left', 'bottom'],
    triggerRect: triggerEndingAt(600),
    contentSize: CONTENT,
    viewport: { width: 1280, height: 800 },
    sideOffset: OFFSET,
    collisionPadding: PADDING,
    ...overrides,
  });

describe('resolveSide', () => {
  it('keeps the preferred side when it fits', () => {
    expect(resolve({})).toBe('right');
  });

  it('falls back to the next side when the preferred one does not fit', () => {
    expect(resolve({ triggerRect: triggerEndingAt(1100) })).toBe('left');
  });

  it('gives up on the last side when nothing fits', () => {
    expect(
      resolve({
        viewport: { width: 375, height: 800 },
        triggerRect: triggerEndingAt(300),
      })
    ).toBe('bottom');
  });

  it.each<[number, number, PopoverSide]>([
    [1280, 600, 'right'],
    [1280, 1100, 'left'],
    [375, 300, 'bottom'],
  ])('a %ipx viewport and a trigger ending at %ipx resolve to %s, as the app expects', (viewportWidth, triggerRight, side) => {
    expect(
      resolve({
        viewport: { width: viewportWidth, height: 800 },
        triggerRect: triggerEndingAt(triggerRight),
      })
    ).toBe(side);
  });

  it('treats exactly enough room as a fit', () => {
    const viewport = { width: 1280, height: 800 };

    expect(
      resolve({ viewport, triggerRect: triggerEndingAt(1280 - NEEDED) })
    ).toBe('right');
    expect(
      resolve({ viewport, triggerRect: triggerEndingAt(1280 - NEEDED + 1) })
    ).toBe('left');
  });

  it('follows the order the caller gives, not a fixed one', () => {
    expect(resolve({ sides: ['left', 'right', 'bottom'] })).toBe('left');
  });

  it('measures vertical sides by height', () => {
    const viewport = { width: 1280, height: 400 };
    const sides: PopoverSide[] = ['bottom', 'top'];
    const needed = CONTENT.height + OFFSET + PADDING;

    expect(
      resolve({ sides, viewport, triggerRect: triggerEndingAt(600, 100) })
    ).toBe('bottom');
    expect(
      resolve({
        sides,
        viewport,
        triggerRect: triggerEndingAt(600, 400 - 32 - needed + 1),
      })
    ).toBe('top');
  });

  it('applies a numeric padding to every side', () => {
    const triggerRect = triggerEndingAt(1280 - CONTENT.width - OFFSET - 20);

    expect(resolve({ triggerRect, collisionPadding: 20 })).toBe('right');
    expect(resolve({ triggerRect, collisionPadding: 21 })).toBe('left');
  });

  it('reads a partial padding object per side, missing sides as zero', () => {
    const triggerRect = triggerEndingAt(1280 - CONTENT.width - OFFSET);

    expect(resolve({ triggerRect, collisionPadding: {} })).toBe('right');
    expect(resolve({ triggerRect, collisionPadding: { left: 500 } })).toBe(
      'right'
    );
    expect(resolve({ triggerRect, collisionPadding: { right: 1 } })).toBe(
      'left'
    );
  });

  it('returns a single side even when it does not fit', () => {
    expect(
      resolve({
        sides: ['right'],
        viewport: { width: 375, height: 800 },
        triggerRect: triggerEndingAt(300),
      })
    ).toBe('right');
  });

  it('rejects an empty side list', () => {
    expect(() => resolve({ sides: [] })).toThrow('`sides` is empty');
  });
});
