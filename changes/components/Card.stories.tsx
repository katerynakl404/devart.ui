import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus, Trash2 } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { Button } from '../../src/components/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../src/components/Card';
import { ConnectorLogo } from '../../src/components/ConnectorLogo';
import { IconCard } from '../../src/components/IconCard';
import { Typography } from '../../src/components/Typography';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';
import { Card as UpstreamCard } from '../upstream/Card';

const meta = {
  title: 'Proposed changes/Components/Card',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The hover tint the published `outline` card carried. */
const OLD_OUTLINE_HOVER = 'hover:border-card-border-hover';

const SETTINGS = ['Host', 'Port', 'Database', 'Schema', 'User', 'Timeout'];

/** A card taller than the box it scrolls in, its actions in the footer. */
function TallCard({ sticky = false }: { sticky?: boolean }) {
  return (
    <div className="h-56 w-64 overflow-y-auto rounded-lg border border-stroke bg-surface-page p-3">
      <Card fullWidth>
        <Typography textStyle="title14">Connection</Typography>
        <CardContent className="flex flex-col gap-3">
          {SETTINGS.map((setting) => (
            <Typography key={setting} textColor="secondary" textStyle="body12">
              {setting} — a row of the form
            </Typography>
          ))}
        </CardContent>
        <CardFooter sticky={sticky} variant="actions">
          <Button size="sm">Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

/**
 * The lift `upstream` writes into `Card` `elevated`, and `IconCard` inherits —
 * `git show f69ebc9:src/components/Card/index.tsx`. Reapplied through
 * `className`, where twMerge keeps the last class in each group.
 */
const OLD_LIFT =
  'transition-all duration-slow hover:-translate-y-0.5 hover:border-card-lift-border hover:shadow-lift-hover';

/** A catalog tile and an elevated card — the two that share the recipe. */
function Lifts({ old }: { old?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-32">
        <IconCard
          actionLabel="Connect"
          actionIcon={<Plus />}
          aria-label="Connect PostgreSQL"
          className={old ? OLD_LIFT : undefined}
          icon={<ConnectorLogo connector="PostgreSQL" size="md" />}
          label="PostgreSQL"
        />
      </div>
      <Card className={old ? `w-44 ${OLD_LIFT}` : 'w-44'} variant="elevated">
        <Typography textStyle="title14">Retention</Typography>
        <Typography textColor="secondary" textStyle="body12">
          A larger box, lifted further.
        </Typography>
      </Card>
    </div>
  );
}

/** The props both Cards share — all the panels need. */
type AnyCard = ComponentType<{
  children?: ReactNode;
  className?: string;
  fullWidth?: boolean;
  variant?: 'outline' | 'elevated' | 'ghost' | 'row';
}>;

/** The same title and line in three variants, side by side in a grid. */
function Boxes({ Component }: { Component: AnyCard }) {
  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {(['outline', 'elevated'] as const).map((variant) => (
        <Component fullWidth key={variant} variant={variant}>
          <Typography textStyle="title14">Retention</Typography>
          <Typography textColor="secondary" textStyle="body12">
            {variant}
          </Typography>
        </Component>
      ))}
      <Component fullWidth variant="ghost">
        <Plus className="size-4 text-ink-secondary" />
        <Typography textColor="secondary" textStyle="body12">
          ghost
        </Typography>
      </Component>
    </div>
  );
}

/** A one-line row, and a row with a name over a sentence. */
function Rows({ Component }: { Component: AnyCard }) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Component fullWidth variant="row">
        billing-eu
      </Component>
      <Component fullWidth variant="row">
        <div className="flex min-w-0 flex-col">
          <span>analytics-prod</span>
          <span className="font-normal text-ink-secondary text-xs">
            Read replica in eu-central-1, refreshed nightly at 02:00 UTC by the
            ingest job.
          </span>
        </div>
      </Component>
    </div>
  );
}

const DELETE_TEXT =
  'The workspace goes, together with its data model and who has access to it. Your connections stay — you can keep using them in other workspaces.';

/**
 * The head as the AI connectivity prototype built it by hand before the slot
 * existed — `_shared/workspaces.jsx` at 9c3b0a9, its classes unchanged.
 */
function HandBuiltHead() {
  return (
    <Card className="p-6" fullWidth variant="outline">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Typography element="h3" textColor="primary" textStyle="title16">
            Delete workspace
          </Typography>
          <Typography
            className="text-pretty"
            element="p"
            textColor="secondary"
            textStyle="body14"
          >
            {DELETE_TEXT}
          </Typography>
        </div>
        <Button leftSlot={<Trash2 />} size="sm" variant="destructiveSecondary">
          Delete Workspace
        </Button>
      </div>
    </Card>
  );
}

