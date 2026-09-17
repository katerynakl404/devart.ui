import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchX } from 'lucide-react';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { StatusView } from './index';

const meta = {
  title: 'Components/StatusView',
  component: StatusView,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    tone: 'neutral',
    size: 'md',
    surface: 'standalone',
    actionsOrientation: 'inline',
    title: 'No chats yet',
    description: 'Start a new conversation to see it appear here.',
    onRetry: fn(),
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'muted', 'error', 'info', 'success', 'transparent'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    surface: {
      control: 'select',
      options: ['embedded', 'standalone'],
    },
    actionsOrientation: {
      control: 'select',
      options: ['inline', 'stacked'],
    },
    title: { control: 'text' },
    description: { control: 'text' },
    retryLabel: { control: 'text' },
    retryButton: { control: false },
    icon: { control: false },
    actions: { control: false },
    onRetry: { control: false },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof StatusView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const ErrorState: Story = {
  args: {
    tone: 'error',
    title: 'Something went wrong',
    description: 'We could not load your data. Please try again.',
    retryLabel: 'Retry',
  },
};

export const ErrorStateCustomRetry: Story = {
  args: {
    tone: 'error',
    title: 'Something went wrong',
    description: 'We could not load your data. Please try again.',
    retryLabel: 'Try again',
    retryButton: {
      variant: 'primary',
      size: 'md',
      rounded: 'md',
    },
  },
};

export const Info: Story = {
  args: {
    tone: 'info',
    title: 'Sync in progress',
    description: 'Your connectors are being indexed in the background.',
  },
};

export const Success: Story = {
  args: {
    tone: 'success',
    title: 'All set',
    description: 'Your workspace has been configured successfully.',
  },
};

/**
 * Size steps. The reference ladder is container padding 16 / 24 / 32, gap
 * 8 / 12 / 16 and an icon circle of 32 / 40 / 56 px — `xs` sits below it for
 * inline notices inside a small tray.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-4">
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <StatusView
          {...args}
          description={size}
          key={size}
          size={size}
          title="Title"
          tone="info"
        />
      ))}
    </div>
  ),
};

/** Every tone, including the two the controls previously did not list. */
export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-4">
      {(
        ['neutral', 'muted', 'info', 'success', 'error', 'transparent'] as const
      ).map((tone) => (
        <StatusView
          {...args}
          className="w-56"
          description={`${tone} variant`}
          key={tone}
          title="Status"
          tone={tone}
        />
      ))}
    </div>
  ),
};

/**
 * The minimalist empty state: `surface="embedded"` drops the card so the block
 * sits directly in the list or grid it replaces, with a caller-supplied
 * illustration in place of the tone icon.
 */
export const EmptyState: Story = {
  args: {
    surface: 'embedded',
    tone: 'transparent',
    size: 'lg',
    title: 'No matches found',
    description:
      'No data sources match your search or filters — try a different term or clear them.',
    icon: <SearchX aria-hidden="true" className="size-12 text-ink-inactive" />,
    withIconHalo: false,
  },
  parameters: { layout: 'padded' },
};

export const WithCustomIcon: Story = {
  args: {
    title: 'No results found',
    description: 'Try adjusting your search or filters.',
    icon: <SearchX aria-hidden="true" />,
  },
};

export const WithAction: Story = {
  args: {
    title: 'No chats yet',
    description: 'Start a new conversation to see it appear here.',
    actions: (
      <Button variant="primary" size="sm" rounded="full">
        New chat
      </Button>
    ),
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
      ['Neutral', Neutral],
      ['Error State', ErrorState],
      ['Error State Custom Retry', ErrorStateCustomRetry],
      ['Info', Info],
      ['Success', Success],
      ['Sizes', Sizes],
      ['Tones', Tones],
      ['Empty State', EmptyState],
      ['With Custom Icon', WithCustomIcon],
      ['With Action', WithAction],
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
