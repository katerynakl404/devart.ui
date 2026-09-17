import type { Meta, StoryObj } from '@storybook/react-vite';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { Toggle } from './index';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: {
    children: 'Auto-refresh',
    variant: 'outline',
    size: 'sm',
    rounded: 'md',
    disabled: false,
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
    pressed: { control: false },
    onPressedChange: { control: false },
    asChild: { control: false, table: { disable: true } },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <span className="text-ink-secondary text-xs">Off</span>
      <div className="flex flex-wrap items-center gap-3">
        <Toggle {...args} variant="outline">
          Outline
        </Toggle>
        <Toggle {...args} variant="stroke">
          Stroke
        </Toggle>
        <Toggle {...args} variant="ghost">
          Ghost
        </Toggle>
        <Toggle {...args} variant="badge">
          Badge
        </Toggle>
      </div>
      <span className="text-ink-secondary text-xs">On</span>
      <div className="flex flex-wrap items-center gap-3">
        <Toggle {...args} variant="outline" defaultPressed>
          Outline
        </Toggle>
        <Toggle {...args} variant="stroke" defaultPressed>
          Stroke
        </Toggle>
        <Toggle {...args} variant="ghost" defaultPressed>
          Ghost
        </Toggle>
        <Toggle {...args} variant="badge" defaultPressed>
          Badge
        </Toggle>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle {...args} size="xs">
        Extra small
      </Toggle>
      <Toggle {...args} size="sm">
        Small
      </Toggle>
      <Toggle {...args} size="md">
        Medium
      </Toggle>
      <Toggle {...args} size="lg">
        Large
      </Toggle>
      <Toggle {...args} size="xl">
        Extra large
      </Toggle>
    </div>
  ),
};

export const Rounded: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle {...args} rounded="none">
        None
      </Toggle>
      <Toggle {...args} rounded="sm">
        Sm
      </Toggle>
      <Toggle {...args} rounded="rounded">
        Rounded
      </Toggle>
      <Toggle {...args} rounded="md">
        Md
      </Toggle>
      <Toggle {...args} rounded="lg">
        Lg
      </Toggle>
      <Toggle {...args} rounded="xl">
        Xl
      </Toggle>
      <Toggle {...args} rounded="full">
        Full
      </Toggle>
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <Toggle {...args} defaultPressed>
      <Check />
      Reviewed
    </Toggle>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Controlled: Story = {
  render: (args) => {
    const [pressed, setPressed] = useState(false);
    return (
      <Toggle {...args} pressed={pressed} onPressedChange={setPressed}>
        {pressed ? 'Auto-refresh on' : 'Auto-refresh off'}
      </Toggle>
    );
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
      ['Primary', Primary],
      ['Variants', Variants],
      ['Sizes', Sizes],
      ['Rounded', Rounded],
      ['With Icon', WithIcon],
      ['Disabled', Disabled],
      ['Controlled', Controlled],
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
