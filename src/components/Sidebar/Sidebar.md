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

- The desktop rail mounts at `lg` and above. Below that `Sidebar` renders as a
  `Sheet`, opened by `SidebarTrigger` — so a narrow preview frame shows no rail,
  which is expected, not a bug.
- `collapsible`: `icon` keeps a narrow rail of icons (the usual choice),
  `offcanvas` slides it away entirely, `none` pins it open.
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
