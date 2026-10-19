Dims and blurs everything around one or more targets; the cutout stays sharp
and live.

```jsx
<Spotlight target='[data-tour="composer"]' onScrimClick={nudge} />
<Spotlight target={[attachRef, '[data-tour="model"]']} padding={6} />   // lit as one union
```

A target is a selector, an element, a ref, or an array of them. Pass a
measured `rect` (and `bounds`) instead when something else already measures —
`Tour` does.

## What it draws

- **The scrim** — one layer over the bounds: the modal scrim (`--overlay-scrim`)
  under `--spotlight-blur`, with a rounded hole cut by its `clip-path`. The
  hole is not painted, so clicks inside it reach the page; the scrim takes
  every other click (`onScrimClick`).
- **The ring** — 2px Brand/Primary with a halo and a glow (`shadow-spotlight`)
  and a pulse (`pulse={false}` stops it). Its corner is concentric with the
  target: the target's own `border-radius` (or its nearest rounded ancestor's,
  for a square part such as a table row) + `padding`. `radius` overrides.

The hole and the ring glide to a new target on `--spotlight-move`. `leaving`
fades the layer out and lets every click through while it unmounts. All
motion stops under `prefers-reduced-motion`.

## Where it may dim

`boundary` (selector, element or ref) limits the scrim to one area — a page's
review strip or app chrome outside it stays live. Default: the viewport.

## `useTargetRect`

`useTargetRect(target, { padding, boundary })` → `{ rect, bounds, radius, vw, vh }`
is exported from this entry: the measurement the tour family shares, kept
current through resize, scroll, DOM changes and font loading. Use it to place
your own furniture against the same rect.

Portalled to `document.body`, or the nearest `PortalContainer`, at
`--spotlight-z` (70). While it is in the page, toasts sit one step under the
scrim (`--spotlight-z` − 1): a toast that lands as a tour opens ("HubSpot
connected") is dimmed with the rest of the page, not laid over the tour.
