import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '..';

// jsdom has no top layer, but floating-ui asks every positioned element about
// it, and nwsapi recurses on `:modal` for about a second per call.
const TOP_LAYER = new Set([':popover-open', ':modal', ':fullscreen']);
const nativeMatches = Element.prototype.matches;

// jsdom in this setup has no `PointerEvent`, so `fireEvent.pointerDown` falls
// back to a plain `Event` and drops `pointerType` — a stub that carries it is
// what lets a test tell a finger from a mouse.
class FakePointerEvent extends Event {
  pointerType: string;

  constructor(type: string, init: EventInit & { pointerType?: string } = {}) {
    super(type, init);
    this.pointerType = init.pointerType ?? '';
  }
}

beforeAll(() => {
  Element.prototype.matches = function (this: Element, selector: string) {
    if (TOP_LAYER.has(selector)) return false;

    return nativeMatches.call(this, selector);
  };
  vi.stubGlobal('PointerEvent', FakePointerEvent);
});

afterAll(() => {
  Element.prototype.matches = nativeMatches;
});

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const LONG_PRESS = 700;

const renderTooltip = (props?: {
  touchGestures?: 'auto' | 'off';
  onClick?: () => void;
}) =>
  render(
    <TooltipProvider delayDuration={0}>
      <Tooltip touchGestures={props?.touchGestures}>
        <TooltipTrigger asChild>
          <button onClick={props?.onClick} type="button">
            Open log
          </button>
        </TooltipTrigger>
        <TooltipContent>3 failures today</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

const trigger = () => screen.getByRole('button', { name: 'Open log' });

const press = (ms: number, pointerType = 'touch') => {
  fireEvent.pointerDown(trigger(), { pointerType });
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

describe('Tooltip on touch', () => {
  it('opens on a long press', () => {
    renderTooltip();
    press(LONG_PRESS);

    expect(screen.getByRole('tooltip')).toHaveTextContent('3 failures today');
  });

  it('does not open on a short tap', () => {
    renderTooltip();
    press(LONG_PRESS - 100);
    fireEvent.pointerUp(trigger(), { pointerType: 'touch' });

    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  /** The whole reason the gesture is a press and not a tap: the tap belongs to
   *  the trigger — a Badge that opens its log, a Button that runs its action. */
  it('leaves the tap to the trigger', () => {
    const onClick = vi.fn();
    renderTooltip({ onClick });
    press(50);
    fireEvent.pointerUp(trigger(), { pointerType: 'touch' });
    fireEvent.click(trigger());

    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('keeps the words a moment after the finger lifts, then closes', () => {
    renderTooltip();
    press(LONG_PRESS);
    fireEvent.pointerUp(trigger(), { pointerType: 'touch' });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('a mouse press never starts the gesture', () => {
    renderTooltip();
    press(LONG_PRESS, 'mouse');

    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('touchGestures="off" leaves touch alone', () => {
    renderTooltip({ touchGestures: 'off' });
    press(LONG_PRESS);

    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
