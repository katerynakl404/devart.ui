import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkles } from 'lucide-react';
import { fn } from 'storybook/test';
import { Badge } from './index';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'Badge',
    variant: 'primary',
    size: 'md',
    rounded: 'md',
    withDot: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'attention',
        'success',
        'error',
        'brand',
        'green',
      ],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
    },
    leftSlot: { control: false },
    rightSlot: { control: false },
    onDelete: { control: false },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge {...args} variant="primary">
        Primary
      </Badge>
      <Badge {...args} variant="secondary">
        Secondary
      </Badge>
      <Badge {...args} variant="attention">
        Attention
      </Badge>
      <Badge {...args} variant="success">
        Success
      </Badge>
      <Badge {...args} variant="error">
        Error
      </Badge>
      <Badge {...args} variant="brand">
        Brand
      </Badge>
      <Badge {...args} variant="green">
        Green
      </Badge>
    </div>
  ),
};

/**
 * Size steps. `md` is the default; `sm` is the table-column step — the
 * reference specifies height 20px / padding 0 6px for it, so a badge in a
 * badge column never out-weighs the text rows around it.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div className="flex flex-wrap items-center gap-3" key={size}>
          <Badge {...args} size={size} variant="primary">
            {size}
          </Badge>
          <Badge {...args} size={size} variant="secondary">
            Built-in
          </Badge>
          <Badge {...args} rounded="full" size={size} variant="success" withDot>
            Active
          </Badge>
          <Badge {...args} leftSlot={<Sparkles />} size={size} variant="brand">
            Star
          </Badge>
        </div>
      ))}
    </div>
  ),
};

export const WithDot: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge {...args} withDot variant="success">
        Active
      </Badge>
      <Badge {...args} withDot variant="attention">
        Pending
      </Badge>
      <Badge {...args} withDot variant="error">
        Failed
      </Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { leftSlot: <Sparkles />, children: 'AI generated' },
};

export const Removable: Story = {
  args: { onDelete: fn(), children: 'Filter: last week' },
};

/**
 * Dark theme. Every token is plain CSS cascade, so a scoped `.dark` re-themes
 * the subtree — no provider, no props, no JS.
 */
export const DarkTheme: Story = {
  ...Primary,
  decorators: [
    (Story) => (
      <div className="dark rounded-lg bg-surface-page p-6">
        <Story />
      </div>
    ),
  ],
};
