import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BookOpen,
  ChevronDown,
  CircleHelp,
  Copy,
  Layers,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Settings,
  TriangleAlert,
} from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';
import { Button } from '../../src/components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRow,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../src/components/DropdownMenu';
import { LinkButton } from '../../src/components/LinkButton';
import { Switch } from '../../src/components/Switch';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';
import { DropdownMenuContent as UpstreamDropdownMenuContent } from '../upstream/DropdownMenu/DropdownMenuContent';
import { DropdownMenuItem as UpstreamDropdownMenuItem } from '../upstream/DropdownMenu/DropdownMenuItem';

const meta = {
  title: 'Proposed changes/Components/DropdownMenu',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const UPSTREAM_SOURCE = (
  <>
    the developers' own <Code>DropdownMenuContent</Code> and{' '}
    <Code>DropdownMenuItem</Code>, vendored unchanged from their 1.4.0 into{' '}
    <Code>changes/upstream/DropdownMenu/</Code> — the menu their storybook
    ships, not a replica of it.
  </>
);

/** The demo links stay on this page. */
const stayHere = (event: MouseEvent) => event.preventDefault();

/**
 * A menu held open beside its twin: non-modal and controlled, so a click
 * elsewhere on the page does not close it, and never flipped above its
 * trigger, so it stays inside its own panel.
 */
function HeldOpen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="h-60">
      <DropdownMenu modal={false} open>
        <DropdownMenuTrigger asChild>
          <Button rightSlot={<MoreHorizontal />} variant="secondary">
            {label}
          </Button>
        </DropdownMenuTrigger>
        {children}
      </DropdownMenu>
    </div>
  );
}

/** A connection's menu: a reading with its own switch, two actions, THE action. */
function RowKindsBefore() {
  return (
    <HeldOpen label="Finance warehouse">
      <UpstreamDropdownMenuContent align="start" avoidCollisions={false}>
        <UpstreamDropdownMenuItem>
          <span className="flex-1">Auto-sync</span>
          <Switch aria-label="Auto-sync" defaultChecked size="sm" />
        </UpstreamDropdownMenuItem>
        <DropdownMenuSeparator />
        <UpstreamDropdownMenuItem>
          <Pencil />
          Rename
        </UpstreamDropdownMenuItem>
        <UpstreamDropdownMenuItem>
          <Copy />
          Duplicate
        </UpstreamDropdownMenuItem>
        <DropdownMenuSeparator />
        <UpstreamDropdownMenuItem>
          <Settings />
          Manage connections
        </UpstreamDropdownMenuItem>
      </UpstreamDropdownMenuContent>
    </HeldOpen>
  );
}

function RowKindsAfter() {
  return (
    <HeldOpen label="Finance warehouse">
      <DropdownMenuContent align="start" avoidCollisions={false}>
        <DropdownMenuRow>
          <span className="flex-1">Auto-sync</span>
          <Switch aria-label="Auto-sync" defaultChecked size="sm" />
        </DropdownMenuRow>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Pencil />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="accent">
          <Settings />
          Manage connections
        </DropdownMenuItem>
      </DropdownMenuContent>
    </HeldOpen>
  );
}

/**
 * A connection's name with the answer under it — "Used in 2 workspaces" — and
 * the menu of those workspaces hung off the count. The library is the same on
 * both sides; only the handle differs.
 */
function UsedIn({ handle }: { handle: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-medium text-ink-primary text-sm">
        Finance warehouse
      </span>
      <span className="flex items-center gap-1.5 text-ink-secondary text-xs">
        Used in
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{handle}</DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Layers />
              Data Analyze
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Layers />
              Finance BI
              <TriangleAlert className="ms-auto text-fb-attention" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TriangleAlert
          aria-label="A workspace needs attention"
          className="size-3.5 text-fb-attention"
        />
      </span>
    </div>
  );
}

const WORKSPACE_ROWS = ['Finance warehouse', 'Sales replica'];

