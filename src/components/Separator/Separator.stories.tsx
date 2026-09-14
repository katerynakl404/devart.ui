import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './index';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  args: {
    variant: 'border',
    orientation: 'horizontal',
    decorative: true,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'border'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-64">
      <Separator {...args} orientation="horizontal" />
    </div>
  ),
};

export const Vertical: Story = {
  render: (args) => (
    <div className="flex h-16 items-center">
      <Separator {...args} orientation="vertical" />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-4">
      <Separator {...args} orientation="horizontal" variant="primary" />
      <Separator {...args} orientation="horizontal" variant="secondary" />
      <Separator {...args} orientation="horizontal" variant="border" />
    </div>
  ),
};

/**
 * Dark theme. Every token is plain CSS cascade, so a scoped `.dark` re-themes
 * the subtree — no provider, no props, no JS.
 */
export const DarkTheme: Story = {
  ...Horizontal,
  decorators: [
    (Story) => (
      <div className="dark rounded-lg bg-surface-page p-6">
        <Story />
      </div>
    ),
  ],
};
