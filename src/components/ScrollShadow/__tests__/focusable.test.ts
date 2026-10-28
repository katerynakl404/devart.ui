import { describe, expect, it } from 'vitest';
import {
  hasFocusableDescendant,
  hasOverflow,
  shouldBeTabStop,
} from '../focusable';

function element(html: string): HTMLElement {
  const root = document.createElement('div');
  root.innerHTML = html;
  return root;
}

function withBox(
  node: HTMLElement,
  box: { scroll: number; client: number },
  orientation: 'vertical' | 'horizontal' = 'vertical'
): HTMLElement {
  if (orientation === 'vertical') {
    Object.defineProperty(node, 'scrollHeight', {
      configurable: true,
      value: box.scroll,
    });
    Object.defineProperty(node, 'clientHeight', {
      configurable: true,
      value: box.client,
    });
  } else {
    Object.defineProperty(node, 'scrollWidth', {
      configurable: true,
      value: box.scroll,
    });
    Object.defineProperty(node, 'clientWidth', {
      configurable: true,
      value: box.client,
    });
  }
  return node;
}

describe('hasFocusableDescendant', () => {
  it('is false for plain text', () => {
    expect(hasFocusableDescendant(element('<p>Hello</p>'))).toBe(false);
  });

  it('finds a button, link, and tabindex child', () => {
    expect(hasFocusableDescendant(element('<button>Go</button>'))).toBe(true);
    expect(hasFocusableDescendant(element('<a href="/x">Go</a>'))).toBe(true);
    expect(hasFocusableDescendant(element('<div tabindex="0">Go</div>'))).toBe(
      true
    );
  });

  it('ignores disabled controls and tabindex="-1"', () => {
    expect(
      hasFocusableDescendant(element('<button disabled>Go</button>'))
    ).toBe(false);
    expect(hasFocusableDescendant(element('<div tabindex="-1">Go</div>'))).toBe(
      false
    );
  });
});

describe('hasOverflow / shouldBeTabStop', () => {
  it('needs both overflow and no focusable child', () => {
    const text = withBox(element('<p>Hello</p>'), { scroll: 200, client: 80 });
    expect(hasOverflow(text, 'vertical')).toBe(true);
    expect(shouldBeTabStop(text, 'vertical')).toBe(true);

    const short = withBox(element('<p>Hello</p>'), { scroll: 80, client: 80 });
    expect(shouldBeTabStop(short, 'vertical')).toBe(false);

    const withButton = withBox(element('<button>Go</button>'), {
      scroll: 200,
      client: 80,
    });
    expect(shouldBeTabStop(withButton, 'vertical')).toBe(false);
  });

  it('checks the horizontal axis when asked', () => {
    const wide = withBox(
      element('<p>Hello</p>'),
      { scroll: 300, client: 100 },
      'horizontal'
    );
    expect(hasOverflow(wide, 'horizontal')).toBe(true);
    expect(shouldBeTabStop(wide, 'horizontal')).toBe(true);
  });
});
