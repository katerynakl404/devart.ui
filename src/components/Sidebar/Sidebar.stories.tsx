import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Bot,
  ChartPie,
  CirclePlus,
  Database,
  Files,
  Folder,
  Home,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { type ComponentProps, useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback } from '../Avatar';
import { Button } from '../Button';
import { DropdownMenuItem } from '../DropdownMenu';
import { LinkButton } from '../LinkButton';
import { PromoCard } from '../PromoCard';
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
  SidebarBrand,
  SidebarChatItem,
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
  SidebarPromo,
  SidebarProvider,
  SidebarRail,
  SidebarSection,
  SidebarStat,
  SidebarTrigger,
  SidebarUser,
  useSidebar,
} from './index';
import type { NavigationElement } from './types';

/**
 * The header row, as the library ships it.
 *
 * `SidebarBrand` hides its first child when the rail collapses and keeps the
 * trailing control, which is the way back out.
 */
const SidebarStoryHeader = () => (
  <SidebarBrand>
    <span className="flex min-w-0 items-center gap-2">
      <Layers className="size-5 shrink-0 text-brand-primary" />
      <Typography className="truncate" element="span" textStyle="title16">
        Insightis
      </Typography>
    </span>
    <SidebarTrigger size="xs" variant="tertiary" />
  </SidebarBrand>
);

// The product's four rows: the way to start, then the three libraries. Chats
// are not a nav row — they are the Pinned / Recent lists below.
const navigation: NavigationElement[] = [
  { id: 'new', title: 'New Chat', icon: CirclePlus, url: '#new' },
  { id: 'sources', title: 'Data Sources', icon: Database, url: '#sources' },
  { id: 'metrics', title: 'Metrics', icon: ChartPie, url: '#metrics' },
  { id: 'files', title: 'Files', icon: Folder, url: '#files' },
];

type Chat = {
  id: string;
  title: string;
  status?: 'loading' | 'new';
  count?: number;
  countActive?: boolean;
};

const PINNED: Chat[] = [
  { id: 'p1', title: 'Message queue', count: 3, countActive: true },
  { id: 'p2', title: 'Salesforce · Q1 revenue commentary' },
  { id: 'p3', title: 'HubSpot · onboarding cohort' },
  { id: 'p4', title: 'churn.csv · deep-dive' },
];

const RECENT: Chat[] = [
  { id: 'r1', title: 'Jira · first 5 AIINS issues', status: 'new' },
  { id: 'r2', title: 'Generate two charts using random data' },
  { id: 'r3', title: 'Q3 report.xlsx', status: 'loading' },
];

const ChatMenu = ({ pinned }: { pinned: boolean }) => (
  <>
    <DropdownMenuItem>{pinned ? 'Unpin' : 'Pin'}</DropdownMenuItem>
    <DropdownMenuItem>Rename</DropdownMenuItem>
    <DropdownMenuItem variant="danger">Delete</DropdownMenuItem>
  </>
);

const ChatRows = ({ chats, pinned }: { chats: Chat[]; pinned: boolean }) =>
  chats.map((chat) => (
    <SidebarChatItem
      aria-current={chat.id === 'p2' ? 'page' : undefined}
      count={chat.count}
      countActive={chat.countActive}
      href={`#${chat.id}`}
      isActive={chat.id === 'p2'}
      key={chat.id}
      menu={<ChatMenu pinned={pinned} />}
      status={chat.status}
    >
      {chat.title}
    </SidebarChatItem>
  ));

const SeeAll = () => <LinkButton href="#chats">See all</LinkButton>;

/** The promo slot, with the dismiss wired to the story's own state. */
const StoryPromo = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <SidebarPromo>
      <PromoCard
        description="Unlimited sources and 15,000 credits a month"
        href="#plan"
        icon={<Sparkles />}
        onDismiss={() => setVisible(false)}
        title="Upgrade to Pro"
      />
    </SidebarPromo>
  );
};

/**
 * The sidebar as the product ships it: brand row, four nav rows, the Pinned
 * and Recent lists, the promo slot, and the footer — balance and account.
 */
const ProductSidebar = ({
  showPromo = false,
  ...args
}: ComponentProps<typeof Sidebar> & { showPromo?: boolean }) => (
  <Sidebar {...args}>
    <SidebarHeader>
      <SidebarStoryHeader />
    </SidebarHeader>
    <SidebarContent>
      <SidebarNavigationItems items={navigation} />
      <SidebarSection action={<SeeAll />} label="Pinned">
        <ChatRows chats={PINNED} pinned />
      </SidebarSection>
      <SidebarSection action={<SeeAll />} label="Recent">
        <ChatRows chats={RECENT} pinned={false} />
      </SidebarSection>
    </SidebarContent>
    {showPromo ? <StoryPromo /> : null}
    <SidebarFooter>
      <SidebarStat icon={<Wallet />} label="Balance" value="9,480 left" />
      <SidebarUser
        avatar={
          <Avatar>
            <AvatarFallback>K</AvatarFallback>
          </Avatar>
        }
        meta={showPromo ? 'Admin · Free' : 'Admin · Pro'}
        name="Kateryna K."
      />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
);

