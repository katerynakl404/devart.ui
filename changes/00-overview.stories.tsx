import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChangePage, Code } from './Harness';

const meta = {
  title: 'Proposed changes/0. Overview',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface Row {
  /** Section number in DESIGN-SYSTEM-CHANGES.md, or the kind of entry. */
  n: string;
  area: string;
  /**
   * One line, and it says the same thing the case on the page says. A row that
   * paraphrases its own case is a second description of one change, and the
   * two drift.
   */
  change: string;
  /** The page that renders it, or `—` when there is nothing to render. */
  page: string;
}

/**
 * One row per case that exists, in page order. Nothing here is aspirational:
 * if a row names a page, that page renders it today.
 */
const ROWS: Row[] = [
  {
    n: '1',
    area: 'Button, IconButton',
    change: 'destructiveOutline — a neutral label under a red border',
    page: '1. Colour and state',
  },
  {
    n: '2',
    area: 'globals.css',
    change: 'dark destructive border — hover made the control less visible',
    page: '1. Colour and state',
  },
  {
    n: '4',
    area: 'Autocomplete',
    change: 'selected and highlighted painted the same',
    page: '1. Colour and state',
  },
  {
    n: '6',
    area: 'globals.css, constants.ts',
    change:
      'no token for a standalone icon — new --ink-icon / --ink-icon-hover',
    page: '1. Colour and state',
  },
  {
    n: '7',
    area: 'TableHead',
    change: 'the sort glyph did not hover with its label',
    page: '1. Colour and state',
  },
  {
    n: '26',
    area: 'Autocomplete',
    change: 'the clear and the chevron paint as placeholders',
    page: '1. Colour and state',
  },
  {
    n: '8',
    area: 'InputGroupAddon',
    change: 'the addon resized glyphs it did not own',
    page: '2. Size and spacing',
  },
  {
    n: '9',
    area: 'TabsContent',
    change: 'the inactive panel came back as an empty box',
    page: '2. Size and spacing',
  },
  {
    n: '10',
    area: 'InputGroup, TextArea',
    change: 'a field label as loud as the hint beneath it',
    page: '2. Size and spacing',
  },
  {
    n: '15',
    area: 'Tooltip',
    change: 'the arrow put the gap off the 4px scale',
    page: '2. Size and spacing',
  },
  {
    n: '49',
    area: 'Button, IconButton',
    change: 'a bigger button grew its box, not its label',
    page: '2. Size and spacing',
  },
  {
    n: '11',
    area: 'SidebarHeader, SidebarBrand',
    change: 'the header lost its horizontal inset',
    page: '3. The sidebar under two shells',
  },
  {
    n: '12',
    area: 'SidebarHeader',
    change: 'two shells from the same elements',
    page: '3. The sidebar under two shells',
  },
  {
    n: '13',
    area: 'SidebarMenuButton',
    change: 'the rail rendered tooltips with no styling at all',
    page: '3. The sidebar under two shells',
  },
  {
    n: '14',
    area: 'SidebarMenuButton',
    change: 'a 32px box its own padding did not fit',
    page: '3. The sidebar under two shells',
  },
  {
    n: '16',
    area: 'Sidebar.md',
    change: 'collapsing could remove the only way to expand',
    page: '3. The sidebar under two shells',
  },
  {
    n: '23',
    area: 'SidebarContent',
    change: 'the navigation column is missing the inset production has',
    page: '3. The sidebar under two shells',
  },
  {
    n: '17',
    area: 'PageHeader',
    change: 'new component, plus a badge that belongs to the title',
    page: '4. New in the system',
  },
  {
    n: '18',
    area: 'ConnectorLogo',
    change: 'new component — connector marks as data-URIs',
    page: '4. New in the system',
  },
  {
    n: '19',
    area: 'TextArea',
    change: 'a character counter, which pages were writing by hand',
    page: '4. New in the system',
  },
  {
    n: '20',
    area: 'StatusView',
    change: 'EmptyStateIllustration — the standard empty-state artwork',
    page: '4. New in the system',
  },
  {
    n: 'Docs',
    area: 'Table.md',
    change: 'where an empty state goes, and what it must carry',
    page: '5. Documented recipes',
  },
  {
    n: 'Docs',
    area: 'Switch.md',
    change: 'which switch size goes where',
    page: '5. Documented recipes',
  },
  {
    n: 'Docs',
    area: 'InputGroup.md',
    change: 'where the clear button goes — InputGroupAction, not an IconButton',
    page: '5. Documented recipes',
  },
  {
    n: 'Tokens',
    area: '--state-*, --tbl-row-*',
    change: 'interaction states became relative overlays',
    page: '6. Colour tokens',
  },
  {
    n: 'Tokens',
    area: '--state-overlay, --tint-*',
    change: 'the state ladder, painted',
    page: '6. Colour tokens',
  },
  {
    n: 'Tokens',
    area: '--brand-300',
    change: 'retuned into the wash — #5DA0A8 → #46A6B9',
    page: '6. Colour tokens',
  },
  {
    n: 'Tokens',
    area: 'destructiveTertiary',
    change: 'destructive tertiary re-stepped to match the neutral ladder',
    page: '6. Colour tokens',
  },
  {
    n: '51',
    area: 'TableCell',
    change: 'a cell that could not grow, under a comment saying it could',
    page: '7. The table',
  },
  {
    n: '64',
    area: 'TableHead',
    change: 'a column width is a share, not a size',
    page: '7. The table',
  },
  {
    n: '66',
    area: 'TableRow',
    change: 'nesting was a number one table owned',
    page: '7. The table',
  },
  {
    n: '59',
    area: 'TableCell',
    change: "the row's pressed fill belonged to whatever was pressed",
    page: '7. The table',
  },
  {
    n: 'new',
    area: 'TableActionsCell',
    change: 'row actions as a part, not a shape each page re-derives',
    page: '7. The table',
  },
  {
    n: '41',
    area: 'Badge',
    change: 'the hairline is the base, not a second variant',
    page: '8. The badge',
  },
  {
    n: 'Archived',
    area: 'Badge',
    change: 'the gap and the glyph did not step with the size — not requested',
    page: '8. The badge',
  },
  {
    n: 'Archived',
    area: 'Badge',
    change:
      'a status that had to become a control to carry a tooltip — not requested',
    page: '8. The badge',
  },
  {
    n: '21',
    area: 'gen-classlist.mjs',
    change: 'empty:* enumerated, or the rule in §12 is never compiled',
    page: '—',
  },
  {
    n: '22',
    area: 'pnpm bundle, check-bundle-css',
    change: 'one command, and a gate for silent CSS gaps',
    page: '—',
  },
];

/** Documented but not rendered yet, so the gap is visible rather than implied. */
const UNCOVERED: [string, string][] = [
  ['Fields', '34, 37, 50, 54, 61 — InputGroup, TextArea, InputGroupAction'],
  ['Overlays and menus', '24, 28, 30, 32, 38, 42, 52, 58'],
  ['Sidebar', '33, 43, 48'],
  [
    'New components',
    '44, 55, 56, 57, 63 — StepperIndicator, Link, StatTile, CodeBlock, MetaRow',
  ],
  ['Left over', '31, 36, 40, 47, 60, 65, 67, 68'],
];

/**
 * Open questions, and only those. A question that has been answered leaves this
 * list — it is not a log.
 */
const DECISIONS: { q: string; detail: string }[] = [
  {
    q: 'Badge — revert the two changes nobody asked for?',
    detail:
      'The request was the hairline. The stepping gap and glyph and the tooltip prop landed in the same commit, cf21296. Both are out of DESIGN-SYSTEM-CHANGES.md and into the archive, but the code still has them — neither reverted nor confirmed. Both are on page 8; either can come out on its own.',
  },
];

export const Overview: Story = {
  name: 'Overview',
  render: () => (
    <ChangePage
      intro={
        <>
          Every case this section renders, and where to look at it. A change is
          reviewed by eye here before it is reviewed in a diff: Storybook is
          this package's only verification surface — there are no unit tests,
          and a class naming a token that does not exist compiles to nothing
          rather than to an error.
        </>
      }
      title="What changed, and where to look"
    >
      <div className="overflow-x-auto rounded-lg border border-stroke">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-surface-card2">
            <tr className="text-ink-secondary text-xs">
              <th className="px-3 py-2 font-medium">§</th>
              <th className="px-3 py-2 font-medium">Area</th>
              <th className="px-3 py-2 font-medium">Change</th>
              <th className="px-3 py-2 font-medium">Page</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr
                className="border-stroke border-b last:border-b-0"
                key={`${row.n}-${row.area}-${row.change}`}
              >
                <td className="px-3 py-2 text-ink-inactive tabular-nums">
                  {row.n}
                </td>
                <td className="px-3 py-2 font-medium text-ink-primary">
                  {row.area}
                </td>
                <td className="px-3 py-2 text-ink-body">{row.change}</td>
                <td className="px-3 py-2 text-ink-secondary text-xs">
                  {row.page}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="flex max-w-[72ch] flex-col gap-3">
        <h3 className="font-semibold text-base text-ink-primary">
          Needs a decision
        </h3>
        <p className="text-ink-body text-sm leading-5">
          Answered questions leave this list rather than staying in it with a
          verdict attached — the section is what is open, not what was asked.
        </p>
        <ul className="flex flex-col gap-3">
          {DECISIONS.map((d) => (
            <li
              className="rounded-md border border-fb-attention/35 bg-fb-attention/5 px-3 py-2"
              key={d.q}
            >
              <p className="font-medium text-ink-primary text-sm">{d.q}</p>
              <p className="mt-1 text-ink-body text-xs leading-5">{d.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex max-w-[72ch] flex-col gap-3 text-ink-body text-sm leading-5">
        <h3 className="font-semibold text-base text-ink-primary">
          Documented, not yet rendered
        </h3>
        <p>
          <Code>DESIGN-SYSTEM-CHANGES.md</Code> runs to §68. The table above
          covers {ROWS.length} entries; these are the rest, grouped by the page
          they would belong to:
        </p>
        <ul className="flex flex-col gap-1 text-ink-secondary text-xs">
          {UNCOVERED.map(([group, list]) => (
            <li key={group}>
              <span className="font-medium text-ink-body">{group}</span> — §
              {list}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex max-w-[72ch] flex-col gap-3 text-ink-body text-sm leading-5">
        <h3 className="font-semibold text-base text-ink-primary">
          How to read a Before panel
        </h3>
        <p>
          The <em>After</em> half is always the live component as this branch
          has it. A case with nothing to compare against — §17 and §18, which
          are components that did not exist — renders that half alone. Where
          there is a <em>Before</em>, it is produced one of three ways, and each
          case says which under the comparison:
        </p>
        <ul className="flex list-disc flex-col gap-2 ps-5">
          <li>
            <strong className="font-medium">A token override.</strong> The old
            value re-declared on a wrapper — §2 is the dark destructive border.
            Exact: the component is untouched.
          </li>
          <li>
            <strong className="font-medium">
              The old class string, reapplied.
            </strong>{' '}
            twMerge keeps the last class in a group, so passing the published
            catalog's own string through <Code>className</Code> restores its
            rendering. Those strings come from{' '}
            <Code>git show upstream/master:…</Code>, never from this document.
          </li>
          <li>
            <strong className="font-medium">A replica.</strong> Where the old
            markup is unreachable from a prop — an internal component, a class
            on an element the component renders itself — the panel rebuilds it
            from the class string in the diff. §4 and §7. A replica can drift
            from what the package once shipped; the other two cannot.
          </li>
        </ul>
        <p>
          §21 and §22 are build and tooling changes with nothing to render.
          Their effect is visible only as the absence of a defect: without §21,{' '}
          <Code>empty:pb-0</Code> in §12 compiles to nothing in the bundle even
          though it works here — Storybook compiles Tailwind from the sources,
          the bundle from an enumerated class list.
        </p>
      </section>
    </ChangePage>
  ),
};
