import { describe, expect, it } from 'vitest';
import { getMaskImage } from '../get-mask-image';

describe('getMaskImage', () => {
  it('draws nothing when the content does not overflow', () => {
    expect(getMaskImage('vertical', 40, false, false)).toBe('');
  });

  it('fades only the far edge while sitting at the start', () => {
    expect(getMaskImage('vertical', 40, false, true)).toBe(
      'linear-gradient(to bottom, black, black calc(100% - 40px), transparent)'
    );
  });

  it('fades only the near edge while sitting at the end', () => {
    expect(getMaskImage('vertical', 40, true, false)).toBe(
      'linear-gradient(to bottom, transparent, black 40px, black)'
    );
  });

  it('fades both edges in the middle', () => {
    expect(getMaskImage('vertical', 40, true, true)).toBe(
      'linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent)'
    );
  });

  it('runs the gradient along the scroll axis', () => {
    expect(getMaskImage('horizontal', 24, true, true)).toContain('to right');
    expect(getMaskImage('vertical', 24, true, true)).toContain('to bottom');
  });

  it('places the stops at the requested size', () => {
    expect(getMaskImage('horizontal', 12, true, true)).toContain('black 12px');
    expect(getMaskImage('horizontal', 12, true, true)).toContain(
      'calc(100% - 12px)'
    );
  });
});
