import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from './index';

/**
 * Toggles the sidebar, reading `toggleSidebar` from context.
 *
 * `label` is the accessible name and doubles as the tooltip text, so a caller
 * that swaps it per state gets both for free with nothing to keep in sync.
 * `icon` replaces the glyph; sizing stays with `className`, so an override
 * inherits whatever `[&_svg]:size-*` is already set.
 */
const meta = {
  title: 'Compositions/Sidebar/SidebarTrigger',
  component: SidebarTrigger,
  tags: ['autodocs'],
  args: {
    variant: 'tertiary',
    tooltip: false,
    tooltipSide: 'right',
  },
  argTypes: {
    icon: { control: false },
    children: { control: false },
    ref: { control: false, table: { disable: true } },
    tooltipSide: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="h-svh min-h-[20rem] w-full">
        <SidebarProvider defaultOpen>
          <Sidebar collapsible="icon">
            <SidebarHeader>
              <Story />
            </SidebarHeader>
            <SidebarContent />
          </Sidebar>
        </SidebarProvider>
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The label is the accessible name, so the tooltip needs no second string. */
export const WithTooltip: Story = {
  args: { tooltip: true, label: 'Collapse sidebar' },
};
