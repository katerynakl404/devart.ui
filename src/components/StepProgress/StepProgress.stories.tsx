import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn } from 'storybook/test';
import { TooltipProvider } from '../Tooltip';
import { StepProgress, type StepProgressProps } from './index';

const TITLES = [
  'Time period',
  'Audience',
  'Sections',
  'Format',
  'Delivery',
  'Schedule',
  'Recipients',
  'Review',
];

interface StepProgressStoryArgs extends StepProgressProps {
  stepCount: number;
  answeredCount: number;
  interactive: boolean;
  unit: 'Question' | 'Step';
}

/** The button names the AskUser panel builds: title, position, answered state. */
const describeSteps = (stepCount: number, answeredCount: number) =>
  TITLES.slice(0, stepCount).map((title, index) => {
    const done = index < answeredCount;

    return {
      title,
      done,
      ariaLabel: `${title}, question ${index + 1} of ${stepCount}${done ? ', answered' : ''}`,
    };
  });

const renderStepProgress = ({
  stepCount,
  answeredCount,
  interactive,
  unit,
  current,
  label,
  onStepSelect,
  ...args
}: StepProgressStoryArgs) => {
  const currentIndex = Math.min(current, stepCount - 1);

  return (
    <StepProgress
      {...args}
      steps={describeSteps(stepCount, answeredCount)}
      current={currentIndex}
      label={label ?? `${unit} ${currentIndex + 1} of ${stepCount}`}
      onStepSelect={interactive ? onStepSelect : undefined}
    />
  );
};

/**
 * A short bar per step with the position in words beside them. A bar fills
 * once its step is done or while it is the current one.
 *
 * With `onStepSelect` every bar is a button that selects its step and names it
 * in a tooltip (needs a `TooltipProvider` above). Without it the bars are
 * plain marks: no pointer, no focus, no tooltip, and the label speaks.
 *
 * `labelPosition` puts the label on any side of the bars. Above or below
 * them, the bars share the full width, as in a setup wizard's header.
 *
 * Unlike the headless `Stepper`, this only draws progress: the consumer owns
 * which step is current and renders its content.
 *
 * This package adds `size="sm"`, the compact read-out a tour's card carries,
 * and a `data-state` (`done` · `current` · `upcoming`) on every step.
 */
const meta = {
  title: 'Components/StepProgress',
  component: StepProgress,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={300}>
        <div className="w-[36rem] max-w-full">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  args: {
    steps: describeSteps(4, 0),
    stepCount: 4,
    answeredCount: 0,
    current: 0,
    interactive: true,
    unit: 'Question',
    labelPosition: 'right',
    showStepTitle: false,
    'aria-label': 'Questions',
    onStepSelect: fn(),
  },
  argTypes: {
    steps: {
      control: false,
      description:
        'The steps, in order: `title` (tooltip and fallback name), `done`, `ariaLabel`. The story builds them from `stepCount` and `answeredCount`.',
      table: { type: { summary: 'StepProgressStep[]' } },
    },
    stepCount: {
      control: { type: 'number', min: 1, max: TITLES.length, step: 1 },
      description: `Story only: how many steps the story passes in \`steps\` (up to ${TITLES.length}).`,
      table: { category: 'Story helpers' },
    },
    answeredCount: {
      control: { type: 'number', min: 0, max: TITLES.length, step: 1 },
      description: 'Story only: marks that many first steps `done`.',
      table: { category: 'Story helpers' },
    },
    interactive: {
      control: 'boolean',
      description:
        'Story only: passes `onStepSelect`, which turns every bar into a button with a tooltip. Off, the bars are read-only.',
      table: { category: 'Story helpers' },
    },
    unit: {
      control: 'inline-radio',
      options: ['Question', 'Step'],
      description:
        'Story only: the word of the generated label ("Question 1 of 4"). A `label` typed in Controls wins.',
      table: { category: 'Story helpers' },
    },
    current: {
      control: { type: 'number', min: 0, max: TITLES.length - 1, step: 1 },
      description: '0-based index of the step on screen. Its bar is filled.',
    },
    label: {
      control: 'text',
      description:
        'The position in words ("Step 1 of 5"), announced politely. `null` renders none.',
      table: { type: { summary: 'ReactNode' } },
    },
    labelPosition: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      description:
        'Where the label sits. `top` and `bottom` stack it with the bars, which then share the full width.',
      table: { defaultValue: { summary: 'right' } },
    },
    showStepTitle: {
      control: 'boolean',
      description:
        "Shows the current step's `title` after the label; at the far end when the label is above or below.",
      table: { defaultValue: { summary: 'false' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Names the group of bars.',
    },
    onStepSelect: {
      description:
        "Called with a bar's index when it is pressed. Without it the bars are read-only.",
    },
    size: {
      control: 'inline-radio',
      options: ['md', 'sm'],
      description:
        "This package's extension: `sm` is the compact read-out a tour's card carries — the label at 12px, the gaps one step tighter.",
      table: { defaultValue: { summary: 'md' } },
    },
    ref: { control: false, table: { disable: true } },
  },
  render: renderStepProgress,
} satisfies Meta<StepProgressStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

/** First question on screen, nothing answered yet. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('group', { name: 'Questions' })
    ).toBeInTheDocument();

    await expect(
      canvas.getByRole('button', { name: 'Time period, question 1 of 4' })
    ).toHaveAttribute('aria-current', 'step');
  },
};

/**
 * Two questions answered, the third on screen. Done and current bars share the
 * brand fill; `aria-current` and the "answered" name tell them apart.
 */
export const Progress: Story = {
  args: { answeredCount: 2, current: 2 },
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(
      buttons.filter((button) => button.hasAttribute('aria-current'))
    ).toEqual([
      canvas.getByRole('button', { name: 'Sections, question 3 of 4' }),
    ]);
    await expect(
      canvas.getByRole('button', {
        name: 'Time period, question 1 of 4, answered',
      })
    ).not.toHaveAttribute('aria-current');
  },
};

