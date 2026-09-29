import type { Meta, StoryObj } from '@storybook/react-vite';
import { Colors, Primitives } from './index';

/**
 * Every colour token in the system, in the two layers it actually has: the
 * semantic and component-scoped tokens Tailwind is given, and the Layer-1 ramps
 * underneath that only those tokens are allowed to name.
 */
const meta = {
  title: 'Foundations/Colors',
  component: Colors,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Colors>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Layers 2 and 3 — the names a class may carry. */
export const Default: Story = {};

/**
 * Layer 1 — the ramps. Shown, not exposed: there is still no `bg-slate-200`,
 * and a component still may not name a shade. They are here because the token
 * page above is unreadable without them — a swatch called `fb-info` is a blue
 * rectangle until the page says *which* blue, and in which theme.
 */
export const PrimitiveRamps: Story = {
  render: () => <Primitives />,
};
