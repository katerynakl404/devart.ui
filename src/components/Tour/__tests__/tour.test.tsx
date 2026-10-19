import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Tour, type TourProps, type TourStep } from '../index';

const STEPS: TourStep[] = [
  {
    id: 'chat',
    target: '#composer',
    title: 'Ask your first question',
    content: <p>Type a question and press Enter.</p>,
    annotations: [{ target: '#model', text: 'Pick a model' }],
  },
  {
    id: 'metrics',
    target: '#metrics',
    title: 'Metrics',
    label: 'Metrics',
    content: <p>How each number is calculated.</p>,
  },
];

const mount = (id: string, left: number) => {
  const el = document.createElement('div');
  el.id = id;
  el.getBoundingClientRect = () =>
    ({
      left,
      top: 100,
      right: left + 200,
      bottom: 140,
      width: 200,
      height: 40,
    }) as DOMRect;
  document.body.appendChild(el);
};

beforeEach(() => {
  mount('composer', 100);
  mount('model', 120);
  mount('metrics', 400);
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
  vi.useRealTimers();
});

const renderTour = (props: Partial<TourProps> = {}) =>
  render(<Tour open steps={STEPS} step={0} {...props} />);

describe('Tour', () => {
  it('renders nothing while closed', () => {
    renderTour({ open: false });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.querySelector('[data-slot="spotlight"]')).toBeNull();
  });

  it('lights the step and explains it in a coachmark with the progress', () => {
    renderTour();

    const card = screen.getByRole('dialog', {
      name: 'Ask your first question',
    });
    expect(card).toHaveTextContent('Step 1 of 2');
    expect(card).toHaveTextContent('Type a question and press Enter.');
    expect(
      document.body.querySelector('[data-slot="spotlight"]')
    ).toBeInTheDocument();
    expect(
      document.body.querySelector('[data-slot="annotation-group"]')
    ).toBeInTheDocument();
    // the annotation is also listed inside the card, for the phone sheet
    expect(
      card.querySelector('[data-slot="tour-annotation-list"]')
    ).toHaveTextContent('Pick a model');
  });

  it('reads out the longer flow it is part of', () => {
    renderTour({
      progress: {
        steps: [
          { id: 'a', label: 'Role' },
          { id: 'b', label: 'Goal' },
          { id: 'c', label: 'Data' },
          { id: 'd', label: 'Chat' },
          { id: 'e', label: 'Metrics' },
        ],
        offset: 3,
      },
    });

    const card = screen.getByRole('dialog');
    expect(card).toHaveTextContent('Step 4 of 5');
    expect(card).toHaveTextContent('Chat');
  });

  it('moves focus to the coachmark', async () => {
    renderTour();
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveFocus());
  });

  it('goes on with Next, finishes with Done, and skips with Skip', () => {
    const onStepChange = vi.fn();
    const onClose = vi.fn();
    const { rerender } = renderTour({ onStepChange, onClose });

    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onStepChange).toHaveBeenCalledExactlyOnceWith(1);

    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
    expect(onClose).toHaveBeenLastCalledWith('skip');

    rerender(
      <Tour
        open
        steps={STEPS}
        step={1}
        onStepChange={onStepChange}
        onClose={onClose}
        labels={{ finish: 'Start chatting' }}
      />
    );
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onStepChange).toHaveBeenLastCalledWith(0);
    fireEvent.click(screen.getByRole('button', { name: 'Start chatting' }));
    expect(onClose).toHaveBeenLastCalledWith('finish');
  });

  it('shows Back on the first step only with onBeforeFirst', () => {
    const onBeforeFirst = vi.fn();
    renderTour({ onBeforeFirst });

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBeforeFirst).toHaveBeenCalledOnce();
  });

  it('answers →, ← and Esc — but not while typing in a field', () => {
    const onStepChange = vi.fn();
    const onClose = vi.fn();
    renderTour({ step: 1, onStepChange, onClose });

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(onStepChange).toHaveBeenLastCalledWith(0);
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(onClose).toHaveBeenLastCalledWith('finish');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenLastCalledWith('escape');

    const field = document.createElement('input');
    document.body.appendChild(field);
    onClose.mockClear();
    fireEvent.keyDown(field, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('nudges the coachmark on a click on the scrim', async () => {
    renderTour();
    const veil = document.body.querySelector(
      '[data-slot="spotlight-veil"]'
    ) as HTMLElement;

    fireEvent.click(veil);
    await waitFor(() =>
      expect(screen.getByRole('dialog').className).toContain(
        'animate-coachmark-nudge'
      )
    );
  });

  it('fades out for 300ms when closed, then unmounts', () => {
    vi.useFakeTimers();
    const { rerender } = renderTour();

    rerender(<Tour open={false} steps={STEPS} step={0} />);
    const card = screen.getByRole('dialog');
    expect(card).toHaveAttribute('data-state', 'leaving');
    expect(
      document.body.querySelector('[data-slot="spotlight"]')
    ).toHaveAttribute('data-state', 'leaving');

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.querySelector('[data-slot="spotlight"]')).toBeNull();
  });
});
