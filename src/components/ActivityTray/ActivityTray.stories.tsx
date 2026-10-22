import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert, CircleCheck, FileText, Loader2 } from 'lucide-react';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { expect, fn, within } from 'storybook/test';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { LinkButton } from '../LinkButton';
import { ActivityTray, ActivityTrayItem } from './index';

/**
 * `ActivityTray` is a fully abstract activity plate — a header (leading icon
 * slot · title · collapse toggle · dismiss) over a scrollable list of rows.
 * It is **positioning-neutral**: it owns its own width and height cap but no
 * placement of its own, so the page docks it — a drawer, a panel, the corner
 * of a screen. It also carries no status vocabulary: every glyph and colour
 * below arrives through a slot the consumer fills in. The upload content in
 * these stories is sample data only — the component itself knows nothing
 * about uploads.
 */
const meta = {
  title: 'Compositions/ActivityTray',
  component: ActivityTray,
  // The row is half the component; without this its props get no table.
  subcomponents: { ActivityTrayItem },
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    onDismiss: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    headerIcon: { control: false },
    children: { control: false },
    isCollapsible: { control: 'boolean' },
    toggleLabel: { control: 'text' },
    dismissLabel: { control: 'text' },
    onDismiss: { control: false },
    autoDismiss: { control: 'boolean' },
    autoDismissDelay: { control: { type: 'number', min: 0, step: 500 } },
    open: { control: false },
    defaultOpen: { control: 'boolean' },
    onOpenChange: { control: false },
  },
} satisfies Meta<typeof ActivityTray>;

export default meta;
type Story = StoryObj<typeof meta>;

const Glyph = () => <FileText aria-hidden="true" />;

export const Complete: Story = {
  args: {
    headerTitle: '2 uploads complete',
    headerIcon: <CircleCheck aria-hidden />,
    role: 'region',
    'aria-label': 'Upload status',
  },
  render: (args) => (
    <ActivityTray {...args}>
      <ActivityTrayItem
        icon={<Glyph />}
        title="giffycanvas.gif"
        rightSlot="1.2 MB"
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
      />
      <ActivityTrayItem
        icon={<Glyph />}
        title="Grid.png"
        rightSlot="480 KB"
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
      />
    </ActivityTray>
  ),
};

export const Uploading: Story = {
  args: {
    headerTitle: '3 uploading',
    // `Spinner` sets `role="status"` + `aria-label="Loading"`, which would
    // turn the trigger's accessible name into "Loading 3 uploading" and put
    // a live region inside a button — a bare decorative glyph avoids both.
    headerIcon: (
      <Loader2
        aria-hidden="true"
        className="animate-spin motion-reduce:animate-none"
      />
    ),
  },
  render: (args) => (
    <ActivityTray {...args}>
      <ActivityTrayItem
        icon={<Glyph />}
        title="quarterly-report-final-v4.pdf"
        hasProgress
        progress={62}
        progressLabel="Uploading quarterly-report-final-v4.pdf"
        rightSlot="62%"
      />
      <ActivityTrayItem
        icon={<Glyph />}
        title="Grid.png"
        hasProgress
        progress={18}
        progressLabel="Uploading Grid.png"
        rightSlot="18%"
      />
      <ActivityTrayItem
        icon={<Glyph />}
        title="notes.txt"
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
      />
    </ActivityTray>
  ),
};

/**
 * The failure is never colour-only: the head glyph stays neutral and the title
 * counts it in words, while the row spells it out through `errorText`. Retry
 * is a text link in `rightSlot` — the kit's `.upl-item-act`, the one action a
 * failed row gets; the status glyph stays in `trailingIcon` so it lines up
 * with success checks on sibling rows.
 */
export const Failed: Story = {
  args: {
    headerTitle: '1 of 3 uploads failed',
    headerIcon: <CircleAlert aria-hidden />,
  },
  render: (args) => (
    <ActivityTray {...args}>
      <ActivityTrayItem
        icon={<Glyph />}
        title="giffycanvas.gif"
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
      />
      <ActivityTrayItem
        icon={<Glyph />}
        title="dataset-full-export.csv"
        errorText="The file is larger than the 25 MB limit"
        rightSlot={
          <LinkButton asChild>
            <button type="button">Retry</button>
          </LinkButton>
        }
        trailingIcon={<CircleAlert aria-hidden className="text-fb-red-text" />}
      />
      <ActivityTrayItem
        icon={<Glyph />}
        title="Grid.png"
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
      />
    </ActivityTray>
  ),
};

