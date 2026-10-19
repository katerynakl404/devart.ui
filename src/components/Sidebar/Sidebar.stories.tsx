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
import { expect, waitFor, within } from 'storybook/test';
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
  SidebarChatItem,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuRow,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMobileTrigger,
  SidebarNavItem,
  SidebarNavigationItems,
  SidebarPanelHeader,
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

/** The trigger's label tracks the open state, and doubles as its tooltip. */
const StateAwareTrigger = () => {
  const { open } = useSidebar();

  return (
    <SidebarTrigger
      className="shrink-0"
      label={open ? 'Collapse sidebar' : 'Expand sidebar'}
      size="xs"
      tooltip
    />
  );
};

/**
 * The header row, as the library ships it.
 *
 * `SidebarPanelHeader` puts the mark on the leading edge and the trigger on
 * the trailing one. On the rail the two share one square: the mark shows, and
 * hover or keyboard focus swaps it for the trigger — the way back out.
 */
const SidebarStoryHeader = () => (
  <SidebarPanelHeader
    logoIcon={
      // biome-ignore lint/a11y/useValidAnchor: story-only placeholder link
      <a aria-label="Home" href="#">
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
      </a>
    }
    sidebarTrigger={<StateAwareTrigger />}
  />
);

// The product's four rows: the way to start, then the three libraries. Chats
// are not a nav row — they are the Pinned / Recent lists below. "New Chat"
// points at the chat page without being it, so it never paints as active.
const NAV_ROWS = [
  { href: '#new', icon: CirclePlus, label: 'New Chat', activatable: false },
  { href: '#sources', icon: Database, label: 'Data Sources' },
  { href: '#metrics', icon: ChartPie, label: 'Metrics' },
  { href: '#files', icon: Folder, label: 'Files' },
];

/** `SidebarNavItem` rows. On the rail the label moves into a tooltip. */
const ProductNav = () => {
  const { state, isMobile } = useSidebar();
  const isRail = state === 'collapsed' && !isMobile;

  return (
    <nav className="flex shrink-0 flex-col gap-0.5 group-data-[collapsible=icon]:items-center">
      {NAV_ROWS.map((row) => (
        <SidebarNavItem key={row.href} withTooltip={isRail} {...row} />
      ))}
    </nav>
  );
};

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
      <ProductNav />
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

/**
 * The page's title row. The trigger stands beside the title only while the
 * sidebar is hidden — collapsed off-canvas, or the sheet on mobile. Collapsed
 * to the icon rail, the rail's own header carries it, and a second one here is
 * the same control twice.
 */
