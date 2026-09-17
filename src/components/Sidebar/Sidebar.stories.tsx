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
import { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../Table';
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
  useSidebar,
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

/**
 * The full-height page shell — the shape every screen built on this library
 * should start from.
 *
 * Three rules make the heights come out right, and all three are easy to get
 * wrong:
 *
 * 1. **Pin the shell, do not let it grow.** `SidebarProvider` is `min-h-svh`
 *    by default, which is right for a page that scrolls as a whole. For an app
 *    screen whose content scrolls *inside* the frame, override it to
 *    `h-svh min-h-0 overflow-hidden`.
 * 2. **`min-h-0` on every flex ancestor of the scroller.** A flex item
 *    defaults to `min-height: auto`, so it refuses to shrink below its
 *    content and an `overflow-y-auto` child grows the page instead of
 *    scrolling.
 * 3. **The page header is `shrink-0`**, and only the region below it takes
 *    `flex-1 overflow-y-auto`.
 *
 * Never reach for `h-full` inside the shell: it resolves against a parent that
 * has only a `min-height`, so it computes to `auto` and silently does nothing.
 */
export const AppShell: StoryObj<typeof Sidebar> = {
  args: { collapsible: "icon" },
  render: (args) => (
    <SidebarProvider defaultOpen className="h-svh min-h-0 overflow-hidden">
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarStoryHeader />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNavigationItems items={navigation} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-0">
        <header className="flex shrink-0 items-center gap-3 border-stroke border-b px-6 py-4">
          <SidebarTrigger variant="tertiary" />
          <Typography element="h1" textStyle="title20">
            Connections
          </Typography>
          <Button className="ms-auto" size="sm" variant="primary">
            New connection
          </Button>
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
          <Typography element="p" textColor="secondary" textStyle="body14">
            Only this region scrolls. The header stays put and the shell never
            grows past the viewport.
          </Typography>
          <ShellTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

/**
 * Below `lg` the sidebar stops being part of the layout. `SidebarProvider`
 * watches the viewport (`sheetBreakpoint`, default `BREAKPOINTS.lg` = 1024) and
 * under that width `Sidebar` renders a `Sheet` instead of the in-flow panel:
 * it slides in **over** the content from the left at
 * `--sidebar-width-mobile` (288px), on a `overlay-scrim` backdrop, and the page
 * underneath keeps its full width rather than being pushed. Open/closed here is
 * a separate piece of state from the desktop one — it starts closed on every
 * mount, so a narrow screen always opens on content, and the scrim, `Esc` or
 * the trigger closes it again. The `Sheet`'s own close button is hidden.
 *
 * Two things the story has to fake, both only to make a live state visible in a
 * static canvas: `sheetBreakpoint` is set past any viewport (the Storybook
 * canvas is wider than `lg` on a desktop, so the branch would never run), and
 * the sheet is opened on mount. Neither belongs in product code — there,
 * crossing 1024px is what switches the branch.
 *
 * The one thing to get right in a page shell: put `SidebarTrigger` in the
 * `SidebarInset` header, not inside `Sidebar`. A trigger that lives in the
 * sidebar goes away with it under `lg`, leaving nothing to open the sheet with.
 */
export const MobileOverlay: StoryObj<typeof Sidebar> = {
  args: { collapsible: 'icon' },
  render: (args) => (
    <SidebarProvider
      className="h-svh min-h-0 overflow-hidden"
      sheetBreakpoint={ALWAYS_SHEET}
    >
      <OpenSheetOnMount />
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarStoryHeader />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNavigationItems items={navigation} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-0">
        <header className="flex shrink-0 items-center gap-3 border-stroke border-b px-6 py-4">
          <SidebarTrigger variant="tertiary" />
          <Typography element="h1" textStyle="title20">
            Connections
          </Typography>
          <Button className="ms-auto" size="sm" variant="primary">
            New connection
          </Button>
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
          <Typography element="p" textColor="secondary" textStyle="body14">
            The content keeps the full width under the scrim — nothing reflows
            when the panel opens, so closing it puts every row back where it
            was.
          </Typography>
          <ShellTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

// Wider than any viewport, so `useMaxWidth` reports "mobile" whatever the
// canvas is. Product code leaves `sheetBreakpoint` alone and lets 1024px decide.
const ALWAYS_SHEET = 99_999;

/**
 * The sheet starts closed by design, which in a static canvas means the story
 * would capture an empty shell. Opening it on mount is a story device, not a
 * pattern — no product screen should force the panel open on a narrow viewport.
 */
function OpenSheetOnMount() {
  const { setOpenMobile } = useSidebar();
  useEffect(() => {
    setOpenMobile(true);
  }, [setOpenMobile]);
  return null;
}

const SHELL_ROWS = [
  { name: "Postgres — analytics", status: "Connected", rows: "1.2M" },
  { name: "Salesforce", status: "Syncing", rows: "480K" },
  { name: "S3 — raw events", status: "Connected", rows: "8.4M" },
  { name: "HubSpot", status: "Error", rows: "—" },
];

/** The connections table both shell stories put in their scroll region. */
function ShellTable() {
  return (
    <Table layout="fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/2">Source</TableHead>
          <TableHead className="w-32">Status</TableHead>
          <TableHead className="w-32 text-right">Rows</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SHELL_ROWS.map((row) => (
          <TableRow key={row.name} data-interactive>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell className="text-right">{row.rows}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

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
 * Dark theme — every state the component ships, on one dark surface. Tokens
 * are pure CSS cascade, so a scoped `.dark` re-themes the whole subtree with
 * no provider and no props.
 */
export const DarkTheme = {
  render: (args, ctx) => {
    const cells: [string, Story][] = [
      ['Expanded', Expanded],
      ['Collapsed Icon', CollapsedIcon],
      ['Floating Variant', FloatingVariant],
      ['Inset Variant', InsetVariant],
    ];
    return (
      <div className="dark grid gap-6 rounded-lg bg-surface-page p-6">
        {cells.map(([name, story]) => (
          <section className="flex flex-col gap-2" key={name}>
            <span className="font-medium text-ink-secondary text-xxs uppercase leading-4 tracking-caps">
              {name}
            </span>
            {story.render ? (
              story.render({ ...args, ...story.args } as never, ctx)
            ) : (
              null
            )}
          </section>
        ))}
      </div>
    );
  },
} as Story;
