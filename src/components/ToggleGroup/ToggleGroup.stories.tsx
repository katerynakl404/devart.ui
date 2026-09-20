import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ToggleRounded, ToggleSize, ToggleVariant } from '../Toggle';
import { Typography } from '../Typography';
import { ToggleGroup, ToggleGroupItem } from './index';

const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  args: {
    type: 'single',
    variant: 'outline',
    size: 'sm',
    rounded: 'md',
    scrollIntoGroup: true,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'stroke', 'ghost', 'badge'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'rounded', 'md', 'lg', 'xl', 'full'],
    },
    type: { control: false },
    value: { control: false },
    defaultValue: { control: false },
    onValueChange: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Radix's single/multiple union means `args` in a render body carries both
// branches at once; picking just the shared variant props keeps each demo's
// own `type`/`value`/`onValueChange` from colliding with the other branch.
type ToggleGroupCommonArgs = {
  variant?: ToggleVariant | null;
  size?: ToggleSize | null;
  rounded?: ToggleRounded | null;
  scrollIntoGroup?: boolean;
};

const pickGroupArgs = (args: ToggleGroupCommonArgs): ToggleGroupCommonArgs => ({
  variant: args.variant,
  size: args.size,
  rounded: args.rounded,
  scrollIntoGroup: args.scrollIntoGroup,
});

const metricTypeOptions = [
  { value: 'all', label: 'All' },
  { value: 'measures', label: 'Measures' },
  { value: 'dimensions', label: 'Dimensions' },
  { value: 'calculated', label: 'Calculated' },
] as const;

const connectionTypeOptions = [
  { value: 'database', label: 'Database' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'api', label: 'API' },
  { value: 'file', label: 'File' },
] as const;

// Production usage: metrics catalog type filter (see MetricsToolbarTypeToggle).
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('all');
    return (
      <ToggleGroup
        {...pickGroupArgs(args)}
        type="single"
        variant="stroke"
        size="xs"
        rounded="full"
        value={value}
        onValueChange={setValue}
      >
        {metricTypeOptions.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    );
  },
};

export const Multiple: Story = {
  args: { type: 'multiple' },
  render: (args) => {
    const [value, setValue] = useState<string[]>(['database']);
    return (
      <ToggleGroup
        {...pickGroupArgs(args)}
        type="multiple"
        value={value}
        onValueChange={setValue}
      >
        {connectionTypeOptions.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    );
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <ToggleGroup
        {...pickGroupArgs(args)}
        type="single"
        variant="outline"
        defaultValue="measures"
      >
        {metricTypeOptions.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ToggleGroup
        {...pickGroupArgs(args)}
        type="single"
        variant="stroke"
        defaultValue="measures"
      >
        {metricTypeOptions.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ToggleGroup
        {...pickGroupArgs(args)}
        type="single"
        variant="ghost"
        defaultValue="measures"
      >
        {metricTypeOptions.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ToggleGroup
        {...pickGroupArgs(args)}
        type="single"
        variant="badge"
        defaultValue="measures"
      >
        {metricTypeOptions.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <ToggleGroup
        {...pickGroupArgs(args)}
        type="single"
        size="xs"
        defaultValue="measures"
      >
        {metricTypeOptions.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ToggleGroup
        {...pickGroupArgs(args)}
        type="single"
        size="sm"
        defaultValue="measures"
      >
        {metricTypeOptions.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ToggleGroup
        {...pickGroupArgs(args)}
        type="single"
        size="md"
        defaultValue="measures"
      >
        {metricTypeOptions.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ToggleGroup
        {...pickGroupArgs(args)}
        type="single"
        size="lg"
        defaultValue="measures"
      >
        {metricTypeOptions.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ToggleGroup
        {...pickGroupArgs(args)}
        type="single"
        size="xl"
        defaultValue="measures"
      >
        {metricTypeOptions.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  ),
};

const metricTypeCounts = [
  { value: 'all', label: 'All', count: 128 },
  { value: 'measures', label: 'Measures', count: 64 },
  { value: 'dimensions', label: 'Dimensions', count: 52 },
  { value: 'calculated', label: 'Calculated', count: 12 },
] as const;

// FilterChips pattern: count rendered inside the item, tinted on select.
export const WithCounts: Story = {
  render: (args) => {
    const [value, setValue] = useState('all');
    return (
      <ToggleGroup
        {...pickGroupArgs(args)}
        type="single"
        variant="stroke"
        size="xs"
        rounded="full"
        value={value}
        onValueChange={setValue}
      >
        {metricTypeCounts.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className="group px-3"
          >
            {option.label}
            <Typography
              variant="p"
              textColor="light"
              className="text-xs group-data-[state=on]:text-ink-highlight"
            >
              {option.count}
            </Typography>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    );
  },
};

export const ItemOverride: Story = {
  render: (args) => (
    <ToggleGroup {...pickGroupArgs(args)} type="single" defaultValue="measures">
      {metricTypeOptions
        .filter((option) => option.value !== 'calculated')
        .map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      <ToggleGroupItem value="calculated" variant="badge">
        Calculated
      </ToggleGroupItem>
    </ToggleGroup>
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
      ['Multiple', Multiple],
      ['Variants', Variants],
      ['Sizes', Sizes],
      ['With Counts', WithCounts],
      ['Item Override', ItemOverride],
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
