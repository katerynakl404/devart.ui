import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FilterChip, FilterChips } from './index';

const meta = {
  title: 'Components/FilterChips',
  component: FilterChips,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: { asChild: { table: { disable: true } } },
} satisfies Meta<typeof FilterChips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('all');
    return (
      <FilterChips {...args} value={value} onValueChange={setValue}>
        <FilterChip value="all">All</FilterChip>
        <FilterChip value="artifacts">Artifacts</FilterChip>
        <FilterChip value="uploaded">Uploaded</FilterChip>
      </FilterChips>
    );
  },
};

/** The count is optional, and `0` renders — only `undefined` hides it. */
export const WithCounts: Story = {
  render: (args) => {
    const [value, setValue] = useState('all');
    return (
      <FilterChips {...args} value={value} onValueChange={setValue}>
        <FilterChip count={24} value="all">
          All
        </FilterChip>
        <FilterChip count={11} value="artifacts">
          Artifacts
        </FilterChip>
        <FilterChip count={13} value="uploaded">
          Uploaded
        </FilterChip>
        <FilterChip count={0} value="shared">
          Shared
        </FilterChip>
      </FilterChips>
    );
  },
};

/** `sm` (28px) for a dense toolbar, `md` (32px) at page level. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <FilterChips defaultValue="all" size="sm">
        <FilterChip count={24} size="sm" value="all">
          All
        </FilterChip>
        <FilterChip count={11} size="sm" value="artifacts">
          Artifacts
        </FilterChip>
      </FilterChips>
      <FilterChips defaultValue="all" size="md">
        <FilterChip count={24} size="md" value="all">
          All
        </FilterChip>
        <FilterChip count={11} size="md" value="artifacts">
          Artifacts
        </FilterChip>
      </FilterChips>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <FilterChips {...args} defaultValue="all">
      <FilterChip value="all">All</FilterChip>
      <FilterChip value="artifacts">Artifacts</FilterChip>
      <FilterChip disabled value="archived">
        Archived
      </FilterChip>
    </FilterChips>
  ),
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
      ['With Counts', WithCounts],
      ['Sizes', Sizes],
      ['Disabled', Disabled],
    ];
    return (
      <div className="dark grid gap-6 rounded-lg bg-surface-page p-6">
        {cells.map(([name, story]) => (
          <section className="flex flex-col gap-2" key={name}>
            <span className="font-medium text-ink-secondary text-xxs uppercase leading-4 tracking-caps">
              {name}
            </span>
            {story.render
              ? story.render({ ...args, ...story.args } as never, ctx)
              : null}
          </section>
        ))}
      </div>
    );
  },
} as Story;
