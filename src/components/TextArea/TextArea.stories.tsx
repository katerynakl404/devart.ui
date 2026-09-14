import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from './index';

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  args: {
    placeholder: 'Type your message...',
    variant: 'outline',
    size: 'md',
    rounded: 'md',
    rows: 4,
    maxRowsBeforeScroll: 15,
    isInvalid: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    rounded: {
      control: 'select',
      options: ['md', 'lg', 'xl', '3xl'],
    },
    label: { control: 'text' },
    errorText: { control: 'text' },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-96">
      <TextArea {...args} />
    </div>
  ),
};

export const WithLabel: Story = {
  args: { label: 'Description' },
  render: (args) => (
    <div className="w-96">
      <TextArea {...args} />
    </div>
  ),
};

export const WithValue: Story = {
  args: {
    label: 'Notes',
    defaultValue: 'Some prefilled multi-line\ncontent for the textarea.',
  },
  render: (args) => (
    <div className="w-96">
      <TextArea {...args} />
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    label: 'Bio',
    isInvalid: true,
    errorText: 'This field is required.',
  },
  render: (args) => (
    <div className="w-96">
      <TextArea {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
    defaultValue: 'Cannot edit this content.',
  },
  render: (args) => (
    <div className="w-96">
      <TextArea {...args} />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    return (
      <div className="flex w-96 flex-col gap-4">
        {sizes.map((size) => (
          <TextArea {...args} key={size} size={size} label={size} rows={2} />
        ))}
      </div>
    );
  },
};

/**
 * Dark theme. Every token is plain CSS cascade, so a scoped `.dark` re-themes
 * the subtree — no provider, no props, no JS.
 */
export const DarkTheme: Story = {
  ...Default,
  decorators: [
    (Story) => (
      <div className="dark rounded-lg bg-surface-page p-6">
        <Story />
      </div>
    ),
  ],
};