/** Every bar moves to its question; the label follows. */
export const Interactive: Story = {
  args: { answeredCount: 1 },
  render: function Render({ current: initialCurrent, onStepSelect, ...args }) {
    const [current, setCurrent] = useState(initialCurrent);

    return renderStepProgress({
      ...args,
      current,
      onStepSelect: (index) => {
        onStepSelect?.(index);
        setCurrent(index);
      },
    });
  },
  play: async ({ args, canvas, userEvent }) => {
    // A hot update re-runs play without remounting, so the story's state can
    // be wherever the last run or a manual click left it.
    await userEvent.click(canvas.getByRole('button', { name: /^Time period/ }));

    const label = canvas.getByText('Question 1 of 4');
    await expect(label).toHaveAttribute('aria-live', 'polite');

    await userEvent.click(
      canvas.getByRole('button', { name: 'Sections, question 3 of 4' })
    );
    await expect(args.onStepSelect).toHaveBeenLastCalledWith(2);
    await expect(label).toHaveTextContent('Question 3 of 4');

    const current = canvas
      .getAllByRole('button')
      .filter((button) => button.hasAttribute('aria-current'));
    await expect(current).toEqual([
      canvas.getByRole('button', { name: 'Sections, question 3 of 4' }),
    ]);

    // Every bar is its own tab stop, in order.
    canvas.getByRole('button', { name: /^Time period/ }).focus();
    for (const name of [/^Audience/, /^Sections/, /^Format/]) {
      await userEvent.tab();
      await expect(canvas.getByRole('button', { name })).toHaveFocus();
    }

    await userEvent.keyboard('{Enter}');
    await expect(args.onStepSelect).toHaveBeenLastCalledWith(3);
    await expect(label).toHaveTextContent('Question 4 of 4');
  },
};

/**
 * Without `onStepSelect` the bars only show progress: no button, pointer,
 * focus or tooltip. Shown as a setup wizard's header, as in onboarding: the
 * label above the bars with the current step's title at the far end, and the
 * bars sharing the full width.
 */
export const ReadOnly: Story = {
  args: {
    stepCount: 5,
    answeredCount: 0,
    interactive: false,
    unit: 'Step',
    labelPosition: 'top',
    showStepTitle: true,
    'aria-label': 'Setup progress',
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole('button')).toHaveLength(0);
    await expect(canvas.getByText('Step 1 of 5')).toBeInTheDocument();
    await expect(canvas.getByText('Time period')).toBeInTheDocument();
  },
};

/* ── Extensions of this package ──────────────────────────────────────────── */

/**
 * `size="sm"`: the compact read-out a tour's card carries. The label is 12px
 * and the gaps are one step tighter, beside the bars and above them.
 */
export const Small: Story = {
  args: {
    ...ReadOnly.args,
    answeredCount: 1,
    current: 1,
    size: 'sm',
  },
  render: (args) => (
    <div className="flex flex-col gap-6">
      {renderStepProgress({ ...args, labelPosition: 'right' })}
      {renderStepProgress(args)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const labels = canvasElement.querySelectorAll(
      '[data-slot="step-progress-label"]'
    );

    for (const label of labels) {
      await expect(label).toHaveClass('text-xs');
    }
  },
};

/** Both sizes, read-only and interactive, on the dark theme. */
export const DarkTheme: Story = {
  globals: { theme: 'dark' },
  args: { ...ReadOnly.args, answeredCount: 1, current: 1 },
  render: (args) => (
    <div className="flex flex-col gap-6 rounded-lg bg-surface-card p-4">
      {renderStepProgress({ ...args, labelPosition: 'right' })}
      {renderStepProgress(args)}
      {renderStepProgress({ ...args, size: 'sm' })}
      {renderStepProgress({
        ...args,
        stepCount: 4,
        answeredCount: 2,
        current: 2,
        interactive: true,
        unit: 'Question',
        labelPosition: 'right',
        showStepTitle: false,
        'aria-label': 'Questions',
      })}
    </div>
  ),
};
