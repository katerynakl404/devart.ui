import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../src/components/Button';
import { Card, CardContent, CardFooter } from '../src/components/Card';
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

export const TheCards: Story = {
  name: 'The cards',
  render: () => (
    <ChangePage
      intro="Two changes to the surfaces: one took a promise off a card that could not keep it, one keeps a tall card's actions in reach."
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
    </ChangePage>
  ),
};
