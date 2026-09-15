import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Bot,
  Files,
  Home,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarNavigationItems,
  SidebarProvider,
  SidebarTrigger,
} from './index';
import type { NavigationElement } from './types';

const SidebarStoryHeader = () => (
  <div className="flex items-center gap-2 px-2">
    <LayoutDashboard className="size-5 shrink-0 text-brand-primary" />
    <Typography variant="h5">Header</Typography>
  </div>
);

// Realistic app navigation: single links + a collapsible group with sub-items.
const navigation: NavigationElement[] = [
  { id: 'home', title: 'Home', icon: Home, url: '/' },
  { id: 'search', title: 'Search', icon: Search, url: '/search' },
  {
    id: 'chats',
    title: 'Chats',
    icon: MessageSquare,
    defaultOpen: true,
    items: [
      { id: 'c1', title: 'Onboarding questions', url: '/chats/1' },
      { id: 'c2', title: 'Quarterly metrics review', url: '/chats/2' },
      { id: 'c3', title: 'Bug triage thread', url: '/chats/3' },
    ],
    viewAll: { id: 'chats-all', title: 'View all', url: '/chats' },
  },
  {
    id: 'agents',
    title: 'Agents',
    icon: Bot,
    emptyMessage: 'No agents yet',
    items: [],
  },
  { id: 'files', title: 'Files', icon: Files, url: '/files' },
];

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    side: 'left',
    variant: 'sidebar',
    collapsible: 'offcanvas',
  },
  argTypes: {
    side: { control: 'select', options: ['left', 'right'] },
    variant: {
      control: 'select',
      options: ['sidebar', 'floating', 'inset'],
    },
    collapsible: {
      control: 'select',
      options: ['offcanvas', 'icon', 'none'],
    },
    sheetClassname: { control: false },
    className: { control: false },
    children: { control: false },
    ref: { control: false, table: { disable: true } },
  },
  // Desktop sidebar only renders at >=lg. Give the canvas a fixed height so the
  // fixed-position panel and inset content lay out correctly.
  decorators: [
    (Story) => (
      <div className="h-svh min-h-[32rem] w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  render: (args) => (
    <SidebarProvider defaultOpen>
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarStoryHeader />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNavigationItems items={navigation} />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2 px-2">
            <Settings className="size-4" />
            <Typography variant="span" textColor="secondary">
              Settings
            </Typography>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-2 p-4">
          <SidebarTrigger variant="tertiary" />
          <Typography variant="h4">Dashboard</Typography>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

// `collapsible="icon"` + collapsed provider state minimises the sidebar to an
// icon rail with tooltips on hover.
export const CollapsedIcon: Story = {
  args: { collapsible: 'icon' },
  render: (args) => (
    <SidebarProvider defaultOpen={false}>
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarStoryHeader />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNavigationItems items={navigation} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-2 p-4">
          <SidebarTrigger variant="tertiary" />
          <Typography variant="h4">Dashboard</Typography>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

export const FloatingVariant: Story = {
  args: { variant: 'floating' },
  render: (args) => (
    <SidebarProvider defaultOpen>
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarStoryHeader />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNavigationItems items={navigation} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-2 p-4">
          <SidebarTrigger variant="tertiary" />
          <Typography variant="h4">Dashboard</Typography>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

export const InsetVariant: Story = {
  args: { variant: 'inset', collapsible: 'icon' },
  render: (args) => (
    <SidebarProvider defaultOpen>
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarStoryHeader />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNavigationItems items={navigation} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-2 p-4">
          <SidebarTrigger variant="tertiary" />
          <Typography variant="h4">Inset content</Typography>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

// Hover and pressed cannot be frozen as CSS pseudo-states in a static story, so
// each is reproduced with the exact fill utility its recipe applies.
const NAV_ROW_STATES = [
  { state: 'default', className: '', isActive: false },
  { state: 'hover', className: 'bg-state-hover', isActive: false },
  { state: 'pressed', className: 'bg-state-pressed', isActive: false },
  { state: 'active', className: '', isActive: true },
] as const;

const CHAT_ROW_STATES = NAV_ROW_STATES;

const StateLabel = ({ children }: { children: string }) => (
  <span className="w-20 shrink-0 self-center font-semibold text-ink-inactive text-xxs uppercase">
    {children}
  </span>
);

/**
 * Every interaction state of a nav row and of a chat / sub row, side by side.
 *
 * The desktop `Sidebar` shell only mounts at `lg`, which hides these rows in a
 * narrow docs frame — so this story renders the menu primitives directly.
 * Hover and pressed are reproduced with the fill utilities the recipes apply
 * (`bg-state-hover` / `bg-state-pressed`) because CSS pseudo-states cannot be
 * frozen in a static story.
 *
 * Nav row: h32, radius `md`, gap 8px, 16px icon, `text-sm font-medium`, ink
 * `Text/Secondary`. Hover paints `State/Hover` and leaves text and icon alone;
 * pressed paints `State/Pressed` only; active paints `State/Pressed` and lifts
 * ink to `Text/Body` — never a brand colour.
 */
export const RowStates: StoryObj<typeof Sidebar> = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <SidebarProvider>
      <div className="w-96 rounded-md border border-stroke bg-surface-card p-2">
        <SidebarMenu>
          {NAV_ROW_STATES.map(({ state, className, isActive }) => (
            <SidebarMenuItem className="flex gap-3" key={state}>
              <SidebarMenuButton
                className={cn('gap-2 px-2', className)}
                isActive={isActive}
              >
                <LayoutDashboard />
                <span>Metrics</span>
              </SidebarMenuButton>
              <StateLabel>{state}</StateLabel>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarMenuSub className="ms-0 border-0 px-0 ps-0">
          {CHAT_ROW_STATES.map(({ state, className, isActive }) => (
            <SidebarMenuSubItem className="flex gap-3" key={state}>
              <SidebarMenuSubButton
                className={cn('flex-1', className)}
                isActive={isActive}
              >
                <span>Q3 KPI deep-dive</span>
              </SidebarMenuSubButton>
              <StateLabel>{state}</StateLabel>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </div>
    </SidebarProvider>
  ),
};

/**
 * Dark theme. Every token is plain CSS cascade, so a scoped `.dark` re-themes
 * the subtree — no provider, no props, no JS.
 */
export const DarkTheme: Story = {
  ...Expanded,
  decorators: [
    (Story) => (
      <div className="dark rounded-lg bg-surface-page p-6">
        <Story />
      </div>
    ),
  ],
};
