import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn } from 'storybook/test';
import { TooltipProvider } from '../Tooltip';
import { StepProgress } from './index';

const STEPS = [
  { id: 'role', label: 'Your role' },
  { id: 'goal', label: 'Your goal' },
  { id: 'data', label: 'Your data' },
  { id: 'chat', label: 'First question' },
];

/**
 * A bar per step and "Step N of M": where a multi-step flow stands. The
 * chat's question card, a setup wizard's header and a tour's coachmark carry
 * the same read-out.
 *
 * Read-only by default — the bars are decoration and the counter speaks. With
 * `onStepSelect` every bar is a button whose tooltip is the step's label.
 */
const meta = {
  title: 'Components/StepProgress',
  component: StepProgress,
  tags: ['autodocs'],
  args: { steps: STEPS, current: 1 },
  argTypes: {
    steps: { control: false },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    ref: { control: false, table: { disable: true } },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StepProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 24px bars inline, then the counter. Done and current are brand. */
export const Default: Story = {};

/** Every position: first, a middle one, the last. */
export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {[0, 2, 3].map((current) => (
        <StepProgress key={current} {...args} current={current} />
      ))}
    </div>
  ),
};

/** The current step's name after the counter — a caption, not a title. */
export const WithStepLabel: Story = {
  args: { showStepLabel: true },
};

/** `fill`: the header (counter · name) over bars that share the full width. */
export const Fill: Story = {
  args: { fill: true, showStepLabel: true },
  render: (args) => (
    <div className="w-96">
      <StepProgress {...args} />
    </div>
  ),
};

/** `size="sm"` — the compact read-out a coachmark carries, at both layouts. */
export const Small: Story = {
  args: { size: 'sm', showStepLabel: true },
  render: (args) => (
    <div className="flex w-80 flex-col gap-6">
      <StepProgress {...args} />
      <StepProgress {...args} fill />
    </div>
  ),
};

/**
 * The question card's stepper: its own counter, done = answered (not
 * "before the current one"), and every bar a button with a tooltip.
 */
export const Interactive: Story = {
  args: { onStepSelect: fn() },
  render: function Render(args) {
    const [current, setCurrent] = useState(1);
    const answered = new Set([0, 3]);
    return (
      <TooltipProvider>
        <StepProgress
          {...args}
          current={current}
          isStepDone={(i) => answered.has(i)}
          counter={(n, total) => `Question ${n} of ${total}`}
          getStepAriaLabel={(i, { done }) =>
            `${STEPS[i]?.label}, question ${i + 1} of ${STEPS.length}${
              done ? ', answered' : ''
            }`
          }
          onStepSelect={(i) => {
            args.onStepSelect?.(i);
            setCurrent(i);
          }}
        />
      </TooltipProvider>
    );
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: /Your data, question 3 of 4/ })
    );
    await expect(args.onStepSelect).toHaveBeenCalledWith(2);
    await expect(canvas.getByText('Question 3 of 4')).toBeVisible();
  },
};

/** Both sizes and both layouts on the dark theme. */
export const DarkTheme: Story = {
  globals: { theme: 'dark' },
  args: { showStepLabel: true },
  render: (args) => (
    <div className="flex w-96 flex-col gap-6 rounded-lg bg-surface-card p-4">
      <StepProgress {...args} />
      <StepProgress {...args} fill />
      <StepProgress {...args} fill size="sm" />
    </div>
  ),
};
