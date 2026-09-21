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
  args: { variant: 'cluster' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['cluster', 'split'] },
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
