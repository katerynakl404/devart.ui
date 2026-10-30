import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '../../src/components/Typography';
import { ChangeCase, ChangePage, Code } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/Typography',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The line box, tinted, so its height can be read — 28px against 24. */
const LINE_BOX = 'bg-brand-primary/10';

/**
 * The profile dialog's plan panel, the one place prod sets 18: the heading at
 * 500, a plan name and a credit amount at 600.
 */
function PlanPanel({ old }: { old?: boolean }) {
  return (
    <div className="flex flex-col items-start gap-2">
      {old ? (
        <>
          <Typography
            className={LINE_BOX}
            element="span"
            variant="large"
            weight="medium"
          >
            Choose a plan
          </Typography>
          <Typography className={LINE_BOX} element="span" variant="large">
            Business
          </Typography>
          <Typography className={LINE_BOX} element="span" variant="large">
            1,200 credits
          </Typography>
        </>
      ) : (
        <>
          <Typography className={LINE_BOX} element="span" textStyle="heading18">
            Choose a plan
          </Typography>
          <Typography className={LINE_BOX} element="span" textStyle="title18">
            Business
          </Typography>
          <Typography className={LINE_BOX} element="span" textStyle="title18">
            1,200 credits
          </Typography>
        </>
      )}
    </div>
  );
}

/**
 * Two struck tree rows at 14px, and the same rows at 4× — under CSS `zoom`, so
 * redrawn at that size rather than scaled up from pixels.
 */
function Struck({ old }: { old?: boolean }) {
  const rows = (
    <div className="flex flex-col items-start gap-1">
      {['orders', 'customers'].map((name) =>
        old ? (
          <Typography
            className="line-through"
            element="span"
            key={name}
            textColor="secondary"
            textStyle="body14"
          >
            {name}
          </Typography>
        ) : (
          <Typography
            element="span"
            key={name}
            lineThrough
            textColor="secondary"
            textStyle="body14"
          >
            {name}
          </Typography>
        )
      )}
    </div>
  );
  return (
    <div className="flex flex-col gap-4">
      {rows}
      <div style={{ zoom: 4 }}>{rows}</div>
    </div>
  );
}

export const Page: Story = {
  name: 'Typography',
  render: () => (
    <ChangePage group="Typography" title="Typography">
      <ChangeCase
        after={<PlanPanel />}
        afterNote="heading18 · title18 — the 24px line prod declares"
        before={<PlanPanel old />}
        beforeNote='variant="large" — 600 on a 28px line'
        beforeSource={
          <>
            the published Typography's one 18px style,{' '}
            <Code>variant="large"</Code> — unchanged since 1.4.0 — with{' '}
            <Code>weight="medium"</Code> for the heading, since there was no 18
            at 500. The tint is each line box.
          </>
        }
        files={['src/components/Typography/index.tsx']}
        footnote={
          <>
            Prod declares <Code>leading-6</Code> on all four elements and still
            renders 28px on the plan panel: <Code>md:text-lg</Code> comes later
            in the stylesheet and brings Tailwind's paired 28px with it. The
            style takes the 24px that was asked for. No <Code>body18</Code>.
          </>
        }
        n={100}
        title="An 18px rung, as prod sets it"
        why="Prod sets 18 in the profile dialog — the plan panel's heading at 500, the plan names and credit amounts at 600, on a 24px line — and the scale had no style for it, so the approved mock-up hand-rolled the credit amount."
      />

      <ChangeCase
        after={<Struck />}
        afterNote="a drawn band through the middle of the x-height"
        before={<Struck old />}
        beforeNote="the browser's stroke, on the tops of the lowercase"
        beforeSource={
          <>
            the old variant's class, <Code>line-through</Code>, put back through{' '}
            <Code>className</Code> with <Code>lineThrough</Code> omitted — the
            stroke where DM Sans says to draw it.
          </>
        }
        files={['src/components/Typography/index.tsx']}
        footnote={
          <>
            CSS cannot move a <Code>line-through</Code>, so the stroke is a
            background band: its middle 0.107em below the middle of the line
            box, where DM Sans's x-height is centred at any line height, and{' '}
            <Code>max(1px, 0.075em)</Code> thick — 1px at 14. Tied to DM Sans:
            another face needs its own offset.
          </>
        }
        n={113}
        title="lineThrough ran along the tops of the lowercase"
        why="DM Sans puts its strikeout at the top of the x-height, so the browser's line-through ran along the tops of the lowercase letters rather than through them — off-centre in a struck tree row at 14px."
      />
    </ChangePage>
  ),
};
