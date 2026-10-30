import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Pagination,
  type PaginationProps,
} from '../../src/components/Pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src/components/Table';
import { Typography } from '../../src/components/Typography';
import { cn, pageFloor } from '../../src/lib/utils';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/Pagination',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A pager that pages. Every prop the panels do not name is the published
 * default, so a half that omits a new prop renders the published markup — the
 * defaults draw exactly what 1.4.0 drew.
 */
function Pager({
  start,
  ...props
}: { start: number } & Omit<
  PaginationProps,
  | 'currentPage'
  | 'onPageChange'
  | 'siblingCount'
  | 'boundaryCount'
  | 'showPrevNext'
>) {
  const [page, setPage] = useState(start);
  return (
    <Pagination
      boundaryCount={1}
      currentPage={page}
      onPageChange={setPage}
      showPrevNext
      siblingCount={1}
      {...props}
    />
  );
}

/**
 * The range a page wrote beside the pager by hand before §161 — the same
 * `body12` in `--ink-secondary` the component now draws itself.
 */
function HandRange({
  page,
  pageSize,
  total,
}: {
  page: number;
  pageSize: number;
  total: number;
}) {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <Typography element="span" textColor="secondary" textStyle="body12">
      {`Showing ${from}–${to} of ${total}`}
    </Typography>
  );
}

/** A connection's log: 118 events, 50 to a page, read in order. */
function LogFooter({ numbers }: { numbers?: boolean }) {
  const [page, setPage] = useState(2);
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      <HandRange page={page} pageSize={50} total={118} />
      <Pagination
        boundaryCount={1}
        currentPage={page}
        onPageChange={setPage}
        showFirstLast={false}
        showPageNumbers={numbers ? undefined : false}
        showPrevNext
        siblingCount={1}
        totalPages={3}
      />
    </div>
  );
}

const ROWS = ['analytics-prod', 'billing-eu', 'crm-sync'];

/** A table and its footer band — 300 rows, 20 to a page. */
function TableFooterBand({ xs }: { xs?: boolean }) {
  const [page, setPage] = useState(1);
  return (
    <div className="flex w-full flex-col gap-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Connection</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((name) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HandRange page={page} pageSize={20} total={300} />
        <Pagination
          boundaryCount={1}
          currentPage={page}
          onPageChange={setPage}
          showFirstLast={false}
          showPrevNext
          siblingCount={1}
          size={xs ? 'xs' : undefined}
          totalPages={15}
        />
      </div>
    </div>
  );
}

/**
 * A scrolling page in a 192px window. `old` puts `pb-8` where the connections
 * prototype put it — on the `min-h-0 flex-1` box, which is sized to the
 * scrollport — and the live half puts `pageFloor` on the list that grows.
 */
