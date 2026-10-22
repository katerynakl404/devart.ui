import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '../../Tooltip';
import {
  StepProgress,
  type StepProgressProps,
  type StepProgressStep,
} from '../index';

const QUESTIONS: StepProgressStep[] = [
  { title: 'Time period' },
  { title: 'Audience' },
  { title: 'Sections' },
];

const bars = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('[data-slot="step-progress-step"]'));

/* The developers' API: every bar a button, the label beside the bars. */
describe('StepProgress', () => {
  const renderInteractive = (props: Partial<StepProgressProps> = {}) => {
    const onStepSelect = vi.fn();
    const view = render(
      <TooltipProvider>
        <StepProgress
          aria-label="Questions"
          steps={QUESTIONS}
          current={0}
          label="Question 1 of 3"
          onStepSelect={onStepSelect}
          {...props}
        />
      </TooltipProvider>
    );
    return { ...view, onStepSelect };
  };

  it('groups the bars in a fieldset named by aria-label', () => {
    renderInteractive();

    const group = screen.getByRole('group', { name: 'Questions' });
    expect(group.tagName).toBe('FIELDSET');
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('names a bar by its title and marks the current one', () => {
    renderInteractive();

    expect(screen.getByRole('button', { name: 'Time period' })).toHaveAttribute(
      'aria-current',
      'step'
    );
    expect(
      screen.getByRole('button', { name: 'Audience' })
    ).not.toHaveAttribute('aria-current');
  });

  it('prefers a step’s ariaLabel over its title', () => {
    renderInteractive({
      steps: [
        {
          title: 'Time period',
          done: true,
          ariaLabel: 'Time period, question 1 of 3, answered',
        },
        { title: 'Audience' },
        { title: 'Sections' },
      ],
      current: 1,
    });

    expect(
      screen.getByRole('button', {
        name: 'Time period, question 1 of 3, answered',
      })
    ).not.toHaveAttribute('aria-current');
  });

  it('fills a bar once its step is done or while it is current', () => {
    const { container } = renderInteractive({
      steps: [{ title: 'A', done: true }, { title: 'B' }, { title: 'C' }],
      current: 1,
    });

    expect(bars(container).map((b) => b.getAttribute('data-state'))).toEqual([
      'done',
      'current',
      'upcoming',
    ]);
    const marks = container.querySelectorAll('[data-slot="step-progress-bar"]');
    expect(marks[0]).toHaveClass('bg-brand-primary');
    expect(marks[1]).toHaveClass('bg-brand-primary');
    expect(marks[2]).toHaveClass('bg-stroke');
  });

  it('does not fill a step before the current one unless it is done', () => {
    const { container } = renderInteractive({ current: 2 });

    expect(bars(container).map((b) => b.getAttribute('data-state'))).toEqual([
      'upcoming',
      'upcoming',
      'current',
    ]);
  });

  it('announces the label politely', () => {
    renderInteractive();

    const label = screen.getByText('Question 1 of 3');
    expect(label).toHaveAttribute('aria-live', 'polite');
    expect(label).toHaveAttribute('data-slot', 'step-progress-label');
  });

  it('renders no label for label={null}', () => {
    const { container } = renderInteractive({ label: null });

    expect(
      container.querySelector('[data-slot="step-progress-label"]')
    ).toBeNull();
  });

  it('selects a step by its bar', () => {
    const { onStepSelect } = renderInteractive();

    fireEvent.click(screen.getByRole('button', { name: 'Sections' }));
    expect(onStepSelect).toHaveBeenCalledExactlyOnceWith(2);
  });

  it('spreads the remaining props onto the root', () => {
    const { container } = renderInteractive({ id: 'questions' });

    expect(
      container.querySelector('[data-slot="step-progress"]')
    ).toHaveAttribute('id', 'questions');
  });
});

/* Fork extensions: `counter`, read-only bars, `showStepTitle`, `fill`. */
describe('StepProgress — extensions', () => {
  it('writes the label with the default counter when label is left out', () => {
    render(<StepProgress aria-label="Steps" steps={QUESTIONS} current={1} />);

    expect(screen.getByText('Step 2 of 3')).toHaveAttribute(
      'aria-live',
      'polite'
    );
  });

  it('takes a custom counter', () => {
    render(
      <StepProgress
        aria-label="Questions"
        steps={QUESTIONS}
        current={0}
        counter={(n, total) => `Question ${n} of ${total}`}
      />
    );

    expect(screen.getByText('Question 1 of 3')).toBeInTheDocument();
  });

  it('keeps the bars read-only without onStepSelect', () => {
    const { container } = render(
      <StepProgress aria-label="Steps" steps={QUESTIONS} current={1} />
    );

    expect(screen.queryByRole('button')).toBeNull();
    for (const bar of bars(container)) {
      expect(bar).toHaveAttribute('aria-hidden', 'true');
    }
    expect(screen.getByRole('group', { name: 'Steps' })).toBeInTheDocument();
  });

  it('shows the current step’s title with showStepTitle', () => {
    render(
      <StepProgress
        aria-label="Steps"
        steps={QUESTIONS}
        current={1}
        showStepTitle
      />
    );

    expect(screen.getByText('Audience')).toHaveAttribute(
      'data-slot',
      'step-progress-title'
    );
  });

  it('puts the header above full-width bars with `fill`', () => {
    const { container } = render(
      <StepProgress
        aria-label="Steps"
        steps={QUESTIONS}
        current={0}
        fill
        showStepTitle
      />
    );

    const head = container.querySelector('[data-slot="step-progress-head"]');
    expect(head).toHaveTextContent('Step 1 of 3Time period');
    expect(
      container.querySelector<HTMLElement>('[data-slot="step-progress-steps"]')
        ?.style.gridTemplateColumns
    ).toBe('repeat(3, minmax(0, 1fr))');
  });

  it('drops the header with `fill` when there is nothing to put in it', () => {
    const { container } = render(
      <StepProgress
        aria-label="Steps"
        steps={QUESTIONS}
        current={0}
        fill
        label={null}
      />
    );

    expect(
      container.querySelector('[data-slot="step-progress-head"]')
    ).toBeNull();
  });
});
