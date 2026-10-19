import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '../../Tooltip';
import { StepProgress } from '../index';

const STEPS = [
  { id: 'role', label: 'Role' },
  { id: 'goal', label: 'Goal' },
  { id: 'data', label: 'Data' },
];

const bars = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('[data-slot="step-progress-step"]'));

describe('StepProgress', () => {
  it('renders a bar per step and the default counter', () => {
    const { container } = render(<StepProgress steps={STEPS} current={1} />);

    expect(bars(container)).toHaveLength(3);
    expect(screen.getByText('Step 2 of 3')).toHaveAttribute(
      'aria-live',
      'polite'
    );
    expect(screen.getByRole('group', { name: 'Steps' })).toBeInTheDocument();
  });

  it('fills done and current bars; read-only bars are hidden from AT', () => {
    const { container } = render(<StepProgress steps={STEPS} current={1} />);

    expect(bars(container).map((b) => b.getAttribute('data-state'))).toEqual([
      'done',
      'current',
      'upcoming',
    ]);
    for (const bar of bars(container)) {
      expect(bar).toHaveAttribute('aria-hidden', 'true');
    }
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('takes a custom counter, isStepDone and the current label', () => {
    const { container } = render(
      <StepProgress
        steps={STEPS}
        current={0}
        isStepDone={(i) => i === 2}
        counter={(n, total) => `Question ${n} of ${total}`}
        showStepLabel
      />
    );

    expect(screen.getByText('Question 1 of 3')).toBeInTheDocument();
    expect(screen.getByText('Role')).toHaveAttribute(
      'data-slot',
      'step-progress-label'
    );
    expect(bars(container)[2]).toHaveAttribute('data-state', 'done');
  });

  it('puts the header above full-width bars with `fill`', () => {
    const { container } = render(
      <StepProgress steps={STEPS} current={0} fill showStepLabel />
    );

    const head = container.querySelector('[data-slot="step-progress-head"]');
    expect(head).toHaveTextContent('Step 1 of 3Role');
    expect(
      container.querySelector<HTMLElement>('[data-slot="step-progress-steps"]')
        ?.style.gridTemplateColumns
    ).toBe('repeat(3, minmax(0, 1fr))');
  });

  it('makes every bar a named button with onStepSelect', () => {
    const onStepSelect = vi.fn();
    render(
      <TooltipProvider>
        <StepProgress steps={STEPS} current={1} onStepSelect={onStepSelect} />
      </TooltipProvider>
    );

    const role = screen.getByRole('button', {
      name: 'Role, step 1 of 3, completed',
    });
    const goal = screen.getByRole('button', { name: 'Goal, step 2 of 3' });
    expect(goal).toHaveAttribute('aria-current', 'step');
    expect(role).not.toHaveAttribute('aria-current');

    fireEvent.click(role);
    expect(onStepSelect).toHaveBeenCalledExactlyOnceWith(0);
  });

  it('names bars with getStepAriaLabel', () => {
    render(
      <TooltipProvider>
        <StepProgress
          steps={STEPS}
          current={0}
          onStepSelect={vi.fn()}
          getStepAriaLabel={(i, { current }) =>
            `Question ${i + 1}${current ? ', open' : ''}`
          }
        />
      </TooltipProvider>
    );

    expect(
      screen.getByRole('button', { name: 'Question 1, open' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Question 3' })
    ).toBeInTheDocument();
  });
});
