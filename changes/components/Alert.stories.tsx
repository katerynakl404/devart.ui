import type { Meta, StoryObj } from '@storybook/react-vite';
import { Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { Alert } from '../../src/components/Alert';
import { ChangeCase, ChangePage, Code } from '../Harness';
import { Alert as UpstreamAlert } from '../upstream/Alert';

const meta = {
  title: 'Proposed changes/Components/Alert',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Permissions pane's explanation — a paragraph, not a headline. */
const LEAD = 'Permissions flow down the tree.';
const REST =
  'A node left as Inherit takes its parent’s grant, all the way up to the connection; Allow or Deny set on a node overrides everything below it.';

function Captioned({
  caption,
  children,
}: {
  caption: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {children}
      <span className="text-ink-secondary text-xxs">{caption}</span>
    </div>
  );
}

export const Page: Story = {
  name: 'Alert',
  render: () => (
    <ChangePage group="Alert" title="Alert">
      <ChangeCase
        after={
          <div className="flex w-full flex-col gap-4">
            <Captioned caption="no title — the paragraph is the message">
              <Alert
                description={`${LEAD} ${REST}`}
                icon={<Info />}
                variant="info"
              />
            </Captioned>
          </div>
        }
        afterNote="the description alone, in ink-primary, the glyph on its first line"
        before={
          <div className="flex w-full flex-col gap-4">
            <Captioned
              caption={
                <>
                  <Code>title=""</Code> — the only way to say no headline
                </>
              }
            >
              <UpstreamAlert
                description={`${LEAD} ${REST}`}
                icon={<Info />}
                title=""
                variant="info"
              />
            </Captioned>
            <Captioned caption="the first sentence lifted out to serve as the title">
              <UpstreamAlert
                description={REST}
                icon={<Info />}
                title={LEAD}
                variant="info"
              />
            </Captioned>
          </div>
        }
        beforeNote="title required — empty, or a sentence of the copy"
        beforeSource={
          <>
            the developers' own <Code>Alert</Code>, vendored unchanged from
            their 1.4.0 into <Code>changes/upstream/Alert</Code>. Its{' '}
            <Code>title</Code> is a required string and its title line is
            rendered whatever it holds.
          </>
        }
        files={['src/components/Alert/index.tsx']}
        footnote={
          <>
            Under a title the description stays <Code>text-ink-secondary</Code>.
            Alone it is the message, in <Code>text-ink-primary</Code>. New
            story: <Code>DescriptionOnly</Code>.
          </>
        }
        n={95}
        title="The title is optional"
        why="An Alert that explains rather than announces had no way to drop its headline: the first sentence was lifted out to serve as one and read as a heading repeating the copy, and an empty title left the whole block in the grey of a footnote."
      />
    </ChangePage>
  ),
};
