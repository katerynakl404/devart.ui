import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChartPie,
  ChevronsUpDown,
  CirclePlus,
  Database,
  Files,
  Folder,
  Home,
  LayoutDashboard,
  Search,
  Settings,
  Users,
} from 'lucide-react';
import { type ComponentType, type ReactNode, useState } from 'react';
import { Button } from '../../src/components/Button';
import { Counter } from '../../src/components/Counter';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMobileTrigger,
  SidebarNavItem,
  SidebarNavigationItems,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '../../src/components/Sidebar';
import type { NavigationElement } from '../../src/components/Sidebar/types';
import { Typography } from '../../src/components/Typography';
import { cn } from '../../src/lib/utils';
import { ChangeCase, ChangePage, Code, NoPanel, TryIt } from '../Harness';
import {
  Sidebar as UpstreamSidebar,
  SidebarMobileTrigger as UpstreamSidebarMobileTrigger,
  SidebarNavItem as UpstreamSidebarNavItem,
  SidebarProvider as UpstreamSidebarProvider,
  SidebarTrigger as UpstreamSidebarTrigger,
} from '../upstream/Sidebar';

const meta = {
  title: 'Proposed changes/Components/Sidebar',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const navigation: NavigationElement[] = [
  { id: 'home', title: 'Home', icon: Home, url: '/' },
  { id: 'search', title: 'Search', icon: Search, url: '/search' },
  { id: 'files', title: 'Files', icon: Files, url: '/files' },
];

/** Seven rows — the length at which §39's 2px per gap becomes visible. */
const sevenRows: NavigationElement[] = [
  ...navigation,
  { id: 'sources', title: 'Data sources', icon: Database, url: '/sources' },
  { id: 'metrics', title: 'Metrics', icon: ChartPie, url: '/metrics' },
  { id: 'people', title: 'People', icon: Users, url: '/people' },
  { id: 'settings', title: 'Settings', icon: Settings, url: '/settings' },
];

/**
 * A provider and the `Sidebar` that reads its context — the package's, or the
 * developers' 1.4.0 pair vendored into `changes/upstream/Sidebar/`. They go
 * together: a `Sidebar` under the other provider throws.
 */
interface SidebarKit {
  Provider: ComponentType<{
    children?: ReactNode;
    className?: string;
    sheetBreakpoint?: number;
  }>;
  Sidebar: ComponentType<{ children?: ReactNode; collapsible?: 'icon' }>;
}

const LIVE: SidebarKit = { Provider: SidebarProvider, Sidebar };
const UPSTREAM: SidebarKit = {
  Provider: UpstreamSidebarProvider,
  Sidebar: UpstreamSidebar,
};

/**
 * `sheetBreakpoint` values on either side of any window, so a panel can be the
 * phone layout or the desktop one without the window being resized. The hook
 * behind it compares the window's width with this number on every render, so
 * moving the number flips `isMobile` the same way a resize does.
 */
const PHONE = 100_000;
const DESKTOP = 1;

/**
 * Their ☰, with the 18px glyph this package draws (§97) — so the size of the
 * glyph is not a second difference beside the one a case is about.
 */
const upstreamMenuButton = (
  <UpstreamSidebarMobileTrigger className="[&_svg]:size-[18px]" />
);

/**
 * The phone layout: a page bar with the ☰, and the sidebar as a sheet. The
 * sheet portals to the page, so it opens over the whole story, not inside the
 * panel — which is where a phone puts it too.
 */
function PhoneShell({
  kit,
  menuButton,
  panelTrigger,
  widen = false,
}: {
  kit: SidebarKit;
  /** The ☰ in the page bar. It must read the same context as `kit`. */
  menuButton: ReactNode;
  /** A trailing control in the sheet's header, beside the product name. */
  panelTrigger?: ReactNode;
  /**
   * §140: a button in the panel that moves the window across the breakpoint
   * and back. In the sheet it widens; on the rail it narrows.
   */
  widen?: boolean;
}) {
  const [phone, setPhone] = useState(true);
  const { Provider, Sidebar: Panel } = kit;
  return (
    <div className="h-64 w-full overflow-hidden rounded-lg border border-stroke">
      {/* `transform-gpu`, as in `Shell`: once widened, the rail is the
          `fixed` desktop panel, and this keeps it inside the box. */}
      <div className="relative h-full transform-gpu overflow-hidden">
        <Provider
          className="h-full min-h-0"
          sheetBreakpoint={phone ? PHONE : DESKTOP}
        >
          <Panel collapsible="icon">
            <SidebarHeader>
              <div className="flex items-center justify-between gap-2">
                <BrandRow />
                {panelTrigger}
              </div>
            </SidebarHeader>
            <SidebarContent>
              <nav className="flex flex-col gap-0.5">
                <SidebarNavItem href="/" icon={Home} label="Home" />
                <SidebarNavItem href="/search" icon={Search} label="Search" />
                <SidebarNavItem href="/files" icon={Files} label="Files" />
              </nav>
            </SidebarContent>
            {widen ? (
              <SidebarFooter>
                <Button
                  onClick={() => setPhone(!phone)}
                  size="sm"
                  variant="secondary"
                >
                  {phone ? 'Widen the window' : 'Narrow the window'}
                </Button>
              </SidebarFooter>
            ) : null}
          </Panel>
          <SidebarInset className="min-h-0">
            {phone ? (
              <div className="flex h-12 shrink-0 items-center gap-2 border-stroke border-b px-2">
                {menuButton}
                <Typography variant="h5">Connections</Typography>
              </div>
            ) : null}
          </SidebarInset>
        </Provider>
      </div>
    </div>
  );
}

/** A bar above the rail, 40px — what the shell that found §35 had. */
const windowBar = (
  <div className="flex h-10 shrink-0 items-center border-stroke border-b bg-surface-card px-4 text-ink-secondary text-xs">
    Window bar
  </div>
);

/** A brand row laid out by hand — which is what most consumers do. */
function BrandRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-8 items-center gap-2', className)}>
      <LayoutDashboard className="size-5 shrink-0 text-brand-primary" />
      <Typography variant="h5">Connections</Typography>
    </div>
  );
}

