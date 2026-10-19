import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Coachmark } from '../index';
import { placeCoachmark } from '../place';

const B = { left: 0, top: 0, right: 1000, bottom: 800 };

const setWidth = (px: number) =>
  Object.defineProperty(window, 'innerWidth', {
    value: px,
    configurable: true,
    writable: true,
  });

afterEach(() => setWidth(1024));

describe('placeCoachmark', () => {
  it('takes the first preferred side where the card fits whole', () => {
    const r = { left: 400, top: 100, right: 600, bottom: 140 };
    const pos = placeCoachmark(r, B, 300, 200, ['bottom', 'top']);

    expect(pos).toMatchObject({ side: 'bottom', x: 350, y: 154 });
    // the arrow points at the target's centre, 6px for half its own width
    expect(pos.arrow).toEqual({ left: 144 });
  });

  it('skips a side the card would hang off', () => {
    const r = { left: 400, top: 650, right: 600, bottom: 700 };
    const pos = placeCoachmark(r, B, 300, 200, ['bottom', 'top']);

    expect(pos).toMatchObject({ side: 'top', y: 650 - 14 - 200 });
  });

  it('keeps the card inside the bounds horizontally', () => {
    const r = { left: 0, top: 100, right: 40, bottom: 140 };
    const pos = placeCoachmark(r, B, 300, 200, ['bottom']);

    expect(pos.x).toBe(8);
    expect(pos.arrow).toEqual({ left: 16 });
  });

  it('pins to the roomiest acceptable side when no side fits whole', () => {
    const r = { left: 100, top: 100, right: 900, bottom: 700 };
    const pos = placeCoachmark(r, B, 300, 200, ['bottom', 'top', 'right']);

    // no side fits, and none has 75% of the card free; every side has 100px,
    // so the tie goes to the first (top), pinned to that edge of the bounds
    expect(pos.side).toBe('top');
    expect(pos.y).toBe(8);
  });
});

describe('Coachmark', () => {
  it('is a non-modal dialog named by its title, portalled to the body', () => {
    render(
      <Coachmark
        rect={{ left: 100, top: 100, right: 200, bottom: 140 }}
        title="Start here"
        icon={<svg />}
        footer={<button type="button">Next</button>}
      >
        <p>Body</p>
      </Coachmark>
    );

    const card = screen.getByRole('dialog', { name: 'Start here' });
    expect(card).toHaveAttribute('aria-modal', 'false');
    expect(card).toHaveAttribute('tabindex', '-1');
    expect(card.parentElement).toBe(document.body);
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('places itself beside the target and reports where', () => {
    const onPlace = vi.fn();
    render(
      <Coachmark
        rect={{ left: 100, top: 100, right: 200, bottom: 140 }}
        title="Placed"
        onPlace={onPlace}
      />
    );

    const card = screen.getByRole('dialog');
    expect(card).toHaveAttribute('data-side', 'bottom');
    expect(card.style.top).toBe('154px');
    expect(
      card.querySelector('[data-slot="coachmark-arrow"]')
    ).toBeInTheDocument();
    expect(onPlace).toHaveBeenLastCalledWith({
      top: 154,
      bottom: 154,
      side: 'bottom',
    });
  });

  it('honours the preferred side', () => {
    render(
      <Coachmark
        rect={{ left: 400, top: 300, right: 500, bottom: 340 }}
        side="right"
        title="Right"
      />
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'right');
  });

  it('is a bottom sheet with no arrow at 640px and below', () => {
    setWidth(640);
    const onPlace = vi.fn();
    render(
      <Coachmark
        rect={{ left: 100, top: 100, right: 200, bottom: 140 }}
        title="Sheet"
        onPlace={onPlace}
      />
    );

    const card = screen.getByRole('dialog');
    expect(card).toHaveAttribute('data-side', 'none');
    expect(card.querySelector('[data-slot="coachmark-arrow"]')).toBeNull();
    expect(onPlace).toHaveBeenLastCalledWith(null);
  });

  it('hands its card to a ref', () => {
    let node: HTMLDivElement | null = null;
    render(
      <Coachmark
        ref={(el) => {
          node = el;
        }}
        rect={null}
        title="Ref"
      />
    );

    expect(node).toBe(screen.getByRole('dialog'));
  });
});
