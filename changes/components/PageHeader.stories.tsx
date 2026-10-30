import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowLeft, Plus } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { ConnectorLogo } from '../../src/components/ConnectorLogo';
import { IconButton } from '../../src/components/IconButton';
import { PageHeader } from '../../src/components/PageHeader';
import { cn } from '../../src/lib/utils';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';
import { PageHeader as UpstreamPageHeader } from '../upstream/PageHeader';

const meta = {
  title: 'Proposed changes/Components/PageHeader',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => undefined;

const DB2 = (
  <Badge
    leftSlot={
      <ConnectorLogo className="size-4 rounded-sm" connector="DB2" size="xs" />
    }
    variant="secondary"
  >
    DB2
  </Badge>
);

const SAVE = (
  <Button size="sm" variant="primary">
    Save
  </Button>
);

const CREATE = (
  <Button size="sm" variant="primary">
    <Plus />
    Create Connection
  </Button>
);

/**
 * What §111 added, taken back off from a wrapper: the title and the glyph had
 * no transition, and the box ran on IconButton's own `duration-fast`.
 */
const OLD_MOTION =
  '[&_h2]:!transition-none [&_svg]:!transition-none [&_button[aria-label=Back]]:!duration-fast';

const UPSTREAM_SOURCE = (
  <>
    the developers' own component, vendored unchanged from their 1.4.0 into{' '}
    <Code>changes/upstream/PageHeader.tsx</Code> — the PageHeader their
    storybook ships, not a replica of it.
  </>
);

/** A 320px phone column, its 12px inset drawn as the dashed frame. */
function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-[320px] max-w-full flex-col gap-4 rounded-lg border border-stroke border-dashed p-3">
      {children}
    </div>
  );
}

/**
 * The header with a page's own padding around it. The padding glides in both
 * halves, as the AI connectivity shell's does — what differs is the header.
 */
function Collapse({ old }: { old?: boolean }) {
  const [condensed, setCondensed] = useState(false);
  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className={cn(
          'rounded-lg bg-surface-page px-4 transition-[padding] duration-slow motion-reduce:transition-none',
          condensed ? 'py-1.5' : 'py-2.5',
          old && OLD_MOTION
        )}
      >
        <PageHeader
          actions={SAVE}
          condensed={condensed}
          onBack={noop}
          title="Connect to DB2"
        />
      </div>
      <Button
        className="self-start"
        onClick={() => setCondensed((value) => !value)}
        size="xs"
        variant="secondary"
      >
        {condensed ? 'Expand' : 'Condense'}
      </Button>
    </div>
  );
}

