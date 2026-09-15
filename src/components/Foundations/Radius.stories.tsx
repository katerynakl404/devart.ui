import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radius } from './index';

/**
 * The radius scale. Every step is a token, so a consumer retunes the whole system's corners by redefining five variables.
 */
const meta = {
  title: 'Foundations/Radius',
  component: Radius,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Radius>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The same scale under `.dark`. */
export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <div className="dark rounded-lg bg-surface-page p-6">
        <Story />
      </div>
    ),
  ],
};
