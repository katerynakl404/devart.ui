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
  n: string;
  area: string;
  change: string;
  /** Which page shows it, or `—` when there is nothing to render. */
  page: string;
}

/** Every row of the Summary table in DESIGN-SYSTEM-CHANGES.md, in its order. */
const ROWS: Row[] = [
  {
    n: '1',
    area: 'Button, IconButton',
    change: 'destructiveOutline label is red, not neutral',
    page: '1. Colour and state',
  },
  {
    n: '2',
    area: 'globals.css',
    change: 'dark destructive border re-stepped so hover raises contrast',
    page: '1. Colour and state',
  },
  {
    n: '4',
    area: 'Autocomplete',
    change: 'selected and highlighted no longer paint the same',
    page: '1. Colour and state',
  },
  {
    n: '6',
    area: 'new tokens --ink-icon',
    change:
      'the colour of a standalone glyph — absent from the kit, and both values already exist in the ink ladder',
    page: '1. Colour and state',
  },
  {
    n: '7',
    area: 'TableHead',
    change:
      'the sort glyph hovers with its label instead of sitting out the interaction; no press state',
    page: '1. Colour and state',
  },
  {
    n: '8',
    area: 'InputGroupAddon',
    change: '[&_svg] → [&>svg] — stops resizing glyphs it does not own',
    page: '2. Size and spacing',
  },
  {
    n: '9',
    area: 'TabsContent',
    change: 'inactive panel no longer returns as an empty box',
    page: '2. Size and spacing',
  },
  {
    n: '10',
    area: 'InputGroup, TextArea',
    change: 'field label Secondary → Body, so the hint is subordinate',
    page: '2. Size and spacing',
  },
  {
    n: '15',
    area: 'Tooltip',
    change: 'arrow 8×4, putting the visible gap on the 4px scale',
    page: '2. Size and spacing',
  },
  {
    n: '11',
    area: 'SidebarHeader',
    change: 'horizontal inset restored',
    page: '3. The sidebar under two shells',
  },
  {
    n: '12',
    area: 'SidebarHeader',
    change: 'empty:pb-0 tells the two shells apart',
    page: '3. The sidebar under two shells',
  },
  {
    n: '13',
    area: 'SidebarMenuButton',
    change: "tooltips through the package's own Tooltip",
    page: '3. The sidebar under two shells',
  },
  {
    n: '14',
    area: 'SidebarMenuButton',
    change: 'collapsed box fixed — every mark centres at 24',
    page: '3. The sidebar under two shells',
  },
  {
    n: '16',
    area: 'Sidebar.md',
    change: 'collapsing may not remove the only way to expand',
    page: '3. The sidebar under two shells',
  },
  {
    n: '17',
    area: 'PageHeader',
    change: 'new component, plus a badge slot inside the title cluster',
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
    change: 'character counter',
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
    change:
      'the empty state lives inside the table, and always carries an action',
    page: '5. Documented recipes',
  },
  {
    n: 'Docs',
    area: 'Switch.md',
    change: 'sm in a table or dense row, default in forms and settings',
    page: '5. Documented recipes',
  },
  {
    n: 'Docs',
    area: 'InputGroup.md',
    change:
      'the trailing action is InputGroupAction, not an IconButton — recipe rewritten',
    page: '5. Documented recipes',
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
  // Not in DESIGN-SYSTEM-CHANGES.md: found by reading §11 against a ruler in
  // this very section, which is the whole point of having it.
  {
    n: '23',
    area: 'SidebarContent',
    change:
      'the nav column is missing production’s px-2 — icons on 8 instead of 16, row fill with no gutter',
    page: '3. The sidebar under two shells',
  },
  {
    n: '51',
    area: 'TableCell',
    change:
      'the cell wraps, so a row grows with its content instead of pushing the table past the card',
    page: '7. The table',
  },
  {
    n: '64',
    area: 'TableHead',
    change:
      'width — a column is a share of the table, not five hand-set pixel widths',
    page: '7. The table',
  },
  {
    n: '66',
    area: 'TableRow',
    change:
      'nested — 8px for a child row, lifted out of one table’s local override',
    page: '7. The table',
  },
  {
    n: '59',
    area: 'TableCell',
    change:
      'the pressed fill belongs to whatever was pressed, not always to the row',
    page: '7. The table',
  },
  {
    n: 'new',
    area: 'TableActionsCell',
    change:
      'row actions as a part — right-aligned, revealed on hover, kept on focus',
    page: '7. The table',
  },
  {
    n: '49',
    area: 'Button, IconButton',
    change:
      'lg and xl grow the label and the glyph instead of the padding — one 14/16/16/20/20 ladder',
    page: '2. Size and spacing',
  },
  {
    n: '26',
    area: 'Autocomplete',
    change:
      'the clear and the chevron paint as placeholder glyphs and never answer the pointer',
    page: '1. Colour and state',
  },
  // Not numbered in DESIGN-SYSTEM-CHANGES.md: the interaction-state work
  // carries its own changeset, `interaction-states-relative-overlays.md`.
  {
    n: 'Tokens',
    area: '--state-*, --tbl-row-*',
    change:
      'interaction states became relative overlays — one base per theme, four strengths, so states composite instead of replacing',
    page: '6. Colour tokens',
  },
  {
    n: 'Tokens',
    area: '--brand-300',
    change: 'retuned into the interaction wash — #5DA0A8 → #46A6B9',
    page: '6. Colour tokens',
  },
  {
    n: 'Tokens',
    area: '--badge-border',
    change:
      'every badge gained a hairline mixed from currentColor, so a Secondary chip does not dissolve into a hovered row',
    page: '6. Colour tokens',
  },
  {
    n: 'Tokens',
    area: 'destructiveTertiary',
    change:
      'light hover/press re-stepped to hold parity with the neutral ladder',
    page: '6. Colour tokens',
  },
];

export const Overview: Story = {
  name: 'Overview',
  render: () => (
    <ChangePage
      intro={
        <>
          Every row of the Summary table in{' '}
          <Code>DESIGN-SYSTEM-CHANGES.md</Code>, and where to look at it. A
          change is reviewed by eye here before it is reviewed in a diff:
          Storybook is this package's only verification surface — there are no
          unit tests, and a class naming a token that does not exist compiles to
          nothing rather than to an error.
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
                key={`${row.n}-${row.area}`}
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
            twMerge keeps the last class in a group, so passing the old one
            through <Code>className</Code> restores the old rendering — §1, §8,
            §11, §12, §14.
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
