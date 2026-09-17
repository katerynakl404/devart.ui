import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch } from '../Switch';
import { TooltipProvider } from '../Tooltip';
import { StepSlider, type StepSliderStep } from './index';

const EFFORT_STEPS: StepSliderStep[] = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

const FIVE_STEPS: StepSliderStep[] = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'max', label: 'Max' },
];

const meta = {
  title: 'Components/StepSlider',
  component: StepSlider,
  tags: ['autodocs'],
  // `showStepTooltips` needs a provider; harmless for the stories that leave it off.
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={200}>
        <Story />
      </TooltipProvider>
    ),
  ],
  args: {
    steps: EFFORT_STEPS,
    value: 'Medium',
    size: 'default',
    disabled: false,
    showStepTooltips: false,
    'aria-label': 'Effort',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'default'] },
    steps: { control: false },
    value: { control: 'select', options: ['Low', 'Medium', 'High'] },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof StepSlider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Drag the thumb, click a dot, or focus it and use the arrow keys. */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState('Medium');

    return (
      <div className="flex items-center gap-3">
        <StepSlider {...args} value={value} onValueChange={setValue} />
        <span className="text-ink-secondary text-sm">{value}</span>
      </div>
    );
  },
};

export const Lowest: Story = { args: { value: 'Low' } };

export const Highest: Story = { args: { value: 'High' } };

export const Small: Story = { args: { size: 'sm' } };

export const Disabled: Story = { args: { disabled: true } };

/**
 * Every stop names itself on hover — the selected one included, even though the
 * thumb is sitting on top of it. Disabling the slider drops the tooltips, so a
 * gated row can explain the gate instead.
 */
export const WithStepTooltips: Story = {
  render: (args) => {
    const [value, setValue] = useState('Medium');

    return <StepSlider {...args} value={value} onValueChange={setValue} />;
  },
  args: { showStepTooltips: true },
};

/** The stop count is not fixed — the slider renders whatever `steps` it is given. */
export const FiveStops: Story = {
  args: { steps: FIVE_STEPS, value: 'high' },
  argTypes: { value: { control: false } },
};

/** In a settings row: label on the left, slider on the right. */
export const InSettingsRow: Story = {
  render: (args) => {
    const [value, setValue] = useState('High');

    return (
      <div className="w-[16.75rem] rounded-md bg-surface-card p-1">
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="font-medium text-ink-body text-sm">
            Effort{' '}
            <span className="font-normal text-ink-secondary">({value})</span>
          </span>
          <StepSlider {...args} value={value} onValueChange={setValue} />
        </div>
      </div>
    );
  },
};

/**
 * Size parity with `Switch` — the two share a settings panel, so per size the
 * track height and thumb diameter must be identical. A regression here shows up
 * as one control sitting taller than the other.
 */
export const MatchesSwitchSizes: Story = {
  render: (args) => (
    <div className="w-80 rounded-md bg-surface-card p-3">
      {(['default', 'sm'] as const).map((size) => (
        <div
          key={size}
          className="flex flex-col gap-2 border-stroke border-b py-3 last:border-b-0"
        >
          <span className="text-ink-secondary text-xs">size="{size}"</span>

          <div className="flex items-center justify-between">
            <span className="font-medium text-ink-body text-sm">Effort</span>
            <StepSlider {...args} size={size} value="Medium" />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium text-ink-body text-sm">Thinking</span>
            <Switch size={size} defaultChecked />
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Dark theme — every state the component ships, on one dark surface. Tokens
 * are pure CSS cascade, so a scoped `.dark` re-themes the whole subtree with
 * no provider and no props.
 */
export const DarkTheme = {
  render: (args, ctx) => {
    const cells: [string, Story][] = [
      ['Default', Default],
      ['Interactive', Interactive],
      ['Lowest', Lowest],
      ['Highest', Highest],
      ['Small', Small],
      ['Disabled', Disabled],
      ['With Step Tooltips', WithStepTooltips],
      ['Five Stops', FiveStops],
      ['In Settings Row', InSettingsRow],
      ['Matches Switch Sizes', MatchesSwitchSizes],
    ];
    return (
      <div className="dark grid gap-6 rounded-lg bg-surface-page p-6">
        {cells.map(([name, story]) => (
          <section className="flex flex-col gap-2" key={name}>
            <span className="font-medium text-ink-secondary text-xxs uppercase leading-4 tracking-caps">
              {name}
            </span>
            {story.render ? (
              story.render({ ...args, ...story.args } as never, ctx)
            ) : (
              null
            )}
          </section>
        ))}
      </div>
    );
  },
} as Story;
