# UploadTray

The plate raised during and after a file upload: a summary bar that expands into
the per-file list, plus a dismiss ✕. Copied from the kit's `.upl-tray`
(`Insightis/pages/kit-theme.css`), which is what production raises on
`/files`.

## Two hard parts of the contract

**1 — Nothing is nested.** The title is a button and toggles the list; the
chevron and the ✕ are two tertiary s **beside** it, not inside it.
A button within a button is invalid markup and unreachable by keyboard, which
is the trap the kit’s own note is about. Two sibling toggles are fine — the
title and the chevron both open the list — and the chevron flips off the same
 the title announces, so the visual cannot disagree with the announced
state.

The kit makes the whole bar one button with the chevron as a mute indicator
inside it. Both icons are real controls here instead, which is the same
division the ✕ always had, applied to the chevron too.

**2 — The plate is positioning-neutral.** It has a width (`100%`, capped at
26rem) and no placement of its own. The page docks it — a drawer, a panel, the
bottom of a screen — which is the same division of labour `MetaRow` uses for its
sticky behaviour, and what lets one plate serve all three.

## Never colour-only

The summary glyph carries the batch outcome: brand while uploading (and
spinning, unless `prefers-reduced-motion` or `spinner={false}`),
green when complete, red when something failed. **It never carries it alone** —
the title says it in words:

```
"3 uploading"   "2 of 3 configured"   "5 uploads complete"   "1 of 5 uploads failed"
```

**`spinner={false}` is for a batch that is stopped on the person** (draft).
Nothing is moving and nothing will until somebody acts — a list of things
still to be set up, rather than a transfer in flight. A spinner there promises
progress that is not happening and, left on screen, reads as an upload that
has hung. The status is still `uploading`: the batch is open, and what the
prop answers is whether anything is moving.

A failed row says it three ways: a red glyph, a 5% red tint on the row, and the
sentence in `error`. The sentence takes no trailing period. `action` is the one
action a failed row gets — a `LinkButton` reading *Retry*.

## Clearing itself — `autoDismiss`

**Off by default, and that is the decision, not an oversight.** A plate that
clears itself is right for a background upload nobody is watching, and wrong
for one they are: a row being read disappears under the reader. So it is a
boolean the page sets, not a behaviour the component assumes.

With it on:

- a row that reaches `done` is **marked** (`data-leaving`), waits
  `autoDismissDelay` (4000ms by default), then fades out and takes its own
  height with it, so the rows under it rise rather than jump;
- when the last row goes, **the plate follows** and `onDismiss` fires;
- a `failed` row **never** retires. It is the only row still waiting for an
  answer, and clearing it would clear the question with it — which is also why
  a batch with one failure leaves the plate on screen.

Two details are load-bearing and neither is obvious:

**Reduced motion shortens the exit, it does not remove it.** A row retires on
`animationend`, so `motion-reduce:animate-none` would leave every row on screen
for ever. The duration drops to one frame instead — one code path, and no
second timer to keep in step with the first.

**`animationend` bubbles.** The plate only accepts its own
(`event.target === event.currentTarget`); without that guard the first row to
finish would dismiss the whole plate.

## The row is always the target

`onRowClick` is **required**. There is no second, inert kind of row to
configure into existence — a row hovers, takes the pointer across its whole
width, and does something.

That is a constraint, not a convenience. A hover surface is a promise, and a
row that paints one while doing nothing is the defect §4 took off
`Card variant="outline"`. Requiring the handler is what keeps the promise and
the behaviour from ever separating.

The row is **not** wrapped in a button. The name is the control and stretches
over the row with `after:absolute after:inset-0` — the package’s own row-link
recipe (`Table.md`). So the accessible target is the file name rather than an
unlabelled box the size of the row, and `action` keeps working: it sits above
the stretched pseudo-element, and a button inside a button would be invalid
markup anyway — the same trap the head and the ✕ are kept apart for.