/**
 * A long name truncates — it never wraps. The plate keeps its width so the
 * page it is docked in does not reflow as files arrive.
 */
export const LongNames: Story = {
  args: {
    headerTitle: '2 uploads complete',
    headerIcon: <CircleCheck aria-hidden />,
  },
  render: (args) => (
    <ActivityTray {...args}>
      <ActivityTrayItem
        icon={<Glyph />}
        title="2026-Q3-consolidated-revenue-by-region-and-product-line-final.xlsx"
        rightSlot="4.1 MB"
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
      />
      <ActivityTrayItem
        icon={<Glyph />}
        title="a.csv"
        rightSlot="12 KB"
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
      />
    </ActivityTray>
  ),
};

/** Collapsed. The whole header except the ✕ is the toggle. */
export const Collapsed: Story = {
  args: {
    headerTitle: '5 uploads complete',
    headerIcon: <CircleCheck aria-hidden />,
    defaultOpen: false,
  },
  render: (args) => (
    <ActivityTray {...args}>
      <ActivityTrayItem
        icon={<Glyph />}
        title="one.png"
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
      />
      <ActivityTrayItem
        icon={<Glyph />}
        title="two.png"
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
      />
    </ActivityTray>
  ),
};

/**
 * A tray hosted inside something that already manages its own open/close —
 * a popover, a drawer — sets `isCollapsible={false}`: the header keeps its
 * icon and title but drops the toggle button and chevron, and the list is
 * always rendered.
 */
export const NonCollapsible: Story = {
  args: {
    headerTitle: '2 uploads complete',
    headerIcon: <CircleCheck aria-hidden />,
    isCollapsible: false,
  },
  render: (args) => (
    <ActivityTray {...args}>
      <ActivityTrayItem
        icon={<Glyph />}
        title="giffycanvas.gif"
        rightSlot="1.2 MB"
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
      />
      <ActivityTrayItem
        icon={<Glyph />}
        title="Grid.png"
        rightSlot="480 KB"
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
      />
    </ActivityTray>
  ),
};

/**
 * `open`/`onOpenChange` — the page decides when the tray is expanded. The DOM
 * always follows `open`; every click still reports through `onOpenChange`.
 */
export const Controlled: Story = {
  args: {
    headerTitle: '2 uploads complete',
    headerIcon: <CircleCheck aria-hidden />,
  },
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <ActivityTray {...args} open={open} onOpenChange={setOpen}>
        <ActivityTrayItem
          icon={<Glyph />}
          title="giffycanvas.gif"
          rightSlot="1.2 MB"
          trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
        />
        <ActivityTrayItem
          icon={<Glyph />}
          title="Grid.png"
          rightSlot="480 KB"
          trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
        />
      </ActivityTray>
    );
  },
};

const AutoDismissDemo = ({
  children,
  ...args
}: ComponentProps<typeof ActivityTray>) => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <Button variant="outline" size="sm" onClick={() => setVisible(true)}>
        Show again
      </Button>
    );
  }

  return (
    <ActivityTray {...args} onDismiss={() => setVisible(false)}>
      {children}
    </ActivityTray>
  );
};

/**
 * `autoDismiss` — rows marked `dismissible` retire themselves once they have
 * settled, and the plate follows the last one out. Off by default: a plate
 * that clears itself is right for a background job nobody is watching, and
 * wrong for one they are. `onDismiss` unmounts this demo; "Show again"
 * remounts it so the story can be replayed.
 */
export const AutoDismiss: Story = {
  args: {
    headerTitle: '2 uploads complete',
    headerIcon: <CircleCheck aria-hidden />,
    autoDismiss: true,
    autoDismissDelay: 1500,
  },
  render: (args) => (
    <AutoDismissDemo {...args}>
      <ActivityTrayItem
        icon={<Glyph />}
        title="giffycanvas.gif"
        rightSlot="1.2 MB"
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
        dismissible
      />
      <ActivityTrayItem
        icon={<Glyph />}
        title="Grid.png"
        rightSlot="480 KB"
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
        dismissible
      />
    </AutoDismissDemo>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2);

    // Rows and plate retire on real `animationend` events from the preset's
    // `row-out` and `panel-out` keyframes, which the unit tests only simulate.
    await expect(
      await canvas.findByRole(
        'button',
        { name: 'Show again' },
        { timeout: 5000 }
      )
    ).toBeVisible();
  },
};

/**
 * With one failure in the batch the plate never leaves: the failed row is
 * not `dismissible`, so it outlives its two settled siblings and keeps the
 * plate — and the question it is asking — on screen.
 */
