import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, waitFor, within } from 'storybook/test';
import {
  Select,
  type SelectOption,
  type SelectOptionBase,
  type SelectProps,
} from './index';

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
    required: false,
    value: null,
    onValueChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    value: { control: 'text' },
    options: { control: false },
    onValueChange: { control: false },
    getOptionLabel: { control: false },
    getOptionDisabled: { control: false },
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

type SelectArgs = SelectProps<SelectOptionBase>;

type ArgsSelectProps = SelectArgs & {
  updateArgs: (args: Partial<SelectArgs>) => void;
};

/**
 * `value` follows the args both ways: a pick updates the Controls panel, and a
 * value typed there updates the field. The local copy keeps the field live
 * where nothing re-renders the story on `updateArgs` (the test runner).
 */
function ArgsSelect({ updateArgs, ...args }: ArgsSelectProps) {
  const [value, setValue] = useState<string | null>(args.value ?? null);

  useEffect(() => {
    setValue(args.value ?? null);
  }, [args.value]);

  return (
    <Select
      {...args}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        args.onValueChange?.(next);
        updateArgs({ value: next });
      }}
    />
  );
}

// Storybook hooks run only in a story's render function, so `useArgs` lives
// here and the React state in ArgsSelect
const renderSelect: Story['render'] = function Render(args) {
  const [, updateArgs] = useArgs<SelectArgs>();
  return <ArgsSelect {...args} updateArgs={updateArgs} />;
};

/** Nothing chosen: the placeholder. A pick closes the list. */
export const Default: Story = {
  render: renderSelect,
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
  },
};

/** The chosen option is marked in the list; Escape closes it. */
export const WithValue: Story = {
  args: { value: 'key' },
  render: renderSelect,
  play: async ({ canvas, userEvent }) => {
    const page = within(document.body);
    await userEvent.click(
      canvas.getByRole('combobox', { name: 'Authentication' })
    );
    await expect(
      await page.findByRole('option', { name: 'Public key' })
    ).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(page.queryByRole('listbox')).not.toBeInTheDocument()
    );
  },
};

/** The clear button empties the field without opening the list. */
export const Clearable: Story = {
  args: { value: 'key', clearable: true },
  render: renderSelect,
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

/**
 * The clear button acts on a click, like any button: a screen-reader or
 * scripted click clears, a right-click does not.
 */
export const ClearOnClick: Story = {
  args: { value: 'key', clearable: true },
  render: renderSelect,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Authentication' });
    const clear = canvas.getByRole('button', { name: 'Clear selection' });

    await userEvent.pointer({ keys: '[MouseRight]', target: clear });
    await expect(trigger, 'a right-click keeps the value').toHaveTextContent(
      'Public key'
    );

    clear.click();
    await waitFor(() => expect(trigger).toHaveTextContent('Choose a method'));
  },
};

/** A value missing from `options` shows the placeholder, as `null` does. */
export const UnknownValue: Story = {
  args: { value: 'removed' },
  render: renderSelect,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Authentication' });
    await expect(trigger).toHaveTextContent('Choose a method');
    await expect(trigger).toHaveAttribute('data-placeholder');
  },
};

/** Asterisk on the label, announced as required; no clear button. */
export const Required: Story = {
  args: { value: 'key', clearable: true, required: true },
  render: renderSelect,
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
  render: function Render(args) {
    const [, updateArgs] = useArgs<SelectArgs>();
    return (
      <form aria-label="Connection">
        <ArgsSelect {...args} updateArgs={updateArgs} />
      </form>
    );
  },
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
  render: renderSelect,
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
  render: renderSelect,
};

export const Sizes: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs<SelectArgs>();
    return (
      <div className="flex flex-col gap-4">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <ArgsSelect
            key={size}
            {...args}
            size={size}
            label={size}
            updateArgs={updateArgs}
          />
        ))}
      </div>
    );
  },
};

/** A required field left empty: the asterisk and the error together. */
export const ErrorState: Story = {
  args: {
    required: true,
    isInvalid: true,
    errorText: 'Choose an authentication method.',
  },
  render: renderSelect,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Authentication' });
    const group = trigger.closest('[data-slot=input-group]') as HTMLElement;
    const errorBorder = getComputedStyle(group).borderColor;

    // Keyboard open with the pointer away, so no hover rule paints the border
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await within(document.body).findByRole('listbox');
    // Past the border colour transition
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(
      getComputedStyle(group).borderColor,
      'the error border stays while the list is open'
    ).toBe(errorBorder);
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        within(document.body).queryByRole('listbox')
      ).not.toBeInTheDocument()
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'password' },
  render: renderSelect,
};
