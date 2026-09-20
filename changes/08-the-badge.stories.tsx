import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleCheck, TriangleAlert } from 'lucide-react';
import { Badge } from '../src/components/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../src/components/Table';
import { TooltipProvider } from '../src/components/Tooltip';
import { ChangeCase, ChangePage, Code, TryIt } from './Harness';

const meta = {
  title: 'Proposed changes/8. The badge',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The published recipe, from
 * `git show upstream/master:src/components/Badge/index.tsx`: a base of
 * `gap-2` with `border-transparent` re-declared by every variant, and a glyph
 * that steps once. Reapplied through `className`, where twMerge keeps the last
 * class in each group.
 */
const OLD_BADGE = 'gap-2 border-transparent';
const OLD_SIZES = {
  xs: 'gap-2 border-transparent px-2 text-xs [&_svg]:size-3',
  sm: 'gap-2 border-transparent px-[0.375rem] text-xs [&_svg]:size-4',
  md: 'gap-2 border-transparent px-2.5 text-xs [&_svg]:size-4',
  lg: 'gap-2 border-transparent px-2.5 text-sm [&_svg]:size-4',
} as const;

const VARIANTS = [
  'primary',
  'secondary',
  'attention',
  'success',
  'error',
  'brand',
  'green',
] as const;

function VariantRow({ old }: { old?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {VARIANTS.map((variant) => (
        <Badge
          className={old ? OLD_BADGE : undefined}
          key={variant}
          variant={variant}
        >
          {variant}
        </Badge>
      ))}
    </div>
  );
}

/**
 * The hairline's whole point is a chip on a surface its own fill matches. A
 * hovered row lands on `--state-hover`, which is where `secondary` already
 * sits, so the row is the panel — not a swatch.
 */
function RowWithChip({ old }: { old?: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Connection</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {['analytics-prod', 'billing-eu'].map((name) => (
          <TableRow className="cursor-pointer" data-interactive key={name}>
            <TableCell>{name}</TableCell>
            <TableCell>
              <Badge
                className={old ? OLD_BADGE : undefined}
                size="sm"
                variant="secondary"
              >
                Draft
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function SizeLadder({ old }: { old?: boolean }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <div className="flex flex-col items-center gap-1" key={size}>
          <Badge
            className={old ? OLD_SIZES[size] : undefined}
            leftSlot={<CircleCheck />}
            size={size}
            variant="success"
          >
            Connected
          </Badge>
          <span className="text-ink-secondary text-xxs">{size}</span>
        </div>
      ))}
    </div>
  );
}

export const TheBadge: Story = {
  name: 'The badge',
  render: () => (
    <TooltipProvider>
      <ChangePage
        intro={
          <>
            One change was requested — the hairline. The other two arrived in
            the same commit as it (<Code>cf21296</Code>) and are rendered here
            because they are in the code, not because anybody asked for them: a
            review page that hides a real difference is worse than no page. Each
            Before half is the published catalog's own class string, reapplied.
          </>
        }
        title="The badge"
      >
        <ChangeCase
          after={
            <div className="flex flex-col gap-4">
              <VariantRow />
              <RowWithChip />
            </div>
          }
          afterNote="a hairline mixed from currentColor, on every variant"
          before={
            <div className="flex flex-col gap-4">
              <VariantRow old />
              <RowWithChip old />
            </div>
          }
          beforeNote="border-transparent — the chip is its fill and nothing else"
          beforeSource={
            <>
              the published base with <Code>border-transparent</Code> put back
              through <Code>className</Code>. Five of the seven variants
              declared it themselves; <Code>brand</Code> and <Code>green</Code>{' '}
              already had a border, which is the inconsistency the change
              removes.
            </>
          }
          files={['src/components/Badge/index.tsx', 'globals.css']}
          footnote={
            <>
              Hover a row in the lower panel. <Code>--badge-border</Code> is a{' '}
              <Code>color-mix()</Code> from <Code>currentColor</Code>, so the
              hairline is the chip's own hue on every variant rather than a
              seventh token to keep in sync. It matters where a fill meets a
              surface it matches: <Code>secondary</Code> sits on{' '}
              <Code>--surface-card2</Code>, which is also roughly where a
              hovered row lands, so without the line the chip dissolves into the
              row under the pointer. <Code>flat</Code> is the opt-out, for a
              chip already inside a bordered container.
            </>
          }
          n={41}
          title="The hairline is the base, not a second variant"
          why="Five variants painted a fill with no edge, so a chip on a surface its fill matched had no shape — and the two that did carry a border looked like a different component."
        />

        <ChangeCase
          after={<SizeLadder />}
          afterNote="gap 4/4/8/8 · glyph 12/12/14/16"
          before={<SizeLadder old />}
          beforeNote="gap 8 flat · glyph 12/16/16/16"
          beforeSource="the published size map, reapplied — the gap lived on the base and never stepped, and the glyph stepped once at xs."
          files={['src/components/Badge/index.tsx']}
          footnote={
            <>
              A flat 8px gap made the space between a glyph and its label wider
              than the chip's own edge inset — 6px at <Code>sm</Code> — so a
              small pill read as two things in a box rather than one chip. Both
              now step with the size. The glyph ladder is the badge's own, not
              the control one: a chip is 20px tall at <Code>sm</Code>, where a
              16px glyph leaves 2px above and below it.
            </>
          }
          n={62}
          title="The gap and the glyph did not step with the size — not requested"
          why="Everything about a badge scaled except the two things inside it, so the smallest chip carried the largest proportions."
        />

        <ChangeCase
          after={
            <TryIt action="Hover the chip — the tooltip is on the badge itself">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  leftSlot={<TriangleAlert />}
                  tooltip="Check failed: API key expired or revoked (HTTP 401) · Aug 11, 11:14"
                  variant="error"
                >
                  1 day ago
                </Badge>
                <Badge
                  leftSlot={<CircleCheck />}
                  tooltip="Last checked 4 minutes ago"
                  variant="success"
                >
                  Connected
                </Badge>
              </div>
            </TryIt>
          }
          afterNote="tooltip — the badge stays a <span>"
          before={
            <TryIt action="Tab into the row — the chip takes focus as a control">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="cursor-default rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2"
                  title="Check failed: API key expired or revoked (HTTP 401) · Aug 11, 11:14"
                  type="button"
                >
                  <Badge leftSlot={<TriangleAlert />} variant="error">
                    1 day ago
                  </Badge>
                </button>
                <button
                  className="cursor-default rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2"
                  title="Last checked 4 minutes ago"
                  type="button"
                >
                  <Badge leftSlot={<CircleCheck />} variant="success">
                    Connected
                  </Badge>
                </button>
              </div>
            </TryIt>
          }
          beforeNote="a <button> wrapper, for a chip that does nothing"
          beforeSource="the shape a page had to write: the badge has no tooltip prop in the published component, so a page that needed one wrapped it."
          files={['src/components/Badge/index.tsx']}
          footnote={
            <>
              A badge is a status, not a control. Wrapping one in a{' '}
              <Code>&lt;button&gt;</Code> to hang a tooltip on it puts a thing
              with no action in the tab order and announces it as clickable —
              tab through the Before panel to hear it. The prop renders the
              package's own <Code>Tooltip</Code> around a{' '}
              <Code>&lt;span&gt;</Code> instead. The kit's connections table is
              the case that needs it: a red "1 day ago" chip whose tooltip
              carries the failure reason and the exact time.
            </>
          }
          n={45}
          title="A status that had to become a control to carry a tooltip — not requested"
          why="There was no tooltip prop, so every page that needed one wrapped the badge in a button — a control that does nothing, in the tab order, announced as clickable."
        />
      </ChangePage>
    </TooltipProvider>
  ),
};
