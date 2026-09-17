import type { Meta, StoryObj } from '@storybook/react-vite';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';
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

export const Default: Story = {
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

/**
 * Dark theme — every state the component ships, on one dark surface. Tokens
 * are pure CSS cascade, so a scoped `.dark` re-themes the whole subtree with
 * no provider and no props.
 */
export const DarkTheme = {
  render: (args, ctx) => {
    const cells: [string, Story][] = [
      ['Default', Default],
      ['With Selection', WithSelection],
      ['With Start Addon', WithStartAddon],
      ['Disabled', Disabled],
      ['No Results', NoResults],
      ['Loading', Loading],
    ];
    return (
      <div className="dark grid gap-6 rounded-lg bg-surface-page p-6">
        {cells.map(([name, story]) => (
          <section className="flex flex-col gap-2" key={name}>
            <span className="font-medium text-ink-secondary text-xxs uppercase leading-4 tracking-caps">
              {name}
            </span>
            {story.render ? (
              story.render({ ...args, ...story.args } as never, ctx)
            ) : (
              null
            )}
          </section>
        ))}
      </div>
    );
  },
} as Story;
