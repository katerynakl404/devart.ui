import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from '../src/components/TextArea';
import { Typography } from '../src/components/Typography';
import { ChangeCase, ChangePage, Code } from './Harness';

const meta = {
  title: 'Proposed changes/9. The fields',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The standing caveat F-25 wants next to the counter. */
const AI_WARNING =
  'Do not include passwords, API tokens, or personal data in these instructions.';

export const TheFields: Story = {
  name: 'The fields',
  render: () => (
    <ChangePage
      intro="Two entries about the field family. One of them changed nothing — it is here because the change log has it, and a section with no panel is still a section somebody has to be able to find."
      title="The fields"
    >
      <ChangeCase
        after={
          <TextArea
            defaultValue="Answer in the user's language."
            hintText={AI_WARNING}
            label="AI instructions"
            maxLength={4000}
            showCount
            wrapperClassName="w-[360px]"
          />
        }
        afterNote="hintText — the left half of the row the counter already owned"
        before={
          <div className="flex w-[360px] flex-col">
            <TextArea
              defaultValue="Answer in the user's language."
              label="AI instructions"
            />
            <div className="mt-1 flex items-start justify-between gap-4">
              <Typography
                className="min-w-0 flex-1"
                textColor="secondary"
                textStyle="body12"
                variant="span"
              >
                {AI_WARNING}
              </Typography>
              <Typography
                className="shrink-0 whitespace-nowrap tabular-nums"
                textColor="secondary"
                textStyle="body12"
                variant="span"
              >
                29/4000
              </Typography>
            </div>
          </div>
        }
        beforeNote="showCount off, and the whole row rebuilt by hand"
        beforeSource="the shape the connections page had to write: a plain TextArea with its own two-column row underneath, because the component's row had no slot for the caveat."
        files={['src/components/TextArea/index.tsx']}
        footnote={
          <>
            <Code>showCount</Code> already drew a two-column row, and its left
            half only ever held <Code>errorText</Code>. A page that needed a
            standing caveat beside the counter — F-25 asks for one — had to turn
            the counter off and rebuild both halves, which is how a{' '}
            <Code>-mt-2</Code> and a hand-set gap end up in a page. The slot is
            now a prop. An error still wins the left half while it is showing: a
            caveat is standing advice, an error is about what you just typed.
          </>
        }
        n={41}
        title="The counter row had a slot nothing could fill"
        why="The row existed, the space existed, and the only thing that could go in it was an error — so a page with a caveat to show threw the row away and built its own."
      />

      <ChangeCase
        after={
          <p className="max-w-[60ch] text-ink-body text-sm leading-5">
            Nothing to render: the three states this was filed against —{' '}
            <em>hover</em>, <em>today</em>, <em>disabled</em> — all exist, in{' '}
            <Code>Calendar.tsx</Code>'s <Code>classNames</Code> map rather than
            in <Code>CalendarDayButton.tsx</Code> where the report looked. What
            survives is one detail: the focus ring is the only one in the
            package that is not the shared recipe.
          </p>
        }
        afterNote="mostly retracted — see the catalog's own Datepicker stories"
        files={['src/components/Datepicker/Calendar.tsx']}
        footnote={
          <>
            Kept as a section because a retraction is worth as much as the
            finding was: the next person reading{' '}
            <Code>CalendarDayButton.tsx</Code> alone will reach the same wrong
            conclusion. The surviving item is real — <Code>--shadow-focus</Code>
            , 2px plus a 2px gap, is what <Code>Button</Code>,{' '}
            <Code>IconButton</Code>, <Code>Switch</Code>,{' '}
            <Code>SegmentedControl</Code> and <Code>StepSlider</Code> all use,
            and the calendar day is the one control that does not.
          </>
        }
        n={29}
        state="proposed"
        title="One bespoke focus ring, not three missing states"
        why="Filed after reading one file, and three quarters of it was wrong. The quarter that is not: a calendar day focuses differently from every other control in the package."
      />
    </ChangePage>
  ),
};
