import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn } from 'storybook/test';
import { TooltipProvider } from '../Tooltip';
import { StepProgress, type StepProgressStep } from './index';

const TITLES = ['Time period', 'Audience', 'Sections', 'Format'];

const QUESTIONS: StepProgressStep[] = TITLES.map((title) => ({ title }));

/** The button names the AskUser panel builds: title, position, answered state. */
const describeQuestions = (answered: ReadonlySet<number>): StepProgressStep[] =>
  TITLES.map((title, index) => {
    const done = answered.has(index);

    return {
      title,
      done,
      ariaLabel: `${title}, question ${index + 1} of ${TITLES.length}${done ? ', answered' : ''}`,
    };
  });

/** An onboarding flow: every step before the current one is done. */
const ONBOARDING = ['Your role', 'Your goal', 'Your data', 'First question'];
const onboarding = (current: number): StepProgressStep[] =>
  ONBOARDING.map((title, index) => ({ title, done: index < current }));

/**
 * A short bar per step with the position in words beside them. The chat's
 * question card, a setup wizard's header and a tour's coachmark carry the
 * same read-out.
 *
 * With `onStepSelect` every bar is a button whose tooltip is the step's
 * `title`. Without it the bars are decoration and the label speaks.
 */
const meta = {
  title: 'Components/StepProgress',
  component: StepProgress,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={300}>
        <Story />
      </TooltipProvider>
    ),
  ],
  args: {
    steps: QUESTIONS,
    current: 0,
    label: 'Question 1 of 4',
    'aria-label': 'Questions',
    onStepSelect: fn(),
  },
  argTypes: {
    steps: { control: false },
    current: { control: { type: 'number', min: 0, max: TITLES.length - 1 } },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    ref: { control: false, table: { disable: true } },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StepProgress>;

export default meta;

type Story = StoryObj<typeof meta>;

/** First question on screen, nothing answered yet. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('group', { name: 'Questions' })
    ).toBeInTheDocument();

    // Without `ariaLabel` the button falls back to the step's title.
    await expect(
      canvas.getByRole('button', { name: 'Time period' })
    ).toHaveAttribute('aria-current', 'step');
  },
};

/**
 * Two questions answered, the third on screen. Done and current bars share the
 * brand fill; `aria-current` and the "answered" name tell them apart.
 */
export const Progress: Story = {
  args: {
    steps: describeQuestions(new Set([0, 1])),
    current: 2,
    label: 'Question 3 of 4',
  },
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
  args: {
    steps: describeQuestions(new Set([0])),
    current: 0,
    label: 'Question 1 of 4',
  },

  render: function Render({ onStepSelect, current: initialCurrent, ...args }) {
    const [current, setCurrent] = useState(initialCurrent);

    return (
      <StepProgress
        {...args}
        current={current}
        label={`Question ${current + 1} of ${TITLES.length}`}
        onStepSelect={(index) => {
          onStepSelect?.(index);
          setCurrent(index);
        }}
      />
    );
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

/* ── Fork extensions ─────────────────────────────────────────────────────── */

/**
 * Read-only — no `onStepSelect`. The bars are decoration and the label speaks;
 * left out, `label` is written by `counter` ("Step N of M").
 */
export const ReadOnly: Story = {
  args: {
    steps: onboarding(1),
    current: 1,
    label: undefined,
    'aria-label': 'Steps',
    onStepSelect: undefined,
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull();
    await expect(canvas.getByText('Step 2 of 4')).toHaveAttribute(
      'aria-live',
      'polite'
    );
  },
};

/** Every position: first, a middle one, the last. */
export const States: Story = {
  args: { ...ReadOnly.args },
  render: (args) => (
    <div className="flex flex-col gap-4">
      {[0, 2, 3].map((current) => (
        <StepProgress
          key={current}
          {...args}
          steps={onboarding(current)}
          current={current}
        />
      ))}
    </div>
  ),
};

/** `showStepTitle` — the current step's title after the label: a caption. */
export const WithStepTitle: Story = {
  args: { ...ReadOnly.args, showStepTitle: true },
};

/** `fill`: the header (label · title) over bars that share the full width. */
export const Fill: Story = {
  args: { ...ReadOnly.args, fill: true, showStepTitle: true },
  render: (args) => (
    <div className="w-96">
      <StepProgress {...args} />
    </div>
  ),
};

/** `size="sm"` — the compact read-out a coachmark carries, at both layouts. */
export const Small: Story = {
  args: { ...ReadOnly.args, size: 'sm', showStepTitle: true },
  render: (args) => (
    <div className="flex w-80 flex-col gap-6">
      <StepProgress {...args} />
      <StepProgress {...args} fill />
    </div>
  ),
};

/** Both sizes and both layouts on the dark theme. */
export const DarkTheme: Story = {
  globals: { theme: 'dark' },
  args: { ...ReadOnly.args, showStepTitle: true },
  render: (args) => (
    <div className="flex w-96 flex-col gap-6 rounded-lg bg-surface-card p-4">
      <StepProgress {...args} />
      <StepProgress {...args} fill />
      <StepProgress {...args} fill size="sm" />
      <StepProgress
        {...args}
        steps={describeQuestions(new Set([0, 1]))}
        current={2}
        label="Question 3 of 4"
        aria-label="Questions"
        showStepTitle={false}
        onStepSelect={fn()}
      />
    </div>
  ),
};
