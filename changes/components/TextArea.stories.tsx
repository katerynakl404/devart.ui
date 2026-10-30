import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from '../../src/components/TextArea';
import { Typography } from '../../src/components/Typography';
import { ChangeCase, ChangePage, Code } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/TextArea',
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

/**
 * §70 — the two footer lines as the published TextArea set them: the counter
 * on `leading-5`, the error at `text-sm`. Reapplied through a wrapper onto the
 * footer's own ids (`…-count`, `…-error`), so the field itself is the live one.
 * An attribute in the selector out-specifies the live single class.
 */
const OLD_FOOTER_LINES = '[&_[id$=-count]]:leading-5 [&_[id$=-error]]:text-sm';

/** A field with a counter, and the same field invalid: both footer lines. */
function FooterLines() {
  return (
    <div className="flex w-[360px] flex-col gap-5">
      <TextArea
        defaultValue="Read replica for the EMEA reporting jobs."
        label="Connection description"
        maxLength={500}
        showCount
      />
      <TextArea
        defaultValue="Use the token sk-live-4f9a when you call the API."
        errorText="Remove the API token from the instructions."
        isInvalid
        label="AI instructions"
        maxLength={4000}
        showCount
      />
    </div>
  );
}

export const Page: Story = {
  name: 'TextArea',
  render: () => (
    <ChangePage group="TextArea" title="TextArea">
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
        after={<FooterLines />}
        afterNote="counter 12/16 · error 12/16, medium"
        before={
          <div className={OLD_FOOTER_LINES}>
            <FooterLines />
          </div>
        }
        beforeNote="counter 12 on a 20px line · error 14/20"
        beforeSource={
          <>
            the live fields with the two published classes put back over the
            footer — <Code>leading-5</Code> on the counter, <Code>text-sm</Code>{' '}
            on the error — through a wrapper, since both lines are rendered
            inside the component.
          </>
        }
        files={[
          'src/components/TextArea/TextAreaCount.tsx',
          'src/components/TextArea/TextAreaFooter.tsx',
        ]}
        footnote={
          <>
            The error is now <Code>InputGroup</Code>'s — <Code>text-xs</Code>,
            medium — and the counter is <Code>body12</Code>, the kit's Body 12,
            on the 16px line its size pairs with. The section's first point, the
            hint at 400, corrects §41's own first pass: the developers' TextArea
            has no hint, so there is nothing to set it against here. It shows in
            §41's After.
          </>
        }
        n={70}
        title="The hint at 400, and the counter and error lines"
        why="A TextArea's error was a size larger than an InputGroup's, and its 12px counter sat on a 20px line — the footer row a step taller than the type in it."
      />
    </ChangePage>
  ),
};
