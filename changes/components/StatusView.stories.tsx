import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchX } from 'lucide-react';
import { Button } from '../../src/components/Button';
import {
  EmptyStateIllustration,
  StatusView,
} from '../../src/components/StatusView';
import { ChangeCase, ChangePage, Code, NoPanel } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/StatusView',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = {
  name: 'StatusView',
  render: () => (
    <ChangePage group="StatusView" title="StatusView">
      <ChangeCase
        after={
          <StatusView
            actions={<Button size="sm">Clear filters</Button>}
            className="w-full"
            description="No connection matches “prod-eu”. Try a shorter query, or clear the filters."
            icon={<EmptyStateIllustration />}
            title="No connections found"
            withIconHalo={false}
          />
        }
        afterNote="EmptyStateIllustration — 150×104, all tokens"
        before={
          <StatusView
            actions={<Button size="sm">Clear filters</Button>}
            className="w-full"
            description="No connection matches “prod-eu”. Try a shorter query, or clear the filters."
            icon={<SearchX />}
            title="No connections found"
          />
        }
        beforeNote="a lucide glyph in a tinted halo"
        beforeSource="the same StatusView with the only artwork it used to offer."
        files={['src/components/StatusView/index.tsx']}
        footnote={
          <>
            Deliberately not a magnifier: "nothing found" is already said by the
            title, and a magnifier repeats it while saying nothing about what is
            absent. The illustration mirrors the list that is missing. Every
            colour is a token — <Code>--surface-card</Code>,{' '}
            <Code>--stroke-border</Code>, <Code>--ink-inactive</Code> — so it
            re-themes with the page and needs no dark variant. Flip the theme
            toolbar to check that.
          </>
        }
        n={51}
        title="EmptyStateIllustration"
        why="At page scale a lucide glyph in a halo reads as a notification icon rather than an empty region."
      />
      <NoPanel
        section={104}
        title="A wider message"
        why={
          <>
            Against the developers' 1.4.0 this is not wider: their description
            had no cap and ran to the block's <Code>max-w-md</Code>, 448px. The
            32ch it widens from was this package's own earlier value, and an
            earlier draft is never a Before.
          </>
        }
      />
      <NoPanel
        section={107}
        title="EmptySearchIllustration — visible on a white card"
        why={
          <>
            <Code>EmptySearchIllustration</Code> is not in the developers'
            library at 1.4.0; the only Before would be this package's own
            earlier drawing.
          </>
        }
      />
    </ChangePage>
  ),
};
