import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, within } from 'storybook/test';
import { Alert, type AlertProps } from '../Alert';
import { AlertStack, type AlertStackProps } from './index';

/**
 * `AlertStack` keeps several notices to one notice's height: folded, the first lies
 * on top and the next two show their bottom edges in their own colours; the edges
 * spread on hover and open the pile on a press; "Show Less" folds it again.
 *
 * The edge colour comes from each child's `variant` prop. A wrapper around `Alert`
 * must take `variant` and pass it on — see "Wrapped notices".
 */
const meta = {
  title: 'Compositions/AlertStack',
  component: AlertStack,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    // "Show code" shows the JSX a story renders, not the story object: the
    // play functions are this package's tests, not usage to copy.
    docs: { source: { type: 'dynamic' } },
  },
  args: { children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof AlertStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const BLOCKED = 'Sales is unavailable to its members';
const RESTORED = 'Marketing is available again';
const TRIAL = 'Your trial ends in 3 days';

const blocked = (
  <Alert
    key="b"
    variant="warning"
    size="md"
    title={BLOCKED}
    description="Your plan no longer includes Workspaces. Nothing was deleted."
  />
);
const restored = (
  <Alert
    key="r"
    variant="success"
    size="md"
    title={RESTORED}
    description="Everything is where it was — its connections, metrics and files."
  />
);
const trial = (
  <Alert
    key="t"
    variant="info"
    size="md"
    title={TRIAL}
    description="After that, Sales becomes unavailable to members until you choose Pro."
  />
);

const error = (
  <Alert
    key="e"
    variant="error"
    size="md"
    title="Payment failed"
    description="Update your card to keep Pro features in Sales."
  />
);
const neutral = (
  <Alert
    key="n"
    variant="neutral"
    size="md"
    title="Scheduled maintenance"
    description="Connections may be slow on Sunday from 02:00 to 03:00 UTC."
  />
);
const NOTICES = [blocked, restored, trial, error, neutral];

type PlaygroundArgs = AlertStackProps & { count: number };

/** Change the number of notices, open or fold the deck, and rename "Show Less" in Controls. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { count: 3, open: false, lessLabel: 'Show Less' },
  argTypes: {
    count: { control: { type: 'range', min: 1, max: NOTICES.length } },
    open: { control: 'boolean' },
    lessLabel: { control: 'text' },
    defaultOpen: { table: { disable: true } },
    moreLabel: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
  },
  render: function Render({ count, ...args }) {
    const [, updateArgs] = useArgs<PlaygroundArgs>();
    return (
      <AlertStack {...args} onOpenChange={(open) => updateArgs({ open })}>
        {NOTICES.slice(0, count)}
      </AlertStack>
    );
  },
};

const ukPlural = new Intl.PluralRules('uk');
const ukMoreLabel = (count: number) =>
  `Показати ще ${count} ${ukPlural.select(count) === 'many' ? 'сповіщень' : 'сповіщення'}`;

/**
 * `moreLabel` takes the number of notices behind the first, so the label can
 * pluralise and be translated. It is the edge's accessible name — read out, not
 * shown.
 */
export const CustomLabels: Story = {
  render: () => (
    <AlertStack moreLabel={ukMoreLabel} lessLabel="Згорнути">
      {[blocked, restored, trial]}
    </AlertStack>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Показати ще 2 сповіщення' })
    );
    await expect(
      canvas.getByRole('button', { name: 'Згорнути' })
    ).toHaveFocus();
  },
};

/** Two notices: one edge under the first. */
export const Two: Story = {
  render: () => <AlertStack>{[blocked, restored]}</AlertStack>,
  play: async ({ canvas }) => {
    const edge = canvas.getByRole('button', { name: 'Show 1 more notice' });
    await expect(edge).toHaveAttribute('aria-expanded', 'false');
    // The edge is in the colours of the notice it stands for.
    await expect(edge.className).toContain('bg-alert-bg-success');
    await expect(canvas.queryByText(RESTORED)).not.toBeInTheDocument();
  },
};

