import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChevronsUpDown,
  Files,
  Home,
  LayoutDashboard,
  PanelLeft,
  Search,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Button } from '../src/components/Button';
import { IconButton } from '../src/components/IconButton';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarNavigationItems,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '../src/components/Sidebar';
import type { NavigationElement } from '../src/components/Sidebar/types';
import { Typography } from '../src/components/Typography';
import { cn } from '../src/lib/utils';
import { ChangeCase, ChangePage, Code, TryIt } from './Harness';

const meta = {
  title: 'Proposed changes/3. The sidebar under two shells',
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
 * subject of §23.
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
  windowBar,
}: {
  /** §14 only: puts the collapsed padding and the label back on the row. */
  accountClassName?: string;
  children: ReactNode;
  /** The account footer. Production always has one; only §12 turns it off. */
  footer?: boolean;
  /**
   * Which footer row. `product` is what the live rail renders — a 36px button
   * with a 24px avatar. `menu-button` is the `SidebarMenuButton` recipe, which
   * §14 needs because that component's collapsed box is its subject.
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
  /** The desktop app's own window bar, rendered above the rail. */
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
          window bar instead of behind it. Without it a panel escapes its box
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
          <Sidebar collapsible="icon">
            {children}
            {footer ? (
              // Production overrides the component's own `p-2` with
              // `px-2.5 pt-2 pb-2.5` — 10 at the sides and the bottom, 8 top.
              <SidebarFooter className="px-2.5 pt-2 pb-2.5">
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
 * The two shapes the library has to serve, built from the same elements — no
 * `variant` prop on `Sidebar`, nothing for a consumer to declare.
 *
 * **Web** keeps the product mark in the rail, because a browser tab is no place
 * for it, and the collapse control sits in that same brand row.
 *
 * **Desktop** owns a window bar, so the mark and the collapse control belong
 * there; the rail renders `<SidebarHeader />` with nothing inside, purely for
 * the top inset, and `empty:pb-0` drops the bottom half on its own. Because the
 * control lives outside the rail, collapsing can never hide it — which is the
 * dead end §16 is about, solved by composition rather than by a rule.
 */
function WebShell({ guides }: { guides?: boolean }) {
  return (
    <Shell guides={guides} navInset>
      <SidebarHeader>
        <div className="flex h-8 items-center justify-between gap-2">
          <BrandRow className="group-data-[collapsible=icon]:hidden" />
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigationItems items={navigation} />
      </SidebarContent>
    </Shell>
  );
}

function DesktopShell({ guides }: { guides?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <Shell
      guides={guides}
      navInset
      onOpenChange={setOpen}
      open={open}
      windowBar={
        <div className="flex h-9 shrink-0 items-center gap-2 border-stroke border-b bg-surface-card2 px-2">
          <LayoutDashboard className="size-4 shrink-0 text-brand-primary" />
          <span className="font-medium text-ink-body text-xs">Connections</span>
          <IconButton
            aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
            className="ms-auto"
            onClick={() => setOpen((v) => !v)}
            size="2xs"
            variant="tertiary"
          >
            <PanelLeft />
          </IconButton>
        </div>
      }
    >
      <SidebarHeader />
      <SidebarContent>
        <SidebarNavigationItems items={navigation} />
      </SidebarContent>
    </Shell>
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

/** The `SidebarMenuButton` footer recipe — §14's subject, 28px avatar and all. */
function AccountMenuRow({ labelClassName }: { labelClassName?: string }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className={labelClassName} size="lg">
          <span className="size-7 shrink-0 rounded-full bg-brand-primary/25" />
          <span className="truncate">katerynak</span>
          <ChevronsUpDown className="ms-auto size-4 shrink-0" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export const SidebarUnderTwoShells: Story = {
  name: 'The sidebar under two shells',
  render: () => (
    <ChangePage
      intro="One library, two products: a desktop app that owns a window bar and a web app that does not. Every case here is a place where a change made while looking at one shell would break the other."
      title="The sidebar under two shells"
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
        files={['src/components/Sidebar/SidebarHeader.tsx', 'SidebarBrand.tsx']}
        footnote={
          <>
            Why this is a library defect and not a page defect: the component
            became unsafe by default. Nothing errors — a consumer who has not
            read the docstring gets a broken rail.{' '}
            <strong className="font-medium text-ink-body">
              Read the After panel against the hairlines before accepting it:
            </strong>{' '}
            the mark now sits on 16, and the navigation icons below it sit on 8.
            16 is the right line — measured on the live Insightis rail — but the
            navigation does not reach it, so this case is half a fix until §23
            lands. And the inset must live in exactly one slot: production's
            brand row owns <Code>pl-4</Code> with the header on <Code>p-0</Code>
            , so a consumer composed that way inherits 32 from this change
            rather than 16.
          </>
        }
        n={11}
        state="working-tree"
        title="SidebarHeader lost its horizontal inset"
        why="The inset was removed on the theory that rows inside would carry their own. Pages lay that row out by hand, so the inset simply stopped existing."
      />

      <ChangeCase
        after={
          <div className="flex flex-col gap-6">
            <Option caption="Web — mark and collapse control in the rail">
              <WebShell />
            </Option>
            <Option caption="Desktop — both in the window bar · try collapsing">
              <DesktopShell />
            </Option>
          </div>
        }
        afterNote="same elements, two compositions"
        before={
          <div className="flex flex-col gap-6">
            <Option caption="Desktop — dead space under an empty header">
              <Shell navInset>
                <SidebarHeader className="empty:!pb-2" />
                <SidebarContent>
                  <SidebarNavigationItems items={navigation} />
                </SidebarContent>
              </Shell>
            </Option>
            <Option caption="Desktop — no header at all: nav butts into the bar">
              <Shell navInset>
                <SidebarContent>
                  <SidebarNavigationItems items={navigation} />
                </SidebarContent>
              </Shell>
            </Option>
          </div>
        }
        beforeNote="the two ways the desktop shape was attempted"
        beforeSource={
          <>
            the live header with <Code>empty:!pb-2</Code> putting the padding
            back — 20px above Home instead of 12 — and, below it, the shell with
            the header dropped entirely, where the first row butts into the
            window bar with gap 0.
          </>
        }
        files={['src/components/Sidebar/SidebarHeader.tsx']}
        footnote={
          <>
            <strong className="font-medium text-ink-body">
              Element-level, not a sidebar-level variant.
            </strong>{' '}
            Nothing in these two panels sets a prop that names the shape: the
            web shell puts a brand row and a <Code>SidebarTrigger</Code> inside{' '}
            <Code>SidebarHeader</Code>; the desktop shell renders{' '}
            <Code>&lt;SidebarHeader /&gt;</Code> empty and keeps the mark and
            the collapse control in its window bar, driving{' '}
            <Code>SidebarProvider</Code> through <Code>open</Code> /{' '}
            <Code>onOpenChange</Code>. The header reads its own content —{' '}
            <Code>empty:pb-0</Code> — so the one number that differs between the
            shapes is decided by the element, not by the product. A{' '}
            <Code>variant</Code> prop would mean every consumer has to know
            which shape it is and say so, which is the kind of rule that
            silently goes unfollowed.{' '}
            <strong className="font-medium text-ink-body">
              It also settles §16:
            </strong>{' '}
            a collapse control that lives in the window bar cannot be hidden by
            collapsing, so the desktop shell needs no <Code>SidebarRail</Code>{' '}
            to stay recoverable.
          </>
        }
        n={12}
        state="working-tree"
        title="Two shells from the same elements"
        why="One library serves a web app, where the product mark belongs in the rail because a browser tab is no place for it, and a desktop app that owns a window bar and puts the mark and the collapse control there. The shapes differ by composition and by one self-deciding number, not by a variant."
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
        n={13}
        state="working-tree"
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
            than blanked.{' '}
            <strong className="font-medium text-ink-body">
              One number in the write-up does not hold here:
            </strong>{' '}
            DESIGN-SYSTEM-CHANGES.md says every mark centres at 24. Measured in
            this panel it is 16 — the 32px button is pinned to the left of a
            57px rail, because the column has no inset of its own. It becomes 24
            with §23 and not before.
          </>
        }
        n={14}
        state="working-tree"
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
            move it outside the sidebar entirely — a window bar, a page header —
            where collapsing cannot take it away.
          </>
        }
        n={16}
        state="docs-only"
        title="Collapsing could remove the only way to expand"
        why="An app that copied the documented shell inherited a dead end: with collapsible=icon and the trigger hidden when collapsed, nothing on screen can expand the sidebar again."
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
            <Option caption="Collapsed — the mark lands on 24, the number §14 claims">
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
            line while §11's header sits on the teal one. The After half applies{' '}
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
              A consequence for §11:
            </strong>{' '}
            production zeroes the header's horizontal padding precisely because
            its brand row owns <Code>pl-4</Code>. A consumer composed that way
            that picks up §11's <Code>ps-4</Code> lands at 32, not 16 — the
            insets add. Whichever slot ends up owning the inset, only one of
            them may. <Code>.design-sync/sb-reference</Code> shows 8 for both
            and no gutter; measured against production, that snapshot is stale.{' '}
            <strong className="font-medium text-ink-body">
              Why the catalog never showed this:
            </strong>{' '}
            <Code>Components/Sidebar → RowStates</Code> renders its rows inside
            a hand-built box with <Code>p-2</Code>, and each row adds{' '}
            <Code>px-2</Code> of its own — measured there, the fill starts at 8
            and the icon at 16, which is production's geometry supplied by the
            story rather than by the library. The states themselves are the
            component's own <Code>hover:bg-state-hover</Code> in both places;
            what the story adds is the gutter. A story that supplies what the
            component is missing certifies a component that is still wrong in a
            real shell — which is the one thing this section exists to catch.
          </>
        }
        n={23}
        state="proposed"
        title="The navigation column is missing the inset production has"
        why="Nothing between the sidebar edge and the row button supplies a gutter, so the navigation sits on 8 while §11 moved the brand mark to 16 — and the live product puts both on 16 with an 8px gutter."
      />
    </ChangePage>
  ),
};