## Anatomy

| | |
|---|---|
| Plate | `max-width: 26rem`, radius 10px, `--shadow-overlay-soft`, clipped |
| Head | 10 / 12 padding, gap 10, Label L, `--ink-primary` |
| Head states | `--state-hover` / `--state-pressed`, **inset** focus ring |
| ✕ | 32px wide, its own left border, `--ink-secondary` → `--ink-body` on hover |
| List | top divider, `max-height: 14rem`, 4px padding, the thin scrollbar |
| Row | gap 10, 8px padding, radius 6 |
| Row glyph | 16px, 2px down from the top so it sits on the name's first line |
| Name | Body M, `--ink-body`, truncates — never wraps |
| Progress | the `ProgressBar` atom at `size="md"` (4px), full row width |
| Meta | Body S, `--ink-secondary`, tabular |

The focus ring is **inset** rather than the package's usual offset ring, and
that is not a preference: the plate is `overflow: hidden` so its corners can
clip, and an outside ring on a full-bleed bar would be clipped away with them.

## Four departures from the kit, and why

**The head paints nothing.** The kit gives `.upl-head` a hover surface and a
pressed one. Here the plate is a plain white bar: a fill across the top of a
small plate reads as the plate changing state rather than as a control
answering, so the response is the chevron going one ink step darker instead —
`--ink-icon` to `--ink-icon-hover`, the same rule the ✕ follows.

The head’s summary glyph is uncoloured for the same reason. The kit paints it
per outcome and its own rule is that the colour is never the only cue, because
the title states the outcome in words beside it. With the colour gone the words
carry it alone, which they were already doing. The ROWS keep their colour —
that is where “which file failed” is answered; the head only counts.


**No `pressed:` anywhere on this component**, and it is worth recording why
even though the head now paints nothing at all. `pressed:` expands to
`&[aria-expanded="true"]` as well (decision 6), and the head carries that
attribute the whole time the list is open — so the bar sat permanently on the
pressed fill, which is what the tinted header was. That variant is for a
trigger whose surface floats *over* the page and has nothing else to say the
menu is its own; an expander opened what is directly under it, and the chevron
already says so.

**The ✕ is an icon, not a tertiary button.** The kit gives `.upl-x` a hover
fill; this one answers with colour instead — `--ink-icon` to
`--ink-icon-hover` — on the rule `InputGroupAction` already follows: a filled
box appearing under the pointer turns a glyph into a control sitting on top of
a control. There is no divider between it and the bar either — a hairline
inside a plate this small reads as a seam in the surface rather than as a
boundary between two targets.

**A one-line row centres.** The kit’s `align-items:flex-start` plus the 2px
nudge is right for a row with a progress bar or an error under the name — the
glyph belongs to the first line, not to the block. A row with only a name has
no second line to align away from, and the same two rules then sit the glyph
2px below the text it labels.

## Usage

```jsx
<UploadTray
  status="failed"
  title="1 of 3 uploads failed"
  onDismiss={dismiss}
>
  <UploadTrayItem icon={<FileText />} name="giffycanvas.gif" status="done" />
  <UploadTrayItem
    status="failed"
    name="dataset-full-export.csv"
    icon={<FileText />}
    error="The file is larger than the 25 MB limit"
    action={<LinkButton onClick={retry}>Retry</LinkButton>}
  />
</UploadTray>
```

While uploading, a row takes `progress` (0–100) and renders the bar:

```jsx
<UploadTrayItem
  status="uploading"
  name="quarterly-report.pdf"
  icon={<FileText />}
  progress={62}
  meta="62%"
/>
```

`icon` is a slot. The kit draws a 16px glyph there; a product with its own
file-type chip passes that instead, and the row's layout does not change.

Open state is the plate's own unless you pass `open` — `defaultOpen` seeds it,
`onOpenChange` reports every toggle either way.
