import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ChangeState } from './Harness';
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
  state: ChangeState | 'not-visual';
  page: string;
}

/** Every row of the Summary table in DESIGN-SYSTEM-CHANGES.md, in its order. */
const ROWS: Row[] = [
  {
    n: '1',
    area: 'Button, IconButton',
    change: 'destructiveOutline label is red, not neutral',
    state: 'committed',
    page: '1. Colour and state',
  },
  {
    n: '2',
    area: 'globals.css',
    change: 'dark destructive border re-stepped so hover raises contrast',
    state: 'committed',
    page: '1. Colour and state',
  },
  {
    n: '3',
    area: 'ds-bundle CSS',
    change:
      'the dead row hover came from the bundle — the package never shipped the broken mapping',
    state: 'not-a-library-change',
    page: '1. Colour and state',
  },
  {
    n: '4',
    area: 'Autocomplete',
    change: 'selected and highlighted no longer paint the same',
    state: 'committed',
    page: '1. Colour and state',
  },
  {
    n: '5',
    area: 'Card / outline',
    change: 'a surface no longer answers hover and press',
    state: 'committed',
    page: '1. Colour and state',
  },
  {
    n: '6',
    area: 'new tokens --ink-icon',
    change:
      'the colour of a standalone glyph — absent from the kit, and both values already exist in the ink ladder',
    state: 'working-tree',
    page: '1. Colour and state',
  },
  {
    n: '7',
    area: 'TableHead',
    change:
      'sort control gained a press state — the kit has hover only, so this is an addition',
    state: 'working-tree',
    page: '1. Colour and state',
  },
  {
    n: '8',
    area: 'InputGroupAddon',
    change: '[&_svg] → [&>svg] — stops resizing glyphs it does not own',
    state: 'working-tree',
    page: '2. Size and spacing',
  },
  {
    n: '9',
    area: 'TabsContent',
    change: 'inactive panel no longer returns as an empty box',
    state: 'committed',
    page: '2. Size and spacing',
  },
  {
    n: '10',
    area: 'InputGroup, TextArea',
    change: 'field label Secondary → Body, so the hint is subordinate',
    state: 'working-tree',
    page: '2. Size and spacing',
  },
  {
    n: '15',
    area: 'Tooltip',
    change: 'arrow 8×4, putting the visible gap on the 4px scale',
    state: 'working-tree',
    page: '2. Size and spacing',
  },
  {
    n: '11',
    area: 'SidebarHeader',
    change: 'horizontal inset restored',
    state: 'working-tree',
    page: '3. The sidebar under two shells',
  },
  {
    n: '12',
    area: 'SidebarHeader',
    change: 'empty:pb-0 tells the two shells apart',
    state: 'working-tree',
    page: '3. The sidebar under two shells',
  },
  {
    n: '13',
    area: 'SidebarMenuButton',
    change: "tooltips through the package's own Tooltip",
    state: 'working-tree',
    page: '3. The sidebar under two shells',
  },
  {
    n: '14',
    area: 'SidebarMenuButton',
    change: 'collapsed box fixed — every mark centres at 24',
    state: 'working-tree',
    page: '3. The sidebar under two shells',
  },
  {
    n: '16',
    area: 'Sidebar.md',
    change: 'collapsing may not remove the only way to expand',
    state: 'docs-only',
    page: '3. The sidebar under two shells',
  },
  {
    n: '17',
    area: 'PageHeader',
    change: 'new component, plus a badge slot inside the title cluster',
    state: 'working-tree',
    page: '4. New in the system',
  },
  {
    n: '18',
    area: 'ConnectorLogo',
    change: 'new component — connector marks as data-URIs',
    state: 'committed',
    page: '4. New in the system',
  },
  {
    n: '19',
    area: 'TextArea',
    change: 'character counter',
    state: 'committed',
    page: '4. New in the system',
  },
  {
    n: '20',
    area: 'StatusView',
    change: 'EmptyStateIllustration — the standard empty-state artwork',
    state: 'working-tree',
    page: '4. New in the system',
  },
  {
    n: 'Docs',
    area: 'Card.md, Table.md, Switch.md, InputGroup.md',
    change: 'recipes every page was otherwise inventing',
    state: 'docs-only',
    page: '5. Documented recipes',
  },
  {
    n: '21',
    area: 'gen-classlist.mjs',
    change: 'empty:* enumerated, or the rule in §12 is never compiled',
    state: 'not-visual',
    page: '—',
  },
  {
    n: '22',
    area: 'pnpm bundle, check-bundle-css',
    change: 'one command, and a gate for silent CSS gaps',
    state: 'not-visual',
    page: '—',
  },
  // Not in DESIGN-SYSTEM-CHANGES.md: found by reading §11 against a ruler in
  // this very section, which is the whole point of having it.
  {
    n: '23',
    area: 'SidebarContent',
    change:
      'the nav column is missing production’s px-2 — icons on 8 instead of 16, row fill with no gutter',
    state: 'proposed',
    page: '3. The sidebar under two shells',
  },
];

const STATE_TEXT: Record<Row['state'], string> = {
  'working-tree': 'Working tree',
  committed: 'Committed',
  'docs-only': 'Docs only',
  'not-visual': 'Not visual',
  proposed: 'Proposed',
  'not-a-library-change': 'Not ours',
};

const STATE_CLASS: Record<Row['state'], string> = {
  'working-tree': 'bg-fb-attention/15 text-ink-body',
  committed: 'bg-fb-green/15 text-ink-body',
  'docs-only': 'bg-surface-chips text-ink-secondary',
  'not-visual': 'bg-surface-card2 text-ink-inactive',
  proposed: 'bg-brand-primary/10 text-ink-body',
  'not-a-library-change': 'bg-fb-red/10 text-ink-body',
};

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
              <th className="px-3 py-2 font-medium">State</th>
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
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xxs ${STATE_CLASS[row.state]}`}
                  >
                    {STATE_TEXT[row.state]}
                  </span>
                </td>
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
          has it. The <em>Before</em> half is produced one of three ways, and
          each case says which under the comparison:
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
            through <Code>className</Code> restores the old rendering — §1, §5,
            §8, §11, §12, §14.
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
