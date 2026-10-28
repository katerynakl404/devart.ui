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

  it('lights the step and explains it in a guide card with the progress', () => {
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
          { title: 'Role' },
          { title: 'Goal' },
          { title: 'Data' },
          { title: 'Chat' },
          { title: 'Metrics' },
        ],
        offset: 3,
      },
    });

    const card = screen.getByRole('dialog');
    expect(card).toHaveTextContent('Step 4 of 5');
    expect(card).toHaveTextContent('Chat');
  });

  it('moves focus to the card', async () => {
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

  it('nudges the card on a click on the scrim', async () => {
    renderTour();
    const veil = document.body.querySelector(
      '[data-slot="spotlight-veil"]'
    ) as HTMLElement;

    fireEvent.click(veil);
    await waitFor(() =>
      expect(screen.getByRole('dialog').className).toContain(
        'animate-guide-card-nudge'
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

/* What `Coachmark` did on its own and `GuideCard` leaves to the engine:
   placement, the phone sheet, the dialog role and focusability. */
describe('Tour — the card', () => {
  const setWidth = (px: number) =>
    Object.defineProperty(window, 'innerWidth', {
      value: px,
      configurable: true,
      writable: true,
    });

  /* jsdom lays nothing out: give the card a 300×200 box to place. */
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(300);
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(200);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    setWidth(1024);
  });

  it('is a non-modal dialog named by its title and described by its body', () => {
    renderTour();

    const card = screen.getByRole('dialog', {
      name: 'Ask your first question',
    });
    expect(card).toHaveAttribute('data-slot', 'guide-card');
    expect(card).toHaveAttribute('aria-modal', 'false');
    expect(card).toHaveAttribute('tabindex', '-1');
    expect(card.parentElement).toBe(document.body);

    const body = card.querySelector('[data-slot="guide-card-body"]');
    expect(card).toHaveAttribute('aria-describedby', body?.id);
    expect(body).toHaveTextContent('Type a question and press Enter.');
  });

  it('places the card beside the target and points its arrow at it', () => {
    renderTour();

    // #composer is 100–300 × 100–140, lit with 8px of padding: 92–308 ×
    // 92–148. The card goes 14px under it, centred on it.
    const card = screen.getByRole('dialog');
    expect(card).toHaveAttribute('data-side', 'bottom');
    expect(card.style.top).toBe('162px');
    expect(card.style.left).toBe('50px');

    const arrow = card.querySelector<HTMLElement>(
      '[data-slot="guide-card-arrow"]'
    );
    expect(arrow?.style.left).toBe('150px');
  });

  it('honours the step’s preferred side', () => {
    renderTour({
      steps: STEPS.map(
        (s, k): TourStep => (k === 0 ? { ...s, side: 'right' } : s)
      ),
    });

    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'right');
  });

  it('puts the annotations under the card when it sits under the target', () => {
    renderTour();

    // the card's bottom edge (162 + 200) + 34
    const label = document.body.querySelector<HTMLElement>(
      '[data-slot="annotation"]'
    );
    expect(label?.style.top).toBe('396px');
  });

  it('is a bottom sheet with no arrow at 640px and below', () => {
    setWidth(640);
    renderTour();

    const card = screen.getByRole('dialog');
    expect(card).not.toHaveAttribute('data-side');
    expect(card.querySelector('[data-slot="guide-card-arrow"]')).toBeNull();
    expect(card.style.top).toBe('');
  });
});