type StoryArgs = ComponentProps<typeof Sidebar> & {
  /** Show the PromoCard slot above the footer. */
  showPromo: boolean;
};

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    side: 'left',
    variant: 'sidebar',
    collapsible: 'icon',
    showPromo: false,
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
    showPromo: {
      name: 'Promo card',
      control: 'boolean',
      description:
        'Adds `SidebarPromo` with a `PromoCard` above the footer. The product shows it on a free plan until dismissed; the account row then says `Free`.',
      table: { category: 'Story' },
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
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

const StoryInset = ({ title = 'New chat' }: { title?: string }) => (
  <SidebarInset>
    <div className="flex items-center gap-2 p-4">
      <SidebarTrigger variant="tertiary" />
      <Typography variant="h4">{title}</Typography>
    </div>
  </SidebarInset>
);

/**
 * The product sidebar. Toggle **Promo card** in Controls to add the offer
 * above the footer — it is a slot (`SidebarPromo`) holding one `PromoCard`,
 * not a prop of the sidebar, because whether to show it is the product's
 * decision.
 *
 * Hover a chat row for its menu; hover a section header for the chevron and
 * "See all". The first pinned chat shows a running queue count, a recent one
 * has new activity and another is still generating.
 */
export const Expanded: Story = {
  render: (args) => (
    <SidebarProvider defaultOpen>
      <ProductSidebar {...args} />
      <StoryInset />
    </SidebarProvider>
  ),
};

/**
 * The offer above the footer: glyph, what it is, one line of what it gives,
 * and a dismiss. It does NOT name the plan the person is on — the account row
 * below already does. Dismissing it here hides it for the story's lifetime.
 */
export const WithPromo: Story = {
  args: { showPromo: true },
  render: Expanded.render,
};

/**
 * Collapsed to the icon rail: the brand keeps only its trigger, the nav keeps
 * its icons with tooltips, and the lists, the promo and the balance leave —
 * none of them has a 48px form. The account row keeps its avatar.
 */
export const CollapsedIcon: Story = {
  args: { showPromo: true },
  render: (args) => (
    <SidebarProvider defaultOpen={false}>
      <ProductSidebar {...args} />
      <StoryInset />
    </SidebarProvider>
  ),
};

export const FloatingVariant: Story = {
  args: { variant: 'floating' },
  render: Expanded.render,
};

export const InsetVariant: Story = {
  args: { variant: 'inset' },
  render: (args) => (
    <SidebarProvider defaultOpen>
      <ProductSidebar {...args} />
      <StoryInset title="Inset content" />
    </SidebarProvider>
  ),
};

// A nav tree with a collapsible group and nested rows. The product no longer
// lists chats this way, but `NavigationGroup` and `SidebarMenuSub` stay for
// consumers whose second level really is navigation.
const nestedNavigation: NavigationElement[] = [
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

/**
 * `SidebarNavigationItems` with a `NavigationGroup` — a second level that is
 * navigation, nested under its row with a left rail. Use `SidebarSection` for
 * lists of things the person made; use this for a genuine sub-tree.
 */
export const NestedGroup: Story = {
  render: (args) => (
    <SidebarProvider defaultOpen>
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarStoryHeader />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNavigationItems items={nestedNavigation} />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2 px-2">
            <Settings className="size-4" />
            <Typography textColor="secondary" variant="span">
              Settings
            </Typography>
          </div>
        </SidebarFooter>
      </Sidebar>
      <StoryInset title="Dashboard" />
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
export const AppShell: Story = {
  render: (args) => (
    <SidebarProvider defaultOpen className="h-svh min-h-0 overflow-hidden">
      <ProductSidebar {...args} />
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
export const MobileOverlay: Story = {
  render: (args) => (
    <SidebarProvider
      className="h-svh min-h-0 overflow-hidden"
      sheetBreakpoint={ALWAYS_SHEET}
    >
      <OpenSheetOnMount />
      <ProductSidebar {...args} />
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
  { name: 'Postgres — analytics', status: 'Connected', rows: '1.2M' },
  { name: 'Salesforce', status: 'Syncing', rows: '480K' },
  { name: 'S3 — raw events', status: 'Connected', rows: '8.4M' },
  { name: 'HubSpot', status: 'Error', rows: '—' },
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
