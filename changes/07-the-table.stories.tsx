import type { Meta, StoryObj } from '@storybook/react-vite';
import { composeStories } from '@storybook/react-vite';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../src/components/Button';
import { Checkbox } from '../src/components/Checkbox';
import { IconButton } from '../src/components/IconButton';
import {
  Table,
  TableActionsCell,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../src/components/Table';
import * as TableStories from '../src/components/Table/Table.stories';
import { ChangeCase, ChangePage, Code, TryIt } from './Harness';

const meta = {
  title: 'Proposed changes/7. The table',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const { InteractiveRows, WithRowActions } = composeStories(TableStories);

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

export const TheTable: Story = {
  name: 'The table',
  render: () => (
    <ChangePage
      intro="Five changes to the component every list page is built from. Each Before half is the published catalog's own class string, reapplied — not a drawing of it."
      title="The table"
    >
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
        n={48}
        title="A cell that could not grow, under a comment saying it could"
        why="Every cell was one clipped line of 12px text at an 8px inset, so a note column showed its first four words and a table sat tighter than the card it was in."
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
        n={60}
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
        n={62}
        title="Nesting was a number one table owned"
        why="A child row is not a row of equal weight, but the only way to say so was a padding override written inside one page."
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
        n={56}
        title="The row's pressed fill belonged to whatever was pressed"
        why="Pressing a button inside an interactive row painted the entire row, so a row action looked like it was opening the row."
      />

      <ChangeCase
        after={
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
                <TableRow data-interactive key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableActionsCell>
                    <Button size="xs" variant="tertiary">
                      Edit
                    </Button>
                    <Button size="xs" variant="destructiveTertiary">
                      Delete
                    </Button>
                  </TableActionsCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
        afterNote="TableActionsCell — revealed on row hover and on focus"
        files={['src/components/Table/TableActionsCell.tsx']}
        footnote={
          <>
            New part, so there is nothing to compare it against. It owns the
            three things every page was re-deriving: the cell is right-aligned
            and holds its width whether or not the actions are visible, the
            cluster fades in on the row's hover, and it stays visible whenever
            anything inside it has focus — otherwise the controls are
            unreachable by keyboard. The catalog's{' '}
            <Code>Components/Table → WithRowActions</Code> and{' '}
            <Code>AlwaysVisibleActions</Code> are the two modes.
          </>
        }
        n="new"
        title="TableActionsCell"
        why="Row actions were assembled per page: a right-aligned cell, a hover reveal, and a focus escape hatch that pages routinely forgot."
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
    </ChangePage>
  ),
};
