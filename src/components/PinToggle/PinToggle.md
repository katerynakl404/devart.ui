Pins a thing to the top of its list — a chat, a report, a query.

```jsx
<PinToggle pressed={chat.pinned} onPressedChange={(pinned) => update({ pinned })} />
```

## The two states

| | glyph | ink | tooltip |
|---|---|---|---|
| **off** | the pin's outline | `tertiary` — Text/Body | "Pin" |
| **on** | filled, tilted 30° | `primaryTertiary` — Brand/Primary | "Unpin" |

The box is an `IconButton` in both, so hover, press, focus and disabled are the
ones every icon button has; only the variant moves between the two. The tilt and
the fill are read off `aria-pressed` rather than off the prop, so the state the
eye sees and the state a screen reader hears are one fact. The tilt eases at
`duration-base` and does not move under `prefers-reduced-motion`.

## Name and state

The accessible name stays **"Pin"** in both states, and `aria-pressed` says
which one it is in — "Pin, toggle button, pressed". A name that flipped to
"Unpin" would read "Unpin, pressed", which contradicts itself. The tooltip is
where the action changes: it says what a click will do now.

`pinLabel` (name and off tooltip) and `unpinLabel` (on tooltip) take the
product's words.

## Size

`2xs` (24px, 14px glyph) by default — the row-action step, the size of the ⋮
beside it. Every other step of the IconButton ladder is reachable through
`size`. In a one-line list row give it `-my-0.5`, so the 24px box takes the 20px
text line's height and the row does not grow.

## In a row

Its click and its Enter / Space stay its own: pinning never opens the row it
sits in. A list row usually shows it **only while pinned**, beside the title,
and offers Pin from its menu; a surface that pins things directly shows it in
both states.

## Controlled or not

`pressed` + `onPressedChange` to own the state; `defaultPressed` to let the
toggle keep its own. A consumer `onClick` that calls `preventDefault` stops the
toggle.

It sits in a raw Radix tooltip, so it needs a `TooltipProvider` above it.
