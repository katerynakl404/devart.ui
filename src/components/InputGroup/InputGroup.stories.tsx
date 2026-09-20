import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, Search, X } from 'lucide-react';
import {
  InputGroup,
  InputGroupAction,
  InputGroupAddon,
  InputGroupInput,
} from './index';

/**
 * `InputGroup` is the composition wrapper that gives a bare `Input` its bordered
 * box, label, error text, and addon (icon / text / button) slots. It shares
 * focus and error state with its children via context. Compose it from
 * `InputGroupAddon` (icons/buttons) and `InputGroupInput` (the field).
 */
const meta = {
  title: 'Components/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  args: {
    size: 'md',
    variant: 'outline',
    isInvalid: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'outline'],
    },
    label: { control: 'text' },
    errorText: { control: 'text' },
    children: { control: false },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Email', inputId: 'group-default' },
  render: (args) => (
    <div className="w-72">
      <InputGroup {...args}>
        <InputGroupInput placeholder="you@example.com" type="email" />
      </InputGroup>
    </div>
  ),
};

export const WithLeadingIcon: Story = {
  args: { label: 'Email', inputId: 'group-leading' },
  render: (args) => (
    <div className="w-72">
      <InputGroup {...args}>
        <InputGroupAddon align="inline-start">
          <Mail aria-hidden />
        </InputGroupAddon>
        <InputGroupInput placeholder="you@example.com" type="email" />
      </InputGroup>
    </div>
  ),
};

export const WithBothIcons: Story = {
  args: { inputId: 'group-both' },
  render: (args) => (
    <div className="w-72">
      <InputGroup {...args}>
        <InputGroupAddon align="inline-start">
          <Search aria-hidden />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search..." type="search" />
        <InputGroupAddon align="inline-end">
          <span className="text-ink-inactive text-xs">⌘K</span>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    label: 'Email',
    inputId: 'group-error',
    isInvalid: true,
    errorText: 'Enter a valid email address.',
  },
  render: (args) => (
    <div className="w-72">
      <InputGroup {...args}>
        <InputGroupAddon align="inline-start">
          <Mail aria-hidden />
        </InputGroupAddon>
        <InputGroupInput placeholder="you@example.com" type="email" />
      </InputGroup>
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Email', inputId: 'group-disabled' },
  render: (args) => (
    <div className="w-72">
      <InputGroup {...args}>
        <InputGroupAddon align="inline-start">
          <Mail aria-hidden />
        </InputGroupAddon>
        <InputGroupInput disabled defaultValue="disabled@example.com" />
      </InputGroup>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    return (
      <div className="flex w-72 flex-col gap-4">
        {sizes.map((size) => (
          <InputGroup
            {...args}
            key={size}
            size={size}
            label={size}
            inputId={`group-${size}`}
          >
            <InputGroupAddon align="inline-start">
              <Mail aria-hidden />
            </InputGroupAddon>
            <InputGroupInput placeholder="you@example.com" />
          </InputGroup>
        ))}
      </div>
    );
  },
};

/**
 * Two shell fills: `primary` sits on `bg-surface-page` (the page well), `outline`
 * on `bg-surface-card`. Border, hover, pressed, focus and error are identical.
 */
export const Variants: Story = {
  render: (args) => {
    const variants = ['primary', 'outline'] as const;
    return (
      <div className="flex w-72 flex-col gap-4">
        {variants.map((variant) => (
          <InputGroup
            {...args}
            key={variant}
            inputId={`group-${variant}`}
            label={variant}
            variant={variant}
          >
            <InputGroupAddon align="inline-start">
              <Mail aria-hidden />
            </InputGroupAddon>
            <InputGroupInput placeholder="you@example.com" />
          </InputGroup>
        ))}
      </div>
    );
  },
};

/**
 * Addons can also stack above or below the field (`block-start` /
 * `block-end`), which turns the shell into a column.
 */
export const BlockAddons: Story = {
  args: { inputId: 'group-block' },
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <InputGroup {...args} inputId="group-block-start">
        <InputGroupAddon align="block-start">
          <span className="text-ink-secondary text-xs">To</span>
        </InputGroupAddon>
        <InputGroupInput placeholder="you@example.com" />
      </InputGroup>
      <InputGroup {...args} inputId="group-block-end">
        <InputGroupInput placeholder="Message subject" />
        <InputGroupAddon align="block-end">
          <span className="text-ink-inactive text-xs">0 / 80</span>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

/**
 * Search shell: the trailing clear (x) button is revealed only while the input
 * holds content, driven purely by `:placeholder-shown` on the shell.
 */
export const SearchWithClear: Story = {
  args: { inputId: 'group-search' },
  render: (args) => (
    <div className="w-72">
      <InputGroup {...args}>
        <InputGroupAddon align="inline-start">
          <Search aria-hidden />
        </InputGroupAddon>
        <InputGroupInput
          defaultValue="Q3 KPI"
          placeholder="Find a project…"
          type="search"
        />
        <InputGroupAddon
          align="inline-end"
          className="group-has-[input:placeholder-shown]/input-group:hidden"
        >
          {/* `InputGroupAction`, not an `IconButton`: an icon docked in a field
              has no surface of its own — the field already owns hover, focus
              and press, so a second filled box inside it reads as a control on
              top of a control. 24px box, 16px glyph, colour-only hover. */}
          <InputGroupAction aria-label="Clear search">
            <X aria-hidden />
          </InputGroupAction>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};
