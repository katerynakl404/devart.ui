import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useGutterInset } from '../use-gutter-inset';

/**
 * jsdom lays nothing out, so a body's box and its computed padding are stubbed:
 * `offsetWidth - clientWidth` is the bar the platform draws.
 */
function body(offset: number, client: number, paddingLeft: string) {
  const el = document.createElement('div');
  Object.defineProperty(el, 'offsetWidth', { value: offset });
  Object.defineProperty(el, 'clientWidth', { value: client });
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    paddingLeft,
    borderLeftWidth: '0px',
    borderRightWidth: '0px',
  } as CSSStyleDeclaration);
  return { current: el };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useGutterInset (§176, §178)', () => {
  it('reserves the gutter whether or not the body overflows', () => {
    const { result } = renderHook(() => useGutterInset(body(300, 290, '16px')));
    expect(result.current.scrollbarGutter).toBe('stable');
  });

  it('pads the right by the left padding less the bar — a plain dialog, 16px and a 10px bar', () => {
    const { result } = renderHook(() => useGutterInset(body(300, 290, '16px')));
    expect(result.current.paddingInlineEnd).toBe('6px');
  });

  it('mirrors whatever left padding the body has — ConfirmationDialog’s 20px', () => {
    const { result } = renderHook(() => useGutterInset(body(300, 290, '20px')));
    expect(result.current.paddingInlineEnd).toBe('10px');
  });

  it('keeps the whole padding where the bar overlays the content (0 wide)', () => {
    const { result } = renderHook(() => useGutterInset(body(300, 300, '24px')));
    expect(result.current.paddingInlineEnd).toBe('24px');
  });

  it('never pads below zero', () => {
    const { result } = renderHook(() => useGutterInset(body(300, 289, '4px')));
    expect(result.current.paddingInlineEnd).toBe('0px');
  });
});
