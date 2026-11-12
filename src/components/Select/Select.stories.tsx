import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, waitFor, within } from 'storybook/test';
import { Select, type SelectOption } from './index';

const AUTH: SelectOption[] = [
  { id: 'password', label: 'Password' },
  { id: 'key', label: 'Public key' },
  { id: 'agent', label: 'SSH agent' },
];

const PROTOCOLS: SelectOption[] = [
  { id: '', label: 'Automatic' },
  { id: '2', label: 'Version 2.0' },
  { id: '3', label: 'Version 3.0' },
];

const REGIONS: SelectOption[] = [
  'US East (N. Virginia)',
  'US West (Oregon)',
  'Canada (Central)',
  'EU (Frankfurt)',
  'EU (Ireland)',
  'EU (London)',
  'EU (Paris)',
  'Asia Pacific (Tokyo)',
  'Asia Pacific (Singapore)',
  'Asia Pacific (Sydney)',
  'South America (São Paulo)',
].map((label, i) => ({ id: `r${i}`, label }));

const meta = {
  title: 'Compositions/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    label: 'Authentication',
    placeholder: 'Choose a method',
    options: AUTH,
    size: 'md',
    disabled: false,
    isInvalid: false,
    clearable: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    options: { control: false },
    value: { control: false },
    onValueChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled(args: Story['args']) {
  const [value, setValue] = useState<string | null>(args?.value ?? null);
  return (
    <Select
      {...(args as Parameters<typeof Select>[0])}
      value={value}
      onValueChange={setValue}
    />
  );
}

/** Nothing chosen: the placeholder. A pick closes the list. */
export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Authentication' });
    await userEvent.click(trigger);
    const page = within(document.body);
    await userEvent.click(
      await page.findByRole('option', { name: 'Public key' })
    );
    await waitFor(() => expect(trigger).toHaveTextContent('Public key'));
    await waitFor(() =>
      expect(page.queryByRole('listbox')).not.toBeInTheDocument()
    );

    await userEvent.click(trigger);
    await expect(
      await page.findByRole('option', { name: 'Public key' })
    ).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(page.queryByRole('listbox')).not.toBeInTheDocument()
    );
  },
};

export const WithValue: Story = {
  args: { value: 'key' },
  render: (args) => <Controlled {...args} />,
};

/** The clear button empties the field without opening the list. */
export const Clearable: Story = {
  args: { value: 'key', clearable: true },
  render: (args) => <Controlled {...args} />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Authentication' });
    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear selection' })
    );
    await expect(trigger).toHaveTextContent('Choose a method');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(
      canvas.queryByRole('button', { name: 'Clear selection' })
    ).not.toBeInTheDocument();
  },
};

/** Asterisk on the label, announced as required; no clear button. */
export const Required: Story = {
  args: { value: 'key', clearable: true, required: true },
  render: (args) => <Controlled {...args} />,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('combobox', { name: 'Authentication' })
    ).toHaveAttribute('aria-required', 'true');
    await expect(canvas.getByText('*')).toBeInTheDocument();
    await expect(
      canvas.queryByRole('button', { name: 'Clear selection' })
    ).not.toBeInTheDocument();
  },
};

/** In a form, `name` and `required` work as on a native select. */
export const InAForm: Story = {
  args: { required: true, name: 'auth' },
  render: (args) => (
    <form aria-label="Connection">
      <Controlled {...args} />
    </form>
  ),
  play: async ({ canvas, userEvent }) => {
    const form = canvas.getByRole('form', {
      name: 'Connection',
    }) as HTMLFormElement;
    await expect(form.checkValidity()).toBe(false);

    await userEvent.click(
      canvas.getByRole('combobox', { name: 'Authentication' })
    );
    await userEvent.click(
      await within(document.body).findByRole('option', { name: 'SSH agent' })
    );
    await waitFor(() => expect(form.checkValidity()).toBe(true));
    await expect(new FormData(form).get('auth')).toBe('agent');
    await waitFor(() =>
      expect(
        within(document.body).queryByRole('listbox')
      ).not.toBeInTheDocument()
    );
  },
};

/** An option may have the empty id: a default that is no explicit value. */
export const EmptyIdOption: Story = {
  args: { label: 'Protocol', options: PROTOCOLS, value: '' },
  render: (args) => <Controlled {...args} />,
  play: async ({ canvas, userEvent }) => {
    const page = within(document.body);
    const field = canvas.getByRole('combobox', { name: 'Protocol' });
    await expect(field).toHaveTextContent('Automatic');

    await userEvent.click(field);
    await userEvent.click(
      await page.findByRole('option', { name: 'Version 2.0' })
    );
    await waitFor(() => expect(field).toHaveTextContent('Version 2.0'));
    await waitFor(() =>
      expect(page.queryByRole('listbox')).not.toBeInTheDocument()
    );

    await userEvent.click(field);
    await userEvent.click(
      await page.findByRole('option', { name: 'Automatic' })
    );
    await waitFor(() => expect(field).toHaveTextContent('Automatic'));
    await waitFor(() =>
      expect(page.queryByRole('listbox')).not.toBeInTheDocument()
    );
  },
};

/** A longer list scrolls after seven and a half rows. */
export const LongList: Story = {
  args: { label: 'Region', placeholder: 'Choose a region', options: REGIONS },
  render: (args) => <Controlled {...args} />,
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Controlled key={size} {...args} size={size} label={size} />
      ))}
    </div>
  ),
};

/** A required field left empty: the asterisk and the error together. */
export const ErrorState: Story = {
  args: {
    required: true,
    isInvalid: true,
    errorText: 'Choose an authentication method.',
  },
  render: (args) => <Controlled {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true, value: 'password' },
  render: (args) => <Controlled {...args} />,
};
