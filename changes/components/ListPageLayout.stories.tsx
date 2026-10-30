import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus } from 'lucide-react';
import { Button } from '../../src/components/Button';
import {
  ListPageLayout,
  type ListPageLayoutHeaderState,
} from '../../src/components/ListPageLayout';
import { PageHeader } from '../../src/components/PageHeader';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/ListPageLayout',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Rows() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 24 }, (_, i) => (
        <div
          className="flex h-11 shrink-0 items-center rounded-lg border border-stroke bg-surface-card px-3 text-ink-body text-sm"
          key={`row-${i + 1}`}
        >
          connection-{i + 1}
        </div>
      ))}
    </div>
  );
}

function header({ condensed }: ListPageLayoutHeaderState) {
  return (
    <PageHeader
      actions={
        <Button size="sm" variant="primary">
          <Plus />
          New
        </Button>
      }
      condensed={condensed}
      title="Connections"
    />
  );
}

/**
 * The layout in a 360px window. The header is sticky only below `lg`, which is
 * read from the viewport, so the page opens at the tablet size.
 */
function Window({ condensing }: { condensing?: boolean }) {
  return (
    <div className="h-[360px] w-full overflow-hidden rounded-lg border border-stroke bg-surface-page">
      {condensing ? (
        <ListPageLayout condenseAfter={60} stickyHeader={header}>
          <Rows />
        </ListPageLayout>
      ) : (
        <ListPageLayout stickyHeader={header({ condensed: false })}>
          <Rows />
        </ListPageLayout>
      )}
    </div>
  );
}

export const Page: Story = {
  name: 'ListPageLayout',
  globals: { viewport: { value: 'tablet', isRotated: false } },
  render: () => (
    <ChangePage
      group="ListPageLayout"
      intro="Opens at the tablet viewport: the header is sticky, and so can condense, only below lg (1024px). From lg up it scrolls away with the page."
      title="ListPageLayout"
    >
      <ChangeCase
        after={
          <TryIt action="Scroll past 60px — the inset tightens and the title steps down">
            <Window condensing />
          </TryIt>
        }
        afterNote="condenseAfter={60} · header as ({ condensed }) => …"
        before={
          <TryIt action="Scroll the list — the header keeps its full height">
            <Window />
          </TryIt>
        }
        beforeNote="the header as a node — it sticks and never changes"
        beforeSource={
          <>
            the live layout with <Code>condenseAfter</Code> omitted and the
            header passed as a node, which renders as the published layout: the
            same sticky header at the same height however far the list goes.
          </>
        }
        files={[
          'src/components/ListPageLayout/index.tsx',
          'src/components/ListPageLayout/use-list-header-height.ts',
        ]}
        footnote={
          <>
            Condensed, the header's inset tightens to 6px over{' '}
            <Code>--motion-slow</Code> and a render-function{' '}
            <Code>stickyHeader</Code> receives <Code>condensed</Code> to hand to{' '}
            <Code>PageHeader</Code> — no context, no <Code>cloneElement</Code>.
            The kit's <Code>scrollTop &gt; 60</Code> flickered when parked just
            past the line: the header shrank, scroll anchoring took the
            difference off <Code>scrollTop</Code>, and it grew back, every
            frame. The layout adds back the height the header lost, so the test
            holds. <Code>bodyClassName</Code> reaches the body's own{' '}
            <Code>pb-3</Code> and <Code>gap-3</Code>, which{' '}
            <Code>contentClassName</Code> cannot — its padding stacks on the
            body's.
          </>
        }
        n={133}
        title="The header condenses, and the body takes a class"
        why="Below lg the header stayed on screen at full height however far the list scrolled, and the layout — the one part that owns the scroller — could not say when to condense. Insightis' kit carried its own copy to do it."
      />
    </ChangePage>
  ),
};
