import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRight, SearchX, Settings2, TriangleAlert } from 'lucide-react';
import { Badge } from '../src/components/Badge';
import { Button } from '../src/components/Button';
import { ConnectorLogo } from '../src/components/ConnectorLogo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRow,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../src/components/DropdownMenu';
import { LinkButton } from '../src/components/LinkButton';
import { PageHeader } from '../src/components/PageHeader';
import {
  EmptyStateIllustration,
  StatusView,
} from '../src/components/StatusView';
import { TextArea } from '../src/components/TextArea';
import { ChangeCase, ChangePage, Code } from './Harness';

const meta = {
  title: 'Proposed changes/4. New in the system',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CONNECTORS = [
  'PostgreSQL',
  'MySQL',
  'Oracle',
  'Snowflake',
  'BigQuery',
  'Salesforce',
];

export const NewInTheSystem: Story = {
  name: 'New in the system',
  render: () => (
    <ChangePage
      intro="Four additions. Two of them replace something every page was assembling by hand, which is the only reason they belong in the library rather than in a page."
      title="New in the system"
    >
      <ChangeCase
        after={
          <PageHeader
            actions={<Button size="sm">Save</Button>}
            badge={
              <Badge
                leftSlot={<ConnectorLogo connector="DB2" size="xs" />}
                variant="secondary"
              >
                DB2
              </Badge>
            }
            className="w-full"
            onBack={() => undefined}
            title="Connect to DB2"
          />
        }
        afterNote="badge slot — inside the title cluster"
        files={['src/components/PageHeader/index.tsx']}
        footnote={
          <>
            The badge renders right after the <Code>h1</Code>, 12px from it —
            the gap the rest of the row uses. The 4px inside the title cluster
            belongs to the back arrow, which is part of the title; a badge is a
            separate object and at 4px reads as glued on. The mark is the
            monogram: DB2 is not in the 23-logo pack, and §17 is where that
            fallback is the subject.{' '}
            <strong className="font-medium text-ink-body">To fix:</strong>{' '}
            DESIGN-SYSTEM-CHANGES.md §16 passes <Code>size="2xs"</Code> to
            ConnectorLogo, whose scale is <Code>xs | sm | md | lg</Code> — that
            snippet does not compile.
          </>
        }
        n={16}
        title="PageHeader — a badge that belongs to the title"
        why="A badge that names what a form connects to fits neither existing slot: in actions it lands at the right edge and reads as one more control next to Save."
      />

      <ChangeCase
        after={
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {CONNECTORS.map((connector) => (
                <div
                  className="flex flex-col items-center gap-1"
                  key={connector}
                >
                  <ConnectorLogo connector={connector} size="md" />
                  <span className="text-ink-secondary text-xxs">
                    {connector}
                  </span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-1">
                <ConnectorLogo
                  connector="Fabrikam"
                  label="Fabrikam"
                  size="md"
                />
                <span className="text-ink-secondary text-xxs">
                  Fabrikam — unknown
                </span>
              </div>
            </div>
            <div className="flex items-end gap-3">
              {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
                <div className="flex flex-col items-center gap-1" key={size}>
                  <ConnectorLogo connector="postgres" size={size} />
                  <span className="text-ink-secondary text-xxs">{size}</span>
                </div>
              ))}
            </div>
          </div>
        }
        afterNote="23 marks, embedded as data-URIs"
        files={['src/components/ConnectorLogo/']}
        footnote={
          <>
            Nothing is fetched at runtime, so a logo cannot arrive as a broken
            image in a consumer's build, in Storybook, or on a design canvas.
            Names resolve loosely — <Code>PostgreSQL</Code>,{' '}
            <Code>postgresql</Code> and <Code>postgres</Code> all find the same
            mark — and an unknown connector renders a monogram, not an empty
            square. Widening the pack is a re-run of{' '}
            <Code>scripts/gen-connector-logos.mjs</Code>, not a code change.
          </>
        }
        n={17}
        title="ConnectorLogo"
        why="There was no component: every page embedded connector marks its own way, and a page never knew which slug the asset folder used."
      />

      <ChangeCase
        after={
          <TextArea
            wrapperClassName="w-[320px]"
            defaultValue="Answer in the user's language."
            label="AI instructions"
            maxLength={4000}
            showCount
          />
        }
        afterNote="showCount — digits only, tabular-nums"
        before={
          <div className="flex w-[320px] flex-col gap-1">
            <TextArea
              defaultValue="Answer in the user's language."
              label="AI instructions"
            />
            <span className="text-ink-secondary text-xs">
              31 characters / 4000 max
            </span>
          </div>
        }
        beforeNote="a counter each page wrote by hand"
        beforeSource="a page's own counter line under a plain TextArea — the shape found on the prototype."
        files={['src/components/TextArea/index.tsx']}
        footnote={
          <>
            Digits only, because a worded phrase reads as a sentence and a
            screen reader re-reads it on every keystroke. Error text and counter
            share one line under the field: both describe the same field, and a
            separate line would shift the next field down every time an error
            appears. Works controlled and uncontrolled.
          </>
        }
        n={18}
        title="TextArea character counter"
        why="There was none, so pages wrote it by hand — differently each time."
      />

      <ChangeCase
        after={
          <StatusView
            actions={<Button size="sm">Clear filters</Button>}
            className="w-full"
            description="No connection matches “prod-eu”. Try a shorter query, or clear the filters."
            icon={<EmptyStateIllustration />}
            title="No connections found"
            withIconHalo={false}
          />
        }
        afterNote="EmptyStateIllustration — 150×104, all tokens"
        before={
          <StatusView
            actions={<Button size="sm">Clear filters</Button>}
            className="w-full"
            description="No connection matches “prod-eu”. Try a shorter query, or clear the filters."
            icon={<SearchX />}
            title="No connections found"
          />
        }
        beforeNote="a lucide glyph in a tinted halo"
        beforeSource="the same StatusView with the only artwork it used to offer."
        files={['src/components/StatusView/index.tsx']}
        footnote={
          <>
            Deliberately not a magnifier: "nothing found" is already said by the
            title, and a magnifier repeats it while saying nothing about what is
            absent. The illustration mirrors the list that is missing. Every
            colour is a token — <Code>--surface-card</Code>,{' '}
            <Code>--stroke-border</Code>, <Code>--ink-inactive</Code> — so it
            re-themes with the page and needs no dark variant. Flip the theme
            toolbar to check that.
          </>
        }
        n={19}
        title="StatusView — EmptyStateIllustration"
        why="At page scale a lucide glyph in a halo reads as a notification icon rather than an empty region."
      />

      <ChangeCase
        after={
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="font-medium text-ink-primary text-sm">
              Salesforce — EMEA
            </span>
            <span className="flex min-w-0 items-center gap-1 text-xs">
              <TriangleAlert className="size-3 shrink-0 text-fb-attention" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <LinkButton className="min-w-0 truncate">
                    2 workspaces
                  </LinkButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72">
                  <DropdownMenuRow className="justify-between">
                    Marketing
                    <ChevronRight className="size-4 text-ink-icon" />
                  </DropdownMenuRow>
                  <DropdownMenuRow className="justify-between">
                    Data Analyze
                    <ChevronRight className="size-4 text-ink-icon" />
                  </DropdownMenuRow>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="accent">
                    <Settings2 className="size-4" />
                    Configure Workspace
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </div>
        }
        afterNote="Click the link."
        files={['src/components/DropdownMenu/DropdownMenu.md']}
        footnote={
          <>
            <b>Why it is a draft.</b> It exists to serve one of three design
            concepts for the Connections list. In the concept that keeps a
            Workspaces <i>column</i>, the menu hangs off a disclosure control
            and this variant is not needed; in the one that carries the answer
            as a sentence under the connection's name, it is the only handle
            that fits. If that concept is not chosen, this goes with it — so
            nothing else should be built on it meanwhile.
            <br />
            <br />
            Nothing in the library changes either way:{' '}
            <Code>DropdownMenuTrigger asChild</Code> already accepts any child,
            and <Code>LinkButton</Code> already inherits its font-size from the
            line it sits in — which is what makes it come out at 12px here with
            no padding at all. What is new is only the statement that this is
            allowed, and the one rule that goes with it: the state glyph stays{' '}
            <i>outside</i> the trigger, because it marks the row, not the
            destination.
          </>
        }
        n="draft"
        state="draft"
        title="A menu opened by a LinkButton, not a control"
        why="A concept with no Workspaces column still has to answer “where is this reachable from”. Under a connection's name that answer is a sentence, and a tertiary button there would put a control's padding and hover surface inside a table cell, under a name that is already a target."
      />
    </ChangePage>
  ),
};
