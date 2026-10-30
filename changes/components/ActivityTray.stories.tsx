import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert, CircleCheck, FileText } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import {
  ActivityTray,
  ActivityTrayItem,
} from '../../src/components/ActivityTray';
import { LinkButton } from '../../src/components/LinkButton';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';
import {
  ActivityTray as UpstreamActivityTray,
  ActivityTrayItem as UpstreamActivityTrayItem,
} from '../upstream/ActivityTray';

const meta = {
  title: 'Proposed changes/Components/ActivityTray',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The props both trays share — all the panels need. */
type AnyTray = ComponentType<{
  children?: ReactNode;
  headerIcon?: ReactNode;
  headerTitle: ReactNode;
  onDismiss?: () => void;
}>;

type AnyItem = ComponentType<{
  errorText?: ReactNode;
  icon?: ReactNode;
  rightSlot?: ReactNode;
  title: ReactNode;
  trailingIcon?: ReactNode;
}>;

const DONE = [
  'giffycanvas.gif',
  'Grid.png',
  'notes.txt',
  'q3-revenue.xlsx',
  'logo.svg',
  'contract.pdf',
  'schema.sql',
];

/**
 * Eight rows — more than the list's 14rem holds, so it scrolls — one of them
 * failed with an error long enough to wrap.
 */
function Uploads({ Tray, Item }: { Tray: AnyTray; Item: AnyItem }) {
  return (
    <Tray
      headerIcon={<CircleAlert aria-hidden />}
      headerTitle="1 of 8 uploads failed"
      onDismiss={() => undefined}
    >
      <Item
        errorText="The file is larger than the 25 MB limit for a single upload"
        icon={<FileText aria-hidden />}
        rightSlot={
          <LinkButton asChild>
            <button type="button">Retry</button>
          </LinkButton>
        }
        title="dataset-full-export.csv"
        trailingIcon={<CircleAlert aria-hidden className="text-fb-red-text" />}
      />
      {DONE.map((file) => (
        <Item
          icon={<FileText aria-hidden />}
          key={file}
          title={file}
          trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
        />
      ))}
    </Tray>
  );
}

export const Page: Story = {
  name: 'ActivityTray',
  render: () => (
    <ChangePage group="ActivityTray" title="ActivityTray">
      <ChangeCase
        after={
          <TryIt action="Scroll the list; hover the chevron and the ✕">
            <Uploads Item={ActivityTrayItem} Tray={ActivityTray} />
          </TryIt>
        }
        afterNote="IconButton's chevron · scrollbar-thin · a balanced error"
        before={
          <TryIt action="Scroll the list; hover the chevron and the ✕">
            <Uploads
              Item={UpstreamActivityTrayItem}
              Tray={UpstreamActivityTray}
            />
          </TryIt>
        }
        beforeNote="its own chevron at stroke 1.5 · the browser's bar"
        beforeSource={
          <>
            the developers' own tray, vendored unchanged from their 1.4.0 into{' '}
            <Code>changes/upstream/ActivityTray/</Code> — the tray their
            storybook ships, not a replica of it. The <Code>IconButton</Code>,{' '}
            <Code>ScrollShadow</Code> and <Code>Typography</Code> under it are
            the live ones in both halves.
          </>
        }
        files={[
          'src/components/ActivityTray/ActivityTrayHeader.tsx',
          'src/components/ActivityTray/ActivityTrayContent.tsx',
          'src/components/ActivityTray/ActivityTrayItem.tsx',
          'src/components/ActivityTray/index.tsx',
        ]}
        footnote={
          <>
            The chevron is the <Code>IconButton</Code> recipe itself —{' '}
            <Code>tertiary</Code>, <Code>xs</Code> — rather than a restatement
            of it, and the ✕ drops its own <Code>stroke-[1.5]</Code>, so both
            draw at the system's one weight. The list is the kit's{' '}
            <Code>.upl-list</Code>: a 14rem cap with <Code>scrollbar-thin</Code>{' '}
            (§98). The error is <Code>text-balance</Code>, the kit's{' '}
            <Code>.upl-item-err</Code>. Not drawn: a row or the plate on its way
            out is now <Code>pointer-events-none</Code> — 240ms that a still
            panel cannot show.
          </>
        }
        n={79}
        title="The kit's values on their tray"
        why="The tray is the developers'; its chevron restated a button recipe at a lighter stroke, its list scrolled with the browser's own bar, and a wrapped error left its last word alone on the line — where the kit draws all three."
      />
    </ChangePage>
  ),
};
