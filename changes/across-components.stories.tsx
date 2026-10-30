import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronUp, EllipsisVertical, Minus, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../src/components/Button';
import { Checkbox } from '../src/components/Checkbox';
import { IconButton } from '../src/components/IconButton';
import { ModalBody, ModalHeader } from '../src/components/Modal';
import { ScrollShadow } from '../src/components/ScrollShadow';
import {
  SegmentedControl,
  SegmentedControlList,
  SegmentedControlTrigger,
} from '../src/components/SegmentedControl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../src/components/Table';
import { Tabs, TabsList, TabsTrigger } from '../src/components/Tabs';
import { ChangeCase, ChangePage, Code, TryIt } from './Harness';
import { Checkbox as UpstreamCheckbox } from './upstream/Checkbox';

const meta = {
  title: 'Proposed changes/Across components',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Labelled({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="font-medium text-ink-inactive text-xxs uppercase leading-4 tracking-caps">
        {label}
      </span>
      {children}
    </div>
  );
}

/* §98 ------------------------------------------------------------------ */

/**
 * The table frame at f69ebc9 — `git show f69ebc9:src/components/Table/index.tsx`,
 * verbatim. The frame is an element `Table` renders itself, so no prop reaches
 * it to take `scrollbar-thin` off: the Before half wraps the live table in this
 * string and sets the live frame to `display: contents`, which draws no box.
 */
const OLD_TABLE_FRAME =
  'relative w-full overflow-x-auto rounded-md border border-stroke bg-surface-card';

/** `ModalBody` at f69ebc9: `ScrollShadow` with this class string, and no bar. */
const OLD_MODAL_BODY = '-mr-4 flex min-h-0 flex-1 flex-col gap-3 pr-2';

const CONNECTIONS = [
  'Finance warehouse',
  'Sales CRM',
  'Marketing events',
  'Support tickets',
  'Billing ledger',
  'HR directory',
  'Inventory',
  'Web analytics',
  'Partner portal',
  'Product catalog',
  'Audit log',
  'Forecasts',
].map((name, i) => ({
  name,
  database: ['PostgreSQL', 'SQL Server', 'MySQL', 'Oracle'][i % 4],
  owner: ['Dana Reyes', 'Ivan Holt', 'Mei Tanaka'][i % 3],
  synced: `${i + 2} min ago`,
  rows: `${(i + 3) * 1173}`,
}));

function ConnectionsTable({ frame }: { frame?: string }) {
  return (
    <Table className="min-w-[640px]" wrapperClassName={frame}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Database</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Last sync</TableHead>
          <TableHead className="text-right">Rows</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {CONNECTIONS.map((c) => (
          <TableRow key={c.name}>
            <TableCell className="font-medium">{c.name}</TableCell>
            <TableCell>{c.database}</TableCell>
            <TableCell>{c.owner}</TableCell>
            <TableCell>{c.synced}</TableCell>
            <TableCell className="text-right tabular-nums">{c.rows}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const TERMS = [
  'Members of this workspace can open every connection in it, run saved queries and export results.',
  'Owners can also add and remove connections, change the data model scope and invite people.',
  'A connection shared from another workspace keeps the permissions it was shared with; it cannot be widened here.',
  'Removing a member does not delete the queries they saved — those move to the workspace owner.',
  'Changes apply the next time each member opens the workspace.',
];

/** A dialog's frame — `ModalContent`'s border, radius and 16px inset — inline. */
function DialogBody({ old }: { old?: boolean }) {
  const body = TERMS.map((text) => (
    <p className="text-ink-body text-sm leading-5" key={text}>
      {text}
    </p>
  ));
  return (
    <div className="flex h-52 w-full flex-col rounded-2xl border border-stroke bg-surface-card p-4">
      <ModalHeader>
        <span className="font-semibold text-base text-ink-primary">
          Share workspace
        </span>
      </ModalHeader>
      {old ? (
        <ScrollShadow className={OLD_MODAL_BODY} size={40}>
          {body}
        </ScrollShadow>
      ) : (
        <ModalBody>{body}</ModalBody>
      )}
    </div>
  );
}

function Scrollers({ old }: { old?: boolean }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-5">
      <Labelled label="Table, given a height">
        {old ? (
          <div className={`${OLD_TABLE_FRAME} max-h-44`}>
            <ConnectionsTable frame="contents" />
          </div>
        ) : (
          <ConnectionsTable frame="max-h-44" />
        )}
      </Labelled>
      <Labelled label="ModalBody, a long body">
        <DialogBody old={old} />
      </Labelled>
    </div>
  );
}

/* §99 ------------------------------------------------------------------ */

/** What f69ebc9 carried beside `cursor-not-allowed` on both triggers. */
const OLD_SWITCHED_OFF = 'disabled:pointer-events-none';

function SwitchedOff({ old }: { old?: boolean }) {
  const off = old ? OLD_SWITCHED_OFF : undefined;
  const BoxComponent = old ? UpstreamCheckbox : Checkbox;
  return (
    <TryIt action="Point at each switched-off control">
      <div className="flex flex-col gap-5">
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger className={off} disabled value="permissions">
              Permissions
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <SegmentedControl defaultValue="allow">
          <SegmentedControlList>
            <SegmentedControlTrigger className={off} disabled value="allow">
              Allow
            </SegmentedControlTrigger>
            <SegmentedControlTrigger className={off} disabled value="deny">
              Deny
            </SegmentedControlTrigger>
          </SegmentedControlList>
        </SegmentedControl>
        <BoxComponent disabled label="Include system tables" />
      </div>
    </TryIt>
  );
}

/* §155 ----------------------------------------------------------------- */

const BRANCHES = [
  { name: 'Finance', depth: 0, open: true },
  { name: 'Warehouse', depth: 1, open: true },
  { name: 'Archive', depth: 1, open: false },
];

/**
 * f69ebc9's `pressed:` matched every `aria-expanded="true"`; today's matches it
 * only beside `aria-haspopup`. So `aria-haspopup` on the Before buttons makes
 * today's variant paint them exactly as the old one did — the variant lives in
 * the preset, not in a component, so there is no class string to reapply.
 */
function Disclosures({ old }: { old?: boolean }) {
  const was = old ? { 'aria-haspopup': true } : {};
  return (
    <div className="flex w-full flex-col gap-5">
      <Labelled label="Tree toggles">
        <ul className="flex flex-col gap-1">
          {BRANCHES.map((b) => (
            <li
              className="flex items-center gap-2 text-ink-body text-sm"
              key={b.name}
              style={{ paddingInlineStart: b.depth * 24 }}
            >
              <IconButton
                aria-expanded={b.open}
                aria-label={`${b.open ? 'Collapse' : 'Expand'} ${b.name}`}
                size="2xs"
                variant="secondary"
                {...was}
              >
                {b.open ? <Minus /> : <Plus />}
              </IconButton>
              {b.name}
            </li>
          ))}
        </ul>
      </Labelled>
      <Labelled label="A disclosure, open">
        <Button
          aria-expanded
          className="self-start"
          size="sm"
          variant="tertiary"
          {...was}
        >
          <ChevronUp />
          Show less
        </Button>
      </Labelled>
      <Labelled label="A menu trigger, open — pressed in both">
        <IconButton
          aria-expanded
          aria-haspopup="menu"
          aria-label="More actions"
          variant="tertiary"
        >
          <EllipsisVertical />
        </IconButton>
      </Labelled>
    </div>
  );
}

export const Page: Story = {
  name: 'Across components',
  render: () => (
    <ChangePage
      group="Across components"
      intro="Changes that land in several components at once — a cursor, a scrollbar, a variant — so no one component's page owns them."
      title="Across components"
    >
      <ChangeCase
        after={<Scrollers />}
        afterNote="scrollbar-thin — 10px track, 4px thumb"
        before={<Scrollers old />}
        beforeNote="the platform's bar — 16px, arrows on Windows"
        beforeSource={
          <>
            a replica of two elements, both with f69ebc9's class strings
            verbatim. The table frame is one the component renders itself: the
            live table sits inside <Code>{OLD_TABLE_FRAME}</Code>, its own frame
            set to <Code>display: contents</Code>. <Code>ModalBody</Code> is the
            live <Code>ScrollShadow</Code> it wraps, with the class string it
            passed.
          </>
        }
        files={[
          'src/components/Table/index.tsx',
          'src/components/Modal/ModalBody.tsx',
        ]}
        footnote={
          <>
            The frame is a scroller both ways: across for a wide table, and down
            wherever a parent gives it a height — in a dialog it shrinks to the
            body and scrolls itself. Raised by the workspaces prototype's table
            preview, twenty rows in a dialog. The frame's corner also moved,{' '}
            <Code>rounded-md</Code> → <Code>rounded-lg</Code>; that is not this
            §.
          </>
        }
        n={98}
        title="Table, ModalBody — the system's scrollbar"
        why="Both scroll, and both scrolled with the platform's bar — on Windows a 16px trough with stepper arrows, the heaviest line in a dialog drawn in hairlines."
      />

      <ChangeCase
        after={<SwitchedOff />}
        afterNote="not-allowed on every switched-off control"
        before={<SwitchedOff old />}
        beforeNote="the arrow — no pointer events, so no cursor"
        beforeSource={
          <>
            the live tabs and segments with f69ebc9's{' '}
            <Code>{OLD_SWITCHED_OFF}</Code> reapplied through{' '}
            <Code>className</Code>; the checkbox is the developers' own,
            vendored unchanged into <Code>changes/upstream/Checkbox.tsx</Code>.
          </>
        }
        files={[
          'src/components/SegmentedControl/SegmentedControlTrigger.tsx',
          'src/components/Tabs/TabsTrigger.tsx',
          'src/components/Toggle/index.tsx',
          'src/components/Checkbox/Checkbox.tsx',
          'src/components/Switch/index.tsx',
          'src/components/DropdownMenu/DropdownMenuItem.tsx',
          'src/components/DropdownMenu/DropdownMenuCheckboxItem.tsx',
          'src/components/DropdownMenu/DropdownMenuRadioItem.tsx',
          'src/components/Accordion/AccordionTrigger.tsx',
        ]}
        footnote={
          <>
            Hover recipes now sit behind <Code>enabled:</Code> (
            <Code>Switch</Code>: <Code>:not([data-disabled])</Code>), so nothing
            lights up once the pointer can reach the control.{' '}
            <Code>RadioButton</Code>, <Code>Button</Code> and{' '}
            <Code>IconButton</Code> already worked this way at f69ebc9.
          </>
        }
        n={99}
        title="Disabled controls — the not-allowed cursor"
        why={
          <>
            <Code>pointer-events-none</Code> sat beside{' '}
            <Code>cursor-not-allowed</Code> and cancelled it: with no pointer
            events the cursor is never asked for, so a switched-off control
            showed the arrow — and a tooltip saying why it was off could not
            open on it. The checkbox's own label said not-allowed; its box did
            not.
          </>
        }
      />

      <ChangeCase
        after={<Disclosures />}
        afterNote="the glyph says open — pressed is only the press"
        before={<Disclosures old />}
        beforeNote="every open disclosure held down"
        beforeSource={
          <>
            the same live buttons with <Code>aria-haspopup</Code> added.
            f69ebc9's <Code>pressed:</Code> matched every{' '}
            <Code>aria-expanded="true"</Code>; today's matches it only beside{' '}
            <Code>aria-haspopup</Code>, so on these buttons it paints exactly
            what the old one did. The variant lives in the preset, not in a
            component, so there is no class string to reapply.
          </>
        }
        files={[
          'src/tailwind-preset.ts',
          'src/components/Tree/index.tsx',
          'src/components/Sidebar/SidebarMenuButton.tsx',
        ]}
        footnote={
          <>
            A popup trigger still holds down while its menu, popover, dialog or
            select is open — Radix stamps <Code>aria-haspopup</Code> on those
            triggers and <Code>role="combobox"</Code> on <Code>Select</Code>
            's, so none of them changed. Trees and disclosures follow WAI-ARIA
            APG and Carbon: +/− or a turned caret carries the state.
          </>
        }
        n={155}
        title="pressed: — an open disclosure is not a held press"
        why="The variant matched every aria-expanded, and a disclosure carries it too: a column of pressed −'s down an opened tree, a pressed Show less, a chosen expandable ChoiceCard whose pressed fill out-ranked its chosen wash."
      />
    </ChangePage>
  ),
};
