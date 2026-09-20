import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../src/components/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../src/components/Table';
import { ChangeCase, ChangePage, Code } from './Harness';

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

export const TheBadge: Story = {
  name: 'The badge',
  render: () => (
    <ChangePage
      intro="One change, and it is the one the change log has: the hairline. The Before half is the published catalog's own class string, reapplied."
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
        n={35}
        title="The hairline is the base, not a second variant"
        why="Five variants painted a fill with no edge, so a chip on a surface its fill matched had no shape — and the two that did carry a border looked like a different component."
      />
    </ChangePage>
  ),
};
