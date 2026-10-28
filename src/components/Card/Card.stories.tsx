import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Download, Trash2 } from 'lucide-react';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { LinkButton } from '../LinkButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardDivider,
  CardFooter,
  CardHeader,
  CardIcon,
  CardSectionLabel,
  CardTitle,
} from './index';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    variant: 'outline',
    rounded: 'lg',
    fullWidth: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'secondary', 'row', 'elevated', 'ghost'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
    },
    children: { control: false },
    ref: { control: false, table: { disable: true } },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Usage this month</CardTitle>
        <CardDescription>Resets on the 1st of each month.</CardDescription>
      </CardHeader>
      <CardContent>
        You have used 640 of 1,000 messages included in your plan.
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="secondary" size="sm">
          View details
        </Button>
        <Button size="sm">Upgrade</Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-4">
      <Card {...args} variant="outline" className="w-72">
        <CardHeader>
          <CardTitle>Outline</CardTitle>
          <CardDescription>
            Bordered surface with a subtle shadow.
          </CardDescription>
        </CardHeader>
        <CardContent>Default variant, best for standalone content.</CardContent>
      </Card>
      <Card {...args} variant="secondary" className="w-72">
        <CardHeader>
          <CardTitle>Secondary</CardTitle>
          <CardDescription>Filled surface with hover feedback.</CardDescription>
        </CardHeader>
        <CardContent>Best for interactive list rows and tiles.</CardContent>
      </Card>
      <Card {...args} className="w-72" variant="elevated">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
          <CardDescription>
            Lifts on hover — shadow, brand-tinted border, -2px translate.
          </CardDescription>
        </CardHeader>
        <CardContent>The provider / connector tile surface.</CardContent>
      </Card>
      <Card {...args} className="w-72" variant="row">
        <CardContent>Row — compact single-line list item.</CardContent>
      </Card>
      <Card {...args} className="h-32 w-72" variant="ghost">
        <CardContent>
          Ghost — dashed &ldquo;browse more&rdquo; tile.
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * The full sub-part set the reference documents, in the shape of the provider
 * card: icon wrapper, title + description, divider, section label, footer CTA.
 */
export const Anatomy: Story = {
  render: (args) => (
    <Card {...args} className="w-64 gap-3" rounded="xl" variant="elevated">
      <CardHeader layout="horizontal" leftSlot={<CardIcon>JS</CardIcon>}>
        <CardTitle>Jira Software</CardTitle>
        <CardDescription className="text-xs">Not connected</CardDescription>
      </CardHeader>
      <CardDivider />
      <CardContent className="flex flex-col gap-2">
        <CardSectionLabel>Available metrics</CardSectionLabel>
        <div className="flex flex-wrap gap-1.5">
          <Badge rounded="md" size="sm" variant="secondary">
            Issues created
          </Badge>
          <Badge rounded="md" size="sm" variant="secondary">
            Bug count
          </Badge>
        </div>
      </CardContent>
      <CardFooter variant="actions">
        <Button size="sm">Connect</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * `CardHeader actions` — what the head offers, on its trailing edge. The slot
 * is one title line tall and centres what it holds on that line: a link, or a
 * 32px button, sits on the title's middle however long the description runs.
 * The text column takes what is left and wraps.
 */
export const HeaderActions: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="flex max-w-xl flex-col gap-4">
      <Card {...args} fullWidth className="p-6">
        <CardHeader
          actions={
            <LinkButton href="#" className="text-sm" rightSlot={<ArrowRight />}>
              Permissions
            </LinkButton>
          }
        >
          <CardTitle>Members with access</CardTitle>
        </CardHeader>
        <CardContent>Three groups and two users.</CardContent>
      </Card>
      <Card {...args} fullWidth className="p-6">
        <CardHeader
          actions={
            <Button size="sm" variant="secondary" leftSlot={<Download />}>
              Export
            </Button>
          }
        >
          <CardTitle>Logs</CardTitle>
        </CardHeader>
      </Card>
      <Card {...args} fullWidth className="p-6">
        <CardHeader
          actions={
            <Button
              size="sm"
              variant="destructiveSecondary"
              leftSlot={<Trash2 />}
            >
              Delete Workspace
            </Button>
          }
        >
          <CardTitle>Delete workspace</CardTitle>
          <CardDescription>
            The workspace goes, together with its data model and who has access
            to it. Your connections stay — you can keep using them in other
            workspaces.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
};

export const Rounded: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-4">
      {(
        [
          ['none', 'flush against a container edge'],
          ['sm', 'hairline chips and dense inline surfaces'],
          ['rounded', 'the 4px default step'],
          ['md', 'controls — buttons, inputs, menu items'],
          ['lg', 'the Card default — cards, popovers, accordion rows'],
          ['xl', 'banners and large surfaces'],
        ] as const
      ).map(([rounded, use]) => (
        <Card {...args} key={rounded} rounded={rounded} className="w-40">
          <CardHeader>
            <CardTitle>{rounded}</CardTitle>
          </CardHeader>
          <CardContent>{use}</CardContent>
        </Card>
      ))}
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Full-width card</CardTitle>
        <CardDescription>Stretches to fill its container.</CardDescription>
      </CardHeader>
      <CardContent>
        Useful inside page sections and settings panels.
      </CardContent>
    </Card>
  ),
};

/**
 * DRAFT. `CardFooter sticky` — a card taller than its scroller keeps its
 * actions in reach: the footer sticks to the bottom of the scroller while the
 * card scrolls under it, and settles in place at the card's end. Scroll the
 * box.
 */
export const StickyFooter: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="h-80 w-96 overflow-y-auto rounded-lg border border-stroke bg-surface-page p-4">
      <Card {...args} fullWidth>
        <CardHeader>
          <CardTitle>Connection settings</CardTitle>
          <CardDescription>Taller than the box it scrolls in.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {[
            'Host',
            'Port',
            'Database',
            'Schema',
            'User',
            'Password',
            'SSL mode',
            'Timeout',
            'Pool size',
            'Read only',
            'Time zone',
            'Encoding',
          ].map((setting) => (
            <p key={setting}>{setting} — a row of the form.</p>
          ))}
        </CardContent>
        <CardFooter sticky variant="actions">
          <Button variant="secondary" size="sm">
            Cancel
          </Button>
          <Button size="sm">Save</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

/**
 * DRAFT. `CardFooter divided` — the footer as a band of its own: a rule across
 * the top of a card whose sections run edge to edge (`p-0`). With `sticky` it
 * keeps the card's bottom corners while pinned. Scroll the box.
 */
export const DividedStickyFooter: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="h-80 w-96 overflow-y-auto rounded-lg border border-stroke bg-surface-page p-4">
      <Card {...args} fullWidth className="p-0">
        <div className="flex flex-col gap-3 p-6">
          {[
            'sakila',
            'public',
            'actor',
            'film',
            'customer',
            'payment',
            'rental',
            'staff',
            'store',
            'address',
          ].map((name) => (
            <p key={name}>{name} — a row of the tree.</p>
          ))}
        </div>
        <CardFooter sticky divided className="justify-end px-6 py-4">
          <Button variant="secondary" size="md">
            Cancel
          </Button>
          <Button size="md">Save</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};
