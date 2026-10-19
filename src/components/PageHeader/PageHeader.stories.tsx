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

/**
 * A drill-down page. The arrow is a 24px glyph in a 36px box, sized against the
 * title, and the box sits 6px from it.
 */
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
 * `wrapTitle` — the same long title on as many lines as it needs. The arrow
 * stays centred on the wrapped title and the action keeps its edge; only the
 * row grows taller.
 */
export const WrapTitle: Story = {
  args: { ...LongTitle.args, wrapTitle: true },
};

/**
 * `wrapTitle` where it matters most: a phone, where a two-word title beside a
 * button would otherwise read "Data So…".
 */
export const WrapTitleOnPhone: Story = {
  name: 'Wrap title (phone)',
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  args: {
    title: 'Data Sources',
    wrapTitle: true,
    actions: (
      <Button size="sm" variant="primary">
        <Plus />
        Create Connection
      </Button>
    ),
  },
};

/**
 * DRAFT — `condensed`. What a sticky header becomes once the page has scrolled:
 * the same row with the `h2` at `heading20` and the back control a step smaller. The back
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

/** Condensed and wrapping: every line of the title steps down to `heading20`. */
export const CondensedWrapTitle: Story = {
  args: { ...LongTitle.args, condensed: true, wrapTitle: true },
};
