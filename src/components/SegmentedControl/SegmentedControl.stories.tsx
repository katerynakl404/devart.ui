import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayoutGrid, List, Rows3 } from 'lucide-react';
import { useState } from 'react';
import { Typography } from '../Typography';
import {
  SegmentedControl,
  SegmentedControlContent,
  SegmentedControlList,
  SegmentedControlTrigger,
} from './index';

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  args: {
    size: 'md',
    variant: 'default',
    rounded: 'md',
    defaultValue: 'list',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    variant: {
      control: 'select',
      options: ['default'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
    },
    value: { control: false },
    defaultValue: { control: false },
    onValueChange: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: 'list', label: 'List', icon: List },
  { value: 'grid', label: 'Grid', icon: LayoutGrid },
  { value: 'rows', label: 'Rows', icon: Rows3 },
] as const;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('list');
    return (
      <SegmentedControl {...args} value={value} onValueChange={setValue}>
        <SegmentedControlList>
          {options.map((option) => (
            <SegmentedControlTrigger key={option.value} value={option.value}>
              <option.icon />
              {option.label}
            </SegmentedControlTrigger>
          ))}
        </SegmentedControlList>
        {options.map((option) => (
          <SegmentedControlContent key={option.value} value={option.value}>
            <Typography>{option.label} view content</Typography>
          </SegmentedControlContent>
        ))}
      </SegmentedControl>
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <SegmentedControl {...args} size="sm" defaultValue="list">
        <SegmentedControlList>
          {options.map((option) => (
            <SegmentedControlTrigger key={option.value} value={option.value}>
              {option.label}
            </SegmentedControlTrigger>
          ))}
        </SegmentedControlList>
      </SegmentedControl>
      <SegmentedControl {...args} size="md" defaultValue="list">
        <SegmentedControlList>
          {options.map((option) => (
            <SegmentedControlTrigger key={option.value} value={option.value}>
              {option.label}
            </SegmentedControlTrigger>
          ))}
        </SegmentedControlList>
      </SegmentedControl>
    </div>
  ),
};

export const Rounded: Story = {
  render: (args) => (
    <SegmentedControl {...args} rounded="full" defaultValue="list">
      <SegmentedControlList>
        {options.map((option) => (
          <SegmentedControlTrigger key={option.value} value={option.value}>
            {option.label}
          </SegmentedControlTrigger>
        ))}
      </SegmentedControlList>
    </SegmentedControl>
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
      ['Sizes', Sizes],
      ['Rounded', Rounded],
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
