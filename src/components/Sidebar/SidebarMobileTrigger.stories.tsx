import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '../Typography';
import {
  Sidebar,
  SidebarContent,
  SidebarMobileTrigger,
  SidebarProvider,
} from './index';

/**
 * Opens the sidebar's mobile sheet from a floating app header.
 *
 * It is separate from `SidebarTrigger` because the two are never on screen
 * together: this one sits over the page, the panel trigger sits inside the
 * sidebar. It deliberately carries **no `data-sidebar` attribute** — consumers
 * disambiguate the two with `:not([data-sidebar])`, so stamping one here would
 * quietly make every such selector match both.
 *
 * `sheetBreakpoint` is pushed past the canvas width in these stories so the
 * provider reports mobile and the sheet actually opens.
 */
const meta = {
  title: 'Compositions/Sidebar/SidebarMobileTrigger',
  component: SidebarMobileTrigger,
  tags: ['autodocs'],
  args: {
    label: 'Toggle sidebar',
    variant: 'tertiary',
    size: 'sm',
    tooltip: false,
    tooltipSide: 'bottom',
  },
  argTypes: {
    icon: { control: false },
    tooltipSide: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    children: { control: false },
    ref: { control: false, table: { disable: true } },
    variant: {
      control: 'select',
      options: ['tertiary', 'secondary', 'outline', 'transparent'],
    },
    size: { control: 'select', options: ['2xs', 'xs', 'sm', 'md', 'lg'] },
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="h-svh min-h-[20rem] w-full">
        <SidebarProvider sheetBreakpoint={99_999}>
          <Sidebar collapsible="icon">
            <SidebarContent className="p-4">
              <Typography variant="span" textColor="secondary">
                Sheet content
              </Typography>
            </SidebarContent>
          </Sidebar>
          <header className="pointer-events-none absolute z-30 flex w-full items-center px-3 py-2.5">
            <Story />
          </header>
        </SidebarProvider>
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarMobileTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The glyph rotates a quarter turn while the sheet is open. */
export const Secondary: Story = {
  args: { variant: 'secondary' },
};

/**
 * `tooltip` shows the accessible name — the same string, so a caller that
 * names the button "Open sidebar" gets both. It hangs below by default: the
 * button lives at the top of the page.
 */
export const WithTooltip: Story = {
  args: { label: 'Open sidebar', tooltip: true },
};
