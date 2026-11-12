import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../index';

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

const renderTooltip = () =>
  render(
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>Save</TooltipTrigger>
        <TooltipContent>Save the draft</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

describe('TooltipTrigger', () => {
  it('opens on focus from the keyboard', () => {
    renderTooltip();
    fireEvent.keyDown(document.body, { key: 'Tab' });
    act(() => screen.getByRole('button', { name: 'Save' }).focus());

    expect(screen.getByRole('tooltip')).toHaveTextContent('Save the draft');
  });

  // A menu closed with the mouse hands focus back to its button
  it('stays shut on focus that follows a pointer press', () => {
    renderTooltip();
    fireEvent.pointerDown(document.body);
    act(() => screen.getByRole('button', { name: 'Save' }).focus());

    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
