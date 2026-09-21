import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../src/components/Card';
import { DataSourceCard } from '../src/components/DataSourceCard';
import { Typography } from '../src/components/Typography';
import { ChangeCase, ChangePage, Code, TryIt } from './Harness';

const meta = {
  title: 'Proposed changes/10. The cards',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The hover tint the published `outline` card carried. */
const OLD_OUTLINE_HOVER = 'hover:border-card-border-hover';

/**
 * The scrim as it was: floated over the tile rather than stacked with it, so it
 * contributed nothing to the tile's own minimum width, and a 16px gutter where
 * the kit uses 8.
 */
const OLD_SCRIM =
  '[&>span:last-child]:absolute [&>span:last-child]:inset-0 [&>span:last-child]:px-4';

/** A grid whose track can go narrower than the action inside the tile. */
function NarrowGrid({ old }: { old?: boolean }) {
  return (
    <div className="grid w-[200px] grid-cols-2 gap-3">
      {['PostgreSQL', 'DB2'].map((connector) => (
        <DataSourceCard
          className={old ? OLD_SCRIM : undefined}
          connector={connector}
          key={connector}
        />
      ))}
    </div>
  );
}

export const TheCards: Story = {
  name: 'The cards',
  render: () => (
    <ChangePage
      intro="Two changes to the surfaces. One took a promise off a card that could not keep it; the other stopped a tile from being narrower than the control inside it."
      title="The cards"
    >
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
            catalog tile below is a <Code>&lt;button&gt;</Code>.{' '}
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
          <TryIt action="Hover a tile — the action sits inside it at any width">
            <NarrowGrid />
          </TryIt>
        }
        afterNote="122px at any grid width — the action plus 8px either side"
        before={
          <TryIt action="Hover a tile — the action reaches past the border">
            <NarrowGrid old />
          </TryIt>
        }
        beforeNote="94px, and the action spills 10px past the border"
        beforeSource={
          <>
            the scrim put back to <Code>absolute inset-0</Code> with its 16px
            gutter, through a child selector on the tile. Both halves are the
            live component in a 200px two-column grid — a width narrower than
            the action, which is where the two part company.
          </>
        }
        files={['src/components/DataSourceCard/index.tsx']}
        footnote={
          <>
            An absolutely positioned child contributes nothing to its parent's
            intrinsic size, so the tile's minimum width was set by the connector
            name while the thing that has to fit inside it is a 104px button.
            The two layers now stack in one grid cell —{' '}
            <Code>[grid-area:1/1]</Code> — so the action counts: the tile cannot
            be narrower than it plus the 8px the scrim keeps either side.
            <br />
            <br />
            Stacking alone was not enough, and the panels above are how that
            turned up: Tailwind’s <Code>grid-cols-2</Code> is{' '}
            <Code>minmax(0, 1fr)</Code>, which lets a track shrink below its
            item’s min-content, so the intrinsic minimum was a suggestion. With
            <Code>min-w-fit</Code> the tile refuses: measured 122px in both
            panels of the After half against 109 and 94 in the Before, where the
            action spills 10px past the border. Above the minimum the grid still
            decides, unchanged.
            <br />
            <br />
            <strong className="font-medium text-ink-body">
              Why this is its own component and not a Card variant:
            </strong>{' '}
            <Code>Card</Code> is a surface — five variants, each a box with
            padding and a border. A catalog tile is a control: a{' '}
            <Code>&lt;button&gt;</Code> with a hover scrim, a revealed action, a
            popular badge and a fixed 8rem height. Behind{' '}
            <Code>Card variant="tile"</Code> the component would render a button
            for one of its six values and a div for the other five. They do
            share the lift recipe, and that is the part kept in sync by hand.
          </>
        }
        n={58}
        title="A tile could be narrower than its own action"
        why="The Connect scrim floated over the tile instead of sitting in it, so nothing stopped the grid from making the tile smaller than the button it reveals."
      />
    </ChangePage>
  ),
};
