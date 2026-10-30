import type { Meta, StoryObj } from '@storybook/react-vite';
import { Info, Link, Plug2, Sun } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { Alert } from '../../src/components/Alert';
import { Banner } from '../../src/components/Banner';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';
import { Banner as UpstreamBanner } from '../upstream/Banner';

const meta = {
  title: 'Proposed changes/Components/Banner',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The props both Banners share — all the panels need. */
type AnyBanner = ComponentType<{
  description?: ReactNode;
  icon?: ReactNode;
  onDismiss?: () => void;
  title: string;
  variant?: 'horizontalWide' | 'diagonalFade';
}>;

/** §85 — two gradient banners with a dismiss, where the defect showed. */
function Dismissible({ Component }: { Component: AnyBanner }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <Component
        description="Link a warehouse or file to start building metrics."
        icon={<Plug2 />}
        onDismiss={() => undefined}
        title="Connect your first data source"
        variant="horizontalWide"
      />
      <Component
        description="Pick light, dark or the system's own."
        icon={<Sun />}
        onDismiss={() => undefined}
        title="A theme for every screen"
        variant="diagonalFade"
      />
    </div>
  );
}

/**
 * The published `sm` body gap — the 6px the default size keeps — put back
 * through `className`. twMerge keeps the last class in a group, so the Before
 * half is the old rendering rather than an impression of it.
 */
const OLD_SM_GAP = '[&_[data-slot=banner-body]]:gap-1.5';

const COPY = {
  title: 'Connect your first data source',
  description: 'Link a warehouse or file to start building metrics.',
};

/** §90 — a small banner over an `Alert size="md"` that says the same thing. */
function SmallBesideAlert({ old }: { old?: boolean }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <Banner
        className={old ? OLD_SM_GAP : undefined}
        description={COPY.description}
        icon={<Link />}
        size="sm"
        title={COPY.title}
      />
      <Alert
        description={COPY.description}
        icon={<Info />}
        size="md"
        title={COPY.title}
        variant="info"
      />
    </div>
  );
}

export const Page: Story = {
  name: 'Banner',
  render: () => (
    <ChangePage group="Banner" title="Banner">
      <ChangeCase
        after={
          <TryIt action="Hover the ✕ — only the glyph brightens">
            <Dismissible Component={Banner} />
          </TryIt>
        }
        afterNote="a 32px glyph-only control — banner-grad-sub → banner-grad-text"
        before={
          <TryIt action="Hover the ✕ — a pale box lands on the artwork">
            <Dismissible Component={UpstreamBanner} />
          </TryIt>
        }
        beforeNote="IconButton tertiary xs — an ink-body glyph, a --state-hover box"
        beforeSource={
          <>
            the developers' own <Code>Banner</Code>, vendored unchanged from
            their 1.4.0 into <Code>changes/upstream/Banner</Code>, its dismiss
            their own <Code>IconButton</Code> vendored beside it. The ✕ is a
            component the Banner renders itself, so no prop reaches it.
          </>
        }
        files={['src/components/Banner/index.tsx']}
        footnote={
          <>
            The 32px box stays — it is the hit area. On the solid variant the
            glyph goes <Code>--ink-icon</Code> → <Code>--ink-icon-hover</Code>.
            The same rule as <Code>InputGroupAction</Code> (§45): an icon docked
            on a surface that already owns hover does not get a surface of its
            own.
          </>
        }
        n={85}
        title="The dismiss answers with colour, not a fill"
        why="The dismiss was a tertiary button: on a gradient its hover fill was a pale box sitting on the artwork, and the ✕ stopped reading as part of the banner."
      />

      <ChangeCase
        after={<SmallBesideAlert />}
        afterNote="title → description 2px, as the Alert under it"
        before={<SmallBesideAlert old />}
        beforeNote="title → description 6px, the default size's"
        beforeSource={
          <>
            the published body gap — <Code>{OLD_SM_GAP}</Code>, the{' '}
            <Code>gap-1.5</Code> the body carried at every size — put back
            through <Code>className</Code>. The <Code>Alert</Code> under it is
            the same in both halves.
          </>
        }
        files={['src/components/Banner/index.tsx']}
        footnote={
          <>
            The body gains <Code>data-slot="banner-body"</Code> so the size can
            reach it. The default size is untouched: its 16px title and taller
            block still want the air.
          </>
        }
        n={90}
        title="sm kept a line gap chosen for a larger title"
        why="sm already stepped the title down to 14/20 but kept the 6px gap chosen for a 16px one, so beside an Alert md — the same type, 2px between its lines — the two read as different components."
      />
    </ChangePage>
  ),
};
