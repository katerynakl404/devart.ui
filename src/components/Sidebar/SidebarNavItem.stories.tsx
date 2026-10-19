import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartPie, CirclePlus, Database, Folder } from 'lucide-react';
import type { ReactNode } from 'react';
import { fn } from 'storybook/test';
import { Badge } from '../Badge';
import { Counter } from '../Counter';
import {
  Sidebar,
  SidebarContent,
  SidebarNavItem,
  type SidebarNavItemProps,
  SidebarProvider,
} from './index';

/** Rows only read `group-data-[collapsible=icon]`, so they need a real rail. */
const Rail = ({
  defaultOpen,
  children,
}: {
  defaultOpen: boolean;
  children: ReactNode;
}) => (
  <SidebarProvider defaultOpen={defaultOpen}>
    <Sidebar collapsible="icon">
      {/* `SidebarContent` already carries the nav column's 8px gutter. */}
      <SidebarContent className="pt-4">
        <nav className="flex shrink-0 flex-col gap-0.5 group-data-[collapsible=icon]:items-center">
          {children}
        </nav>
      </SidebarContent>
    </Sidebar>
  </SidebarProvider>
);

/**
 * One navigation row: icon, label, active state, collapsed-rail geometry.
 *
 * It is a row rather than a list, which is the whole reason it exists next to
 * `SidebarNavigationItems` — call sites write their items as explicit JSX with
 * per-item props instead of mapping a data array.
 *
 * The kit owns no router, so a real link arrives through `asChild`: the row's
 * classes are merged onto the caller's element and the icon and label are
 * injected as its children. Active styling reads both `data-status="active"`
 * and `aria-current="page"`, so TanStack Router and plain anchors both light up.
 */
const meta = {
  title: 'Components/Sidebar/SidebarNavItem',
  component: SidebarNavItem,
  tags: ['autodocs'],
  args: {
    icon: Database,
    label: 'Data sources',
    activatable: true,
    withTooltip: false,
    href: '#',
    onClick: fn(),
  },
  argTypes: {
    icon: { control: false },
    badge: { control: false },
    children: { control: false },
    asChild: { control: false },
    tooltipSide: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="h-svh min-h-[24rem] w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarNavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Rail defaultOpen>
      <SidebarNavItem {...args} />
    </Rail>
  ),
};

/** The four rows an app shell actually ships, expanded. */
export const Navigation: Story = {
  render: (args) => (
    <Rail defaultOpen>
      <SidebarNavItem
        {...args}
        icon={CirclePlus}
        label="New chat"
        activatable={false}
      />
      <SidebarNavItem {...args} icon={Database} label="Data sources" />
      <SidebarNavItem {...args} icon={ChartPie} label="Metrics" />
      <SidebarNavItem {...args} icon={Folder} label="Files" />
    </Rail>
  ),
};

/**
 * Collapsed, the row becomes a 28px square and the label moves into a tooltip.
 * Callers flip `withTooltip` from the sidebar's own `state`.
 */
export const CollapsedRail: Story = {
  args: { withTooltip: true },
  render: (args) => (
    <Rail defaultOpen={false}>
      <SidebarNavItem
        {...args}
        icon={CirclePlus}
        label="New chat"
        activatable={false}
      />
      <SidebarNavItem {...args} icon={Database} label="Data sources" />
      <SidebarNavItem {...args} icon={ChartPie} label="Metrics" />
      <SidebarNavItem {...args} icon={Folder} label="Files" />
    </Rail>
  ),
};

/**
 * `asChild` hands the row to the caller's link element. Here a plain anchor
 * carries `aria-current="page"`; a router link carrying `data-status="active"`
 * paints identically.
 */
export const Active: Story = {
  render: ({ href: _href, ...args }) => (
    <Rail defaultOpen>
      <SidebarNavItem {...args} asChild>
        {/* biome-ignore lint/a11y/useValidAnchor: story-only placeholder link */}
        {/* biome-ignore lint/a11y/useAnchorContent: the row injects icon and label as this anchor's children */}
        <a href="#" aria-current="page" />
      </SidebarNavItem>
      <SidebarNavItem {...args} icon={ChartPie} label="Metrics" href="#" />
    </Rail>
  ),
};

/**
 * `activatable={false}` is for a row that navigates somewhere it does not
 * represent — "New chat" points at `/chat`, but the chat page is not "New
 * chat". The attribute is still on the element; only the paint is suppressed.
 */
export const NotActivatable: Story = {
  args: { activatable: false, icon: CirclePlus, label: 'New chat' },
  render: ({ href: _href, ...args }) => (
    <Rail defaultOpen>
      <SidebarNavItem {...args} asChild>
        {/* biome-ignore lint/a11y/useValidAnchor: story-only placeholder link */}
        {/* biome-ignore lint/a11y/useAnchorContent: the row injects icon and label as this anchor's children */}
        <a href="#" aria-current="page" />
      </SidebarNavItem>
    </Rail>
  ),
};

/** Three rows: a count, a word, and nothing — the row without a badge. */
const BadgeRows = (args: SidebarNavItemProps) => (
  <>
    <SidebarNavItem
      {...args}
      badge={<Counter size="sm">3</Counter>}
      icon={Database}
      label="Data sources"
    />
    <SidebarNavItem
      {...args}
      badge={
        <Badge size="sm" variant="brand">
          New
        </Badge>
      }
      icon={ChartPie}
      label="Metrics"
    />
    <SidebarNavItem {...args} icon={Folder} label="Files" />
  </>
);

/**
 * `badge` rides at the row's end: a `Counter` for a number, a `Badge` for a
 * word. It is the row's accessible description, not part of its name — the
 * name stays "Data sources" and a screen reader hears "3" after it.
 */
export const WithBadge: Story = {
  render: (args) => (
    <Rail defaultOpen>
      <BadgeRows {...args} />
    </Rail>
  ),
};

/**
 * The same rows on the rail. A 28px square has no room for a badge, so it
 * leaves; the description stays, so the rail still says it.
 */
export const WithBadgeCollapsed: Story = {
  args: { withTooltip: true },
  render: (args) => (
    <Rail defaultOpen={false}>
      <BadgeRows {...args} />
    </Rail>
  ),
};

/**
 * `icon` takes an element as well as a component — a product mark, an
 * `<img>`. The row sets it in the glyph's own box, 16px open and 14px on the
 * rail, so a column of mixed marks still reads as one column.
 */
export const ElementIcon: Story = {
  render: (args) => (
    <Rail defaultOpen>
      <SidebarNavItem
        {...args}
        icon={
          <svg viewBox="0 0 16 16">
            <title>Warehouse</title>
            <rect fill="currentColor" height="16" rx="4" width="16" />
            <path
              d="M4 11V6l4-2 4 2v5"
              fill="none"
              stroke="hsl(var(--surface-card))"
              strokeWidth="1.5"
            />
          </svg>
        }
        label="Warehouse"
      />
      <SidebarNavItem {...args} icon={Database} label="Data sources" />
    </Rail>
  ),
};
