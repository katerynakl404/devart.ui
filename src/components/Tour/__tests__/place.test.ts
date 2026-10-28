import { describe, expect, it } from 'vitest';
import { placeGuideCard } from '../place';

const B = { left: 0, top: 0, right: 1000, bottom: 800 };

describe('placeGuideCard', () => {
  it('takes the first preferred side where the card fits whole', () => {
    const r = { left: 400, top: 100, right: 600, bottom: 140 };
    const pos = placeGuideCard(r, B, 300, 200, ['bottom', 'top']);

    expect(pos).toMatchObject({ side: 'bottom', x: 350, y: 154 });
    // the arrow's centre sits on the target's centre
    expect(pos.arrowOffset).toBe(150);
  });

  it('skips a side the card would hang off', () => {
    const r = { left: 400, top: 650, right: 600, bottom: 700 };
    const pos = placeGuideCard(r, B, 300, 200, ['bottom', 'top']);

    expect(pos).toMatchObject({ side: 'top', y: 650 - 14 - 200 });
  });

  it('keeps the card inside the bounds horizontally', () => {
    const r = { left: 0, top: 100, right: 40, bottom: 140 };
    const pos = placeGuideCard(r, B, 300, 200, ['bottom']);

    expect(pos.x).toBe(8);
    // 16px clear of the corner, plus half the 12px arrow
    expect(pos.arrowOffset).toBe(22);
  });

  it('measures the arrow from the top on a left or right side', () => {
    const r = { left: 100, top: 300, right: 200, bottom: 340 };
    const pos = placeGuideCard(r, B, 300, 200, ['right']);

    expect(pos).toMatchObject({ side: 'right', x: 214, y: 220 });
    expect(pos.arrowOffset).toBe(100);
  });

  it('pins to the roomiest acceptable side when no side fits whole', () => {
    const r = { left: 100, top: 100, right: 900, bottom: 700 };
    const pos = placeGuideCard(r, B, 300, 200, ['bottom', 'top', 'right']);

    // no side fits, and none has 75% of the card free; every side has 100px,
    // so the tie goes to the first (top), pinned to that edge of the bounds
    expect(pos.side).toBe('top');
    expect(pos.y).toBe(8);
  });
});