function Floor({ old }: { old?: boolean }) {
  return (
    <div className="scrollbar-thin flex h-48 w-full flex-col overflow-y-auto rounded-lg border border-stroke bg-surface-page">
      <div className={cn('flex min-h-0 flex-1 flex-col', old && 'pb-8')}>
        <div className={cn('flex flex-col gap-2 px-3 pt-3', !old && pageFloor)}>
          {Array.from({ length: 8 }, (_, i) => (
            <div
              className="flex h-9 shrink-0 items-center rounded-md border border-stroke bg-surface-card px-3 text-ink-body text-sm"
              key={`row-${i + 1}`}
            >
              connection-{i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Page: Story = {
  name: 'Pagination',
  render: () => (
    <ChangePage group="Pagination" title="Pagination">
      <ChangeCase
        after={
          <TryIt action="Page through — Prev and Next move the range">
            <LogFooter />
          </TryIt>
        }
        afterNote="showPageNumbers={false} · showFirstLast={false}"
        before={
          <TryIt action="Page through — three buttons that each do what Next does">
            <LogFooter numbers />
          </TryIt>
        }
        beforeNote="showFirstLast={false} — the numbers always drawn"
        beforeSource={
          <>
            the live pager with <Code>showPageNumbers</Code> omitted — it
            defaults to <Code>true</Code>, which is the published pager exactly.
            The range beside it is written by hand in both halves, as pages did.
          </>
        }
        files={['src/components/Pagination/index.tsx']}
        footnote={
          <>
            A page number is right where it is a destination — a table somebody
            searches, sorts and comes back to — so the default stays on. Pair it
            with <Code>showFirstLast={'{false}'}</Code>: First and Last are
            jumps of the same kind, and leaving them in while the numbers go is
            half a decision.
          </>
        }
        n={82}
        state="draft"
        title="showPageNumbers — a stream read in order"
        why="The pager always drew the numbered buttons. Under a connection's log that was three buttons all doing what Next does, and the current one doing nothing at all — what keeps the reader's place there is the range."
      />

      <ChangeCase
        after={<TableFooterBand xs />}
        afterNote="xs — number squares 24px, Prev / Next 28px, gap 4px"
        before={<TableFooterBand />}
        beforeNote="32px squares, gap 8px — the only rung"
        beforeSource={
          <>
            the live pager with <Code>size</Code> omitted — <Code>sm</Code>, the{' '}
            <Code>size-8</Code> every part was hard-coded to in 1.4.0. The band
            around it is the same hand-written range in both halves.
          </>
        }
        files={[
          'src/components/Pagination/index.tsx',
          'src/components/Pagination/size.ts',
        ]}
        footnote={
          <>
            <Code>sm</Code> stays the default and is right when the pager is the
            page's own control. 24px is the floor for a hit target, so the
            ladder is two rungs and stops; <Code>Pagination/size.ts</Code> holds
            the type and the box map.
          </>
        }
        n={93}
        state="draft"
        title="Pagination takes a rung"
        why="Every part was hard-coded to 32px. Under a table the pager shares a footer band with a 12px range, and a 32px control beside 12px text was the loudest thing in a strip whose job is to be quiet."
      />

      <ChangeCase
        after={
          <TryIt action="Scroll to the end — 32px of floor under the last row">
            <Floor />
          </TryIt>
        }
        afterNote="pageFloor on the list that grows"
        before={
          <TryIt action="Scroll to the end — the last row lands on the edge">
            <Floor old />
          </TryIt>
        }
        beforeNote="pb-8 on the min-h-0 flex-1 box"
        beforeSource="the same page with pb-8 where the connections prototype put it — on the content box that flex-1 sizes to the scrollport. The padding is there in the markup and draws at the bottom of the window."
        files={['src/lib/utils.ts']}
        footnote={
          <>
            Padding on the scroll container is the other wrong answer: it moves
            the sticky constraint rectangle, and a <Code>sticky bottom-0</Code>{' '}
            commit bar then stops short of the window with the form scrolling
            under it. <Code>pageFloor</Code> sits in <Code>lib/utils</Code>{' '}
            beside <Code>focusRing</Code> and <Code>glyphStroke</Code>, so a
            page reaches for the name rather than a number of its own.
          </>
        }
        n={93}
        state="draft"
        title="The page gets a floor"
        why="A page put its bottom padding on a box sized to the scrollport, so the padding drew at the bottom of the window and the last row scrolled flush against it — in the connections prototype, for the second time."
      />

      <ChangeCase
        after={
          <Pager
            pageSize={25}
            showFirstLast={false}
            size="xs"
            start={2}
            totalItems={60}
            totalPages={3}
          />
        }
        afterNote="the range on the leading edge, the pager on the trailing one"
        before={
          <Pager showFirstLast={false} size="xs" start={2} totalPages={3} />
        }
        beforeNote="the pager alone · size xs in both halves"
        beforeSource={
          <>
            the live pager with <Code>totalItems</Code> and{' '}
            <Code>pageSize</Code> omitted — the pager alone, which is all the
            published component renders.
          </>
        }
        files={['src/components/Pagination/index.tsx']}
        footnote={
          <>
            From <Code>(currentPage − 1) × pageSize + 1</Code> to{' '}
            <Code>min(currentPage × pageSize, totalItems)</Code>; an empty list
            reads 0–0 of 0. <Code>totalPages</Code> stays the caller's, and
            without both props the pager renders alone, as before.
          </>
        }
        n={161}
        state="draft"
        title="totalItems and pageSize — the range"
        why="Pagination.md asks every pager to show the current range and the total, and the component had nowhere to put it — so the band was built by hand beside the pager, three times in one prototype."
      />
    </ChangePage>
  ),
};
