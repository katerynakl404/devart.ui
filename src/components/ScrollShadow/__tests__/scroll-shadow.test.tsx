import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollShadow } from '../index';

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      callback: ResizeObserverCallback;

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }

      observe() {
        this.callback([], this as unknown as ResizeObserver);
      }

      unobserve() {}

      disconnect() {}
    }
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubOverflowBox(scroll: number, client: number) {
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get() {
      return scroll;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get() {
      return client;
    },
  });
}

describe('ScrollShadow focusable', () => {
  it('never takes a Tab stop when focusable={false}', () => {
    const { container } = render(
      <ScrollShadow focusable={false} className="h-24">
        <p>Only text, even if it overflowed</p>
      </ScrollShadow>
    );

    const region = container.firstElementChild as HTMLElement;
    expect(region).not.toHaveAttribute('tabindex');
    expect(region).not.toHaveAttribute('role');
  });

  it('is always a named region when focusable={true}', () => {
    render(
      <ScrollShadow focusable aria-label="Details">
        <button type="button">Inside</button>
      </ScrollShadow>
    );

    const region = screen.getByRole('region', { name: 'Details' });
    expect(region).toHaveAttribute('tabindex', '0');
  });

  it('auto: skips the Tab stop when a focusable descendant is present', async () => {
    stubOverflowBox(400, 100);

    let root: HTMLElement | undefined;
    await act(async () => {
      const result = render(
        <ScrollShadow className="h-24">
          <button type="button">Chip</button>
        </ScrollShadow>
      );
      root = result.container;
    });

    const region = root?.firstElementChild as HTMLElement;
    expect(region).not.toHaveAttribute('tabindex');
  });

  it('auto: becomes a named region for overflowing text-only content', async () => {
    stubOverflowBox(400, 100);

    await act(async () => {
      render(
        <ScrollShadow className="h-24">
          <p>Long copy that overflows</p>
        </ScrollShadow>
      );
    });

    const region = screen.getByRole('region', { name: 'Scrollable content' });
    expect(region).toHaveAttribute('tabindex', '0');
  });
});
