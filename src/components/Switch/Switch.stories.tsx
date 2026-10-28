import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TooltipProvider } from '../Tooltip';
import { Switch } from './index';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    label: 'Enable notifications',
    labelPosition: 'right',
    size: 'default',
    gap: 'md',
    disabled: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    containerVariant: {
      control: 'select',
      options: ['default', 'tertiary'],
    },
    checked: { control: false },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabel: Story = {};

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Switch {...args} label="Off" />
      <Switch {...args} defaultChecked label="On" />
      <Switch {...args} disabled label="Disabled off" />
      <Switch {...args} defaultChecked disabled label="Disabled on" />
    </div>
  ),
};

/**
 * `sm` — 28 x 16 px track with a 12 x 12 px thumb. Same colour tokens and
 * states as the default switch; use it in compact rows where 36 x 20 is too
 * large.
 */
export const Small: Story = {
  args: { size: 'sm' },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Switch {...args} label="Off" />
      <Switch {...args} defaultChecked label="On" />
      <Switch {...args} disabled label="Disabled off" />
      <Switch {...args} defaultChecked disabled label="Disabled on" />
    </div>
  ),
};

export const WithoutLabel: Story = {
  args: { label: undefined, 'aria-label': 'Toggle feature' },
};

/**
 * `description` — a line under the label that says what switching does:
 * `body12`, `--ink-secondary`, 2px under the label, and the switch's
 * `aria-describedby`. The row aligns to the top, so the switch sits on the
 * label's first line however long the description runs — `sm` included.
 */
export const WithDescription: Story = {
  args: {
    label: 'Active',
    labelPosition: 'left',
    description:
      'Inactive connections stop syncing data but keep their configuration.',
    defaultChecked: true,
    className: 'max-w-80',
  },
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Switch {...args} />
      <Switch {...args} size="sm" />
      <Switch {...args} disabled />
    </div>
  ),
};

/**
 * `tooltip` — on hover and keyboard focus, what switching does, or why the
 * switch is off. A disabled switch with a tooltip is rendered `aria-disabled`:
 * Tab reaches it and the reason opens; it does not toggle. Under a tooltip the
 * track keeps its own checked / unchecked colour.
 */
export const WithTooltip: Story = {
  args: { label: undefined },
  render: () => {
    const [on, setOn] = useState(true);
    return (
      <TooltipProvider>
        <div className="flex items-center gap-6">
          <Switch
            size="sm"
            checked={on}
            onCheckedChange={setOn}
            aria-label={on ? 'Deactivate Finance' : 'Activate Finance'}
            tooltip={on ? 'Deactivate' : 'Activate'}
          />
          <Switch
            size="sm"
            defaultChecked
            disabled
            aria-label="Deactivate Sales"
            tooltip="Only an owner can deactivate a workspace"
            tooltipSide="bottom"
          />
        </div>
      </TooltipProvider>
    );
  },
};

// Menu-row usage: whole labelled row gets Button-tertiary hover/pressed
// overlays (e.g. connector toggles inside the chat composer popover).
export const TertiaryRow: Story = {
  args: {
    containerVariant: 'tertiary',
    labelPosition: 'right',
    size: 'sm',
    className: 'h-8 w-56 justify-between px-3',
  },
};
