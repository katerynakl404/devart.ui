import type { Meta, StoryObj } from '@storybook/react-vite';
import { composeStories } from '@storybook/react-vite';
import { ChevronsUpDown, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../src/components/Button';
import { Checkbox } from '../../src/components/Checkbox';
import { IconButton } from '../../src/components/IconButton';
import {
  EmptyStateIllustration,
  StatusView,
} from '../../src/components/StatusView';
import {
  Table,
  TableActionsCell,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src/components/Table';
import * as TableStories from '../../src/components/Table/Table.stories';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/Table',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The catalog's own stories, rendered rather than rebuilt — composing them
 * here means the two cannot drift: change `Components/Table` and these panels
 * change with it.
 */
const { InteractiveRows, SortableHeader, WithRowActions } =
  composeStories(TableStories);

/**
 * The cell recipe the published catalog ships —
 * `git show upstream/master:src/components/Table/TableCell.tsx`. Reapplied
 * through `className`, where twMerge keeps the last class in each group, so the
 * Before half is the old rendering rather than an impression of it.
 */
const OLD_CELL = 'h-9 whitespace-nowrap p-2 text-xs';

/** The same for the header: 12px in on the start edge, 8px on the end. */
const OLD_HEAD = 'ps-3 pe-2 text-xs';

/**
 * The published press rule. It keys off the row alone, so anything pressed
 * inside the row — a button, a link, a menu trigger — painted the whole row.
 */
const OLD_PRESS =
  'group-data-[interactive]/row:group-active/row:bg-tbl-row-pressed';

/**
 * The published row had no cursor rule at all, so its cells inherited `auto`.
 * Through `className` twMerge drops the live `data-[interactive]:cursor-pointer`
 * for this, which puts the inherited `auto` back.
 */
const OLD_CURSOR = 'data-[interactive]:cursor-auto';

const CONNECTIONS = [
  { name: 'analytics-prod', type: 'PostgreSQL', synced: '2 min ago' },
  { name: 'billing-eu', type: 'MySQL', synced: '1 h ago' },
  { name: 'crm-sync', type: 'Salesforce', synced: 'Yesterday' },
  { name: 'warehouse', type: 'Snowflake', synced: '5 min ago' },
  { name: 'legacy-orders', type: 'SQL Server', synced: '3 days ago' },
];

const ROWS = [
  {
    id: 'INV001',
    name: 'analytics-prod',
    note: 'Read replica in eu-central-1, refreshed nightly at 02:00 UTC by the ingest job.',
    status: 'Connected',
  },
  {
    id: 'INV002',
    name: 'billing-eu',
    note: 'Primary, write access. Owner: platform.',
    status: 'Connected',
  },
];

function NoteTable({ old, widths }: { old?: boolean; widths?: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className={old ? OLD_HEAD : undefined}
            width={widths ? 'md' : undefined}
          >
            Source
          </TableHead>
          <TableHead className={old ? OLD_HEAD : undefined}>Note</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.id}>
            <TableCell className={old ? OLD_CELL : undefined}>
              {row.name}
            </TableCell>
            <TableCell className={old ? OLD_CELL : undefined}>
              {row.note}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function NestedTable({ old }: { old?: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>Schema</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>analytics-prod</TableCell>
          <TableCell>public</TableCell>
        </TableRow>
        {['orders', 'customers'].map((table) => (
          <TableRow key={table} nested={!old}>
            <TableCell className="ps-8 text-ink-secondary">{table}</TableCell>
            <TableCell className="text-ink-secondary">public</TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell>billing-eu</TableCell>
          <TableCell>public</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

/**
 * Every one of the five `width` values in one table — a checkbox column, two
 * shares, an auto column and a row-action cluster. `old` swaps the prop for
 * the pixel widths a page had to write before it existed.
 */
function WidthTable({ old }: { old?: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className={old ? 'w-[40px]' : undefined}
            width={old ? undefined : 'control'}
          >
            <Checkbox aria-label="Select all" />
          </TableHead>
          <TableHead
            className={old ? 'w-[180px]' : undefined}
            width={old ? undefined : 'md'}
          >
            Source
          </TableHead>
          <TableHead>Note</TableHead>
          <TableHead
            className={old ? 'w-[110px]' : undefined}
            width={old ? undefined : 'sm'}
          >
            Status
          </TableHead>
          <TableHead
            className={old ? 'w-[96px]' : undefined}
            width={old ? undefined : 'actions'}
          >
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow data-interactive key={row.id}>
            <TableCell>
              <Checkbox aria-label={`Select ${row.name}`} />
            </TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.note}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableActionsCell>
              <IconButton aria-label="Edit" size="2xs" variant="tertiary">
                <Pencil />
              </IconButton>
              <IconButton
                aria-label="Delete"
                size="2xs"
                variant="destructiveTertiary"
              >
                <Trash2 />
              </IconButton>
            </TableActionsCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function PressTable({ old }: { old?: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead width="md">Source</TableHead>
          <TableHead>Status</TableHead>
          <TableHead width="actions">&nbsp;</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow className="cursor-pointer" data-interactive key={row.id}>
            <TableCell className={old ? OLD_PRESS : undefined}>
              {row.name}
            </TableCell>
            <TableCell className={old ? OLD_PRESS : undefined}>
              {row.status}
            </TableCell>
            <TableCell className={old ? OLD_PRESS : undefined}>
              <Button size="xs" variant="secondary">
                Test
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DensityTable({ compact }: { compact?: boolean }) {
  return (
    <Table density={compact ? 'compact' : undefined}>
      <TableHeader>
        <TableRow>
          <TableHead>Connection</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Last sync</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {CONNECTIONS.map((row) => (
          <TableRow key={row.name}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.type}</TableCell>
            <TableCell>{row.synced}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function CursorTable({ old }: { old?: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Connection</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {CONNECTIONS.slice(0, 3).map((row) => (
          <TableRow
            className={old ? OLD_CURSOR : undefined}
            data-interactive
            key={row.name}
          >
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const Page: Story = {
  name: 'Table',
  render: () => (
    <ChangePage group="Table" title="Table">
      <ChangeCase
        after={
          <TryIt action="Hover the Invoice header — label and glyph move together">
            <SortableHeader />
          </TryIt>
        }
        afterNote="hover: both, on ink-icon-hover"
        before={
          <TryIt action="Hover the header — only the words change colour">
            <div className="px-4 py-2.5">
              <button
                className="inline-flex items-center gap-1.5 rounded font-medium text-ink-secondary text-xs leading-4 transition-colors hover:text-ink-body"
                type="button"
              >
                Invoice
                <ChevronsUpDown className="size-3.5 text-ink-inactive" />
              </button>
            </div>
          </TryIt>
        }
        beforeNote="hover: label only, on ink-body"
        beforeSource={
          <>
            a replica of the sort control carrying HEAD's two class strings — on
            the button <Code>transition-colors hover:text-ink-body</Code>, on
            the glyph a bare <Code>text-ink-inactive</Code> with no hover rule
            at all. The button is rendered inside <Code>TableHead</Code> and its
            classes are not reachable from a prop; the After half is the
            catalog's own <Code>Components/Table → SortableHeader</Code>,
            composed rather than rebuilt.
          </>
        }
        files={['src/components/Table/TableHead.tsx']}
        footnote={
          <>
            The mechanism is a <Code>group</Code> on the button and{' '}
            <Code>group-hover:text-ink-icon-hover</Code> on the glyph, so the
            chevrons follow the label instead of sitting out the interaction.
            The glyph still rests a step quieter — an unsorted column should not
            shout — but the two now move together.{' '}
            <strong className="font-medium text-ink-body">
              No press state, deliberately:
            </strong>{' '}
            a sort header commits on click and the feedback is the table
            reordering, so a press colour on a control with no box reads as a
            flicker.{' '}
            <strong className="font-medium text-ink-body">
              Against the kit:
            </strong>{' '}
            its sort control is <Code>hover:text-ink-body</Code> on the label
            and nothing on the glyph, so this is an addition — the package is a
            step ahead of the kit here, not catching up to it.
          </>
        }
        n={6}
        title="The sort glyph did not hover with its label"
        why="Hover moved only the words to ink-body while the chevrons stayed inactive, so a header read as two controls — one that answers the pointer and one that ignores it."
      />

      <ChangeCase
        after={<NoteTable />}
        afterNote="16px inset · 14px text · wraps inside the table's width"
        before={<NoteTable old />}
        beforeNote="8px inset · 12px text · one line, and the table grows past the card"
        beforeSource={
          <>
            the published cell recipe — <Code>h-9 p-2 text-xs</Code> plus{' '}
            <Code>whitespace-nowrap</Code> — put back through{' '}
            <Code>className</Code>. The columns are the same in both halves, so
            the only variable is the cell.
          </>
        }
        files={['src/components/Table/TableCell.tsx']}
        footnote={
          <>
            Three things moved together because they are one recipe. The inset
            went 8 → 16 to match the header and the kit's{' '}
            <Code>table.tbl td</Code>; the text went 12 → 14, the size every
            other body text in the system uses; and{' '}
            <Code>whitespace-nowrap</Code> came off, so a row grows with its
            content instead of pushing the table past the card it sits in. A
            table that must hold its columns to one line asks for it explicitly
            — <Code>&lt;Table layout="fixed"&gt;</Code> restores the clamp, and
            adds the ellipsis the old rule never had.
          </>
        }
        n={42}
        title="A cell that could not grow, under a comment saying it could"
        why="Every cell was one clipped line of 12px text at an 8px inset, so a note column showed its first four words and a table sat tighter than the card it was in."
      />

      <ChangeCase
        after={
          <TryIt action="Press the row, then press Test — the fill follows what you pressed">
            <PressTable />
          </TryIt>
        }
        afterNote="pressing a control leaves the row alone"
        before={
          <TryIt action="Press Test — the whole row paints">
            <PressTable old />
          </TryIt>
        }
        beforeNote="any press inside the row paints the row"
        beforeSource={
          <>
            the published press rule —{' '}
            <Code>group-data-[interactive]/row:group-active/row:…</Code> —
            reapplied through <Code>className</Code>. It keys off the row and
            nothing else, which is the defect.
          </>
        }
        files={['src/components/Table/TableCell.tsx']}
        footnote={
          <>
            The row's press state says "this row is being opened". A button
            inside it says something narrower, and painting the row under it
            claims an action the click is not going to take. The fix is a
            negative condition on the same rule —{' '}
            <Code>:not(:has(button:active))</Code>, the same for a link and for
            an open menu — so the row answers only a press that is the row's
            own. <Code>--tbl-row-selected-hover</Code> went with it: a selected
            row keeps its own surface and whatever is hovered inside it
            composites on top, which is what the overlay tokens are for.
          </>
        }
        n={50}
        title="The row's pressed fill belonged to whatever was pressed"
        why="Pressing a button inside an interactive row painted the entire row, so a row action looked like it was opening the row."
      />

      <ChangeCase
        after={
          <div className="flex flex-col gap-2">
            <WidthTable />
            <p className="text-ink-secondary text-xs">
              <Code>control</Code> · <Code>md</Code> · auto · <Code>sm</Code> ·{' '}
              <Code>actions</Code>
            </p>
          </div>
        }
        afterNote="control 48 · md 16% · auto · sm 12% · actions 112"
        before={
          <div className="flex flex-col gap-2">
            <WidthTable old />
            <p className="text-ink-secondary text-xs">
              <Code>w-[40px]</Code> · <Code>w-[180px]</Code> · auto ·{' '}
              <Code>w-[110px]</Code> · <Code>w-[96px]</Code>
            </p>
          </div>
        }
        beforeNote="a pixel width per column, five numbers set by the page"
        beforeSource="a consumer's own hand-set widths — the published TableHead has no width prop, so this is what a page had to write."
        files={['src/components/Table/TableHead.tsx']}
        footnote={
          <>
            A pixel width is a promise about a container the column cannot see.
            Five pages set five different numbers for the same kind of column,
            and each one broke at a width its author did not test.{' '}
            <Code>control</Code> and <Code>actions</Code> stay absolute — a
            checkbox and a row-action cluster are fixed objects — while{' '}
            <Code>sm</Code>, <Code>md</Code> and <Code>lg</Code> are shares of
            the table, so a column keeps its proportion at any width. Drag the
            Storybook panel narrower to see which half survives it.
          </>
        }
        n={53}
        title="A column width is a share, not a size"
        why="There was no width prop, so every page hand-set pixel widths on the head — five tables, five different numbers for the same column."
      />

      <ChangeCase
        after={<NestedTable />}
        afterNote="nested — 8px of vertical padding"
        before={<NestedTable old />}
        beforeNote="every row the same height"
        beforeSource="the same table with `nested` omitted, which is all the published component offers — the prop is new."
        files={['src/components/Table/TableRow.tsx']}
        footnote={
          <>
            One table in the product tightened its child rows with a local
            override, and every other table that grew a hierarchy either
            repeated the override or did without. <Code>nested</Code> is that
            number, stated once. The horizontal indent stays with the consumer:
            how far a child sits in depends on what the parent's first cell
            holds, which the component cannot know.
          </>
        }
        n={54}
        title="Nesting was a number one table owned"
        why="A child row is not a row of equal weight, but the only way to say so was a padding override written inside one page."
      />

      <ChangeCase
        after={<DensityTable compact />}
        afterNote="compact — 6px cell padding · 28px header"
        before={<DensityTable />}
        beforeNote="10px cell padding · 36px header — the only step"
        beforeSource={
          <>
            the same table with <Code>density</Code> omitted —{' '}
            <Code>comfortable</Code>, what every table renders today. The
            published component had one row height and no prop.
          </>
        }
        files={[
          'src/components/Table/index.tsx',
          'src/components/Table/TableCell.tsx',
          'src/components/Table/TableHead.tsx',
        ]}
        footnote={
          <>
            Stamped on the table as <Code>data-density</Code> and read by the
            cells, the mechanism <Code>layout</Code> already uses: the row's air
            is a decision about the whole table, and a cell that took its own
            would let two columns disagree. Opt-in: Insightis' users ask
            questions of their data and are better served by the default, so
            this is a prop and not a new number for everybody.
          </>
        }
        n={56}
        state="draft"
        title="density — a compact row step"
        why="Every table had one row height, about 44px — web density — so a list that technical administrators scan rather than read got the same air as a table someone reads, and four fewer rows on screen."
      />

      <ChangeCase
        after={
          <TryIt action="Point at a row's text — the pointer, wherever it lands">
            <CursorTable />
          </TryIt>
        }
        afterNote="data-[interactive]:cursor-pointer on the row"
        before={
          <TryIt action="Point at a row's text — a text caret over a pressable fill">
            <CursorTable old />
          </TryIt>
        }
        beforeNote="hover fill, and the cursor the text gives"
        beforeSource={
          <>
            the live row with its cursor rule taken back off —{' '}
            <Code>{OLD_CURSOR}</Code> through <Code>className</Code>, where
            twMerge drops <Code>cursor-pointer</Code>. The published row had no
            cursor rule, so its cells inherited <Code>auto</Code>, which is what
            this puts back.
          </>
        }
        files={['src/components/Table/TableRow.tsx']}
        footnote={
          <>
            On the row, unlike the fills: a cursor is inherited, not painted,
            and the row is what is being described. It went unnoticed because
            pages documented the pointer as part of{' '}
            <Code>data-interactive</Code> while no rule emitted one. The class
            is also named in <Code>gen-classlist.mjs</Code>, or the bundle never
            compiles a <Code>data-[…]</Code> cursor (§19).
          </>
        }
        n={76}
        title="A clickable row kept the text cursor"
        why="data-interactive gave a row its hover, pressed and focus fills and no cursor, so the one row state that means pressable answered the pointer with a text caret."
      />

      <section className="flex max-w-[72ch] flex-col gap-2 text-ink-secondary text-xs leading-5">
        <p>
          The catalog's own interactive tables, composed here so the two cannot
          drift — <Code>Components/Table → InteractiveRows</Code> and{' '}
          <Code>WithRowActions</Code>:
        </p>
        <InteractiveRows />
        <WithRowActions />
      </section>

      <ChangeCase
        after={
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Connection</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="py-12" colSpan={2}>
                  <StatusView
                    actions={<Button size="sm">Create connection</Button>}
                    description="Connect a data source to give AI access to it"
                    icon={<EmptyStateIllustration />}
                    size="lg"
                    surface="embedded"
                    title="No connections yet"
                    tone="transparent"
                    withIconHalo={false}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        }
        afterNote="StatusView in the row · py-12 on the cell"
        before={
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Connection</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={2}>
                  No data
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        }
        beforeNote="h-24 text-center — where the doc stopped"
        beforeSource="the doc's own recipe, which asked for a single row with colSpan and h-24 text-center and said nothing further, so every page improvised the rest."
        files={['src/components/Table/Table.md']}
        footnote={
          <>
            Three things the doc now settles: the empty state lives{' '}
            <em>inside</em> the table, so the header and toolbar stay put; a
            first run and a filtered miss are two different texts; and both
            carry an action, because an empty state is never a dead end.
          </>
        }
        n="Docs · Table.md"
        state="docs-only"
        title="The table's empty state"
        why="The doc described a container and stopped, so the part a user actually reads was left to each page."
      />
    </ChangePage>
  ),
};
