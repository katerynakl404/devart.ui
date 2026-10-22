import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, within } from 'storybook/test';
import { FilterChips } from './index';

const TAGS = [
  { value: 'all', label: 'All' },
  { value: 'artifacts', label: 'Artifacts' },
  { value: 'uploaded', label: 'Uploaded' },
];

const CATEGORIES = [
  { value: 'all', label: 'All', count: 207 },
  { value: '1', label: 'Business Intelligence', count: 18 },
  { value: '2', label: 'Commerce', count: 24 },
  { value: '3', label: 'Communication', count: 11 },
  { value: '4', label: 'IT & Operations', count: 31 },
  { value: '5', label: 'Marketing', count: 42 },
  { value: '6', label: 'Productivity', count: 16 },
  { value: '7', label: 'Sales & CRM', count: 27 },
  { value: '8', label: 'Storage & Files', count: 9 },
  { value: '9', label: 'Support', count: 0 },
];

/**
 * `FilterChips` is a single-select filter strip. Below `md` it is one
 * horizontally scrolling row with a fade at the overflowing edge; from `md` up
 * it wraps.
 *
 * It is fully controlled and holds no state, so the selection can live in a URL
 * parameter or a store without the strip knowing which. Toggling the active
 * chip off reports `''` — a strip that must always have a selection ignores
 * that rather than storing it.
 */
const meta = {
  title: 'Compositions/FilterChips',
  component: FilterChips,
  tags: ['autodocs'],
  args: {
    items: TAGS,
    value: 'all',
    onValueChange: fn(),
  },
  argTypes: {
    items: { control: false },
    onValueChange: { control: false },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FilterChips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole('radio', { name: 'All' })).toBeChecked();
    await expect(
      canvas.getByRole('radio', { name: 'Uploaded' })
    ).not.toBeChecked();

    await userEvent.click(canvas.getByRole('radio', { name: 'Uploaded' }));
    await expect(args.onValueChange).toHaveBeenCalledWith('uploaded');

    // Toggling the active chip off is reported as `''`; the caller decides.
    await userEvent.click(canvas.getByRole('radio', { name: 'All' }));
    await expect(args.onValueChange).toHaveBeenCalledWith('');
    await expect(args.onValueChange).toHaveBeenCalledTimes(2);
  },
};

/** `count` is rendered whenever it is present — including `0`. */
export const WithCounts: Story = {
  args: { items: CATEGORIES, value: 'all' },
  play: async ({ canvas }) => {
    const support = canvas.getByRole('radio', { name: /^Support/ });
    await expect(within(support).getByText('0')).toBeVisible();
  },
};

/** Narrow enough to overflow: one row, scrolled, with the edge fade. */
export const Overflowing: Story = {
  args: { items: CATEGORIES, value: '5' },
  render: (args) => (
    <div className="w-80 rounded-lg border border-stroke p-3">
      <FilterChips {...args} />
    </div>
  ),
};

/** Wired to state, so selection and the deselect-to-`''` case are visible. */
export const Interactive: Story = {
  play: async ({ canvas, userEvent }) => {
    const all = canvas.getByRole('radio', { name: /^All/ });
    const marketing = canvas.getByRole('radio', { name: /^Marketing/ });
    await expect(all).toBeChecked();

    await userEvent.click(marketing);
    await expect(marketing).toBeChecked();
    await expect(all).not.toBeChecked();

    // A second click would deselect; the story ignores `''`, so it stays on.
    await userEvent.click(marketing);
    await expect(marketing).toBeChecked();
  },
  render: (args) => {
    const [value, setValue] = useState('all');

    return (
      <FilterChips
        {...args}
        items={CATEGORIES}
        value={value}
        // Ignoring the empty value is what keeps a filter always-selected.
        onValueChange={(next) => next && setValue(next)}
      />
    );
  },
};
