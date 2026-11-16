import { fireEvent, render, screen } from '@testing-library/react';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { TooltipProvider } from '../../Tooltip';
import { IconHint } from '../index';

// jsdom has no top layer, but floating-ui asks every positioned element about
// it, and nwsapi recurses on `:modal` for about a second per call.
const TOP_LAYER = new Set([':popover-open', ':modal', ':fullscreen']);
const nativeMatches = Element.prototype.matches;

beforeAll(() => {
  Element.prototype.matches = function (this: Element, selector: string) {
    if (TOP_LAYER.has(selector)) return false;
    return nativeMatches.call(this, selector);
  };
});

afterAll(() => {
  Element.prototype.matches = nativeMatches;
});

// jsdom has no `ResizeObserver`; Popper measures the content and the arrow with one.
beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

// jsdom in this setup has no `PointerEvent` at all, so `fireEvent.pointerDown`
// falls back to a plain `Event` and silently drops `pointerType` — a stub
// that actually carries it is what lets a test tell a tap from a click.
class FakePointerEvent extends Event {
  pointerType: string;
  constructor(type: string, init: EventInit & { pointerType?: string } = {}) {
    super(type, init);
    this.pointerType = init.pointerType ?? '';
  }
}
beforeAll(() => {
  vi.stubGlobal('PointerEvent', FakePointerEvent);
});

const renderHint = () =>
  render(
    <TooltipProvider delayDuration={0}>
      <IconHint
        tooltip="About Finance warehouse"
        label="About Finance warehouse"
      />
    </TooltipProvider>
  );

const tap = (hint: HTMLElement) => {
  fireEvent.pointerDown(hint, { pointerType: 'touch' });
  fireEvent.click(hint);
};

describe('IconHint on touch', () => {
  it('opens on the first tap', () => {
    renderHint();
    tap(screen.getByRole('img', { name: 'About Finance warehouse' }));

    expect(screen.getByRole('tooltip')).toHaveTextContent(
      'About Finance warehouse'
    );
  });

  it('closes on the second tap, not a reopen', () => {
    renderHint();
    const hint = screen.getByRole('img', { name: 'About Finance warehouse' });
    tap(hint);
    tap(hint);

    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('a mouse click does not open it — hover and focus still own the mouse', () => {
    renderHint();
    const hint = screen.getByRole('img', { name: 'About Finance warehouse' });
    fireEvent.pointerDown(hint, { pointerType: 'mouse' });
    fireEvent.click(hint);

    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
