import type { Meta, StoryObj } from '@storybook/react-vite';
import { Layers } from 'lucide-react';
import type { ReactNode } from 'react';
import { Typography } from '../Typography';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarPanelHeader,
  SidebarProvider,
  SidebarTrigger,
} from './index';

const Shell = ({
  defaultOpen,
  children,
}: {
  defaultOpen: boolean;
  children: ReactNode;
}) => (
  <SidebarProvider defaultOpen={defaultOpen}>
    <Sidebar collapsible="icon">
      {/* The header owns the inset; the row inside carries none. */}
      <SidebarHeader>{children}</SidebarHeader>
      <SidebarContent />
    </Sidebar>
  </SidebarProvider>
);

/** The product mark and name. The name leaves on the rail; the mark stays. */
const Wordmark = () => (
  <span className="flex min-w-0 items-center gap-2">
    <Layers className="size-5 shrink-0 text-brand-primary" />
    <Typography
      className="truncate group-data-[collapsible=icon]:hidden"
      element="span"
      textStyle="title16"
    >
      Insightis
    </Typography>
  </span>
);

/**
 * The sidebar panel header: brand mark leading, collapse trigger trailing.
 *
 * `logoIcon` is a `Slot`, so the row's layout and focus classes land on the
 * caller's own element — the brand link keeps its focus ring. The trigger is
 * any node; pass a `SidebarTrigger` to control its label.
 *
 * On the icon rail the two stack in one square and swap on hover. That swap is
 * opacity-only and never `display`: the trigger stays in the tab order while
 * invisible, which is what lets keyboard focus reveal it.
 */
const meta = {
  title: 'Compositions/Sidebar/SidebarPanelHeader',
  component: SidebarPanelHeader,
  tags: ['autodocs'],
  argTypes: {
    logoIcon: { control: false },
    sidebarTrigger: { control: false },
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="h-svh min-h-[20rem] w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarPanelHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: {
    logoIcon: (
      // biome-ignore lint/a11y/useValidAnchor: story-only placeholder link
      <a href="#" aria-label="Home">
        <Wordmark />
      </a>
    ),
  },
  render: (args) => (
    <Shell defaultOpen>
      <SidebarPanelHeader {...args} />
    </Shell>
  ),
};

/**
 * Collapsed to the rail. Hover the square (or tab to it) to swap the mark for
 * the trigger.
 */
export const CollapsedRail: Story = {
  args: {
    logoIcon: (
      // biome-ignore lint/a11y/useValidAnchor: story-only placeholder link
      <a href="#" aria-label="Home">
        <Wordmark />
      </a>
    ),
    sidebarTrigger: (
      <SidebarTrigger
        className="shrink-0"
        label="Expand sidebar"
        size="xs"
        tooltip
      />
    ),
  },
  render: (args) => (
    <Shell defaultOpen={false}>
      <SidebarPanelHeader {...args} />
    </Shell>
  ),
};
