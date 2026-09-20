import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './index';

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: {
    value: 50,
    max: 100,
    variant: 'primary',
    size: 'md',
    rounded: 'lg',
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    max: {
      control: { type: 'number', min: 1 },
    },
    variant: {
      control: 'select',
      options: ['primary', 'tertiary', 'green', 'attention', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['md', 'lg'],
    },
    rounded: {
      control: 'select',
      options: ['lg', 'full'],
    },
    ref: { control: false, table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { value: 0 },
};

export const Half: Story = {
  args: { value: 50 },
};

export const Full: Story = {
  args: { value: 100 },
};

/** Every fill variant the recipe defines. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      {(
        ['primary', 'tertiary', 'green', 'attention', 'destructive'] as const
      ).map((variant) => (
        <ProgressBar {...args} key={variant} value={64} variant={variant} />
      ))}
    </div>
  ),
};

/** Track heights: `md` 4px, `lg` 6px. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      {(['md', 'lg'] as const).map((size) => (
        <ProgressBar {...args} key={size} size={size} value={64} />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <ProgressBar {...args} value={0} />
      <ProgressBar {...args} value={50} />
      <ProgressBar {...args} value={100} />
    </div>
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
      ['Empty', Empty],
      ['Half', Half],
      ['Full', Full],
      ['Variants', Variants],
      ['Sizes', Sizes],
      ['States', States],
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
