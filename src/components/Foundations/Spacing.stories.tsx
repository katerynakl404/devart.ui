import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spacing } from './index';

/**
 * The 4px step. The step number is the unit, so `4` is 16px. Half-steps exist for control internals only — never for page or section rhythm.
 */
const meta = {
  title: 'Foundations/Spacing',
  component: Spacing,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Spacing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
