import type { Meta, StoryObj } from '@storybook/react-vite';
import { Colors } from './index';

/**
 * Every semantic and component-scoped colour token, grouped by role.
 *
 * The Layer-1 primitive ramps (`--brand-*`, `--slate-*`, …) are deliberately
 * not here: they are never exposed to Tailwind, so no component can pin itself
 * to a shade. That indirection is what lets a colour pack re-theme the whole
 * system by redefining the primitives and the semantic layer only.
 */
const meta = {
  title: 'Foundations/Colors',
  component: Colors,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Colors>;

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
    const cells: [string, Story][] = [
      ['Default', Default],
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
