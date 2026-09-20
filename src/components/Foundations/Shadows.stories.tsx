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
