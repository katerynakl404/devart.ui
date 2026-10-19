import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  boundsOf,
  isPhoneViewport,
  radiusOf,
  resolveTargets,
  targetKey,
  unionRect,
  useTargetRect,
} from '../index';

const box = (left: number, top: number, width: number, height: number) =>
  ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  }) as DOMRect;

const setWidth = (px: number) =>
  Object.defineProperty(window, 'innerWidth', {
    value: px,
    configurable: true,
    writable: true,
  });

const place = (el: Element, rect: DOMRect) => {
  el.getBoundingClientRect = () => rect;
  return el;
};

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
  setWidth(1024);
});

describe('resolveTargets', () => {
  it('reads selectors, elements, refs and arrays of them', () => {
    document.body.innerHTML =
      '<button class="a"></button><button class="a"></button><i id="b"></i>';
    const b = document.getElementById('b') as Element;

    expect(resolveTargets('.a')).toHaveLength(2);
    expect(resolveTargets(b)).toEqual([b]);
    expect(resolveTargets({ current: b })).toEqual([b]);
    expect(resolveTargets({ current: null })).toEqual([]);
    expect(resolveTargets(['.a', { current: b }, null])).toHaveLength(3);
    expect(resolveTargets(undefined)).toEqual([]);
  });
});

describe('unionRect', () => {
  it('is the padded union of the visible boxes', () => {
    const a = place(document.createElement('div'), box(10, 20, 30, 10));
    const b = place(document.createElement('div'), box(50, 5, 10, 10));
    const hidden = place(document.createElement('div'), box(0, 0, 0, 0));

    expect(unionRect([a, b, hidden], 4)).toEqual({
      left: 6,
      top: 1,
      right: 64,
      bottom: 34,
    });
  });

  it('is null when nothing has a box', () => {
    const hidden = place(document.createElement('div'), box(0, 0, 0, 0));
    expect(unionRect([hidden])).toBeNull();
  });
});

describe('radiusOf', () => {
  it("takes the target's own corner, else the nearest rounded ancestor's", () => {
    document.body.innerHTML =
      '<div id="card" style="border-top-left-radius: 8px"><table><tbody><tr id="row"><td>x</td></tr></tbody></table></div><button id="pill" style="border-top-left-radius: 6px"></button>';
    const row = document.getElementById('row') as Element;
    const pill = document.getElementById('pill') as Element;

    // tr → tbody → table → div: the card's corner, four levels up
    expect(radiusOf([row])).toBe(8);
    expect(radiusOf([pill])).toBe(6);
    expect(radiusOf([row, pill])).toBe(8);
    expect(radiusOf([document.body])).toBe(0);
  });
});

describe('boundsOf', () => {
  it('is the viewport without a boundary, and the clipped boundary with one', () => {
    expect(boundsOf()).toEqual({
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
    });

    const shell = place(document.createElement('div'), box(-10, 48, 5000, 300));
    expect(boundsOf(shell)).toEqual({
      left: 0,
      top: 48,
      right: window.innerWidth,
      bottom: 348,
    });
  });
});

describe('targetKey', () => {
  it('keys selectors by text and elements as "el"', () => {
    expect(targetKey(['.a', document.body, null])).toBe('.a|el|');
  });
});

describe('isPhoneViewport', () => {
  it('is true at 640px and below', () => {
    setWidth(640);
    expect(isPhoneViewport()).toBe(true);
    setWidth(641);
    expect(isPhoneViewport()).toBe(false);
  });
});

function Probe({ padding }: { padding?: number }) {
  const { rect } = useTargetRect('#target', { padding });
  return <output>{rect ? JSON.stringify(rect) : 'none'}</output>;
}

describe('useTargetRect', () => {
  it('measures the target with the default 8px padding', async () => {
    const target = document.createElement('div');
    target.id = 'target';
    place(target, box(100, 100, 50, 20));
    document.body.appendChild(target);

    render(<Probe />);

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        JSON.stringify({ left: 92, top: 92, right: 158, bottom: 128 })
      )
    );
  });

  it('is null when the target is missing', () => {
    render(<Probe padding={0} />);
    expect(screen.getByRole('status')).toHaveTextContent('none');
  });
});
