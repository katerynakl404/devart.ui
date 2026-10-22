import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { expect } from 'storybook/test';
import { TextArea } from './index';

const NEAR_LIMIT_TEXT = 'Lorem ipsum dolor sit amet, '.repeat(8).slice(0, 185);
const OVER_LIMIT_TEXT = 'Lorem ipsum dolor sit amet, '.repeat(5).slice(0, 120);
const OVER_LIMIT_ERROR = 'Must be 100 characters or fewer';

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
    showCount: { control: 'boolean' },
    softLimit: { control: 'boolean' },
    maxLength: { control: 'number' },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  /**
   * The field grows with its content and stops at `maxRowsBeforeScroll`, after
   * which it scrolls instead. Both halves matter: without the cap a long
   * message pushes the send button off the screen.
   */
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByPlaceholderText('Type your message...');
    const initialHeight = field.offsetHeight;

    await userEvent.click(field);
    await userEvent.keyboard('{Enter}x'.repeat(10));

    const grownHeight = field.offsetHeight;
    await expect(grownHeight).toBeGreaterThan(initialHeight);
    await expect(field.style.overflowY).toBe('hidden');

    await userEvent.keyboard('{Enter}x'.repeat(20));
    const cappedHeight = field.offsetHeight;
    await expect(field.style.overflowY).toBe('auto');

    // Past the cap the field scrolls instead of growing — without that, a long
    // message would push everything below it off the screen.
    await userEvent.keyboard('{Enter}x'.repeat(10));
    await expect(field.offsetHeight).toBe(cappedHeight);
  },
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

export const WithCount: Story = {
  args: {
    label: 'Definition',
    placeholder: 'Describe how to compute this metric…',
    maxLength: 200,
    showCount: true,
  },
  render: (args) => (
    <div className="w-96">
      <TextArea {...args} />
    </div>
  ),
};

export const CountNearLimit: Story = {
  args: {
    label: 'Definition',
    maxLength: 200,
    showCount: true,
    defaultValue: NEAR_LIMIT_TEXT,
  },
  render: (args) => (
    <div className="w-96">
      <TextArea {...args} />
    </div>
  ),
};

export const CountOverSoftLimit: Story = {
  args: {
    label: 'Definition',
    maxLength: 100,
    showCount: true,
    softLimit: true,
  },
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByRole('textbox', { name: 'Definition' });
    const counter = canvas.getByText(`${OVER_LIMIT_TEXT.length} / 100`);
    const row = counter.parentElement as HTMLElement;
    const overLimitColor = getComputedStyle(counter).color;
    const rowHeight = row.offsetHeight;

    // No native cap under softLimit: typing keeps going past the limit.
    await expect(field).not.toHaveAttribute('maxlength');
    await userEvent.type(field, '!');
    await expect(counter).toHaveTextContent(
      `${OVER_LIMIT_TEXT.length + 1} / 100`
    );

    await userEvent.keyboard(`{Backspace>${OVER_LIMIT_TEXT.length - 98}/}`);
    await expect(counter).toHaveTextContent('99 / 100');
    await expect(canvas.queryByText(OVER_LIMIT_ERROR)).not.toBeInTheDocument();
    await expect(getComputedStyle(counter).color).not.toBe(overLimitColor);

    // The counter shares the error's line, so the error leaving moves nothing.
    await expect(row.offsetHeight).toBe(rowHeight);
  },
  render: (args) => <CountOverSoftLimitExample {...args} />,
};

const CountOverSoftLimitExample = ({
  maxLength = 100,
  onChange,
  value: _value,
  defaultValue: _defaultValue,
  isInvalid: _isInvalid,
  errorText: _errorText,
  ...args
}: ComponentProps<typeof TextArea>) => {
  const [value, setValue] = useState(OVER_LIMIT_TEXT);
  const isOverLimit = value.length > maxLength;

  return (
    <div className="w-96">
      <TextArea
        {...args}
        maxLength={maxLength}
        value={value}
        isInvalid={isOverLimit}
        errorText={isOverLimit ? OVER_LIMIT_ERROR : undefined}
        onChange={(event) => {
          setValue(event.currentTarget.value);
          onChange?.(event);
        }}
      />
    </div>
  );
};

export const CountWithoutLimit: Story = {
  args: {
    label: 'Notes',
    showCount: true,
    defaultValue: 'No limit set, so only the count is shown',
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
