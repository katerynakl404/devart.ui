import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../src/components/Tabs';
import { ChangeCase, ChangePage, Code } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/Tabs',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The panel classes `TabsContent` carries, minus the one line under review. */
const TABS_PANEL_CLASSES =
  'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card';

function PanelBody({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-stroke bg-surface-card2 p-4 text-ink-body text-sm">
      {label}
    </div>
  );
}

/**
 * The second tab open, and a marker under the whole block. Both halves of §8
 * need the same frame: the defect is 16px of empty space, which is only legible
 * against something that moves.
 */
function TabsDemo({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-[320px] flex-col">
      <Tabs defaultValue="schema">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
      <div className="mt-2 border-fb-attention border-t border-dashed pt-1 text-fb-attention text-xxs">
        next section starts here
      </div>
    </div>
  );
}

export const Page: Story = {
  name: 'Tabs',
  render: () => (
    <ChangePage group="Tabs" title="Tabs">
      <ChangeCase
        after={
          <TabsDemo>
            <TabsContent className="flex flex-col gap-2" value="overview">
              <PanelBody label="Overview panel" />
            </TabsContent>
            <TabsContent className="flex flex-col gap-2" value="schema">
              <PanelBody label="Schema panel — the open one" />
            </TabsContent>
          </TabsDemo>
        }
        afterNote="the open panel starts right under the tabs"
        before={
          <TabsDemo>
            <TabsPrimitive.Content
              className={`${TABS_PANEL_CLASSES} flex flex-col gap-2`}
              value="overview"
            >
              <PanelBody label="Overview panel" />
            </TabsPrimitive.Content>
            <TabsPrimitive.Content
              className={`${TABS_PANEL_CLASSES} flex flex-col gap-2`}
              value="schema"
            >
              <PanelBody label="Schema panel — the open one" />
            </TabsPrimitive.Content>
          </TabsDemo>
        }
        beforeNote="16px of nothing above it — and below the whole block"
        beforeSource={
          <>
            the package's own Tabs with the panels swapped for raw{' '}
            <Code>@radix-ui/react-tabs</Code>, which is what{' '}
            <Code>TabsContent</Code> was before the pin. The second tab is open
            on purpose: the closed panel sits <em>above</em> it in the DOM, so
            its dead space is what pushes the open panel down. Measured, the
            closed panel is <Code>display: flex</Code> with height 0 — Radix
            drops its children but the box stays in the flow, and its own{' '}
            <Code>mt-4</Code> is the 16px you see.
          </>
        }
        files={['src/components/Tabs/TabsContent.tsx']}
        n={8}
        title="TabsContent — the inactive panel came back as an empty box"
        why={
          <>
            Radix hides the inactive panel with the <Code>hidden</Code>{' '}
            attribute, which is only a UA-stylesheet <Code>display:none</Code> —
            any display class from the consumer beats it. That was the source of
            the "extra padding under the tabs".
          </>
        }
      />
    </ChangePage>
  ),
};
