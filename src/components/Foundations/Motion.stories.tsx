import type { Meta, StoryObj } from '@storybook/react-vite';
import { Motion } from './index';

/**
 * Three durations, two easings, one reading window, and the four movements a list makes.
 *
 * The movements are here rather than described in each component's docs because they are shared:
 * a row leaving the upload plate and a row leaving a message queue are the same event, and a
 * consumer that re-derives the recipe gets it subtly wrong — the order of fade and collapse is
 * what makes it read as smooth, and it is not recoverable by inspection.
 */
const meta = {
  title: 'Foundations/Motion',
  component: Motion,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Motion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