const UPSTREAM_SOURCE = (
  <>
    the developers' own <Code>Card</Code>, vendored unchanged from their 1.4.0
    into <Code>changes/upstream/Card/</Code> — the component their storybook
    ships, not a replica of it.
  </>
);

export const Page: Story = {
  name: 'Card',
  render: () => (
    <ChangePage group="Card" title="Card">
      <ChangeCase
        after={
          <TryIt action="Hover both — neither border moves">
            <div className="flex gap-3">
              <Card className="w-44" variant="outline">
                <Typography textStyle="title14">Retention</Typography>
                <Typography textColor="secondary" textStyle="body12">
                  A surface. Nothing here is clickable.
                </Typography>
              </Card>
            </div>
          </TryIt>
        }
        afterNote="border-stroke, and it stays"
        before={
          <TryIt action="Hover — the border tints toward brand, and nothing happens">
            <div className="flex gap-3">
              <Card className={`w-44 ${OLD_OUTLINE_HOVER}`} variant="outline">
                <Typography textStyle="title14">Retention</Typography>
                <Typography textColor="secondary" textStyle="body12">
                  A surface. Nothing here is clickable.
                </Typography>
              </Card>
            </div>
          </TryIt>
        }
        beforeNote="hover:border-card-border-hover"
        beforeSource={
          <>
            the published class reapplied through <Code>className</Code> —{' '}
            <Code>hover:border-card-border-hover</Code>, which is the whole of
            the change.
          </>
        }
        files={['src/components/Card/index.tsx']}
        footnote={
          <>
            An <Code>outline</Code> card is a surface, not a control. It tinted
            its border toward brand on hover while doing nothing when clicked,
            so the tint promised an interaction the card did not have — and on a
            page of them, the pointer lit up whatever it crossed. Cards that are
            controls say so: <Code>ghost</Code> is the browse-more tile, a
            clickable row uses the table's own interactive states, and the
            catalog tile, <Code>IconCard</Code>, is a <Code>role="button"</Code>
            .{' '}
            <strong className="font-medium text-ink-body">Filed wrong:</strong>{' '}
            the original entry said hover <em>and press</em>. The press half
            never existed in a published version — it was added and removed
            inside this branch — so one line is the whole delta.
          </>
        }
        n={4}
        title="An outline card answered the pointer and then did nothing"
        why="The border tint is the affordance of a control. On a surface it is a promise nothing keeps."
      />
      <ChangeCase
        after={
          <TryIt action="Hover the tile, then the card — 1px, then 2">
            <Lifts />
          </TryIt>
        }
        afterNote="liftOnHover(1) on the tile, liftOnHover(2) on the card"
        before={
          <TryIt action="Hover the tile, then the card — both rise 2px">
            <Lifts old />
          </TryIt>
        }
        beforeNote="one 2px lift, transition-all"
        beforeSource={
          <>
            the published lift reapplied through <Code>className</Code> on the
            live tile and card —{' '}
            <Code>transition-all duration-slow hover:-translate-y-0.5</Code>{' '}
            with its border and shadow — which <Code>IconCard</Code> inherited
            from <Code>elevated</Code>.
          </>
        }
        files={[
          'src/lib/utils.ts',
          'src/components/Card/index.tsx',
          'src/components/IconCard/index.tsx',
        ]}
        footnote={
          <>
            The distance is the one parameter, because it is the one part that
            legitimately differs: the same travel reads bigger on a smaller box,
            so the kit lifts a catalog tile 1px and a larger card 2. The
            transition is a scoped list —{' '}
            <Code>box-shadow, border-color, transform</Code> — because a card
            that animates every property also animates its own content
            reflowing.
          </>
        }
        n={59}
        title="liftOnHover — one elevation recipe, 1px"
        why="The lift lived inside Card elevated, so the catalog tile inherited a card's 2px and every property animated with it — a small tile jumped the distance meant for a large box."
      />
      <ChangeCase
        after={<Boxes Component={Card} />}
        afterNote="flex flex-col gap-3 p-4 on every variant"
        before={<Boxes Component={UpstreamCard} />}
        beforeNote="elevated and ghost: no layout, no padding"
        beforeSource={UPSTREAM_SOURCE}
        files={['src/components/Card/index.tsx']}
        footnote={
          <>
            <Code>ghost</Code> carried <Code>items-center justify-center</Code>{' '}
            with no <Code>flex</Code> for them to act on, so a full-width ghost
            tile centred nothing. Its old <Code>bg-surface-bg</Code> names a
            token this package removed (§97), so the Before paints no fill — as
            the After does.
          </>
        }
        n={60}
        title="elevated and ghost carry the card's box"
        why="secondary and outline drew a padded column; elevated and ghost drew neither, so the card that lifts on hover was the one every page padded itself, and an outline card beside an elevated one sat on a different inset."
      />
      <ChangeCase
        after={<Rows Component={Card} />}
        afterNote="px-4 py-3, no height — one line is 44, two grow"
        before={<Rows Component={UpstreamCard} />}
        beforeNote="h-11 px-3 — 44px, whatever it holds"
        beforeSource={UPSTREAM_SOURCE}
        files={['src/components/Card/index.tsx']}
        footnote={
          <>
            One line of <Code>text-sm</Code> is 20px; 12 above and below is the
            same 44, so a one-line row does not move. The inset went 12 → 16,
            where text starts from the edge in every other card. The connection
            form had argued the row out of its height at the call site —{' '}
            <Code>h-auto min-h-11 items-start py-3</Code>, three classes to undo
            one.
          </>
        }
        n={78}
        title="A list item that could only ever be one line"
        why="Card row carried h-11: right for one line of text, and a ceiling for anything more — a name over a description ran out of the row and across its border."
      />
      <ChangeCase
        after={
          <TryIt action="Scroll — Save stays at the bottom of the box">
            <TallCard sticky />
          </TryIt>
        }
        afterNote="sticky bottom-0 z-10 bg-surface-card"
        before={
          <TryIt action="Scroll — Save only arrives at the card's end">
            <TallCard />
          </TryIt>
        }
        beforeNote="the footer scrolls with the card"
        beforeSource={
          <>
            the live component without the prop — <Code>sticky</Code> defaults
            to <Code>false</Code>, which is the published footer exactly.
          </>
        }
        files={[
          'src/components/Card/CardFooter.tsx',
          'src/components/Card/index.tsx',
        ]}
        footnote={
          <>
            The footer sticks to the bottom of the scroller while the card
            scrolls under it, and settles in place at the card's end. It carries
            the card's own surface so nothing shows through it.{' '}
            <Code>cardFooterVariants</Code> is exported from the Card entry now,
            so a consumer can tell whether its build has the variant.
          </>
        }
        n={123}
        state="draft"
        title="CardFooter — sticky"
        why="A card taller than the window put its actions below the fold, out of reach until the reader scrolled to its end."
      />
      <ChangeCase
        after={
          <Card className="p-6" fullWidth variant="outline">
            <CardHeader
              actions={
                <Button
                  leftSlot={<Trash2 />}
                  size="sm"
                  variant="destructiveSecondary"
                >
                  Delete Workspace
                </Button>
              }
            >
              <CardTitle>Delete workspace</CardTitle>
              <CardDescription className="text-pretty">
                {DELETE_TEXT}
              </CardDescription>
            </CardHeader>
          </Card>
        }
        afterNote="CardHeader actions — on the title's line"
        before={<HandBuiltHead />}
        beforeNote="a row built on the page — the button centred on the whole block"
        beforeSource={
          <>
            the AI connectivity prototype's own head, its markup copied from{' '}
            <Code>_shared/workspaces.jsx</Code> as it stood before the prop: the
            published <Code>CardHeader</Code> has no slot, so the page wrapped a{' '}
            <Code>title16</Code> and a <Code>body14</Code> in{' '}
            <Code>flex items-center justify-between</Code> itself. A consumer's
            markup, not the developers' file.
          </>
        }
        files={['src/components/Card/CardHeader.tsx']}
        footnote={
          <>
            The slot is one title line tall — <Code>h-6</Code>,{' '}
            <Code>CardTitle</Code>'s line — and centres what it holds on it, so
            a link, a 24px icon button and a 32px button all sit on the title's
            middle however many lines the description runs. The head was built
            by hand like this at eight places. Not restyled: the prototype's
            heads put 4px between title and description and set no tracking;{' '}
            <Code>CardHeader</Code> keeps its 6px and <Code>CardTitle</Code>'s{' '}
            <Code>tracking-tight</Code>.
          </>
        }
        n={162}
        state="draft"
        title="CardHeader — actions"
        why="The header had nowhere to put the head's own action, so each page built the row itself — and centred the button on the title and its description together, which drops it below the title as soon as the description runs past one line."
      />
    </ChangePage>
  ),
};
