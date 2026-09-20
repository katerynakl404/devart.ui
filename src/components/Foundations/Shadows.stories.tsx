import type { Meta, StoryObj } from '@storybook/react-vite';
import { Shadows } from './index';

/**
 * Elevation expressed as roles rather than sizes — pick by what the surface is doing, not by how big the shadow looks. A role token re-themes; a stock Tailwind shadow does not.
 */
const meta = {
  title: 'Foundations/Shadows',
  component: Shadows,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Shadows>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * Dark theme — every state the component ships, on one dark surface. Tokens
 * are pure CSS cascade, so a scoped `.dark` re-themes the whole subtree with
 * no provider and no props.
 */
export const DarkTheme = {
  render: (args, ctx) => {
    const cells: [string, Story][] = [['Default', Default]];
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