/** Two table rows, each with its Workspaces menu — the report's own shape. */
function WorkspacesRows({ upstream }: { upstream?: boolean }) {
  return (
    <div className="flex w-full flex-col">
      {WORKSPACE_ROWS.map((name) => (
        <div
          className="flex items-center justify-between gap-3 border-stroke border-b py-2 text-ink-body text-sm last:border-b-0"
          key={name}
        >
          {name}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button rightSlot={<ChevronDown />} size="xs" variant="secondary">
                2 workspaces
              </Button>
            </DropdownMenuTrigger>
            {upstream ? (
              <UpstreamDropdownMenuContent align="end">
                <UpstreamDropdownMenuItem>
                  <Layers />
                  Data Analyze
                </UpstreamDropdownMenuItem>
                <UpstreamDropdownMenuItem>
                  <Layers />
                  Finance BI
                </UpstreamDropdownMenuItem>
              </UpstreamDropdownMenuContent>
            ) : (
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Layers />
                  Data Analyze
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Layers />
                  Finance BI
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}

function SupportBefore() {
  return (
    <HeldOpen label="Support">
      <UpstreamDropdownMenuContent align="start" avoidCollisions={false}>
        <UpstreamDropdownMenuItem>
          <MessageSquare />
          Leave feedback
        </UpstreamDropdownMenuItem>
        <UpstreamDropdownMenuItem asChild>
          <a
            href="https://www.devart.com"
            onClick={stayHere}
            rel="noopener"
            target="_blank"
          >
            <CircleHelp />
            Resources
          </a>
        </UpstreamDropdownMenuItem>
        <UpstreamDropdownMenuItem asChild>
          <a
            href="https://docs.devart.com"
            onClick={stayHere}
            rel="noopener"
            target="_blank"
          >
            <BookOpen />
            Documentation
          </a>
        </UpstreamDropdownMenuItem>
      </UpstreamDropdownMenuContent>
    </HeldOpen>
  );
}

function SupportAfter() {
  return (
    <HeldOpen label="Support">
      <DropdownMenuContent align="start" avoidCollisions={false}>
        <DropdownMenuItem>
          <MessageSquare />
          Leave feedback
        </DropdownMenuItem>
        <DropdownMenuItem asChild isExternal>
          <a
            href="https://www.devart.com"
            onClick={stayHere}
            rel="noopener"
            target="_blank"
          >
            <CircleHelp />
            Resources
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild isExternal>
          <a
            href="https://docs.devart.com"
            onClick={stayHere}
            rel="noopener"
            target="_blank"
          >
            <BookOpen />
            Documentation
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </HeldOpen>
  );
}

export const Page: Story = {
  name: 'DropdownMenu',
  render: () => (
    <ChangePage group="DropdownMenu" title="DropdownMenu">
      <ChangeCase
        after={<RowKindsAfter />}
        afterNote="DropdownMenuRow — no hover · accent — brand ink, medium"
        before={<RowKindsBefore />}
        beforeNote="one kind of row — every row highlights, every row is equal"
        beforeSource={UPSTREAM_SOURCE}
        files={[
          'src/components/DropdownMenu/DropdownMenuItem.tsx',
          'src/components/DropdownMenu/DropdownMenuRow.tsx',
        ]}
        footnote={
          <>
            Hover the Auto-sync row on each side. <Code>accent</Code> is ink and
            weight on the same rail, not a bordered button: at 4px of menu
            padding a second edge lands against the divider and outweighs the
            list. <Code>--ink-highlight</Code> holds AA on light and dark.
          </>
        }
        n={43}
        state="draft"
        title="Two kinds of row it could not draw"
        why="A menu had one row — an item that highlights and acts — so a reading with its own switch promised a click it did not have, and the one action the menu exists for read like every other row. Pages built both out of a Popover instead."
      />

      <ChangeCase
        after={
          <TryIt action="Open the menu from the count">
            <UsedIn handle={<LinkButton>2 workspaces</LinkButton>} />
          </TryIt>
        }
        afterNote="LinkButton — the size of the line it sits in"
        before={
          <TryIt action="Open the menu from the count">
            <UsedIn
              handle={
                <Button
                  rightSlot={<ChevronDown />}
                  size="xs"
                  variant="secondary"
                >
                  2 workspaces
                </Button>
              }
            />
          </TryIt>
        }
        beforeNote="a secondary Button — a control's box inside a line of text"
        beforeSource={
          <>
            the same live menu with the handle the developers' stories hang
            every menu from, a <Code>secondary</Code> <Code>Button</Code>.
            Nothing in the library differs between the halves.
          </>
        }
        files={['src/components/DropdownMenu/DropdownMenu.md']}
        footnote={
          <>
            Nothing in the library changed:{' '}
            <Code>DropdownMenuTrigger asChild</Code> already took any child.
            What is new is that it is allowed, and the two rules with it — one
            menu whatever the handle, and the state glyph outside the trigger,
            because it marks the row, not the destination. Written for one of
            three Connections concepts; if that one is not chosen, the section
            goes.
          </>
        }
        n={55}
        state="draft"
        title="A link may open a menu"
        why="Where the menu hangs off a reading — the answer on a line under a name — the only handle the library showed was a control, with a padding and a hover surface inside a cell whose title is already a target."
      />

      <ChangeCase
        after={
          <TryIt action="Open a menu with the mouse, pick a workspace, look at the trigger">
            <WorkspacesRows />
          </TryIt>
        }
        afterNote="focus restored for the keyboard only — no ring after a click"
        before={
          <TryIt action="Open a menu with the mouse, pick a workspace, look at the trigger">
            <WorkspacesRows upstream />
          </TryIt>
        }
        beforeNote="focus handed back on every close — and the ring with it"
        beforeSource={UPSTREAM_SOURCE}
        files={[
          'src/components/DropdownMenu/DropdownMenuContent.tsx',
          'src/lib/focus-modality.ts',
        ]}
        footnote={
          <>
            Radix returns focus to the trigger with a programmatic{' '}
            <Code>focus()</Code>, which Chrome answers with{' '}
            <Code>:focus-visible</Code> — so no stylesheet can tell the two
            cases apart. <Code>DropdownMenuContent</Code> now keeps the restore
            for the keyboard and skips it for the pointer. Open a menu with
            Enter and close it with Escape: both halves hand focus back, ring
            and all.
          </>
        }
        n={74}
        title="The focus ring a closed menu left behind"
        why="A menu opened and closed with the mouse left its trigger wearing a focus ring — on one row of a table nobody was navigating with the keyboard, where it read as “this row is selected”."
      />

      <ChangeCase
        after={<SupportAfter />}
        afterNote="trailing 14px arrow in Text/Secondary · “(opens in new tab)” for a screen reader"
        before={<SupportBefore />}
        beforeNote="a new tab looks like any other row"
        beforeSource={UPSTREAM_SOURCE}
        files={['src/components/DropdownMenu/DropdownMenuItem.tsx']}
        footnote={
          <>
            It only says so: the link and its <Code>target="_blank"</Code> are
            the caller's, passed with <Code>asChild</Code>, and the arrow and
            the hidden words are injected into that link. The arrow is the one{' '}
            <Code>SidebarMenuRow</Code> already draws.
          </>
        }
        n={130}
        title="isExternal"
        why="A row that leaves the product for a new tab — Help, Terms — looked and read like a row that acts in place; products drew their own arrow, each its own way."
      />
    </ChangePage>
  ),
};
