import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useMemo, useState } from 'react';
import { expect, fn, within } from 'storybook/test';
import { TooltipProvider } from '../Tooltip';
import { Typography } from '../Typography';
import { SearchInput } from './index';

/**
 * `SearchInput` is a search field built on `InputGroup`: a leading search icon,
 * the field, and a trailing clear button. The clear button is driven by `value`
 * — it appears only while the field holds text and `onClear` is provided — and
 * returns focus to the field when pressed. The field is controlled by the
 * application through `value` and `onValueChange`.
 *
 * The clear button carries a tooltip, so a `TooltipProvider` must sit above it.
 *
 * With `results` it also offers what matches, in a short list that opens only
 * while something is typed — no chevron, since there is no whole list to
 * browse — at most five and a half rows (`maxVisibleResults`), picked with the
 * pointer or the keys; picking puts the name in the field and calls
 * `onSelect`. The caller matches; the field shows what it is given, or
 * `emptyText`.
 */
const meta = {
  title: 'Compositions/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  args: {
    placeholder: 'Search conversations…',
    clearLabel: 'Clear search',
    size: 'lg',
    onValueChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'inline-radio',
      options: ['outline', 'primary'],
    },
    disabled: { control: 'boolean' },
    value: { control: false },
    onValueChange: { control: false },
    onClear: { control: false },
    onKeyDown: { control: false },
    onSelect: { control: false },
    results: { control: false },
    getResultLabel: { control: false },
    renderResult: { control: false },
    ref: { control: false, table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Holds the value the way an application would, and still reports to the args. */
const ControlledSearchInput = (args: ComponentProps<typeof SearchInput>) => {
  const [value, setValue] = useState(args.value ?? '');

  return (
    <SearchInput
      {...args}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        args.onValueChange?.(next);
      }}
      onClear={() => {
        setValue('');
        args.onClear?.();
      }}
    />
  );
};

/** Empty, the field shows no clear button; typing reveals it. */
export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByRole('searchbox');
    await expect(field).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: 'Clear search' })
    ).toBeNull();

    await userEvent.type(field, 'q');
    await expect(
      await canvas.findByRole('button', { name: 'Clear search' })
    ).toBeVisible();
  },
  render: (args) => (
    <div className="w-72">
      <ControlledSearchInput {...args} />
    </div>
  ),
};

/** With a value the clear button is present, reachable by Tab, and hands focus back to the field. */
export const WithValue: Story = {
  args: { value: 'Q3 KPI' },
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByRole('searchbox');
    const clear = canvas.getByRole('button', { name: 'Clear search' });

    await userEvent.click(field);
    await userEvent.tab();
    await expect(clear).toHaveFocus();
    await expect(
      await within(document.body).findByRole('tooltip')
    ).toHaveTextContent('Clear search');

    await userEvent.click(clear);
    await expect(args.onClear).toHaveBeenCalledOnce();
    await expect(field).toHaveValue('');
    await expect(field).toHaveFocus();
    await expect(
      canvas.queryByRole('button', { name: 'Clear search' })
    ).toBeNull();
  },
  render: (args) => (
    <div className="w-72">
      <ControlledSearchInput {...args} />
    </div>
  ),
};

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * From `sm` up the clear button is a 24px box around a 16px glyph. At `xs`
 * the box is the field's 14px glyph itself, so the ✕ sits 8px in, as the
 * search icon does across from it.
 */
export const Sizes: Story = {
  args: { value: 'Q3 KPI' },
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button', { name: 'Clear search' });
    await expect(buttons).toHaveLength(SIZES.length);

    for (const [index, button] of buttons.entries()) {
      const isXs = SIZES[index] === 'xs';
      const box = button.getBoundingClientRect();
      await expect(box.width).toBe(isXs ? 14 : 24);
      await expect(box.height).toBe(isXs ? 14 : 24);

      const glyph = button.querySelector('svg');
      await expect(glyph).not.toBeNull();
      const glyphBox = glyph?.getBoundingClientRect();
      await expect(glyphBox?.width).toBe(isXs ? 14 : 16);
      await expect(glyphBox?.height).toBe(isXs ? 14 : 16);
    }
  },
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      {SIZES.map((size) => (
        <ControlledSearchInput {...args} key={size} size={size} />
      ))}
    </div>
  ),
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
  args: {
    placeholder: 'Search users and groups…',
    emptyText: 'No user or group matches',
    size: 'md',
  },
  render: (args) => {
    const [value, setValue] = useState('');
    const [picked, setPicked] = useState<string | null>(null);
    const results = useMemo(
      () =>
        PEOPLE.filter((p) =>
          p.label.toLowerCase().includes(value.trim().toLowerCase())
        ),
      [value]
    );
    return (
      <div className="flex w-96 flex-col gap-3">
        <SearchInput
          {...args}
          value={value}
          onValueChange={(next) => {
            setValue(next);
            args.onValueChange?.(next);
          }}
          onClear={() => {
            setValue('');
            setPicked(null);
            args.onClear?.();
          }}
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
