import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { Typography } from '../Typography';
import { SearchField } from './index';

const meta = {
  title: 'Components/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  args: {
    value: '',
    onValueChange: () => {},
    placeholder: 'Search connections…',
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    variant: { control: 'inline-radio', options: ['outline', 'primary'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A search field — not an Autocomplete with parts switched off. It holds a query, not a value: what is typed is the state and the ✕ (`Clear search`) empties it. Alone it is the field a list, a tree or a catalog filters with. With `results` it also offers what matches, in a short list that opens only while something is typed — no chevron, since there is no whole list to browse — at most five and a half rows (`maxVisibleResults`), picked with the pointer or the keys; picking puts the name in the field and calls `onSelect`. The caller matches; the field shows what it is given, or `emptyText`.',
      },
    },
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The field a list filters with: the glyph, the query, the ✕ while there is text. */
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <SearchField {...args} value={value} onValueChange={setValue} />
      </div>
    );
  },
};

/** The size ladder InputGroup has, the glyph following it. */
export const Sizes: Story = {
  render: (args) => {
    const [value, setValue] = useState('Sales');
    return (
      <div className="flex w-80 flex-col gap-3">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <SearchField key={size} {...args} size={size} value={value} onValueChange={setValue} />
        ))}
      </div>
    );
  },
};

const PEOPLE = [
  'Anna Shevchenko',
  'BI & Reporting Analysts',
  'David Miller',
  'External Contractors — Data Migration 2026',
  'Finance & Accounting — EMEA',
  'Iryna Bondar',
  'John Doe',
  'Maria Kovalenko',
  'Oleh Fesenko',
  'Platform Engineering',
  'Sales Operations',
  'Taras Melnyk',
].map((name, i) => ({ id: `p${i}`, label: name }));

/** A search that offers matches — anyone in a directory, found by name. */
export const WithResults: Story = {
  args: { placeholder: 'Search users and groups…', emptyText: 'No user or group matches' },
  render: (args) => {
    const [value, setValue] = useState('');
    const [picked, setPicked] = useState<string | null>(null);
    const results = useMemo(
      () => PEOPLE.filter((p) => p.label.toLowerCase().includes(value.trim().toLowerCase())),
      [value]
    );
    return (
      <div className="flex w-96 flex-col gap-3">
        <SearchField
          {...args}
          value={value}
          onValueChange={setValue}
          onClear={() => setPicked(null)}
          results={results}
          onSelect={(p) => setPicked(p.label)}
        />
        <Typography element="p" textStyle="body14" textColor="secondary">
          {picked ? `Showing ${picked}` : 'Type a name — try “a”.'}
        </Typography>
      </div>
    );
  },
};
