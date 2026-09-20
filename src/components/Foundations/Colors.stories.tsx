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
