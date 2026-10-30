import type { Meta, StoryObj } from '@storybook/react-vite';
import { TriangleAlert } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { Badge } from '../../src/components/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src/components/Table';
import { ChangeCase, ChangePage, Code, NoPanel } from '../Harness';
import { Badge as UpstreamBadge } from '../upstream/Badge';

const meta = {
  title: 'Proposed changes/Components/Badge',
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

/** The props both Badges share — all the panels need. */
type AnyBadge = ComponentType<{
  children?: ReactNode;
  leftSlot?: ReactNode;
  size?: 'sm' | 'md';
  variant?: 'secondary' | 'attention';
}>;

/**
 * The tile the defect was found on: 213px, a name, and a chip beside it with
 * more to say than the room left for it.
 */
function Tile({ Component }: { Component: AnyBadge }) {
  return (
    <div className="flex w-[213px] flex-col gap-2 rounded-lg border border-stroke bg-surface-card p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-ink-primary text-sm">
          Connections
        </span>
        <Component leftSlot={<TriangleAlert />} size="sm" variant="attention">
          1 not configured
        </Component>
      </div>
      <span className="font-semibold text-2xl text-ink-primary">12</span>
    </div>
  );
}

/** A size ladder, each pill named under itself. */
function Ladder({ pills }: { pills: [size: string, pill: ReactNode][] }) {
  return (
    <div className="flex items-end gap-4">
      {pills.map(([size, pill]) => (
        <div className="flex flex-col items-start gap-1.5" key={size}>
          {pill}
          <Code>{size}</Code>
        </div>
      ))}
    </div>
  );
}

const UPSTREAM_SOURCE = (
  <>
    the developers' own component, vendored unchanged from their 1.4.0 into{' '}
    <Code>changes/upstream/Badge.tsx</Code> — so it also predates §33's
    hairline.
  </>
);

export const Page: Story = {
  name: 'Badge',
  render: () => (
    <ChangePage group="Badge" title="Badge">
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
            through <Code>className</Code>. Five of the seven variants declared
            it themselves; <Code>brand</Code> and <Code>green</Code> already had
            a border, which is the inconsistency the change removes.
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
            <Code>--surface-card2</Code>, which is also roughly where a hovered
            row lands, so without the line the chip dissolves into the row under
            the pointer. <Code>flat</Code> is the opt-out, for a chip already
            inside a bordered container.
          </>
        }
        n={33}
        title="The hairline is the base, not a second variant"
        why="Five variants painted a fill with no edge, so a chip on a surface its fill matched had no shape — and the two that did carry a border looked like a different component."
      />

      <ChangeCase
        after={<Tile Component={Badge} />}
        afterNote="one line, cut inside the border; the glyph keeps its size"
        before={<Tile Component={UpstreamBadge} />}
        beforeNote="the label wraps, and the 20px pill does not grow with it"
        beforeSource={UPSTREAM_SOURCE}
        files={['src/components/Badge/index.tsx']}
        footnote={
          <>
            A badge that does not fit has one allowed outcome: a truncated
            label. <Code>overflow-hidden</Code> is what lets the pill shrink at
            all — a flex item's minimum width is its content until it hides its
            overflow — and <Code>truncate</Code> on the label puts the ellipsis
            inside the border. A label that can be cut should carry{' '}
            <Code>tooltip</Code>. §83 is the other half of this case: once the
            pill clipped, <Code>leading-none</Code> cut the tail off a g, so the
            label took its scale line-height back. At the developers' base
            nothing clipped, so §83 has no Before of its own.
          </>
        }
        n={65}
        title="A fixed-height pill whose label could wrap"
        why="Every size fixes the height, so a label that wrapped did not make the chip taller — its second line was drawn across the border and out of the pill. Found on a 213px dashboard tile."
      />

      <ChangeCase
        after={
          <Ladder
            pills={[
              [
                'sm',
                <Badge key="sm" size="sm" variant="secondary">
                  Draft
                </Badge>,
              ],
              [
                'md',
                <Badge key="md" size="md" variant="secondary">
                  Draft
                </Badge>,
              ],
            ]}
          />
        }
        afterNote="sm 20px · 6px sides — md 28px · 10px sides"
        before={
          <Ladder
            pills={[
              [
                'xs',
                <UpstreamBadge key="xs" size="xs" variant="secondary">
                  Draft
                </UpstreamBadge>,
              ],
              [
                'sm',
                <UpstreamBadge key="sm" size="sm" variant="secondary">
                  Draft
                </UpstreamBadge>,
              ],
              [
                'md',
                <UpstreamBadge key="md" size="md" variant="secondary">
                  Draft
                </UpstreamBadge>,
              ],
            ]}
          />
        }
        beforeNote="xs 20px · 8px sides — sm 20px · 6px sides"
        beforeSource={UPSTREAM_SOURCE}
        files={[
          'src/components/Badge/index.tsx',
          'src/components/Autocomplete/BadgeList.tsx',
        ]}
        footnote={
          <>
            Text only, as it was reported. With a glyph the two were not
            identical at 1.4.0 — <Code>xs</Code> drew it at 12px,{' '}
            <Code>sm</Code> at 16 — and <Code>sm</Code> now draws the 12px one.
            The kit has one badge, 28px with 10px sides, which is this ladder's{' '}
            <Code>md</Code>; the small steps are the package's own.
          </>
        }
        n={86}
        title="A step that was not a step"
        why="xs and sm were the same 20px pill with 12px text, differing only in their sides — and the step named smaller carried the larger inset. Moving a pill between them changed nothing anyone could see."
      />
      <NoPanel
        section={83}
        title="The pill cut the tail off a g"
        why={
          <>
            At 1.4.0 the pill does not hide its overflow, so a descender was
            never clipped there. The clip came in with §65's{' '}
            <Code>overflow-hidden</Code>, in this package, and this section
            undoes it — against the developers' Badge there is nothing to
            compare.
          </>
        }
      />
    </ChangePage>
  ),
};