export const Page: Story = {
  name: 'PageHeader',
  render: () => (
    <ChangePage group="PageHeader" title="PageHeader">
      <ChangeCase
        after={
          <div className="w-full">
            <PageHeader
              actions={SAVE}
              backLabel="Back to connections"
              onBack={noop}
              title="Connect to DB2"
              titleRight={DB2}
            />
          </div>
        }
        afterNote="onBack: a 24px arrow 12px from the title · titleRight 12px"
        before={
          <div className="w-full">
            <UpstreamPageHeader
              actions={SAVE}
              title="Connect to DB2"
              titleLeft={
                <IconButton aria-label="Back" variant="tertiary">
                  <ArrowLeft />
                </IconButton>
              }
              titleRight={DB2}
            />
          </div>
        }
        beforeNote="the arrow passed as titleLeft · everything 8px apart"
        beforeSource={
          <>
            {UPSTREAM_SOURCE} It had no back control, so the arrow is passed the
            way a page had to — through <Code>titleLeft</Code>, the one slot
            before the title — as a default tertiary <Code>IconButton</Code>.
          </>
        }
        files={['src/components/PageHeader/index.tsx']}
        footnote={
          <>
            <Code>titleLeft</Code> now opens the row — before the arrow when
            there is one, which is where the mobile sidebar trigger goes. The
            row is a <Code>&lt;header data-slot="page-header"&gt;</Code> with no
            margin of its own (the published one carried <Code>mb-2</Code>), its
            parts and its actions 12px apart.
          </>
        }
        n={15}
        state="draft"
        title="The back control, and where the slots sit"
        why="The published header had no back control, so a page put one in titleLeft at a size of its own choosing, 8px from the title like every other part of the row — a neighbour of the title rather than part of it."
      />

      <ChangeCase
        after={
          <div className="w-full">
            <PageHeader
              actions={SAVE}
              condensed
              onBack={noop}
              title="Connect to DB2"
              titleRight={DB2}
            />
          </div>
        }
        afterNote="heading20 · the back control 32px with a 16px arrow"
        before={
          <div className="w-full">
            <PageHeader
              actions={SAVE}
              onBack={noop}
              title="Connect to DB2"
              titleRight={DB2}
            />
          </div>
        }
        beforeNote="heading30 · the back control 36px with a 24px arrow"
        beforeSource={
          <>
            the live header with <Code>condensed</Code> omitted — the full row,
            the only size the published header has. Its back control is §15's.
          </>
        }
        files={['src/components/PageHeader/index.tsx']}
        footnote={
          <>
            The arrow steps down with the title because it is sized against the
            title, not the row. The back control, the title and the actions keep
            their columns, so it is a shrink and not a relayout. The page
            decides when: the component has no scroll listener —{' '}
            <Code>ListPageLayout</Code>'s <Code>condenseAfter</Code> is one way
            to drive it (§133).
          </>
        }
        n={67}
        state="draft"
        title="condensed — the header once the page scrolls"
        why="A header that stays on screen while the page scrolls spent window on a line already read: on a 900px window, the header and a 32px window bar took a fifth of the height, in front of the form the person came for."
      />

      <ChangeCase
        after={
          <TryIt action="Press Condense — title, arrow and padding move as one, 240ms">
            <Collapse />
          </TryIt>
        }
        afterNote="title, box and glyph on --motion-slow"
        before={
          <TryIt action="Press Condense — the title and the arrow jump, the padding glides">
            <Collapse old />
          </TryIt>
        }
        beforeNote="only the padding animates"
        beforeSource={
          <>
            the live header under a wrapper that takes §111 back off —{' '}
            <Code>[&amp;_h2]:transition-none</Code> and{' '}
            <Code>[&amp;_svg]:transition-none</Code> for the title and the
            glyph, which had none, and the box back on <Code>IconButton</Code>'s
            own <Code>duration-fast</Code>.
          </>
        }
        files={['src/components/PageHeader/index.tsx']}
        footnote={
          <>
            All three take <Code>motion-reduce:transition-none</Code>. §67 had
            held the type still because a font-size transition reflows every
            frame. It does — for one line of one header, for a quarter of a
            second — and the jump was the cost that showed.
          </>
        }
        n={111}
        state="draft"
        title="The collapse animates whole — title, arrow, 240ms"
        why="Condensing moved the title 30 → 20px and the arrow 24 → 16px in one frame while the page's padding glided, so the header read as a jump."
      />

      <ChangeCase
        after={
          <Phone>
            <PageHeader actions={SAVE} title="warehouse_eu_central_replica" />
            <PageHeader actions={CREATE} title="Data Sources" wrapTitle />
          </Phone>
        }
        afterNote="truncates by default · wrapTitle wraps, and breaks a long word"
        before={
          <Phone>
            <UpstreamPageHeader
              actions={SAVE}
              title="warehouse_eu_central_replica"
            />
            <UpstreamPageHeader actions={CREATE} title="Data Sources" />
          </Phone>
        }
        beforeNote="always wraps — a name with nowhere to break runs over Save"
        beforeSource={UPSTREAM_SOURCE}
        files={['src/components/PageHeader/index.tsx']}
        footnote={
          <>
            Truncation alone costs the other way: on a phone, "Data Sources"
            beside Create Connection read "Data So…". <Code>wrapTitle</Code>{' '}
            wraps it instead, with <Code>min-w-0 break-words</Code> so a single
            long word breaks rather than overflows; the arrow and the slots stay
            centred on the wrapped title and the actions keep their edge.
          </>
        }
        n={135}
        title="The title truncates; wrapTitle wraps it"
        why="The published title had no truncate and always wrapped: a long title grew the row a line at a time, and a name with nowhere to break pushed past the actions."
      />
    </ChangePage>
  ),
};
