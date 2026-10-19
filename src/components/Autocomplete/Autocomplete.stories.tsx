import type { Meta, StoryObj } from '@storybook/react-vite';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { expect, fn, waitFor, within } from 'storybook/test';
import { Autocomplete } from './index';

interface Option {
  id: string;
  label: string;
}

const CITIES: Option[] = [
  { id: 'ny', label: 'New York' },
  { id: 'ldn', label: 'London' },
  { id: 'tky', label: 'Tokyo' },
  { id: 'par', label: 'Paris' },
  { id: 'ber', label: 'Berlin' },
  { id: 'syd', label: 'Sydney' },
  { id: 'mel', label: 'Melbourne' },
];

const getOptionLabel = (option: Option) => option.label;

const meta = {
  title: 'Components/Autocomplete',
  component: Autocomplete<Option>,
  tags: ['autodocs'],
  args: {
    label: 'City',
    placeholder: 'Search cities…',
    size: 'lg',
    badgeVariant: 'secondary',
    isMultipleSelect: false,
    isLoading: false,
    disabled: false,
    readOnly: false,
    disableClearable: false,
    disableFiltering: false,
    // Data lives in args so the required `options` prop is satisfied; renders
    // may still override it (e.g. NoResults passes an empty list).
    options: CITIES,
    getOptionLabel,
    onChange: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    badgeVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'attention', 'success', 'error'],
    },
    options: { control: false },
    value: { control: false },
    defaultValue: { control: false },
    renderOption: { control: false },
    renderBadge: { control: false },
    getOptionLabel: { control: false },
    filterOptions: { control: false },
    startAddon: { control: false },
    endAddon: { control: false },
    label: { control: false },
    noOptionsText: { control: false },
    loadingText: { control: false },
    onChange: { control: false, table: { disable: true } },
    ref: { control: false, table: { disable: true } },
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Autocomplete<Option>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The popup renders in a portal, so it lives outside the story canvas. */
const popup = () => within(document.body);

const openMenu = async (
  canvas: ReturnType<typeof within>,
  userEvent: { click: (element: Element) => Promise<void> }
) => {
  const input = canvas.getByRole('combobox');
  await userEvent.click(input);
  await expect(await popup().findByRole('listbox')).toBeInTheDocument();
  return input;
};

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = await openMenu(canvas, userEvent);

    await expect(await popup().findAllByRole('option')).toHaveLength(7);

    await userEvent.type(input, 'lo');
    // `findAll` resolves on the list that is already open — wait for the
    // filtered one instead.
    await waitFor(() => expect(popup().getAllByRole('option')).toHaveLength(1));
    const matches = popup().getAllByRole('option');
    await expect(matches[0]).toHaveTextContent('London');

    await userEvent.click(matches[0] as HTMLElement);
    await expect(input).toHaveValue('London');
    await expect(popup().queryByRole('listbox')).not.toBeInTheDocument();
  },
  render: (args) => {
    const [value, setValue] = useState<Option | null>(null);
    return (
      <Autocomplete<Option>
        {...args}
        value={value}
        onChange={(_event, next) => setValue(next)}
      />
    );
  },
};

export const WithSelection: Story = {
  /**
   * Reopening with a selection shows the whole list, not the one option whose
   * label happens to sit in the input — see `useFilteredOptions`.
   */
  play: async ({ canvas, userEvent }) => {
    await openMenu(canvas, userEvent);
    await expect(await popup().findAllByRole('option')).toHaveLength(7);
  },
  render: (args) => {
    const [value, setValue] = useState<Option | null>(CITIES[1] ?? null);
    return (
      <Autocomplete<Option>
        {...args}
        value={value}
        onChange={(_event, next) => setValue(next)}
      />
    );
  },
};

// Multi-select mode: `value` becomes `Option[]`, tags render as removable
// badges. Typed against the `Multiple = true` instantiation.
export const MultipleSelect: StoryObj<typeof Autocomplete<Option, true>> = {
  args: { isMultipleSelect: true, label: 'Cities', options: CITIES },
  play: async ({ canvas, userEvent }) => {
    const input = await openMenu(canvas, userEvent);

    // Chosen options stay in the list — `filterSelectedOptions` is off by
    // default, so all seven remain offered and the two picked ones read as
    // selected.
    await expect(await popup().findAllByRole('option')).toHaveLength(7);

    await userEvent.type(input, 'tok');
    await waitFor(() => expect(popup().getAllByRole('option')).toHaveLength(1));
    await userEvent.click(popup().getByRole('option', { name: 'Tokyo' }));

    await expect(input).toHaveValue('');
    await expect(canvas.getByText('Tokyo')).toBeInTheDocument();

    // Backspace on an empty input removes the badge nearest the caret.
    await userEvent.click(input);
    await userEvent.keyboard('{Backspace}');
    await expect(canvas.queryByText('Tokyo')).not.toBeInTheDocument();
  },
  render: (args) => {
    const [value, setValue] = useState<Option[]>(CITIES.slice(0, 2));
    return (
      <div className="w-80">
        <Autocomplete<Option, true>
          {...args}
          isMultipleSelect
          getOptionLabel={getOptionLabel}
          value={value}
          onChange={(_event, next) => setValue(next)}
        />
      </div>
    );
  },
};

export const WithStartAddon: Story = {
  render: (args) => {
    const [value, setValue] = useState<Option | null>(null);
    return (
      <Autocomplete<Option>
        {...args}
        startAddon={<MapPin className="size-4 text-ink-secondary" />}
        value={value}
        onChange={(_event, next) => setValue(next)}
      />
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: CITIES[0] ?? null },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox')).toBeDisabled();
    await expect(popup().queryByRole('listbox')).not.toBeInTheDocument();
  },
};

/**
 * The reference composition: multi-select with the listbox open. `open` is a
 * controlled prop, so the list — and `autoHighlight`'s highlighted option, which
 * paints `State/Hover` — stay visible in a static story. The listbox portals to
 * `document.body`, hence the reserved height below the field.
 */
export const MultipleSelectOpen: StoryObj<typeof Autocomplete<Option, true>> = {
  args: { isMultipleSelect: true, label: 'Cities', options: CITIES },
  decorators: [
    (Story) => (
      <div className="h-80 w-80">
        <Story />
      </div>
    ),
  ],
  render: (args) => {
    const [value, setValue] = useState<Option[]>(CITIES.slice(0, 2));
    return (
      <Autocomplete<Option, true>
        {...args}
        autoHighlight
        getOptionLabel={getOptionLabel}
        isMultipleSelect
        onChange={(_event, next) => setValue(next)}
        open
        value={value}
      />
    );
  },
};

// Empty options list -> `noOptionsText` renders inside the open listbox.
export const NoResults: Story = {
  args: { open: true, options: [], noOptionsText: 'No cities found' },
  // The story holds the popup open, so there is nothing to click first.
  play: async () => {
    const empty = await popup().findByText('No cities found');
    // `listbox` must contain options, so the message announces as one that
    // cannot be picked rather than as stray text inside a list.
    await expect(empty).toHaveAttribute('role', 'option');
    await expect(empty).toHaveAttribute('aria-disabled', 'true');
    await expect(popup().queryAllByRole('option')).toHaveLength(1);
  },
  decorators: [
    (Story) => (
      <div className="h-48 w-80">
        <Story />
      </div>
    ),
  ],
};

export const Loading: Story = {
  args: { open: true, isLoading: true, loadingText: 'Loading cities…' },
  decorators: [
    (Story) => (
      <div className="h-48 w-80">
        <Story />
      </div>
    ),
  ],
};
