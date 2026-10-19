import type { Meta, StoryObj } from '@storybook/react-vite';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { LinkButton } from '../LinkButton';
import { MetaRow } from './index';

const meta = {
  title: 'Components/MetaRow',
  component: MetaRow,
  tags: ['autodocs'],
  args: { variant: 'cluster', sticky: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['cluster', 'split'] },
    sticky: { control: 'boolean' },
    stickyOffset: { control: 'text' },
  },
} satisfies Meta<typeof MetaRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MetaRow {...args}>
      <MetaRow.Count>5 connections</MetaRow.Count>
      <LinkButton>Select all</LinkButton>
    </MetaRow>
  ),
};

/** With a selection: the reading changes and the actions arrive at the end. */
export const WithSelection: Story = {
  render: (args) => (
    <MetaRow {...args}>
      <MetaRow.Count>3 selected</MetaRow.Count>
      <LinkButton>Deselect all</LinkButton>
      <MetaRow.End>
        <Button size="sm" variant="destructiveTertiary" leftSlot={<Trash2 />}>
          Delete
        </Button>
      </MetaRow.End>
    </MetaRow>
  ),
};

/**
 * The spacing contract. The row carries its own 6px and a 44px floor; the list
 * below takes **4px** and nothing else. One gap, in one place.
 */
export const AboveAList: Story = {
  render: () => {
    return (
      <div className="flex w-full max-w-2xl flex-col gap-1">
        <MetaRow>
          <MetaRow.Count>3 connections</MetaRow.Count>
          <LinkButton>Select all</LinkButton>
        </MetaRow>
        <Card variant="outline" className="gap-0 p-0">
          {['DB2', 'PostgreSQL', 'Salesforce'].map((n) => (
            <div
              className="border-stroke border-b p-4 text-sm last:border-b-0"
              key={n}
            >
              {n}
            </div>
          ))}
        </Card>
      </div>
    );
  },
};

/** The action belongs on the far edge rather than beside the count. */
export const Split: Story = {
  args: { variant: 'split' },
  render: (args) => (
    <MetaRow {...args} className="w-full max-w-2xl">
      <MetaRow.Count>12 conversations</MetaRow.Count>
      <LinkButton>Deselect all</LinkButton>
    </MetaRow>
  ),
};

/**
 * The row does not move when its actions appear — that is what the 44px floor
 * is for. Toggle the selection and watch the list below stay put.
 */
export const StableHeight: Story = {
  render: () => {
    const [on, setOn] = useState(false);
    return (
      <div className="flex w-full max-w-2xl flex-col gap-1">
        <MetaRow>
          <MetaRow.Count>{on ? '2 selected' : '5 connections'}</MetaRow.Count>
          <LinkButton onClick={() => setOn((v) => !v)}>
            {on ? 'Deselect all' : 'Select all'}
          </LinkButton>
          {on ? (
            <MetaRow.End>
              <Button
                size="sm"
                variant="destructiveTertiary"
                leftSlot={<Trash2 />}
              >
                Delete
              </Button>
            </MetaRow.End>
          ) : null}
        </MetaRow>
        <Card variant="outline" className="p-4 text-sm">
          The list starts here, 4px under the row, either way.
        </Card>
      </div>
    );
  },
};

const ROWS = Array.from({ length: 24 }, (_, i) => `Conversation ${i + 1}`);

/**
 * `sticky`: the row pins to the top of the scroller while the list runs under
 * it, so the count and the selection actions stay in reach. It takes the page
 * colour so the rows passing behind it do not show through. Scroll the box.
 *
 * Sticky only while selecting is the usual shape — `sticky={selected > 0}` —
 * so a list nobody is acting on scrolls away like any other content.
 */
export const Sticky: Story = {
  args: { sticky: true },
  render: (args) => (
    <div className="h-72 w-full max-w-2xl overflow-y-auto bg-surface-page px-4">
      <div className="flex flex-col gap-1">
        <MetaRow {...args}>
          <MetaRow.Count>3 selected</MetaRow.Count>
          <LinkButton>Select all</LinkButton>
          <MetaRow.End>
            <Button
              size="sm"
              variant="destructiveTertiary"
              leftSlot={<Trash2 />}
            >
              Delete
            </Button>
          </MetaRow.End>
        </MetaRow>
        <div className="flex flex-col gap-1.5 pb-4">
          {ROWS.map((name) => (
            <Card key={name} variant="row" fullWidth>
              {name}
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
};

/**
 * `stickyOffset`: under a header that is itself sticky, the row pins below it
 * rather than behind it. The page passes its header's height as a CSS length.
 */
export const StickyUnderAHeader: Story = {
  args: { sticky: true, stickyOffset: '3rem' },
  render: (args) => (
    <div className="h-72 w-full max-w-2xl overflow-y-auto bg-surface-page px-4">
      <div className="sticky top-0 z-20 flex h-12 items-center bg-surface-page font-semibold text-base text-ink-primary">
        Chats
      </div>
      <div className="flex flex-col gap-1">
        <MetaRow {...args}>
          <MetaRow.Count>24 conversations</MetaRow.Count>
          <LinkButton>Select all</LinkButton>
        </MetaRow>
        <div className="flex flex-col gap-1.5 pb-4">
          {ROWS.map((name) => (
            <Card key={name} variant="row" fullWidth>
              {name}
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
};
