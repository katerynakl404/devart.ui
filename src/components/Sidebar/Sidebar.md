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
      <SidebarTrigger variant="tertiary" />
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
  `Sheet`, opened by `SidebarTrigger` — so a narrow preview frame shows no rail,
  which is expected, not a bug.
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
- put the trigger outside the sidebar entirely — in a page header, where
  collapsing cannot take it away.

The rail is the cheapest and is what the shell example above uses.
- `variant`: `sidebar` is flush to the edge; `floating` and `inset` detach the
  panel, and `SidebarInset` then picks up matching margins and a radius.
- `SidebarContent` is the scrolling region and already carries `min-h-0`; put
  `SidebarHeader` / `SidebarFooter` outside it so they stay pinned.
- Page padding is `p-6`, section gap `gap-4`–`gap-6`, and the page title is one
  `h1` at `title20`.

## Navigation

`SidebarNavigationItems` takes a `NavigationElement[]` — items and groups, with
`isNavigationGroup` / `isNavigationItem` guards for narrowing. A nav row is 32px
tall with a `md` radius, an 16px icon and an 8px gap; hover paints
`State/Hover`, active paints `State/Pressed` and lifts the ink to `Text/Body`.
Active is never a brand colour.

## The product sidebar

The shape both products ship, top to bottom:

```jsx
<Sidebar collapsible="icon">
  <SidebarHeader>
    <SidebarBrand>…mark and name… <SidebarTrigger size="xs" variant="tertiary" /></SidebarBrand>
  </SidebarHeader>
  <SidebarContent>
    <SidebarNavigationItems items={nav} />           {/* New Chat, Data Sources, Metrics, Files */}
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

- **Chats are not a nav row.** They are flat `SidebarSection` lists under the
  nav, not a `NavigationGroup` nested under a `Chats` row with a left rail. Keep
  `NavigationGroup` for a second level that really is navigation.
- **`SidebarChatItem`** — h28, 14px `Text/Secondary`. The title *fades* at the
  right edge instead of ellipsising; the fade widens on hover so the kebab lands
  on solid fill. `status="loading" | "new"` and `count` share the right-edge slot
  and step aside for the kebab. `menu` takes `DropdownMenuItem`s; the kebab is a
  sibling of the link, never inside it.
- **`SidebarPromo`** is a slot for one `PromoCard`: above the footer rule, 8px
  gutter, hidden when the rail collapses. Whether it renders (free plan, not yet
  dismissed) is the product's decision — the sidebar has no prop for it.
- **The footer** is two buttons that open popovers above themselves: a
  one-line `SidebarStat` (label left, figure right) and the `SidebarUser`
  account row (24px avatar, name, one quiet line, up-down chevron).
- **Collapsed to icons**, the sections, the promo and the stat leave — none has
  a 48px form — and the account row keeps its avatar.
