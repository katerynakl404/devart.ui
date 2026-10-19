import type { Meta, StoryObj } from '@storybook/react-vite';
import { Download, Share2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { expect, fn } from 'storybook/test';
import { Button } from '../Button';
import { TooltipProvider } from '../Tooltip';
import { ListSelectionBar } from './index';

/**
 * `ListSelectionBar` is the header of a multi-select list. It swaps `title`
 * for `selectedText` once anything is selected, flips its link between
 * select-all and deselect-all, and only then reveals the exit control.
 *
 * Both captions arrive already formatted: pluralisation and counting belong to
 * the application, so the bar never needs to know how to say "3 of 40".
 */
const meta = {
  title: 'Components/ListSelectionBar',
  component: ListSelectionBar,
  tags: ['autodocs'],
  args: {
    title: '24 files',
    selectedText: '3 selected',
    isPending: false,
    selectedCount: 0,
    allSelected: false,
    isEmpty: false,
    sticky: false,
    onClearSelection: fn(),
    onSelectAll: fn(),
  },
  argTypes: {
    selectedCount: { control: { type: 'number', min: 0 } },
    rightSlot: { control: false },
    onClearSelection: { control: false },
    onSelectAll: { control: false },
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="w-full max-w-2xl">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof ListSelectionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText('24 files')).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: 'Exit selection' })
    ).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Select all' }));
    await expect(args.onSelectAll).toHaveBeenCalledOnce();
    await expect(args.onClearSelection).not.toHaveBeenCalled();
  },
};

/** With a selection the caption swaps and the exit control appears. */
export const Selecting: Story = {
  args: { selectedCount: 3 },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText('3 selected')).toBeVisible();
    await expect(canvas.queryByText('24 files')).not.toBeInTheDocument();
    // Not everything is selected yet, so the link still offers select-all.
    await expect(
      canvas.getByRole('button', { name: 'Select all' })
    ).toBeEnabled();

    await userEvent.click(
      canvas.getByRole('button', { name: 'Exit selection' })
    );
    await expect(args.onClearSelection).toHaveBeenCalledOnce();
    await expect(args.onSelectAll).not.toHaveBeenCalled();
  },
};

/** Everything selected — the link becomes deselect-all. */
export const AllSelected: Story = {
  args: { selectedCount: 24, selectedText: '24 selected', allSelected: true },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText('24 selected')).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: 'Select all' })
    ).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Deselect all' }));
    await expect(args.onClearSelection).toHaveBeenCalledOnce();
    await expect(args.onSelectAll).not.toHaveBeenCalled();
  },
};

/** Nothing to select: the link is disabled rather than hidden. */
export const EmptyList: Story = {
  args: { title: '0 files', isEmpty: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('0 files')).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Select all' })
    ).toBeDisabled();
  },
};

/** While counts are loading the caption is a skeleton and the link is absent. */
export const Pending: Story = {
  args: { isPending: true },
  play: async ({ canvas }) => {
    // The caption keeps its footprint under the skeleton but is not shown.
    await expect(canvas.getByText('24 files')).not.toBeVisible();
    await expect(
      canvas.queryAllByRole('button', { hidden: true })
    ).toHaveLength(0);
  },
};

/** `rightSlot` is the application's — it may hold actions with no selection. */
export const WithActions: Story = {
  args: {
    selectedCount: 3,
    rightSlot: (
      <div className="flex items-center gap-2">
        <Button variant="transparent" size="xs" leftSlot={<Share2 />}>
          Share
        </Button>
        <Button variant="transparent" size="xs" leftSlot={<Download />}>
          Download
        </Button>
        <Button variant="destructiveTertiary" size="xs" leftSlot={<Trash2 />}>
          Delete
        </Button>
      </div>
    ),
  },
};

/**
 * `sticky` pins the bar; `stickyOffset` is any CSS length, so a page whose own
 * header is sticky passes that header's height — as a custom property here.
 */
export const Sticky: Story = {
  args: { selectedCount: 3, sticky: true, stickyOffset: '2.5rem' },
  render: (args) => (
    <div className="h-64 overflow-y-auto rounded-lg border border-stroke">
      <div className="sticky top-0 z-20 flex h-10 items-center bg-surface-card px-3 text-ink-secondary text-sm">
        Page header (2.5rem tall)
      </div>
      <div className="px-3">
        <ListSelectionBar {...args} />
        <div className="flex flex-col gap-2 py-2">
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={`row-${index + 1}`}
              className="rounded-md border border-stroke px-3 py-2 text-ink-body text-sm"
            >
              Row {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Wired to real state, so the caption and link transitions are visible. */
export const Interactive: Story = {
  render: (args) => {
    const total = 5;
    const [selected, setSelected] = useState(0);

    return (
      <ListSelectionBar
        {...args}
        title={`${total} files`}
        selectedText={`${selected} selected`}
        selectedCount={selected}
        allSelected={selected === total}
        onSelectAll={() => setSelected(total)}
        onClearSelection={() => setSelected(0)}
        rightSlot={
          selected === 0 && (
            <Button variant="outline" size="xs" onClick={() => setSelected(1)}>
              Select one
            </Button>
          )
        }
      />
    );
  },
};
