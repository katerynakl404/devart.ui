import { act, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GuideCard } from '../index';

const findSlot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`);

describe('GuideCard', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders header, title, body and footer in order', () => {
    const { container } = render(
      <GuideCard
        header="Step 4 of 5"
        icon={<svg />}
        title="Metrics"
        footer={<button type="button">Next</button>}
      >
        <p>Body</p>
      </GuideCard>
    );

    const slots = Array.from(
      container.querySelectorAll('[data-slot^="guide-card-"]')
    ).map((element) => element.getAttribute('data-slot'));

    expect(slots).toEqual([
      'guide-card-header',
      'guide-card-title-row',
      'guide-card-icon',
      'guide-card-title',
      'guide-card-body',
      'guide-card-footer',
    ]);
  });

  it('renders no wrapper for an empty slot', () => {
    const { container } = render(<GuideCard title="Metrics" />);

    expect(findSlot(container, 'guide-card-header')).toBeNull();
    expect(findSlot(container, 'guide-card-body')).toBeNull();
    expect(findSlot(container, 'guide-card-footer')).toBeNull();
    expect(findSlot(container, 'guide-card-icon')).toBeNull();
  });

  it('shows the icon only together with a title', () => {
    const { container } = render(<GuideCard icon={<svg />}>Body</GuideCard>);

    expect(findSlot(container, 'guide-card-icon')).toBeNull();
  });

  it('puts titleId on the h3 and descriptionId on the body', () => {
    render(
      <GuideCard title="Metrics" titleId="step-title" descriptionId="step-body">
        Body
      </GuideCard>
    );

    expect(screen.getByRole('heading', { level: 3 })).toHaveAttribute(
      'id',
      'step-title'
    );
    expect(screen.getByText('Body')).toHaveAttribute('id', 'step-body');
  });

  it('leaves the dialog role to the engine that renders it', () => {
    const { container } = render(<GuideCard title="Metrics" />);

    expect(findSlot(container, 'guide-card')).not.toHaveAttribute('role');
  });

  it('merges a consumer className over the width', () => {
    const { container } = render(
      <GuideCard title="Metrics" width="lg" className="w-full" />
    );
    const card = findSlot(container, 'guide-card');

    expect(card).toHaveClass('w-full');
    expect(card).not.toHaveClass('w-[29rem]');
  });

  it('forwards ref and div props to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<GuideCard ref={ref} title="Metrics" data-testid="card" />);

    expect(ref.current).toBe(screen.getByTestId('card'));
  });

  it('draws no arrow without a side', () => {
    const { container } = render(<GuideCard title="Metrics" />);

    expect(findSlot(container, 'guide-card-arrow')).toBeNull();
  });

  it('points the arrow back at the target from the given side', () => {
    const { container } = render(<GuideCard title="Metrics" side="right" />);

    expect(findSlot(container, 'guide-card')).toHaveAttribute(
      'data-side',
      'right'
    );
    expect(findSlot(container, 'guide-card-arrow')).toHaveClass(
      '-left-px',
      'top-1/2'
    );
  });

  it('centres the arrow on its edge until an arrowOffset is given', () => {
    const { container, rerender } = render(
      <GuideCard title="Metrics" side="bottom" />
    );
    const getArrow = () =>
      findSlot(container, 'guide-card-arrow') as HTMLElement;

    expect(getArrow()).toHaveClass('-top-px', 'left-1/2');

    rerender(<GuideCard title="Metrics" side="bottom" arrowOffset={40} />);

    expect(getArrow()).not.toHaveClass('left-1/2');
    expect(getArrow().style.left).toBe('40px');
  });

  it('measures the arrowOffset from the top on a left or right side', () => {
    const { container } = render(
      <GuideCard title="Metrics" side="left" arrowOffset={30} />
    );

    expect(
      (findSlot(container, 'guide-card-arrow') as HTMLElement).style.top
    ).toBe('30px');
  });

  it('takes a CSS length as the arrowOffset, e.g. a custom property', () => {
    const { container } = render(
      <GuideCard title="Metrics" side="right" arrowOffset="var(--x)" />
    );
    const arrow = findSlot(container, 'guide-card-arrow') as HTMLElement;

    expect(arrow).not.toHaveClass('top-1/2');
    expect(arrow).toHaveAttribute('style', 'top: var(--x);');
  });

  it('fades out while leaving', () => {
    const { container } = render(<GuideCard title="Metrics" isLeaving />);
    const card = findSlot(container, 'guide-card');

    expect(card).toHaveAttribute('data-state', 'leaving');
    expect(card).toHaveClass('animate-guide-card-out', 'pointer-events-none');
  });

  it('still ends the leave animation under reduced motion', () => {
    const { container, rerender } = render(<GuideCard title="Metrics" />);

    expect(findSlot(container, 'guide-card')).toHaveClass(
      'motion-reduce:animate-none'
    );

    rerender(<GuideCard title="Metrics" isLeaving />);

    const card = findSlot(container, 'guide-card');

    expect(card).toHaveClass('motion-reduce:[animation-duration:1ms]');
    expect(card).not.toHaveClass('motion-reduce:animate-none');
  });

  it('shakes once for each nudgeCount change', () => {
    vi.useFakeTimers();
    const { container, rerender } = render(
      <GuideCard title="Metrics" nudgeCount={0} />
    );
    const getCard = () => findSlot(container, 'guide-card');

    expect(getCard()).toHaveClass('animate-guide-card-in');

    rerender(<GuideCard title="Metrics" nudgeCount={1} />);
    act(() => {
      vi.advanceTimersToNextFrame();
    });
    expect(getCard()).toHaveClass('animate-guide-card-nudge');

    act(() => {
      vi.advanceTimersByTime(420);
    });
    expect(getCard()).toHaveClass('animate-guide-card-in');
  });
});
