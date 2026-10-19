The application shell: a collapsible navigation rail plus the content area
beside it.

## Full-height page shell

This is the shape every screen should start from. Three details decide whether
the heights come out right, and all three are easy to miss.

```jsx
<SidebarProvider defaultOpen className="h-svh min-h-0 overflow-hidden">
  <Sidebar collapsible="icon">
    <SidebarHeader>…</SidebarHeader>
    <SidebarContent>…</SidebarContent>
    <SidebarFooter>…</SidebarFooter>
    <SidebarRail />   {/* see "Collapsing" — not optional with collapsible="icon" */}
  </Sidebar>

  <SidebarInset className="min-h-0">
    <header className="flex shrink-0 items-center gap-3 border-stroke border-b px-6 py-4">
      {/* Only while the sidebar is hidden — see "One trigger at a time" */}
      {isMobile && <SidebarMobileTrigger />}
      <Typography element="h1" textStyle="title20">Connections</Typography>
      <Button className="ms-auto" size="sm">New connection</Button>
    </header>

    {/* the ONLY scrolling region */}
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
      …
    </div>
  </SidebarInset>
</SidebarProvider>
```

1. **`min-h-0` on every flex ancestor of the scroller.** A flex item defaults to
   `min-height: auto`, so it refuses to shrink below its content. Without it the
   `overflow-y-auto` child grows the page instead of scrolling, and the header
   scrolls away with it.
2. **Never `h-full` inside the shell.** `SidebarProvider` carries only a
   `min-height`, so its computed `height` is `auto` — and a percentage height
   against an `auto` parent computes to `auto` too. `h-full` there is not
   wrong-looking, it is *inert*. Use `flex-1` with `min-h-0`.
3. **Pin the shell only when the content scrolls inside it.** The default
   `min-h-svh` is right for a document-style page that scrolls as a whole; add
   `h-svh min-h-0 overflow-hidden` for an app screen with its own scroll region.
   `SidebarInset` fills the shell either way.

## Layout notes

- The rail mounts at `lg` and above. Below that `Sidebar` renders as a
  `Sheet` — so a narrow preview frame shows no rail, which is expected, not a
  bug. Open it with `SidebarMobileTrigger` in the page header: an
  `IconButton` whose menu glyph turns a quarter while the sheet is open. It
  carries **no `data-sidebar`**, so `:not([data-sidebar])` separates it from
  the panel's own `SidebarTrigger`; do not add one. `tooltip` shows its
  accessible name, below it by default (`tooltipSide`) — the button lives at
  the top of the page.
- **Leaving the phone layout closes the sheet.** `SidebarProvider` resets
  `openMobile` the moment the viewport crosses back over `sheetBreakpoint`.
  Left open, the sheet would wait unseen behind the rail and spring back over
  the content the next time the window narrowed — a drawer nobody opened.
- `collapsible`: `icon` keeps a narrow rail of icons (the usual choice),
  `offcanvas` slides it away entirely, `none` pins it open.

## Collapsing — the way back must survive the collapse

**A `SidebarTrigger` may not be the only way to expand the sidebar if it hides
when the sidebar collapses.** The common shape of this bug: the trigger is put in
`SidebarHeader` next to the product name and given
`group-data-[collapsible=icon]:hidden` so the header collapses cleanly. Collapse
the sidebar once and there is no control left on screen that can expand it — the
only affordance left the screen together with the thing it controls.

There is no expand-on-hover in this package, so one of these has to be true:

- render `SidebarRail` (the edge strip: click or drag the border), **or**
- keep the trigger visible when collapsed, **or**
- with `collapsible="offcanvas"`, put the trigger outside the sidebar — beside
  the page title, where collapsing cannot take it away.

The rail is the cheapest and is what the shell example above uses.
`SidebarPanelHeader` is the second option built in: on the rail the mark and
the trigger share one 28px square, the mark shows, and hover or keyboard focus
swaps it for the trigger. The swap is **opacity-only, never `display`** — the
trigger stays in the tab order while invisible, which is what lets focus reveal
it.

**One trigger at a time.** Collapsed to the icon rail, the trigger lives in
the rail — `SidebarPanelHeader` carries it. Beside the page title it appears
only while the sidebar is hidden: `collapsible="offcanvas"` collapsed, or the
sheet below `lg` (`SidebarMobileTrigger`). A trigger in both places is the same
control twice.

`SidebarTrigger` takes `icon` (replaces the panel glyph) and `tooltip` /
`tooltipSide`. The tooltip shows `label`, which is also the accessible name, so
a caller that swaps the label per state ("Collapse sidebar" / "Expand sidebar")
has nothing else to keep in sync. The tooltip is **off while the sidebar is the
sheet** (`isMobile`), whatever the prop says: there is no rail there, and the
sheet hands focus inside as it opens, so a tooltip answering that focus would
pop with no pointer near it.

- `variant`: `sidebar` is flush to the edge; `floating` and `inset` detach the
  panel, and `SidebarInset` then picks up matching margins and a radius.
- `SidebarContent` is the scrolling region and already carries `min-h-0`; put
  `SidebarHeader` / `SidebarFooter` outside it so they stay pinned.
- Page padding is `p-6`, section gap `gap-4`–`gap-6`, and the page title is one
  `h1` at `title20`.

## Navigation

Two ways to write the rows, one look:

- **`SidebarNavItem`** — one row as explicit JSX: `icon`, `label`, and a link
  through `href` or, with a router, `asChild` around the caller's own link (the
  icon and label are injected as its children). Active paint reads
  `data-status="active"` and `aria-current="page"`; `activatable={false}` drops
  it for a row that points somewhere it does not represent ("New chat").
  `withTooltip` puts the label in a tooltip — set it from `useSidebar().state`
  on the rail. Classes: `sidebarNavItemVariants`.

  `icon` takes a component (a lucide icon, sized by the row) or an element (a
  product mark, an `<img>`), which the row sets in the same 16px box — 14px on
  the rail — so mixed marks still read as one column. `badge` is trailing
  content after the label: a `Counter` for a number, a `Badge` for a word. The
  rail has no room for it, so it leaves there; it is the row's accessible
  **description**, not part of its name, so the name stays "Data sources" and
  the rail still says "3".
- **`SidebarNavigationItems`** — maps a `NavigationElement[]`, items and groups,
  with `isNavigationGroup` / `isNavigationItem` guards for narrowing. Use it
  when the nav is data, and for a `NavigationGroup` sub-tree.

A nav row is 32px tall with a `md` radius, a 16px icon, an 8px gap and a 14px
label; hover paints `State/Hover`, active paints `State/Pressed` and lifts the
ink to `Text/Body`. Active is never a brand colour. On the rail a
`SidebarNavItem` is a 28px square with a 14px glyph.

## The product sidebar

The shape both products ship, top to bottom:

```jsx
<Sidebar collapsible="icon">
  <SidebarHeader>
    <SidebarPanelHeader
      logoIcon={<a href="/" aria-label="Home">…mark and name…</a>}
      sidebarTrigger={<SidebarTrigger size="xs" tooltip label={open ? 'Collapse sidebar' : 'Expand sidebar'} />}
    />
  </SidebarHeader>
  <SidebarContent>
    <nav className="flex flex-col gap-0.5 group-data-[collapsible=icon]:items-center">
      <SidebarNavItem href="/chat" icon={CirclePlus} label="New Chat" activatable={false} />
      <SidebarNavItem href="/sources" icon={Database} label="Data Sources" />
      …Metrics, Files
    </nav>
    <SidebarSection label="Pinned" action={<LinkButton href="/chats">See all</LinkButton>}>
      <SidebarChatItem href="/chats/1" menu={<>…DropdownMenuItems…</>}>Message queue</SidebarChatItem>
    </SidebarSection>
    <SidebarSection label="Recent" action={…}>…</SidebarSection>
  </SidebarContent>
  {showOffer ? (
    <SidebarPromo>
      <PromoCard icon={<Sparkles />} title="Upgrade to Pro" description="…" href="/plan" onDismiss={…} />
    </SidebarPromo>
  ) : null}
  <SidebarFooter>
    <SidebarStat icon={<Wallet />} label="Balance" value="9,480 left" />
    <SidebarUser avatar={<Avatar><AvatarFallback>K</AvatarFallback></Avatar>} name="Kateryna K." meta="Admin · Free" />
  </SidebarFooter>
  <SidebarRail />
</Sidebar>
```

- **`SidebarPanelHeader`** — a 32px row, mark leading, trigger trailing.
  `logoIcon` must be a single element: the row's layout and focus classes are
  merged onto it (`sidebarPanelHeaderSlotClassName`), so the focus ring lands
  on the link itself. The trigger sits in a wrapper
  (`sidebarPanelHeaderTriggerSlotClassName`), because a tooltip-wrapped trigger
  has no DOM node of its own. The row carries **no horizontal inset** —
  `SidebarHeader` owns it — and a name inside `logoIcon` takes
  `group-data-[collapsible=icon]:hidden` so only the mark survives the rail.
- **Chats are not a nav row.** They are flat `SidebarSection` lists under the
  nav, not a `NavigationGroup` nested under a `Chats` row with a left rail. Keep
  `NavigationGroup` for a second level that really is navigation.
- **`SidebarChatItem`** — h28, 14px `Text/Secondary`. The title *fades* at the
  right edge instead of ellipsising; the fade widens on hover so the kebab lands
  on solid fill. `status="loading" | "new"` and `count` share the right-edge slot
  and step aside for the kebab. `menu` takes `DropdownMenuItem`s; the kebab is a
  sibling of the link, never inside it, and its tooltip is `menuLabel` — the
  same string as its name. `countLabel` says what the number means ("3 messages
  queued — still sending"): it is spoken in place of the bare count and shown
  as the count's tooltip, wherever the count is on screen — not while the kebab
  covers it. The count is not a tab stop (it sits inside the link); the
  keyboard hears the same words in the row's name.

  **Where there is no hover, the kebab never hides.** Below `lg` (the sheet) and
  on any touch screen (`(hover: none)`) — the same two conditions as
  `SidebarSection`'s "See all" — the kebab is always on, the link keeps 32px of
  room for it, and the fade ends where that room begins. The status and the
  count stay beside it instead of stepping aside, since there is room for both.
- **`SidebarPromo`** is a slot for one `PromoCard`: above the footer rule, 8px
  gutter, hidden when the rail collapses. Whether it renders (free plan, not yet
  dismissed) is the product's decision — the sidebar has no prop for it.
- **The footer** is two buttons that open popovers above themselves: a
  one-line `SidebarStat` (label left, figure right) and the `SidebarUser`
  account row (24px avatar, name, one quiet line, up-down chevron). Inside the
  popover each row is a `SidebarMenuRow` — leading icon, label, and
  `isExternal` for the outbound arrow (`trailingSlot` takes its place). It is a
  `<button>` reporting `onSelect`; a row that navigates is wrapped in the
  consumer's own link. `SidebarStat` takes `asChild` to render the caller's
  element instead — a router link, or a `<div>` where the figure is a reading
  that opens nothing; the recipe goes with it unchanged.
- **Collapsed to icons**, the sections, the promo and the stat leave — none has
  a 48px form — and the account row keeps its avatar. Its name and meta line
  leave the screen but not the button: they become `sr-only` text, because on
  the rail they are the only accessible name the account menu's trigger has.