/** One candidate model, captioned with the numbers it produces. */
function Option({
  caption,
  children,
}: {
  caption: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-medium text-ink-secondary text-xxs uppercase leading-4 tracking-caps">
        {caption}
      </span>
      {children}
    </div>
  );
}

/**
 * The shell production actually renders, measured on the live Insightis rail:
 * header → nav → scrolling group region → footer, with the footer holding the
 * bottom edge. Every panel in this section uses it, because a rail without its
 * footer has a false vertical and the paddings around the menu are the whole
 * subject of §21.
 *
 * One product number is deliberately NOT reproduced: the row type step —
 * production runs 13px where the package and the kit are both at 14px. That is
 * a product choice, and copying it here would quietly propose it as a
 * design-system change. The row gap is no longer in that list: production's 2px
 * is the kit's value (`.sbx-nav { gap: 2px }`), and `SidebarMenu` now carries
 * `gap-0.5` to match.
 */
function Shell({
  accountClassName,
  children,
  footer = true,
  footerRow = 'product',
  guides,
  navInset,
  onOpenChange,
  open = true,
  sidebarClassName,
  windowBar,
}: {
  /** §12 only: puts the collapsed padding and the label back on the row. */
  accountClassName?: string;
  children: ReactNode;
  /**
   * The account footer. Production always has one; §39 turns it off to fit
   * seven rows.
   */
  footer?: boolean;
  /**
   * Which footer row. `product` is what the live rail renders — a 36px button
   * with a 24px avatar. `menu-button` is the `SidebarMenuButton` recipe, which
   * §12 needs because that component's collapsed box is its subject.
   */
  footerRow?: 'product' | 'menu-button';
  /** Hairlines at x=8 and x=16 — the two candidate alignment lines. */
  guides?: boolean;
  /**
   * Applies the insets production puts around the menu — `px-2 pb-4` on the
   * nav container — from outside, so the component is not edited to preview it.
   */
  navInset?: boolean;
  /** Controlled open, for a shell whose collapse control lives outside the rail. */
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  /** §35 only: a class on the fixed panel — `Sidebar`'s own `className`. */
  sidebarClassName?: string;
  /** A bar above the rail, when the shell has one. */
  windowBar?: ReactNode;
}) {
  return (
    // `transform-gpu` is load-bearing, not decoration: `Sidebar` is
    // `fixed inset-y-0`, and a fixed element resolves against the viewport
    // unless an ancestor is transformed. Without it a panel escapes its box and
    // covers the page — which is what Components/Sidebar/ShellShapes does
    // today, and why two shells cannot be compared side by side there.
    <div
      className={cn(
        'flex h-80 w-full flex-col overflow-hidden rounded-lg border border-stroke',
        // `content` rather than `group`, because that is the slot production
        // carries the inset on — measured on the live rail: `px-2 pb-4`.
        navInset &&
          '[&_[data-sidebar=content]]:px-2 [&_[data-sidebar=content]]:pb-4'
      )}
    >
      {windowBar}
      {/* `transform-gpu` is load-bearing, not decoration: `Sidebar` is
          `fixed inset-y-0`, and a fixed element resolves against the viewport
          unless an ancestor is transformed. It also keeps the rail below the
          bar above it instead of behind it. Without it a panel escapes its box
          and covers the page — which is what Components/Sidebar/ShellShapes
          does today, and why two shells cannot be compared side by side. */}
      <div className="relative min-h-0 flex-1 transform-gpu overflow-hidden">
        {guides ? (
          <>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-2 z-30 w-px bg-fb-attention/70"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-4 z-30 w-px bg-brand-primary/70"
            />
          </>
        ) : null}
        <SidebarProvider
          defaultOpen={onOpenChange ? undefined : open}
          onOpenChange={onOpenChange}
          open={onOpenChange ? open : undefined}
        >
          <Sidebar className={sidebarClassName} collapsible="icon">
            {children}
            {footer ? (
              // Production's `px-2.5 pt-2 pb-2.5` — 10 at the sides and the
              // bottom, 8 on top — is an expanded-state number. In the 48px
              // collapsed rail it leaves 28px for a row the component forces to
              // 32, and the avatar is cut; collapsed, the footer falls back to
              // the component's own `p-2`: 8 + 32 + 8 = 48.
              <SidebarFooter className="px-2.5 pt-2 pb-2.5 group-data-[collapsible=icon]:px-2">
                {footerRow === 'menu-button' ? (
                  <AccountMenuRow labelClassName={accountClassName} />
                ) : (
                  <AccountRow />
                )}
              </SidebarFooter>
            ) : null}
          </Sidebar>
          <SidebarInset />
        </SidebarProvider>
      </div>
    </div>
  );
}

