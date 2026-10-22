import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from '../Alert';
import { AlertStack } from './index';

/**
 * `AlertStack` keeps several notices to one notice's height: folded, the first lies
 * on top and the next two show their bottom edges in their own colours; the edges
 * spread on hover and open the pile on a press; "Show Less" folds it again.
 */
const meta = {
  title: 'Compositions/AlertStack',
  component: AlertStack,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof AlertStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const blocked = (
  <Alert key="b" variant="warning" size="md" title="Sales is unavailable to its members" description="Your plan no longer includes Workspaces. Nothing was deleted." />
);
const restored = (
  <Alert key="r" variant="success" size="md" title="Marketing is available again" description="Everything is where it was — its connections, metrics and files." />
);
const trial = (
  <Alert key="t" variant="info" size="md" title="Your trial ends in 3 days" description="After that, Sales becomes unavailable to members until you choose Pro." />
);

/** Two notices: one edge under the first. */
export const Two: Story = { render: () => <AlertStack>{[blocked, restored]}</AlertStack> };

/** Three or more: two edges, the second further in. */
export const Three: Story = { render: () => <AlertStack>{[blocked, restored, trial]}</AlertStack> };

/** Opened: every notice, then Show Less. */
export const Open: Story = { render: () => <AlertStack defaultOpen>{[blocked, restored, trial]}</AlertStack> };

/** One notice is just that notice. */
export const Single: Story = { render: () => <AlertStack>{[blocked]}</AlertStack> };