const StoryInset = ({
  title = 'New chat',
  collapsible = 'icon',
}: {
  title?: string;
  collapsible?: StoryArgs['collapsible'];
}) => {
  const { isMobile, state } = useSidebar();
  const hidden =
    isMobile || (collapsible === 'offcanvas' && state === 'collapsed');

  return (
    <SidebarInset>
      <div className="flex items-center gap-2 p-4">
        {hidden ? <SidebarTrigger variant="tertiary" /> : null}
        <Typography variant="h4">{title}</Typography>
      </div>
    </SidebarInset>
  );
};

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
  /**
   * The open state lives in the provider and is published as `data-state`, so
   * consumers can style against it. The trigger is the only thing that moves
   * it, and it must move it both ways.
   */
  play: async ({ canvasElement, userEvent }) => {
    const panel = canvasElement.querySelector('[data-state]') as HTMLElement;
    await expect(panel).toHaveAttribute('data-state', 'expanded');

    const trigger = canvasElement.querySelector(
      '[data-sidebar="trigger"]'
    ) as HTMLElement;
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(panel).toHaveAttribute('data-state', 'collapsed')
    );

    await userEvent.click(trigger);
    await waitFor(() =>
      expect(panel).toHaveAttribute('data-state', 'expanded')
    );
  },
  render: (args) => (
    <SidebarProvider defaultOpen>
      <ProductSidebar {...args} />
      <StoryInset collapsible={args.collapsible} />
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
 * Collapsed to the icon rail: the brand keeps its mark and swaps it for the
 * trigger on hover or focus, the nav keeps its icons with tooltips, and the
 * lists, the promo and the balance leave — none of them has a 48px form. The
 * account row keeps its avatar, and its name as visually hidden text.
 */
export const CollapsedIcon: Story = {
  args: { showPromo: true },
  /**
   * `data-collapsible` only carries a value while the panel is actually
   * collapsed — that is what lets a consumer target the icon rail without also
   * matching the expanded panel.
   */
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector('[data-state]') as HTMLElement;
    await expect(panel).toHaveAttribute('data-state', 'collapsed');
    await expect(panel).toHaveAttribute('data-collapsible', 'icon');

    // The avatar alone on screen, and still a button with a name.
    await expect(
      within(canvasElement).getByRole('button', { name: /^Kateryna K\./ })
    ).toBeInTheDocument();
  },
  render: (args) => (
    <SidebarProvider defaultOpen={false}>
      <ProductSidebar {...args} />
      <StoryInset collapsible={args.collapsible} />
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
      <StoryInset collapsible={args.collapsible} title="Inset content" />
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
  // `showPromo` is a story arg, not a `Sidebar` prop — spread, it lands on the DOM.
  render: ({ showPromo: _showPromo, ...args }) => (
    <SidebarProvider defaultOpen>
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarStoryHeader />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNavigationItems items={nestedNavigation} />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuRow icon={Settings} label="Settings" />
        </SidebarFooter>
      </Sidebar>
      <StoryInset collapsible={args.collapsible} title="Dashboard" />
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
 * The one thing to get right in a page shell: put `SidebarMobileTrigger` in
 * the `SidebarInset` header, not inside `Sidebar`. A trigger that lives in the
 * sidebar goes away with it under `lg`, leaving nothing to open the sheet with.
 * Its glyph turns a quarter while the sheet is open, and it carries no
 * `data-sidebar`, so `:not([data-sidebar])` tells it apart from the panel's
 * own `SidebarTrigger`.
 *
 * The panel's trigger keeps its `tooltip` prop here and shows none: the sheet
 * hands focus inside as it opens, and a tooltip that answers that focus pops
 * with no pointer near it.
 */
export const MobileOverlay: Story = {
  play: async () => {
    const trigger = await waitFor(() => {
      const node = document.querySelector(
        '[data-mobile="true"] [data-sidebar="trigger"]'
      );
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    // A tooltip trigger stamps `data-state`; the bare button carries none.
    await expect(trigger).not.toHaveAttribute('data-state');
  },
  render: (args) => (
    <SidebarProvider
      className="h-svh min-h-0 overflow-hidden"
      sheetBreakpoint={ALWAYS_SHEET}
    >
      <OpenSheetOnMount />
      <ProductSidebar {...args} />
      <SidebarInset className="min-h-0">
        <header className="flex shrink-0 items-center gap-3 border-stroke border-b px-6 py-4">
          <SidebarMobileTrigger label="Toggle sidebar" />
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

/** One wording for the queue tooltip, so the stories read like the product. */
const queued = (count: number, active: boolean) =>
  `${count} messages queued — ${active ? 'still sending' : 'paused, waiting for you'}`;

/** Every `SidebarChatItem` the product draws, each with its menu. */
const ChatRowSet = () => (
  <SidebarProvider className="min-h-0">
    <div className="flex w-64 flex-col gap-px rounded-md border border-stroke bg-surface-card p-2">
      <SidebarChatItem href="#c1" menu={<ChatMenu pinned={false} />}>
        Generate two charts using random data
      </SidebarChatItem>
      <SidebarChatItem
        href="#c2"
        menu={<ChatMenu pinned={false} />}
        status="new"
      >
        Jira · first 5 AIINS issues
      </SidebarChatItem>
      <SidebarChatItem
        href="#c3"
        menu={<ChatMenu pinned={false} />}
        status="loading"
      >
        Q3 report.xlsx
      </SidebarChatItem>
      <SidebarChatItem
        count={3}
        countActive
        countLabel={queued(3, true)}
        href="#c4"
        menu={<ChatMenu pinned />}
      >
        Message queue
      </SidebarChatItem>
      <SidebarChatItem
        count={2}
        countLabel={queued(2, false)}
        href="#c5"
        menu={<ChatMenu pinned />}
      >
        Churn deep-dive, waiting on you
      </SidebarChatItem>
      <SidebarChatItem
        aria-current="page"
        href="#c6"
        isActive
        menu={<ChatMenu pinned />}
      >
        Salesforce · Q1 revenue commentary
      </SidebarChatItem>
      <SidebarChatItem count={4} countLabel={queued(4, false)} href="#c7">
        A row with no menu
      </SidebarChatItem>
    </div>
  </SidebarProvider>
);

/**
 * `SidebarChatItem` in every state: plain, new activity, generating, a queue
 * still sending and one that stopped, the open chat, and a row with no menu.
 *
 * The kebab appears on hover or focus and its tooltip is `menuLabel`, the same
 * string as its name. `countLabel` says what the number means: it is spoken
 * in place of the bare count and shown as the count's tooltip — wherever the
 * count is on screen, which on a row with a menu means not while the kebab
 * covers it. The last row has no menu, so its count answers the pointer.
 */
export const ChatItemStates: StoryObj<typeof SidebarChatItem> = {
  parameters: { layout: 'padded' },
  render: () => <ChatRowSet />,
};

/**
 * The same rows on a phone. Below `lg`, and on any touch screen, there is no
 * hover to wait for, so the kebab never hides: the link keeps 32px of room
 * for it, the fade ends where that room begins, and the status and the count
 * stay beside it instead of stepping aside.
 */
export const ChatItemsOnAPhone: StoryObj<typeof SidebarChatItem> = {
  parameters: { layout: 'padded' },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: () => <ChatRowSet />,
};

/**
 * The footer's two rows. `SidebarStat` is a `<button>` that opens the detail
 * above itself; with `asChild` the same row renders the caller's element —
 * here a `<div>`, for a figure that is a reading and opens nothing. The
 * recipe goes with it unchanged.
 */
export const FooterRows: StoryObj<typeof SidebarStat> = {
  parameters: { layout: 'padded' },
  render: () => (
    <SidebarProvider className="min-h-0">
      <div className="flex w-96 flex-col gap-1 rounded-md border border-stroke bg-surface-card p-2">
        <div className="flex gap-3">
          <div className="w-56">
            <SidebarStat icon={<Wallet />} label="Balance" value="9,480 left" />
          </div>
          <StateLabel>button</StateLabel>
        </div>
        <div className="flex gap-3">
          <div className="w-56">
            <SidebarStat
              asChild
              icon={<Wallet />}
              label="Balance"
              value="9,480 left"
            >
              <div />
            </SidebarStat>
          </div>
          <StateLabel>asChild div</StateLabel>
        </div>
        <div className="flex gap-3">
          <div className="w-56">
            <SidebarUser
              avatar={
                <Avatar>
                  <AvatarFallback>K</AvatarFallback>
                </Avatar>
              }
              meta="Admin · Free"
              name="Kateryna K."
            />
          </div>
          <StateLabel>user</StateLabel>
        </div>
      </div>
    </SidebarProvider>
  ),
};

// The other end of `ALWAYS_SHEET`: narrower than any viewport, so the
// provider always reports the desktop layout.
const NEVER_SHEET = 0;

/**
 * Leaving the phone layout closes the sheet. Open it with the menu button,
 * then switch **Phone layout** off in Controls — the rail comes back — and on
 * again: the page opens on content, not on the drawer left open before.
 *
 * The switch stands in for the window crossing `lg`; in product code that
 * crossing is all it takes.
 */
export const LeavingThePhoneLayout: StoryObj<
  StoryArgs & { phoneLayout: boolean }
> = {
  args: { phoneLayout: true },
  argTypes: {
    phoneLayout: {
      name: 'Phone layout',
      control: 'boolean',
      description:
        'Moves `sheetBreakpoint` past the canvas (sheet) or under it (rail) — the window crossing `lg`.',
      table: { category: 'Story' },
    },
  },
  render: ({ phoneLayout, ...args }) => (
    <SidebarProvider
      className="h-svh min-h-0 overflow-hidden"
      sheetBreakpoint={phoneLayout ? ALWAYS_SHEET : NEVER_SHEET}
    >
      <ProductSidebar {...args} />
      <SidebarInset className="min-h-0">
        <header className="flex shrink-0 items-center gap-3 border-stroke border-b px-6 py-4">
          {phoneLayout ? (
            <SidebarMobileTrigger label="Open sidebar" tooltip />
          ) : null}
          <Typography element="h1" textStyle="title20">
            Connections
          </Typography>
        </header>
      </SidebarInset>
    </SidebarProvider>
  ),
};
