import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileText } from 'lucide-react';
import { LinkButton } from '../LinkButton';
import { UploadTray, UploadTrayItem } from './index';

/**
 * The plate raised during and after a file upload. It is
 * **positioning-neutral**: it has a width and a cap and no placement of its
 * own, so the page docks it — a drawer, a panel, the bottom of a screen.
 */
const meta = {
  title: 'Components/UploadTray',
  component: UploadTray,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    status: { control: 'select', options: ['uploading', 'complete', 'failed'] },
    children: { control: false },
  },
} satisfies Meta<typeof UploadTray>;

export default meta;
type Story = StoryObj<typeof meta>;

const Glyph = () => <FileText aria-hidden="true" />;

export const Complete: Story = {
  args: {
    status: 'complete',
    title: '2 uploads complete',
    onDismiss: () => undefined,
  },
  render: (args) => (
    <UploadTray {...args}>
      <UploadTrayItem
        onRowClick={() => undefined}
        icon={<Glyph />}
        meta="1.2 MB"
        name="giffycanvas.gif"
        status="done"
      />
      <UploadTrayItem
        onRowClick={() => undefined}
        icon={<Glyph />}
        meta="480 KB"
        name="Grid.png"
        status="done"
      />
    </UploadTray>
  ),
};

export const Uploading: Story = {
  args: {
    status: 'uploading',
    title: '3 uploading',
    onDismiss: () => undefined,
  },
  render: (args) => (
    <UploadTray {...args}>
      <UploadTrayItem
        onRowClick={() => undefined}
        icon={<Glyph />}
        meta="62%"
        name="quarterly-report-final-v4.pdf"
        progress={62}
        status="uploading"
      />
      <UploadTrayItem
        onRowClick={() => undefined}
        icon={<Glyph />}
        meta="18%"
        name="Grid.png"
        progress={18}
        status="uploading"
      />
      <UploadTrayItem
        icon={<Glyph />}
        name="notes.txt"
        status="done"
        onRowClick={() => undefined}
      />
    </UploadTray>
  ),
};

/**
 * The failure is never colour-only: the glyph is red, the row is tinted, the
 * summary says so in words, and the row itself carries the sentence. Retry is
 * the one action a failed row gets.
 */
export const Failed: Story = {
  args: {
    status: 'failed',
    title: '1 of 3 uploads failed',
    onDismiss: () => undefined,
  },
  render: (args) => (
    <UploadTray {...args}>
      <UploadTrayItem
        icon={<Glyph />}
        name="giffycanvas.gif"
        status="done"
        onRowClick={() => undefined}
      />
      <UploadTrayItem
        onRowClick={() => undefined}
        action={<LinkButton>Retry</LinkButton>}
        error="The file is larger than the 25 MB limit"
        icon={<Glyph />}
        name="dataset-full-export.csv"
        status="failed"
      />
      <UploadTrayItem
        icon={<Glyph />}
        name="Grid.png"
        status="done"
        onRowClick={() => undefined}
      />
    </UploadTray>
  ),
};

/**
 * A long name truncates — it never wraps. The plate keeps its width so the
 * page it is docked in does not reflow as files arrive.
 */
export const LongNames: Story = {
  args: {
    status: 'complete',
    title: '2 uploads complete',
    onDismiss: () => undefined,
  },
  render: (args) => (
    <UploadTray {...args}>
      <UploadTrayItem
        onRowClick={() => undefined}
        icon={<Glyph />}
        meta="4.1 MB"
        name="2026-Q3-consolidated-revenue-by-region-and-product-line-final.xlsx"
        status="done"
      />
      <UploadTrayItem
        onRowClick={() => undefined}
        icon={<Glyph />}
        meta="12 KB"
        name="a.csv"
        status="done"
      />
    </UploadTray>
  ),
};

/** Collapsed. The whole bar except the ✕ is the toggle. */
export const Collapsed: Story = {
  args: {
    status: 'complete',
    title: '5 uploads complete',
    defaultOpen: false,
    onDismiss: () => undefined,
  },
  render: (args) => (
    <UploadTray {...args}>
      <UploadTrayItem
        icon={<Glyph />}
        name="one.png"
        status="done"
        onRowClick={() => undefined}
      />
      <UploadTrayItem
        icon={<Glyph />}
        name="two.png"
        status="done"
        onRowClick={() => undefined}
      />
    </UploadTray>
  ),
};

/**
 * `autoDismiss` — settled rows retire themselves, and the plate follows the
 * last one out. Off by default: a plate that clears itself is right for a
 * background upload nobody is watching, and wrong for one they are.
 *
 * A `failed` row never retires. It is the only row still waiting for an
 * answer, and clearing it would clear the question with it.
 */
export const AutoDismiss: Story = {
  args: {
    status: 'complete',
    title: '2 uploads complete',
    autoDismiss: true,
    autoDismissDelay: 1500,
    onDismiss: () => undefined,
  },
  render: (args) => (
    <UploadTray {...args}>
      <UploadTrayItem
        onRowClick={() => undefined}
        icon={<Glyph />}
        meta="1.2 MB"
        name="giffycanvas.gif"
        status="done"
      />
      <UploadTrayItem
        onRowClick={() => undefined}
        icon={<Glyph />}
        meta="480 KB"
        name="Grid.png"
        status="done"
      />
    </UploadTray>
  ),
};

/** With one failure in the batch, the plate stays and so does that row. */
export const AutoDismissWithFailure: Story = {
  args: {
    status: 'failed',
    title: '1 of 3 uploads failed',
    autoDismiss: true,
    autoDismissDelay: 1500,
    onDismiss: () => undefined,
  },
  render: (args) => (
    <UploadTray {...args}>
      <UploadTrayItem
        icon={<Glyph />}
        name="giffycanvas.gif"
        status="done"
        onRowClick={() => undefined}
      />
      <UploadTrayItem
        onRowClick={() => undefined}
        action={<LinkButton>Retry</LinkButton>}
        error="The file is larger than the 25 MB limit"
        icon={<Glyph />}
        name="dataset-full-export.csv"
        status="failed"
      />
      <UploadTrayItem
        icon={<Glyph />}
        name="Grid.png"
        status="done"
        onRowClick={() => undefined}
      />
    </UploadTray>
  ),
};

/**
 * `onRowClick` — the whole row is the target, with a hover surface to say so.
 *
 * The row is not wrapped in a button: the name becomes the control and
 * stretches over the row with `after:absolute after:inset-0`, the package's own
 * row-link recipe. So the accessible target is the file name rather than an
 * unlabelled box, and `action` still works — it sits above the stretched
 * pseudo-element rather than under it.
 */
export const ClickableRows: Story = {
  args: {
    status: 'complete',
    title: '0 of 2 workspaces configured',
    onDismiss: () => undefined,
  },
  render: (args) => (
    <UploadTray {...args}>
      <UploadTrayItem
        action={<LinkButton>Configure</LinkButton>}
        icon={<Glyph />}
        name="Marketing"
        onRowClick={() => undefined}
        status="done"
      />
      <UploadTrayItem
        action={<LinkButton>Configure</LinkButton>}
        icon={<Glyph />}
        name="Developers"
        onRowClick={() => undefined}
        status="done"
      />
    </UploadTray>
  ),
};
