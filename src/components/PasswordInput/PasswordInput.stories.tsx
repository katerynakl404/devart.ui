import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { PasswordInput } from './index';

/**
 * `PasswordInput` composes an `InputGroup` with a lock icon, the field, and a
 * visibility toggle. Group-level options (`size`, `variant`, `isInvalid`,
 * `errorText`, `label`, `inputId`) are passed via `inputGroupProps`; native
 * input attributes are passed directly.
 */
const meta = {
  title: 'Compositions/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  args: {
    placeholder: 'Enter password',
    toggleShowLabel: 'Show password',
    toggleHideLabel: 'Hide password',
    disabled: false,
  },
  argTypes: {
    inputGroupProps: { control: false },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByPlaceholderText('Enter password');
    await expect(field).toHaveAttribute('type', 'password');

    const toggle = canvas.getByRole('button', { name: 'Show password' });
    await userEvent.click(toggle);

    await expect(field).toHaveAttribute('type', 'text');
    // The control renames itself, so the label always describes what the next
    // press will do rather than the current state.
    await expect(
      canvas.getByRole('button', { name: 'Hide password' })
    ).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole('button', { name: 'Hide password' })
    );
    await expect(field).toHaveAttribute('type', 'password');
  },
  render: (args) => (
    <div className="w-72">
      <PasswordInput {...args} />
    </div>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="w-72">
      <PasswordInput
        {...args}
        inputGroupProps={{ label: 'Password', inputId: 'pw-with-label' }}
      />
    </div>
  ),
};

export const WithValue: Story = {
  args: { defaultValue: 'super-secret' },
  render: (args) => (
    <div className="w-72">
      <PasswordInput
        {...args}
        inputGroupProps={{ label: 'Password', inputId: 'pw-with-value' }}
      />
    </div>
  ),
};

export const ErrorState: Story = {
  render: (args) => (
    <div className="w-72">
      <PasswordInput
        {...args}
        inputGroupProps={{
          label: 'Password',
          inputId: 'pw-error',
          isInvalid: true,
          errorText: 'Password is too short.',
        }}
      />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'locked' },
  render: (args) => (
    <div className="w-72">
      <PasswordInput
        {...args}
        inputGroupProps={{ label: 'Password', inputId: 'pw-disabled' }}
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    return (
      <div className="flex w-72 flex-col gap-4">
        {sizes.map((size) => (
          <PasswordInput
            {...args}
            key={size}
            inputGroupProps={{ size, label: size, inputId: `pw-${size}` }}
          />
        ))}
      </div>
    );
  },
};
