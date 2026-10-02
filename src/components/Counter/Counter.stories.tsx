import type { Meta, StoryObj } from '@storybook/react-vite';
import { Counter } from './index';

const meta = {
  title: 'Components/Counter',
  component: Counter,
  tags: ['autodocs'],
  args: { children: '2', active: false },
  argTypes: {
    active: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A small round count. Not a Badge: a badge labels a thing and sizes itself to its label, so it is a pill; this holds a number and keeps a 1:1 box, because a column of counts has to read as a column. Default is quiet — a count is content, not a status. `active` means one thing only: this is moving on its own right now.',
      },
    },
  },
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = { args: { active: true } };

/** Both states beside each other, and the digits that prove the box does not stretch. */
export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Counter>1</Counter>
      <Counter>10</Counter>
      <Counter active>1</Counter>
      <Counter active>10</Counter>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A second digit does not widen the box — the same rule every mark in the kit follows. If a count outgrows it, the box grows on BOTH axes or the count is abbreviated; it never becomes an oval.',
      },
    },
  },
};

/** Both steps, and the thing each one sits next to. A size is only right relative to its
 *  neighbour, so neither is shown on its own. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Counter size="md">3</Counter>
        <span className="text-ink-body text-sm">
          md — beside 14px body text in a list row
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Counter size="sm">3</Counter>
        <span className="text-ink-body text-sm">
          sm — beside a 14px nav label, where md reads as a token dropped on the row
        </span>
      </div>
      <div className="flex items-center gap-4 border-stroke border-t pt-4">
        <Counter size="md">3</Counter>
        <Counter size="sm">3</Counter>
        <Counter size="md" active>
          3
        </Counter>
        <Counter size="sm" active>
          3
        </Counter>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Two steps and no more, because the same count sits beside two different line heights. The step is chosen by what the counter stands next to, not by how important the number is.',
      },
    },
  },
};

/** In place: the two readings it carries in a list of chats. */
export const InAList: Story = {
  render: () => (
    <div className="flex w-56 flex-col gap-1">
      {[
        ['Q1 revenue commentary', 2, false],
        ['Churn deep-dive', 3, true],
        ['Onboarding cohort', 1, false],
      ].map(([label, n, active]) => (
        <div
          key={label as string}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-ink-body text-sm hover:bg-state-hover"
        >
          <span className="min-w-0 flex-1 truncate">{label as string}</span>
          <Counter active={active as boolean}>{n as number}</Counter>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Quiet where the queue is parked, filled where it is still sending. The colour carries the state of that queue — not which row is selected, which the row itself already shows.',
      },
    },
  },
};
