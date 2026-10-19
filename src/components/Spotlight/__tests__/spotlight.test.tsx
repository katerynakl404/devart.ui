import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Spotlight } from '../index';

const BOUNDS = { left: 0, top: 0, right: 1000, bottom: 800 };
const RECT = { left: 100, top: 200, right: 300, bottom: 260 };

const veils = () =>
  Array.from(
    document.body.querySelectorAll<HTMLElement>('[data-slot="spotlight-veil"]')
  );
const frame = () =>
  document.body.querySelector<HTMLElement>('[data-slot="spotlight-frame"]');

describe('Spotlight', () => {
  it('portals into document.body', () => {
    const { container } = render(<Spotlight rect={RECT} bounds={BOUNDS} />);

    expect(container.querySelector('[data-slot="spotlight"]')).toBeNull();
    expect(
      document.body.querySelector('[data-slot="spotlight"]')
    ).toBeInTheDocument();
  });

  it('dims the whole bounds with one layer and no hole when nothing is lit', () => {
    render(<Spotlight rect={null} bounds={BOUNDS} />);

    expect(veils()).toHaveLength(1);
    expect(veils()[0]?.style.width).toBe('1000px');
    expect(veils()[0]?.style.height).toBe('800px');
    expect(veils()[0]?.style.clipPath).toBe('');
    expect(frame()).toBeNull();
  });

  it('cuts a rounded hole out of the one layer and frames it', () => {
    render(<Spotlight rect={RECT} bounds={BOUNDS} radius={10} />);

    expect(veils()).toHaveLength(1);
    const clip = veils()[0]?.style.clipPath ?? '';
    expect(clip).toMatch(/^path\(evenodd, "M0 0H1000V800H0Z/);
    // the hole starts 10px in from its corner and turns on 10px arcs
    expect(clip).toContain('M110 200H290A10 10 0 0 1 300 210');

    expect(frame()?.style.width).toBe('200px');
    expect(frame()?.style.height).toBe('60px');
    expect(frame()?.style.borderRadius).toBe('10px');
    expect(frame()).toHaveAttribute('aria-hidden', 'true');
  });

  it('caps the corner at half the shorter side', () => {
    render(<Spotlight rect={RECT} bounds={BOUNDS} radius={100} />);

    // 60px tall → a 30px corner at most
    expect(veils()[0]?.style.clipPath).toContain('M130 200H270A30 30');
  });

  it('defaults the corner to 12 when there is nothing to measure', () => {
    render(<Spotlight rect={RECT} bounds={BOUNDS} />);
    expect(frame()?.style.borderRadius).toBe('12px');
  });

  it('reports a click on the scrim', () => {
    const onScrimClick = vi.fn();
    render(
      <Spotlight rect={RECT} bounds={BOUNDS} onScrimClick={onScrimClick} />
    );

    fireEvent.click(veils()[0] as HTMLElement);
    expect(onScrimClick).toHaveBeenCalledOnce();
  });

  it('drops the pulse ring with pulse={false}', () => {
    const { rerender } = render(<Spotlight rect={RECT} bounds={BOUNDS} />);
    expect(frame()?.className).toContain('after:animate-spotlight-ring');

    rerender(<Spotlight rect={RECT} bounds={BOUNDS} pulse={false} />);
    expect(frame()?.className).not.toContain('after:animate-spotlight-ring');
  });

  it('puts the toasts one step under the scrim while it is in the page', () => {
    render(<Spotlight rect={RECT} bounds={BOUNDS} />);

    const root = document.body.querySelector('[data-slot="spotlight"]');
    expect(root?.className).toContain(
      '[:root:has(&)_[data-sonner-toaster]]:z-[calc(var(--spotlight-z)-1)]'
    );
  });

  it('lifts what pops out of a lit control one step over the scrim', () => {
    render(<Spotlight rect={RECT} bounds={BOUNDS} />);

    const root = document.body.querySelector('[data-slot="spotlight"]');
    expect(root?.className).toContain(
      '[:root:has(&)_[data-radix-popper-content-wrapper]]:!z-[calc(var(--spotlight-z)+1)]'
    );
  });

  it('fades out and lets clicks through while leaving', () => {
    render(<Spotlight rect={RECT} bounds={BOUNDS} leaving />);

    const root = document.body.querySelector('[data-slot="spotlight"]');
    expect(root).toHaveAttribute('data-state', 'leaving');
    expect(root?.className).toContain('animate-spotlight-out');
    expect(root?.className).toContain('[&_*]:!pointer-events-none');
  });
});
