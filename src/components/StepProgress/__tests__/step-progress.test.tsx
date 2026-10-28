import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '../../Tooltip';
import { StepProgress, type StepProgressProps } from '../index';

const STEPS = [{ title: 'Role' }, { title: 'Goals' }, { title: 'Data' }];

const renderStepProgress = (props: Partial<StepProgressProps> = {}) =>
  render(
    <TooltipProvider>
      <StepProgress
        aria-label="Setup progress"
        steps={STEPS}
        current={0}
        label="Step 1 of 3"
        {...props}
      />
    </TooltipProvider>
  );

const findSlot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`);

describe('StepProgress', () => {
  it('draws read-only bars without onStepSelect', () => {
    const { container } = renderStepProgress();

    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(
      container.querySelectorAll('span[data-slot="step-progress-step"]')
    ).toHaveLength(3);
    expect(findSlot(container, 'step-progress-step')).not.toHaveClass(
      'cursor-pointer'
    );
  });

  it('turns every bar into a button with onStepSelect', () => {
    const onStepSelect = vi.fn();
    renderStepProgress({ onStepSelect });

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(screen.getByRole('button', { name: 'Role' })).toHaveAttribute(
      'aria-current',
      'step'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Data' }));
    expect(onStepSelect).toHaveBeenCalledExactlyOnceWith(2);
  });

  it('fills done bars and the current one', () => {
    const { container } = renderStepProgress({
      steps: [
        { title: 'Role', done: true },
        { title: 'Goals' },
        { title: 'Data' },
      ],
      current: 1,
    });
    const bars = container.querySelectorAll('[data-slot="step-progress-bar"]');

    expect(bars[0]).toHaveClass('bg-brand-primary');
    expect(bars[1]).toHaveClass('bg-brand-primary');
    expect(bars[2]).toHaveClass('bg-stroke');
  });

  it('keeps the label to the right of 24px bars by default', () => {
    const { container } = renderStepProgress();

    expect(findSlot(container, 'step-progress')).toHaveAttribute(
      'data-label-position',
      'right'
    );
    expect(findSlot(container, 'step-progress-bar')).toHaveClass('w-6');
  });

  it.each([
    ['top', 'flex-col-reverse'],
    ['bottom', 'flex-col'],
  ] as const)('stretches the bars with the label at the %s', (labelPosition, direction) => {
    const { container } = renderStepProgress({ labelPosition });

    expect(findSlot(container, 'step-progress')).toHaveClass(direction);
    expect(findSlot(container, 'step-progress-step')).toHaveClass('flex-1');
    expect(findSlot(container, 'step-progress-bar')).toHaveClass('w-full');
    expect(findSlot(container, 'step-progress-header')).toHaveClass(
      'justify-between'
    );
  });

  it('puts the label to the left with labelPosition="left"', () => {
    const { container } = renderStepProgress({ labelPosition: 'left' });

    expect(findSlot(container, 'step-progress')).toHaveClass(
      'flex-row-reverse'
    );
    expect(findSlot(container, 'step-progress-bar')).toHaveClass('w-6');
  });

  it("shows the current step's title with showStepTitle", () => {
    const { container } = renderStepProgress({
      current: 1,
      showStepTitle: true,
    });

    expect(findSlot(container, 'step-progress-title')).toHaveTextContent(
      'Goals'
    );
  });

  it('renders no header without a label or step title', () => {
    const { container } = renderStepProgress({ label: null });

    expect(findSlot(container, 'step-progress-header')).toBeNull();
  });

  it('announces the label politely', () => {
    renderStepProgress();

    expect(screen.getByText('Step 1 of 3')).toHaveAttribute(
      'aria-live',
      'polite'
    );
  });
});

/* This package's extensions on top of the developers' API. */
describe('StepProgress — extensions', () => {
  it('marks every step done, current or upcoming on data-state', () => {
    const { container } = renderStepProgress({
      steps: [{ title: 'Role', done: true }, { title: 'Goals' }, { title: '' }],
      current: 1,
      onStepSelect: vi.fn(),
    });

    expect(
      Array.from(
        container.querySelectorAll('[data-slot="step-progress-step"]'),
        (step) => step.getAttribute('data-state')
      )
    ).toEqual(['done', 'current', 'upcoming']);
  });

  it('does not fill a step before the current one unless it is done', () => {
    const { container } = renderStepProgress({ current: 2 });

    expect(
      Array.from(
        container.querySelectorAll('[data-slot="step-progress-step"]'),
        (step) => step.getAttribute('data-state')
      )
    ).toEqual(['upcoming', 'upcoming', 'current']);
  });

  it('gives a step with no title no tooltip', async () => {
    renderStepProgress({
      steps: [{ title: 'Role' }, { title: '', ariaLabel: 'Second step' }],
      onStepSelect: vi.fn(),
    });

    fireEvent.focus(screen.getByRole('button', { name: 'Second step' }));
    expect(screen.queryByRole('tooltip')).toBeNull();

    fireEvent.focus(screen.getByRole('button', { name: 'Role' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Role');
  });

  it('steps the label down and tightens the gaps with size="sm"', () => {
    const { container } = renderStepProgress({
      size: 'sm',
      labelPosition: 'top',
      showStepTitle: true,
    });

    expect(findSlot(container, 'step-progress')).toHaveClass('gap-1.5');
    expect(findSlot(container, 'step-progress')).not.toHaveClass('gap-2');
    expect(findSlot(container, 'step-progress-steps')).toHaveClass('gap-1');
    expect(findSlot(container, 'step-progress-label')).toHaveClass('text-xs');
    expect(findSlot(container, 'step-progress-label')).not.toHaveClass(
      'text-sm'
    );
    expect(findSlot(container, 'step-progress-title')).toHaveClass('text-xs');
  });

  it('keeps the label beside the bars at 8px with size="sm"', () => {
    const { container } = renderStepProgress({
      size: 'sm',
      showStepTitle: true,
    });

    expect(findSlot(container, 'step-progress')).toHaveClass('gap-2');
    expect(findSlot(container, 'step-progress-header')).toHaveClass('gap-2');
    expect(findSlot(container, 'step-progress-header')).not.toHaveClass(
      'gap-3'
    );
  });

  it('keeps the developers’ type and gaps at the default size', () => {
    const { container } = renderStepProgress({ labelPosition: 'top' });

    expect(findSlot(container, 'step-progress')).toHaveClass('gap-2');
    expect(findSlot(container, 'step-progress-steps')).toHaveClass('gap-1.5');
    expect(findSlot(container, 'step-progress-label')).toHaveClass('text-sm');
  });
});