/**
 * The footer account row as production renders it, measured on the live rail:
 * a 36px button with `p-1`, radius 6 and `gap-1.5`, a 24px round avatar and a
 * 12px semibold label — not a `SidebarMenuButton`.
 */
function AccountRow() {
  return (
    <Button
      className="w-full justify-start gap-1.5 p-1 group-data-[collapsible=icon]:justify-center"
      size="md"
      variant="tertiary"
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-primary font-semibold text-[10px] text-content-on-solid">
        OF
      </span>
      <span className="min-w-0 flex-1 truncate text-left font-semibold text-ink-body text-xs group-data-[collapsible=icon]:hidden">
        Oleh Fesenko
      </span>
      <ChevronsUpDown className="size-4 shrink-0 text-ink-secondary group-data-[collapsible=icon]:hidden" />
    </Button>
  );
}

/** The `SidebarMenuButton` footer recipe — §12's subject, 28px avatar and all. */
function AccountMenuRow({ labelClassName }: { labelClassName?: string }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className={labelClassName} size="lg">
          <span className="size-7 shrink-0 rounded-full bg-brand-primary/25" />
          {/* The component hides only `> span:last-child`, and here the last
              child is the chevron — deliberately, so an avatar-led row is not
              blanked. The consequence is that this row must hide its own label
              and trailing control, or the collapsed 32px box holds
              avatar + text + chevron and `justify-center` pushes the avatar out
              under `overflow-hidden`. */}
          <span className="truncate group-data-[collapsible=icon]:hidden">
            katerynak
          </span>
          <ChevronsUpDown className="ms-auto size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export const Page: Story = {
  name: 'Sidebar',
  render: () => (
    <ChangePage
      intro="The web sidebar: the product mark and the collapse control live in the rail, because a browser tab is no place for them."
      group="Sidebar"
      title="Sidebar"
    >
      <ChangeCase
        after={
          <Shell guides navInset>
            <SidebarHeader>
              <BrandRow />
            </SidebarHeader>
            <SidebarContent>
              <SidebarNavigationItems items={navigation} />
            </SidebarContent>
          </Shell>
        }
        afterNote="ps-4 pe-2 — the mark moves to 16"
        before={
          <Shell guides navInset>
            <SidebarHeader className="ps-0 pe-0">
              <BrandRow />
            </SidebarHeader>
            <SidebarContent>
              <SidebarNavigationItems items={navigation} />
            </SidebarContent>
          </Shell>
        }
        beforeNote="no horizontal padding — the mark sits at 0"
        beforeSource={
          <>
            the live header with its inset removed through{' '}
            <Code>className</Code>, which is what the component carried. The two
            hairlines are x = 8 (amber) and x = 16 (teal).
          </>
        }
        files={[
          'src/components/Sidebar/SidebarHeader.tsx',
          'SidebarPanelHeader.tsx',
        ]}
        footnote={
          <>
            Why this is a library defect and not a page defect: the component
            became unsafe by default. Nothing errors — a consumer who has not
            read the docstring gets a broken rail. The hairlines are x = 8
            (amber) and x = 16 (teal); 16 is the line production aligns to.{' '}
            <strong className="font-medium text-ink-body">
              Two things still to settle:
            </strong>{' '}
            the navigation itself sits on 8 until §21 lands, and the inset must
            live in exactly one slot — production's brand row owns{' '}
            <Code>pl-4</Code> with the header on <Code>p-0</Code>, so a consumer
            composed that way inherits 32 from this change rather than 16.
          </>
        }
        n={10}
        title="SidebarHeader lost its horizontal inset"
        why="The inset was removed on the theory that rows inside would carry their own. Pages lay that row out by hand, so the inset simply stopped existing."
      />

      <ChangeCase
        after={
          <TryIt action="Hover a rail icon">
            <Shell navInset open={false}>
              <SidebarHeader />
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip={{ children: 'Files' }}>
                      <Files />
                      <span>Files</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Shell>
          </TryIt>
        }
        afterNote="the package's own Tooltip"
        before={
          <TryIt action="Hover the rail icon">
            <Shell navInset open={false}>
              <SidebarHeader />
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <TooltipPrimitive.Provider>
                      <TooltipPrimitive.Root>
                        <TooltipPrimitive.Trigger asChild>
                          <SidebarMenuButton>
                            <Files />
                            <span>Files</span>
                          </SidebarMenuButton>
                        </TooltipPrimitive.Trigger>
                        <TooltipPrimitive.Portal>
                          <TooltipPrimitive.Content side="right" sideOffset={8}>
                            Files
                          </TooltipPrimitive.Content>
                        </TooltipPrimitive.Portal>
                      </TooltipPrimitive.Root>
                    </TooltipPrimitive.Provider>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Shell>
          </TryIt>
        }
        beforeNote="raw @radix-ui/react-tooltip"
        beforeSource={
          <>
            the raw Radix primitives the component used to import. Radix ships
            behaviour, not appearance: measured, the tooltip carried{' '}
            <Code>className: ""</Code> and{' '}
            <Code>background-color: rgba(0, 0, 0, 0)</Code> — loose text
            floating over the page.
          </>
        }
        files={['src/components/Sidebar/SidebarMenuButton.tsx']}
        footnote={
          <>
            Appearance is the visible half. The other half is that{' '}
            <Code>TooltipContent</Code> is what honours{' '}
            <Code>PortalContainerProvider</Code>, so a sidebar tooltip was also
            ignoring the scoped theming and portal retargeting every other
            tooltip respects.
          </>
        }
        n={11}
        title="SidebarMenuButton rendered tooltips with no styling at all"
        why="The component imported Tooltip from @radix-ui/react-tooltip — the raw primitives — instead of from the package's own Tooltip."
      />

      <ChangeCase
        after={
          <Shell footerRow="menu-button" navInset open={false}>
            <SidebarHeader />
            <SidebarContent>
              <SidebarNavigationItems items={navigation} />
            </SidebarContent>
          </Shell>
        }
        afterNote="!px-0 + justify-center — nothing is clipped any more"
        before={
          <Shell
            accountClassName="group-data-[collapsible=icon]:!px-2 group-data-[collapsible=icon]:justify-start group-data-[collapsible=icon]:[&>span:last-child]:!inline"
            footerRow="menu-button"
            navInset
            open={false}
          >
            <SidebarHeader />
            <SidebarContent>
              <SidebarNavigationItems items={navigation} />
            </SidebarContent>
          </Shell>
        }
        beforeNote="px-2 inside a 32px box — the avatar is clipped"
        beforeSource={
          <>
            the live footer row with the collapsed padding and the label put
            back. The 28px avatar loses its right edge to the component's own{' '}
            <Code>overflow-hidden</Code> — a 16px navigation icon fits the
            remaining 16px exactly, which is why this surfaced on the avatar and
            nowhere else.
          </>
        }
        files={['src/components/Sidebar/SidebarMenuButton.tsx']}
        footnote={
          <>
            Adding <Code>justify-center</Code> alone did nothing: the label span
            was still in the row, so <Code>icon + text</Code> overflowed the
            32px box and centring was meaningless. The label is hidden through{' '}
            <Code>&gt; span:last-child</Code> — the selector chosen for what it
            does not match, so an avatar-led footer row is left alone rather
            than blanked. Every mark centres at 24 — 8 of column inset plus half
            of the 32px box — which holds only with §21's inset and the 48px
            collapsed rail; at the old 57px width the same button sat 8 from the
            left and 16 from the right.
          </>
        }
        n={12}
        title="SidebarMenuButton — a 32px box its own padding did not fit"
        why="Collapsed, the button is forced to 32×32 while the consumer keeps px-2, leaving 16px of usable width."
      />

      <ChangeCase
        after={
          <TryIt action="Collapse it — the rail on the right edge brings it back">
            <Shell navInset>
              <SidebarHeader>
                <div className="flex h-8 items-center justify-between gap-2">
                  <Typography
                    className="group-data-[collapsible=icon]:hidden"
                    variant="h5"
                  >
                    Connections
                  </Typography>
                  <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarNavigationItems items={navigation} />
              </SidebarContent>
              <SidebarRail />
            </Shell>
          </TryIt>
        }
        afterNote="SidebarRail in the shell example"
        before={
          <TryIt action="Collapse it — now find a way back">
            <Shell navInset>
              <SidebarHeader>
                <div className="flex h-8 items-center justify-between gap-2">
                  <Typography
                    className="group-data-[collapsible=icon]:hidden"
                    variant="h5"
                  >
                    Connections
                  </Typography>
                  <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarNavigationItems items={navigation} />
              </SidebarContent>
            </Shell>
          </TryIt>
        }
        beforeNote="the doc's shell example — trigger only"
        beforeSource="the shell exactly as Sidebar.md described it, reproduced live. Collapsing hides the only control that can expand it again; there is no expand-on-hover in this package."
        files={['src/components/Sidebar/Sidebar.md']}
        footnote={
          <>
            New rule in the doc, plus <Code>SidebarRail</Code> in the example: a{' '}
            <Code>SidebarTrigger</Code> may not be the only way back if it hides
            when collapsed. Either render the rail, keep the trigger visible, or
            move it outside the sidebar entirely — a page header — where
            collapsing cannot take it away.
          </>
        }
        n={14}
        state="docs-only"
        title="Collapsing could remove the only way to expand"
        why="An app that copied the documented shell inherited a dead end: with collapsible=icon and the trigger hidden when collapsed, nothing on screen can expand the sidebar again."
      />

      <ChangeCase
        after={
          <Shell windowBar={windowBar}>
            <SidebarHeader>
              <BrandRow />
            </SidebarHeader>
            <SidebarContent>
              <SidebarNavigationItems items={navigation} />
            </SidebarContent>
          </Shell>
        }
        afterNote="inset-y-0 alone — the box's height, the footer on its edge"
        before={
          <Shell sidebarClassName="h-svh" windowBar={windowBar}>
            <SidebarHeader>
              <BrandRow />
            </SidebarHeader>
            <SidebarContent>
              <SidebarNavigationItems items={navigation} />
            </SidebarContent>
          </Shell>
        }
        beforeNote="h-svh — the window's height, the footer below the edge"
        beforeSource={
          <>
            the live panel with <Code>h-svh</Code> put back through{' '}
            <Code>className</Code>, which lands on the same fixed element the
            class was removed from. The box is transformed, as the shell that
            found this was (<Code>translateZ(0)</Code>), so the panel's
            containing block is the box under the bar, not the window.
          </>
        }
        files={['src/components/Sidebar/index.tsx']}
        footnote="Where the shell is the whole window — Insightis — the containing block is the viewport and the two heights agree, so nothing changes there."
        n={35}
        title="The fixed panel was pinned to the viewport"
        why="inset-y-0 already sized the panel to its containing block, and h-svh overrode it with the window's height. Under a bar the two differ, and the account row slid off the bottom edge."
      />

      <ChangeCase
        after={
          <Shell footer={false}>
            <SidebarHeader>
              <BrandRow />
            </SidebarHeader>
            <SidebarContent>
              <SidebarNavigationItems items={sevenRows} />
            </SidebarContent>
          </Shell>
        }
        afterNote="gap-0.5 — 2px between rows"
        before={
          <Shell footer={false}>
            <SidebarHeader>
              <BrandRow />
            </SidebarHeader>
            <SidebarContent className="[&_[data-sidebar=menu]]:gap-1">
              <SidebarNavigationItems items={sevenRows} />
            </SidebarContent>
          </Shell>
        }
        beforeNote="gap-1 — 4px between rows"
        beforeSource={
          <>
            the live rail with the old <Code>gap-1</Code> put back on{' '}
            <Code>SidebarMenu</Code> from its container —{' '}
            <Code>SidebarNavigationItems</Code> renders the menu itself, so the
            class reaches it through <Code>SidebarContent</Code>'s{' '}
            <Code>className</Code>.
          </>
        }
        files={['src/components/Sidebar/SidebarMenu.tsx']}
        footnote={
          <>
            The kit states both halves: <Code>.sbx-nav {'{ gap: 2px }'}</Code>{' '}
            over 32px rows, and 2px as the spacing scale's fine sub-step — so 2
            is on the scale, not an exception to it.
          </>
        }
        n={39}
        title="Nav rows 4px apart where the kit says 2"
        why="4px between 32px rows reads as a list of separate buttons; at 2px the rows read as one navigation block, which is what they are."
      />

      <ChangeCase
        after={
          <div className="flex flex-col gap-6">
            <Option caption="px-2 on the nav container — icons on 16, fill inset 8">
              <Shell guides navInset>
                <SidebarHeader>
                  <BrandRow />
                </SidebarHeader>
                <SidebarContent>
                  <SidebarNavigationItems items={navigation} />
                </SidebarContent>
              </Shell>
            </Option>
            <Option caption="Collapsed — the mark lands on 24, the number §12 claims">
              <Shell navInset open={false}>
                <SidebarHeader />
                <SidebarContent>
                  <SidebarNavigationItems items={navigation} />
                </SidebarContent>
              </Shell>
            </Option>
          </div>
        }
        afterNote="matches production: 16 / 16, gutter 8"
        before={
          <div className="flex flex-col gap-6">
            <Option caption="Today — expanded">
              <Shell guides>
                <SidebarHeader>
                  <BrandRow />
                </SidebarHeader>
                <SidebarContent>
                  <SidebarNavigationItems items={navigation} />
                </SidebarContent>
              </Shell>
            </Option>
            <Option caption="Today — collapsed, the mark sits on 16">
              <Shell open={false}>
                <SidebarHeader />
                <SidebarContent>
                  <SidebarNavigationItems items={navigation} />
                </SidebarContent>
              </Shell>
            </Option>
          </div>
        }
        beforeNote="mark on 16, nav on 8 — 8px apart"
        beforeSource={
          <>
            the library as it stands. Measured: <Code>SidebarContent</Code>,{' '}
            <Code>SidebarGroup</Code> and <Code>SidebarMenu</Code> all carry{' '}
            <Code>padding-left: 0</Code> — the only 8px comes from the row
            button's own <Code>px-2</Code>, so the navigation sits on the amber
            line while §10's header sits on the teal one. The After half applies{' '}
            <Code>[&amp;_[data-sidebar=content]]:px-2</Code> from outside —
            nothing in the component is edited to preview it.
          </>
        }
        files={[
          'src/components/Sidebar/SidebarContent.tsx',
          'src/components/Sidebar/SidebarHeader.tsx',
        ]}
        footnote={
          <>
            <strong className="font-medium text-ink-body">
              Measured on the live Insightis rail, not inferred:
            </strong>{' '}
            every nav row is inset 8 from both edges, its icon starts at 16, the
            row is 32 high with a 6px radius, and the brand mark starts at 16
            too. The product carries the inset on the scrolling nav container (
            <Code>px-2</Code>, dropped to <Code>px-0</Code> with{' '}
            <Code>items-center</Code> when collapsed) and puts{' '}
            <Code>pl-4 pr-2</Code> on the brand row itself, while{' '}
            <Code>SidebarHeader</Code> keeps <Code>p-0 pt-3 pb-2</Code>. So 16
            is the line, and the gutter is real — the package is missing both.{' '}
            <strong className="font-medium text-ink-body">
              A consequence for §10:
            </strong>{' '}
            production zeroes the header's horizontal padding precisely because
            its brand row owns <Code>pl-4</Code>. A consumer composed that way
            that picks up §10's <Code>ps-4</Code> lands at 32, not 16 — the
            insets add. Whichever slot ends up owning the inset, only one of
            them may. <Code>.design-sync/sb-reference</Code> shows 8 for both
            and no gutter; measured against production, that snapshot is stale.{' '}
            <strong className="font-medium text-ink-body">
              Also to fix — the catalog hides this:
            </strong>{' '}
            <Code>Components/Sidebar → RowStates</Code> renders its rows inside
            a hand-built box with <Code>p-2</Code>, and each row adds{' '}
            <Code>px-2</Code> of its own, so the fill measures 8 from the edge
            and the icon 16 — production's geometry supplied by the story rather
            than by the library. That story should drop its own padding, or it
            will keep certifying a rail that is wrong in a real shell.
          </>
        }
        n={64}
        title="The navigation column had no gutter"
        why="Nothing between the sidebar edge and the row button supplies a gutter, so the navigation sits on 8 while §10 moved the brand mark to 16 — and the live product puts both on 16 with an 8px gutter."
      />
      <ChangeCase
        after={
          <TryIt action="Hover any icon in the rail">
            <Shell navInset open={false}>
              <SidebarHeader>
                <BrandRow />
              </SidebarHeader>
              <SidebarContent>
                <SidebarNavigationItems items={navigation} />
              </SidebarContent>
            </Shell>
          </TryIt>
        }
        afterNote="every row names itself, and the header centres on the nav axis"
        before={
          <TryIt action="Hover any icon in the rail — nothing names it">
            <Shell navInset open={false}>
              <SidebarHeader className="group-data-[collapsible=icon]:ps-4 group-data-[collapsible=icon]:pe-2">
                <BrandRow />
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  {navigation.map((item) => {
                    const Icon = 'icon' in item ? item.icon : undefined;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton className="gap-2 px-2">
                          {Icon ? <Icon /> : null}
                          <span className="font-medium">{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarContent>
            </Shell>
          </TryIt>
        }
        beforeNote="no tooltip anywhere, and the header leans 4px right"
        beforeSource={
          <>
            the rows rebuilt with no <Code>tooltip</Code> prop — which is what{' '}
            <Code>SidebarNavigationItems</Code> emitted — and the header's
            asymmetric inset put back through <Code>className</Code>.
          </>
        }
        files={[
          'src/components/Sidebar/SidebarNavigationItems.tsx',
          'src/components/Sidebar/SidebarProvider.tsx',
          'src/components/Sidebar/SidebarHeader.tsx',
        ]}
        footnote={
          <>
            Three things, one cause: the rail had been given its width and
            nothing else. <b>The tooltip existed and was never passed</b> —{' '}
            <Code>SidebarMenuButton</Code> takes a <Code>tooltip</Code> prop and
            hides it unless the sidebar is collapsed, and{' '}
            <Code>SidebarNavigationItems</Code> supplied it on none of the three
            rows it can render collapsed, so the one state where a row has no
            label was the state with nothing to supply one.{' '}
            <b>The delay was overridden to 500ms</b> in{' '}
            <Code>SidebarProvider</Code>, with no note saying why; the package's
            own value is 300, the kit's, and a collapsed rail has the strongest
            claim on it — the tooltip there is not extra information about the
            row, it is the name of it. <b>And the header leaned</b>:{' '}
            <Code>ps-4 pe-2</Code> is correct expanded, but in a 48px rail an
            asymmetric inset stops being an inset — it put the surviving
            control's centre on 28 while every nav glyph below centres on 24.
            Measured after: both on 24.
            <br />
            <br />
            <strong className="font-medium text-ink-body">
              The catalog is why none of this showed:
            </strong>{' '}
            <Code>Components/Sidebar</Code> built its header row as a plain{' '}
            <Code>div</Code> with its own <Code>px-2</Code> instead of{' '}
            <Code>SidebarPanelHeader</Code> (then <Code>SidebarBrand</Code>), so
            it stacked an inset on the header's own and had nothing to hide its
            label with — the product name ran straight across the rail and over
            the page behind it. A story that does not use the part cannot
            demonstrate the part.
          </>
        }
        n={72}
        title="The collapsed rail was never finished"
        why="Collapsed, an icon is the whole row — and nothing told you what it was. The prop for it had shipped; no row passed it."
      />

      <ChangeCase
        after={
          <TryIt action="Open ☰, press Widen, then Narrow — the sheet stays shut">
            <PhoneShell
              kit={LIVE}
              menuButton={<SidebarMobileTrigger />}
              widen
            />
          </TryIt>
        }
        afterNote="the sheet closes when the phone layout ends"
        before={
          <TryIt action="Open ☰, press Widen, then Narrow — the sheet opens itself">
            <PhoneShell kit={UPSTREAM} menuButton={upstreamMenuButton} widen />
          </TryIt>
        }
        beforeNote="openMobile stays true behind the rail"
        beforeSource={
          <>
            the developers' <Code>SidebarProvider</Code>, <Code>Sidebar</Code>{' '}
            and <Code>SidebarMobileTrigger</Code> (on their own{' '}
            <Code>IconButton</Code>), vendored unchanged from their 1.4.0 into{' '}
            <Code>changes/upstream/Sidebar/</Code> — their state, not a replica.
            The ☰ is given the 18px glyph this package draws, so the glyph is
            not a second difference.
          </>
        }
        files={['src/components/Sidebar/SidebarProvider.tsx']}
        footnote={
          <>
            The window is not resized: Widen and Narrow move{' '}
            <Code>sheetBreakpoint</Code> to the other side of the window's
            width, which flips <Code>isMobile</Code> the way a resize across
            1024px does.
          </>
        }
        n={140}
        title="The sheet outlived the phone layout"
        why="Widening past the breakpoint left the sheet open, unseen behind the rail, and it sprang back over the page the next time the window narrowed — a drawer nobody opened."
      />

      <ChangeCase
        after={
          <div className="flex w-60 flex-col gap-0.5">
            <SidebarNavItem
              activatable={false}
              asChild
              icon={CirclePlus}
              label="New chat"
            >
              <button type="button" />
            </SidebarNavItem>
            <SidebarNavItem
              badge={<Counter size="sm">3</Counter>}
              href="/sources"
              icon={Database}
              label="Data sources"
            />
            <SidebarNavItem href="/files" icon={Folder} label="Files" />
          </div>
        }
        afterNote="text-start on any element, and a badge at the row's end"
        before={
          <div className="flex w-60 flex-col gap-0.5">
            <UpstreamSidebarNavItem
              activatable={false}
              asChild
              className="text-sm"
              icon={CirclePlus}
              label="New chat"
            >
              <button type="button" />
            </UpstreamSidebarNavItem>
            <UpstreamSidebarNavItem
              className="text-sm"
              href="/sources"
              icon={Database}
              label="Data sources"
            />
            <UpstreamSidebarNavItem
              className="text-sm"
              href="/files"
              icon={Folder}
              label="Files"
            />
          </div>
        }
        beforeNote="the button centres its label; no place for a count"
        beforeSource={
          <>
            the developers' <Code>SidebarNavItem</Code>, vendored unchanged from
            their 1.4.0 into <Code>changes/upstream/Sidebar/</Code>. Their row
            sets its label at 13px; <Code>text-sm</Code> is passed through{' '}
            <Code>className</Code> so the type is not a second difference.
          </>
        }
        files={['src/components/Sidebar/SidebarNavItem.tsx']}
        footnote={
          <>
            The badge is the row's description (<Code>aria-describedby</Code>),
            so the rail, which has no room to draw it, still says it. An element
            as <Code>icon</Code> is not drawn: a component wrapping the same
            mark sets the same pixels on their row — what changed is what a page
            has to write.
          </>
        }
        n={142}
        title="SidebarNavItem — badge, and the label at its icon on a button"
        why="Their row had nowhere after the label for a count, and on a <button> — a row that acts rather than links — the label sat mid-row, because a button centres its text."
      />

      <ChangeCase
        after={
          <TryIt action="Hover ☰ — it names itself. Open it — the sheet stays quiet">
            <PhoneShell
              kit={LIVE}
              menuButton={<SidebarMobileTrigger tooltip />}
              panelTrigger={<SidebarTrigger tooltip />}
            />
          </TryIt>
        }
        afterNote="no panel tooltip while isMobile; the ☰ takes tooltip"
        before={
          <TryIt action="Hover ☰ — nothing names it. Open it — a tooltip pops over the sheet">
            <PhoneShell
              kit={UPSTREAM}
              menuButton={upstreamMenuButton}
              panelTrigger={
                <UpstreamSidebarTrigger
                  className="p-0"
                  tooltip
                  variant="tertiary"
                />
              }
            />
          </TryIt>
        }
        beforeNote="the panel trigger's tooltip fires on the sheet's focus"
        beforeSource={
          <>
            the developers' <Code>SidebarProvider</Code>, <Code>Sidebar</Code>{' '}
            and both triggers — the ☰ on their own <Code>IconButton</Code> —
            vendored unchanged from their 1.4.0 into{' '}
            <Code>changes/upstream/Sidebar/</Code>. Two of their defaults are
            set to this package's through props, so neither is a second
            difference: the ☰ glyph at 18px, and the panel trigger{' '}
            <Code>tertiary</Code> with no padding rather than a filled{' '}
            <Code>primary</Code>.
          </>
        }
        files={[
          'src/components/Sidebar/SidebarTrigger.tsx',
          'src/components/Sidebar/SidebarMobileTrigger.tsx',
        ]}
        footnote={
          <>
            Both halves are the phone layout at any window width:{' '}
            <Code>sheetBreakpoint</Code> is set above it.
          </>
        }
        n={143}
        title="SidebarTrigger, SidebarMobileTrigger — their tooltips"
        why="Opening the sheet hands its first control focus, so the panel trigger's tooltip popped up over the sheet with no pointer near it — while the ☰ that opened it had no visible name at all."
      />
      <NoPanel
        section={94}
        title="The product sidebar — Pinned / Recent, the chat row, the promo slot, the compact footer"
        why={
          <>
            <Code>SidebarSection</Code>, <Code>SidebarChatItem</Code>,{' '}
            <Code>SidebarPromo</Code>, <Code>SidebarStat</Code> and{' '}
            <Code>SidebarUser</Code> are not in the developers' library at
            1.4.0. The section is new parts; they are reviewed in their own
            stories under Components/Sidebar.
          </>
        }
      />

      <NoPanel
        section={139}
        title="SidebarUser — the rail kept the avatar and lost the name"
        why={
          <>
            <Code>SidebarUser</Code> is not in the developers' library at 1.4.0,
            and the fix — <Code>hidden</Code> to <Code>sr-only</Code> — moves no
            pixel: the name is now there for a screen reader.
          </>
        }
      />

      <NoPanel
        section={141}
        title="SidebarChatItem — the ⋮ where there is no hover, and countLabel"
        why={
          <>
            <Code>SidebarChatItem</Code> is not in the developers' library at
            1.4.0.
          </>
        }
      />

      <NoPanel
        section={144}
        title="SidebarStat — asChild"
        why={
          <>
            <Code>SidebarStat</Code> is not in the developers' library at 1.4.0,
            and <Code>asChild</Code> changes the element, not the pixels.
          </>
        }
      />
    </ChangePage>
  ),
};
