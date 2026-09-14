import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, Search } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../InputGroup';
import { Input } from './index';

/**
 * `Input` renders a bare, unstyled `<input>` with only sizing, focus-reset and
 * disabled styling. In real usage it lives inside an `InputGroup` (which provides
 * the bordered box, label and icon slots) via `InputGroupInput`. The standalone
 * story shows the raw element; the composed stories show the intended pattern.
 */
const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Type here...',
    disabled: false,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The raw element renders without a border by design — wrap it in a box so the
 * bare input is visible on the canvas.
 */
export const Standalone: Story = {
  render: (args) => (
    <div className="flex h-9 w-72 items-center rounded-md border border-stroke bg-surface-card px-2">
      <Input {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Cannot edit' },
  render: (args) => (
    <div className="flex h-9 w-72 items-center rounded-md border border-stroke bg-surface-card px-2">
      <Input {...args} />
    </div>
  ),
};

/**
 * The intended usage: `Input` (via `InputGroupInput`) composed inside an
 * `InputGroup` that supplies the border, label and addon slots.
 */
export const InGroup: Story = {
  render: (args) => (
    <div className="w-72">
      <InputGroup label="Email" inputId="input-in-group">
        <InputGroupAddon align="inline-start">
          <Mail aria-hidden />
        </InputGroupAddon>
        <InputGroupInput {...args} placeholder="you@example.com" type="email" />
      </InputGroup>
    </div>
  ),
};

export const InGroupWithLeadingIcon: Story = {
  render: (args) => (
    <div className="w-72">
      <InputGroup inputId="input-search">
        <InputGroupAddon align="inline-start">
          <Search aria-hidden />
        </InputGroupAddon>
        <InputGroupInput {...args} placeholder="Search..." type="search" />
      </InputGroup>
    </div>
  ),
};

/**
 * Dark theme. Every token is plain CSS cascade, so a scoped `.dark` re-themes
 * the subtree — no provider, no props, no JS.
 */
export const DarkTheme: Story = {
  ...Standalone,
  decorators: [
    (Story) => (
      <div className="dark rounded-lg bg-surface-page p-6">
        <Story />
      </div>
    ),
  ],
};
