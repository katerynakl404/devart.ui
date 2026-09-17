import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './index';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    animation: 'shimmer',
    rounded: 'md',
    isLoaded: false,
    className: 'h-4 w-48',
  },
  argTypes: {
    animation: {
      control: 'select',
      options: ['shimmer', 'pulse', 'none'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
    },
    children: { control: false },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Animations: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Skeleton {...args} animation="shimmer" className="h-4 w-48" />
      <Skeleton {...args} animation="pulse" className="h-4 w-48" />
      <Skeleton {...args} animation="none" className="h-4 w-48" />
    </div>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Skeleton {...args} rounded="full" className="size-12" />
      <div className="flex flex-col gap-2">
        <Skeleton {...args} rounded="md" className="h-4 w-40" />
        <Skeleton {...args} rounded="md" className="h-4 w-28" />
      </div>
    </div>
  ),
};

/** Every radius step the recipe defines; `md` is the default. */
export const Rounded: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((rounded) => (
        <Skeleton
          {...args}
          className="size-12"
          key={rounded}
          rounded={rounded}
        />
      ))}
    </div>
  ),
};

export const WithContent: Story = {
  args: {
    isLoaded: false,
    children: <span className="text-ink-body">Loaded content goes here</span>,
  },
};

export const Loaded: Story = {
  args: {
    isLoaded: true,
    children: <span className="text-ink-body">Loaded content goes here</span>,
  },
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
      ['Animations', Animations],
      ['Shapes', Shapes],
      ['Rounded', Rounded],
      ['With Content', WithContent],
      ['Loaded', Loaded],
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
