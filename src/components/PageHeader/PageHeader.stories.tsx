import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus, Settings } from 'lucide-react';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { PageHeader } from './index';

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { title: 'Connections' },
  argTypes: { actions: { control: false }, leading: { control: false } },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A top-level page: no back control. */
export const Default: Story = {};

/** A drill-down page. The arrow is 20px and sits 8px from the title. */
export const WithBack: Story = {
  args: { title: 'PostgreSQL', onBack: fn(), backLabel: 'Back to connections' },
};

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <IconButton aria-label="Page settings" size="sm" variant="tertiary">
          <Settings />
        </IconButton>
        <Button size="sm" variant="primary">
          <Plus />
          New connection
        </Button>
      </>
    ),
  },
};

export const BackAndActions: Story = {
  args: {
    title: 'PostgreSQL',
    onBack: fn(),
    backLabel: 'Back to connections',
    actions: (
      <Button size="sm" variant="secondary">
        Edit
      </Button>
    ),
  },
};

/** The title truncates rather than pushing the actions off the row. */
export const LongTitle: Story = {
  args: {
    title: 'Primary analytics warehouse — production replica, EMEA region',
    onBack: fn(),
    actions: (
      <Button size="sm" variant="secondary">
        Edit
      </Button>
    ),
  },
};

/**
 * DRAFT — `condensed`. What a sticky header becomes once the page has scrolled:
 * the same row at 40px instead of 72px, the `h1` at `title16`. The back
 * control, the title and the actions keep their columns, so the change is a
 * shrink and not a relayout.
 */
export const Condensed: Story = {
  args: {
    title: 'Oracle ERP (staging)',
    condensed: true,
    onBack: fn(),
    actions: (
      <>
        <Button size="sm" variant="secondary">
          Cancel
        </Button>
        <Button size="sm" variant="primary">
          Save
        </Button>
      </>
    ),
  },
};
