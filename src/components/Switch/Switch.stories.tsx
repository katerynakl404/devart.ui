import type { Meta, StoryObj } from '@storybook/react-vite';
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

/**
 * Dark theme — every state the component ships, on one dark surface. Tokens
 * are pure CSS cascade, so a scoped `.dark` re-themes the whole subtree with
 * no provider and no props.
 */
export const DarkTheme = {
  render: (args, ctx) => {
    const cells: [string, Story][] = [
      ['With Label', WithLabel],
      ['States', States],
      ['Small', Small],
      ['Without Label', WithoutLabel],
      ['Tertiary Row', TertiaryRow],
    ];
    return (
      <div className="dark grid gap-6 rounded-lg bg-surface-page p-6">
        {cells.map(([name, story]) => (
          <section className="flex flex-col gap-2" key={name}>
            <span className="font-medium text-ink-secondary text-xxs uppercase leading-4 tracking-caps">
              {name}
            </span>
            {story.render
              ? story.render({ ...args, ...story.args } as never, ctx)
              : null}
          </section>
        ))}
      </div>
    );
  },
} as Story;
