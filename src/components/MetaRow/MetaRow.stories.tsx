import type { Meta, StoryObj } from '@storybook/react-vite';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { expect, userEvent } from 'storybook/test';
import { Button } from '../Button';
import { Card } from '../Card';
import { LinkButton } from '../LinkButton';
import { TooltipProvider } from '../Tooltip';
import {
  MetaRow,
  MetaRowActions,
  MetaRowCount,
  type MetaRowProps,
} from './index';

const meta = {
  title: 'Compositions/MetaRow',
  component: MetaRow,
  tags: ['autodocs'],
  args: { align: 'start', sticky: false },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'between'] },
    sticky: { control: 'boolean' },
    stickyOffset: { control: 'text' },
  },
  // The ✕ that `onClear` renders sits in a Radix tooltip.
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof MetaRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROWS = Array.from({ length: 24 }, (_, i) => `Conversation ${i + 1}`);
const CONNECTIONS = ['DB2', 'MySQL', 'PostgreSQL', 'Salesforce', 'Snowflake'];

type PlaygroundArgs = MetaRowProps & { selected: number; clearable: boolean };

/** Change the selection in Controls, or with "Select all" and the ✕. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { selected: 0, clearable: true },
  argTypes: {
    selected: {
      control: { type: 'range', min: 0, max: CONNECTIONS.length },
    },
    clearable: { control: 'boolean' },
  },
  render: function Render({ selected, clearable, ...args }) {
    const [, updateArgs] = useArgs<PlaygroundArgs>();
    const all = selected === CONNECTIONS.length;
    const clear = () => updateArgs({ selected: 0 });

    return (
      <div className="flex w-full max-w-2xl flex-col gap-1">
        <MetaRow
          {...args}
          onClear={clearable && selected > 0 ? clear : undefined}
        >
          <MetaRowCount>
            {selected > 0
              ? `${selected} selected`
              : `${CONNECTIONS.length} connections`}
          </MetaRowCount>
          <LinkButton
            onClick={() =>
              updateArgs({ selected: all ? 0 : CONNECTIONS.length })
            }
          >
            {all ? 'Deselect all' : 'Select all'}
          </LinkButton>
          {selected > 0 ? (
            <MetaRowActions>
              <Button
                size="sm"
                variant="destructiveTertiary"
                leftSlot={<Trash2 />}
              >
                Delete
              </Button>
            </MetaRowActions>
          ) : null}
        </MetaRow>
        <Card variant="outline" className="gap-0 bg-surface-card p-0">
          {CONNECTIONS.map((name) => (
            <div
              className="border-stroke border-b p-4 text-sm last:border-b-0"
              key={name}
            >
              {name}
            </div>
          ))}
        </Card>
      </div>
    );
  },
};

export const Default: Story = {
  render: (args) => (
    <MetaRow {...args}>
      <MetaRowCount>5 connections</MetaRowCount>
      <LinkButton>Select all</LinkButton>
    </MetaRow>
  ),
};

/** With a selection: the reading changes and the actions arrive at the end. */
export const WithSelection: Story = {
  render: (args) => (
    <MetaRow {...args}>
      <MetaRowCount>3 selected</MetaRowCount>
      <LinkButton>Deselect all</LinkButton>
      <MetaRowActions>
        <Button size="sm" variant="destructiveTertiary" leftSlot={<Trash2 />}>
          Delete
        </Button>
      </MetaRowActions>
    </MetaRow>
  ),
};

/** The spacing contract. The row carries its own 6px and a 44px floor; the list
 *  below takes **4px** and nothing else. One gap, in one place. */
export const AboveAList: Story = {
  render: () => (
    <div className="flex w-full max-w-2xl flex-col gap-1">
      <MetaRow>
        <MetaRowCount>3 connections</MetaRowCount>
        <LinkButton>Select all</LinkButton>
      </MetaRow>
      <Card variant="outline" className="gap-0 bg-surface-card p-0">
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
  ),
};

/** The action belongs on the far edge rather than beside the count. */
export const Between: Story = {
  args: { align: 'between' },
  render: (args) => (
    <MetaRow {...args} className="w-full max-w-2xl">
      <MetaRowCount>12 conversations</MetaRowCount>
      <LinkButton>Deselect all</LinkButton>
    </MetaRow>
  ),
};

/** The row does not move when its actions appear — that is what the 44px floor
 *  is for. Toggle the selection and watch the list below stay put. */
export const StableHeight: Story = {
  render: () => {
    const [on, setOn] = useState(false);
    return (
      <div className="flex w-full max-w-2xl flex-col gap-1">
        <MetaRow>
          <MetaRowCount>{on ? '2 selected' : '5 connections'}</MetaRowCount>
          <LinkButton onClick={() => setOn((v) => !v)}>
            {on ? 'Deselect all' : 'Select all'}
          </LinkButton>
          {on ? (
            <MetaRowActions>
              <Button
                size="sm"
                variant="destructiveTertiary"
                leftSlot={<Trash2 />}
              >
                Delete
              </Button>
            </MetaRowActions>
          ) : null}
        </MetaRow>
        <Card variant="outline" className="bg-surface-card p-4 text-sm">
          The list starts here, 4px under the row, either way.
        </Card>
      </div>
    );
  },
};

/** `sticky`: the row pins to the top of the scroller while the list runs under
 *  it, so the count and the selection actions stay in reach. It takes the page
 *  colour so the rows passing behind it do not show through. Scroll the box.
 *
 *  Sticky only while selecting is the usual shape — `sticky={selected > 0}` —
 *  so a list nobody is acting on scrolls away like any other content. */
export const Sticky: Story = {
  args: { sticky: true },
  render: (args) => (
    <div className="h-72 w-full max-w-2xl overflow-y-auto bg-surface-page px-4">
      <div className="flex flex-col gap-1">
        <MetaRow {...args}>
          <MetaRowCount>3 selected</MetaRowCount>
          <LinkButton>Select all</LinkButton>
          <MetaRowActions>
            <Button
              size="sm"
              variant="destructiveTertiary"
              leftSlot={<Trash2 />}
            >
              Delete
            </Button>
          </MetaRowActions>
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

/** `stickyOffset`: under a header that is itself sticky, the row pins below it
 *  rather than behind it. The page passes its header's height as a CSS length. */
export const StickyUnderAHeader: Story = {
  args: { sticky: true, stickyOffset: '3rem' },
  render: (args) => (
    <div className="h-72 w-full max-w-2xl overflow-y-auto bg-surface-page px-4">
      <div className="sticky top-0 z-20 flex h-12 items-center bg-surface-page font-semibold text-base text-ink-primary">
        Chats
      </div>
      <div className="flex flex-col gap-1">
        <MetaRow {...args}>
          <MetaRowCount>24 conversations</MetaRowCount>
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

/** Test only — kept out of the sidebar and the docs page, so `StableHeight`
 *  shows the same code as the design kit. Proves the 44px floor: the list
 *  below must not move when the selection brings the actions in. */
export const StableHeightCheck: Story = {
  tags: ['!dev', '!autodocs'],
  render: StableHeight.render,
  play: async ({ canvas }) => {
    const list = canvas.getByText(/The list starts here/);
    const before = list.getBoundingClientRect().top;

    await userEvent.click(canvas.getByRole('button', { name: 'Select all' }));
    await expect(
      canvas.getByRole('button', { name: 'Delete' })
    ).toBeInTheDocument();
    await expect(list.getBoundingClientRect().top).toBe(before);
  },
};
