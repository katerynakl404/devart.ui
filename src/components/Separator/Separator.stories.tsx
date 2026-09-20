import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './index';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  args: {
    variant: 'border',
    orientation: 'horizontal',
    decorative: true,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'border'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-64">
      <Separator {...args} orientation="horizontal" />
    </div>
  ),
};

export const Vertical: Story = {
  render: (args) => (
    <div className="flex h-16 items-center">
      <Separator {...args} orientation="vertical" />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-4">
      <Separator {...args} orientation="horizontal" variant="primary" />
      <Separator {...args} orientation="horizontal" variant="secondary" />
      <Separator {...args} orientation="horizontal" variant="border" />
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
      ['Horizontal', Horizontal],
      ['Vertical', Vertical],
      ['Variants', Variants],
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