/** Three or more: two edges, the second further in. Opens and folds again. */
export const Three: Story = {
  render: () => <AlertStack>{[blocked, restored, trial]}</AlertStack>,
  play: async ({ canvas, userEvent }) => {
    const notice = canvas.getByText(BLOCKED).closest('[role="status"]');
    const edge = canvas.getByRole('button', { name: 'Show 2 more notices' });
    // The edge shows below the notice on top, in that notice's colours.
    await expect(edge.getBoundingClientRect().bottom).toBeGreaterThan(
      (notice?.getBoundingClientRect().bottom ?? 0) + 4
    );
    await expect(edge.className).toContain('bg-alert-bg-success');
    await expect(canvas.queryByText(TRIAL)).not.toBeInTheDocument();

    await userEvent.click(edge);
    await expect(canvas.getByText(RESTORED)).toBeVisible();
    await expect(canvas.getByText(TRIAL)).toBeVisible();
    // Focus moves to the control that replaced the pressed one.
    const less = canvas.getByRole('button', { name: 'Show Less' });
    await expect(less).toHaveFocus();

    await userEvent.click(less);
    await expect(canvas.queryByText(TRIAL)).not.toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: 'Show 2 more notices' })
    ).toHaveFocus();
  },
};

/**
 * The deck at the bottom of a long page: opening it, by mouse or by keyboard,
 * leaves the page where it was, though "Show Less" lands below the fold.
 */
export const KeepsScroll: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div>
      <div style={{ height: 'calc(100vh - 140px)' }} />
      <AlertStack>{[blocked, restored, trial]}</AlertStack>
      <div style={{ height: '150vh' }} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const page = document.scrollingElement as HTMLElement;
    const before = page.scrollTop;

    await userEvent.click(
      canvas.getByRole('button', { name: 'Show 2 more notices' })
    );
    await expect(
      canvas.getByRole('button', { name: 'Show Less' })
    ).toHaveFocus();
    await expect(page.scrollTop).toBe(before);

    await userEvent.keyboard('{Enter}');
    await expect(
      canvas.getByRole('button', { name: 'Show 2 more notices' })
    ).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(
      canvas.getByRole('button', { name: 'Show Less' })
    ).toHaveFocus();
    await expect(page.scrollTop).toBe(before);
  },
};

/** From the keyboard: one Tab stop for the deck, Enter opens, Enter folds. */
export const Keyboard: Story = {
  render: () => <AlertStack>{[blocked, restored, trial]}</AlertStack>,
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(
      canvas.getByRole('button', { name: 'Show 2 more notices' })
    ).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(
      canvas.getByRole('button', { name: 'Show Less' })
    ).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(
      canvas.getByRole('button', { name: 'Show 2 more notices' })
    ).toHaveFocus();
  },
};

/** Opened: every notice, then Show Less. */
export const Open: Story = {
  render: () => (
    <AlertStack defaultOpen>{[blocked, restored, trial]}</AlertStack>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('status')).toHaveLength(3);
    const less = canvas.getByRole('button', { name: 'Show Less' });
    await expect(less).toHaveAttribute('aria-expanded', 'true');
    // Opened on mount, not by a press: focus stays where the page put it.
    await expect(less).not.toHaveFocus();
  },
};

/** One notice is just that notice. */
export const Single: Story = {
  render: () => <AlertStack>{[blocked]}</AlertStack>,
  play: async ({ canvas }) => {
    await expect(canvas.getByText(BLOCKED)).toBeVisible();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

const WorkspaceTrialAlert = ({ variant }: Pick<AlertProps, 'variant'>) => (
  <Alert
    variant={variant}
    size="md"
    title={TRIAL}
    description="After that, Sales becomes unavailable to members until you choose Pro."
  />
);

/**
 * A notice wrapped in the app's own component: the wrapper takes `variant` and
 * passes it on, so the deck can paint its edge. Without it the edge is neutral.
 */
export const WrappedNotices: Story = {
  name: 'Wrapped notices',
  render: () => (
    <AlertStack>
      {blocked}
      <WorkspaceTrialAlert variant="info" />
    </AlertStack>
  ),
  play: async ({ canvas }) => {
    const edge = canvas.getByRole('button', { name: 'Show 1 more notice' });
    await expect(edge.className).toContain('bg-alert-bg-info');
    await expect(within(edge).queryByText(TRIAL)).not.toBeInTheDocument();
  },
};