export const AutoDismissWithFailure: Story = {
  args: {
    headerTitle: '1 of 3 uploads failed',
    headerIcon: <CircleAlert aria-hidden />,
    autoDismiss: true,
    autoDismissDelay: 1500,
  },
  render: (args) => (
    <AutoDismissDemo {...args}>
      <ActivityTrayItem
        icon={<Glyph />}
        title="giffycanvas.gif"
        rightSlot="1.2 MB"
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
        dismissible
      />
      <ActivityTrayItem
        icon={<Glyph />}
        title="dataset-full-export.csv"
        errorText="The file is larger than the 25 MB limit"
        rightSlot={
          <LinkButton asChild>
            <button type="button">Retry</button>
          </LinkButton>
        }
        trailingIcon={<CircleAlert aria-hidden className="text-fb-red-text" />}
      />
      <ActivityTrayItem
        icon={<Glyph />}
        title="Grid.png"
        rightSlot="480 KB"
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
        dismissible
      />
    </AutoDismissDemo>
  ),
};

const onActivateMarketing = fn();
const onActivateDevelopers = fn();
const onConfigureMarketing = fn();
const onConfigureDevelopers = fn();

/**
 * `onActivate` turns a row's title into a button whose `::after` stretches
 * over the whole `<li>` — the row-link recipe: the hit area is the row, the
 * accessible name stays the title. A `rightSlot` control such as this
 * "Configure" text link stays independently clickable because its own wrapper
 * is `relative` and paints above that stretched target.
 */
export const ClickableRows: Story = {
  args: {
    headerTitle: '0 of 2 workspaces configured',
    headerIcon: <CircleCheck aria-hidden />,
  },
  render: (args) => (
    <ActivityTray {...args}>
      <ActivityTrayItem
        icon={<Glyph />}
        title="Marketing"
        onActivate={onActivateMarketing}
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
        rightSlot={
          <LinkButton asChild>
            <button type="button" onClick={onConfigureMarketing}>
              Configure
            </button>
          </LinkButton>
        }
      />
      <ActivityTrayItem
        icon={<Glyph />}
        title="Developers"
        onActivate={onActivateDevelopers}
        trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
        rightSlot={
          <LinkButton asChild>
            <button type="button" onClick={onConfigureDevelopers}>
              Configure
            </button>
          </LinkButton>
        }
      />
    </ActivityTray>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', {
      name: '0 of 2 workspaces configured',
    });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const marketingRow = await canvas.findByRole('button', {
      name: 'Marketing',
    });
    await userEvent.click(marketingRow);
    await expect(onActivateMarketing).toHaveBeenCalledOnce();

    const row = marketingRow.closest('li') as HTMLElement;
    const configure = within(row).getByRole('button', { name: 'Configure' });
    const rowRect = row.getBoundingClientRect();
    const configureRect = configure.getBoundingClientRect();

    // The title's `::after` covers the row's padding, but the `relative` right
    // slot paints above it, so "Configure" still receives its own clicks.
    await expect(
      document.elementFromPoint(
        rowRect.left + 4,
        rowRect.top + rowRect.height / 2
      )
    ).toBe(marketingRow);
    await expect(
      configure.contains(
        document.elementFromPoint(
          configureRect.left + configureRect.width / 2,
          configureRect.top + configureRect.height / 2
        )
      )
    ).toBe(true);
  },
};

/**
 * Status as words, not glyphs: the trailing slot takes a `Badge` so a row can
 * say "No data included" / "Data included" instead of a colour-only icon. The
 * connector name sits in `rightSlot` next to the title.
 */
export const StatusAsWords: Story = {
  args: {
    headerTitle: '3 workspaces need configuring',
  },
  render: (args) => (
    <ActivityTray {...args}>
      <ActivityTrayItem
        icon={<Glyph />}
        title="Product"
        onActivate={fn()}
        rightSlot="DB2"
        trailingIcon={
          <Badge size="sm" rounded="full" variant="attention">
            No data included
          </Badge>
        }
      />
      <ActivityTrayItem
        icon={<Glyph />}
        title="Finance"
        onActivate={fn()}
        rightSlot="DB2"
        trailingIcon={
          <Badge size="sm" rounded="full" variant="attention">
            No data included
          </Badge>
        }
      />
      <ActivityTrayItem
        icon={<Glyph />}
        title="Support"
        onActivate={fn()}
        rightSlot="DB2"
        trailingIcon={
          <Badge size="sm" rounded="full" variant="secondary">
            Data included
          </Badge>
        }
      />
    </ActivityTray>
  ),
};
