# ActivityTray

A plate whose header expands into a list of `ActivityTrayItem` rows, plus a
dismiss ✕. It replaces `UploadTray`. The visuals are the kit's `.upl-tray`
(`Insightis/legacy-html/pages/kit-theme.css`), the plate production raises on `/files`
during and after an upload.

The component carries **no status vocabulary**. There is no `status` prop:
every glyph, colour and sentence arrives through a slot the consumer fills in,
so the same plate serves an upload batch, a list of workspaces to configure, or
any other set of things in progress.

## API

`ActivityTray` — the root is a Radix `Collapsible`, so `role`, `aria-label` and
other root props pass through.

| Prop | Default | |
|---|---|---|
| `headerTitle` | — | The summary sentence. States the outcome in words. |
| `headerIcon` | — | The 16px summary glyph. Omit it and the slot goes. |
| `isCollapsible` | `true` | `false`: the header is not a toggle and the list stays open. |
| `open` / `defaultOpen` / `onOpenChange` | — / `true` / — | Controlled or uncontrolled open state. |
| `toggleLabel` | the title text | `aria-label` for the toggle. |
| `onDismiss` | — | Renders the ✕. Also called after the auto-dismiss exit. |
| `dismissLabel` | `'Dismiss'` | `aria-label` for the ✕. |
| `autoDismiss` | `false` | Auto-remove `dismissible` rows; the plate leaves after the last one. |
| `autoDismissDelay` | `4000` | ms before a dismissible row leaves. |
| `contentClassName` | — | Classes for the scrollable list. |

`ActivityTrayItem` — an `<li>`. It must be rendered inside an `ActivityTray`;
outside one it throws.

| Prop | |
|---|---|
| `title` | The row's name. Truncates — never wraps. |
| `icon` | The leading 16px mark: a file glyph, or a product's own type chip. |
| `hasProgress` + `progress` (0–100) + `progressLabel` | Renders a `ProgressBar` under the title. `progressLabel` names it; the title is the fallback. |
| `errorText` | A red sentence under the title. Wins over `description`. |
| `description` / `descriptionClassName` | A secondary sentence under the title. |
| `rightSlot` | A reading or a control at the row's end — a size, a percentage, *Retry*. |
| `trailingIcon` | The row's state at its very end — a glyph or a `Badge`. |
| `dismissible` | The row may retire under `autoDismiss`. |
| `onActivate` | Makes the row the click target (see below). |

Exports: `ActivityTray`, `ActivityTrayItem`, `activityTrayVariants`,
`activityTrayItemVariants`, and the `ActivityTrayProps` /
`ActivityTrayItemProps` types.

## Two hard parts of the contract

**1 — Nothing is nested.** The whole header except the ✕ is one toggle (a
`CollapsibleTrigger` carrying `aria-expanded`), and the ✕ is its **sibling**. A
button within a button is invalid markup and unreachable by keyboard, which is
the trap the kit's own note is about. The chevron inside the toggle is an
`aria-hidden` indicator, not a second control. It reads Radix's `data-state` off
the same trigger that announces `aria-expanded`, so the glyph cannot disagree
with what assistive tech hears.

The chevron points **up when collapsed** and down once open: the plate docks at
the bottom of the screen, so the list opens upward and the chevron points where
the content is about to come from.

With `isCollapsible={false}` — a tray hosted inside something that already
opens and closes, a popover or a drawer — the header keeps its icon and title,
drops the toggle and the chevron, and the list is always rendered.

**2 — The plate is positioning-neutral.** It has a width (26rem, `max-w-full`)
and a height cap on its list, and no placement of its own. The page docks it —
a drawer, a panel, the bottom of a screen — which is the same division of
labour `MetaRow` uses for its sticky behaviour.

## Never colour-only

The summary glyph stays `--ink-secondary` in **every** state. The outcome is
carried by the glyph's shape and spelled out in `headerTitle`:

```
"3 uploading"   "2 of 3 configured"   "5 uploads complete"   "1 of 5 uploads failed"
```

While something is moving, pass a turning glyph — `Loader2` with
`animate-spin motion-reduce:animate-none`. Not `Spinner`: it sets
`role="status"` and `aria-label="Loading"`, which would put a live region inside
the toggle and turn its name into "Loading 3 uploading".

**A batch waiting on the person passes no `headerIcon`** (draft). Nothing is
moving and nothing will until somebody acts — a list of things still to set up.
A spinner there promises progress that is not happening, and a still ring reads
as a loader that stalled. The title already states the count, so the slot goes.

A failed row says it in words and shape, not only colour: `errorText` carries
the sentence (no trailing period), `trailingIcon` takes `CircleAlert` in
`text-fb-red-text`, and the header title counts the failures. The one action a
failed row gets is *Retry* in `rightSlot`, as a text link — `LinkButton`, the
kit's `.upl-item-act`.

## Clearing itself — `autoDismiss`

**Off by default, and that is the decision.** A plate that clears itself is
right for a background job nobody is watching, and wrong for one they are: a
row being read disappears under the reader.

With it on:

- a row marked `dismissible` waits `autoDismissDelay`, is marked
  (`data-leaving`), and plays `animate-row-out` — it fades over the first 40%,
  then its height and padding close over the rest. The row hands its own height
  to the animation as `--row-height`, because `height: auto` cannot animate;
- a row that is not visible when its time comes (the tray is collapsed) leaves
  without the animation;
- when the last row goes, **the plate follows** with `animate-panel-out`, and
  `onDismiss` fires on the plate's own `animationend`. Without `onDismiss` the
  plate stays;
- a row that is **not** `dismissible` never retires, and keeps the plate on
  screen. Leave a failed row non-dismissible: it is the only row still waiting
  for an answer, and clearing it would clear the question with it.

Two details are load-bearing:

**Reduced motion shortens the exit, it does not remove it.** Rows and plate
retire on `animationend`, so `motion-reduce:animate-none` would leave them on
screen for ever. The duration drops to 1ms instead — one code path.

**`animationend` bubbles.** Each element only accepts its own
(`event.target === event.currentTarget`); without that guard the first row to
finish would dismiss the whole plate.

## The state in words

`trailingIcon` takes a `Badge` (`size="sm"`, `rounded="full"`) when a row says
its state as a sentence — "No data included" rather than a glyph.

`UploadTray` fixed the pairing inside the component: a row still waiting on
somebody is `attention`, a settled one `secondary`, a failed one `error`.
`ActivityTray` leaves the variant to the consumer, so keep that pairing at the
call site — the same state must not be amber in one plate and grey in the next.

## Clickable rows — `onActivate`

With `onActivate`, the row is the click target and gets the hover and press
surfaces (`--state-hover` / `--state-pressed`). The row is **not** wrapped in a
button: the title becomes the button and stretches over the row with
`after:absolute after:inset-0` — the package's row-link recipe (`Table.md`). So
the accessible target is the title, not an unlabelled box the size of the row.
`rightSlot` is `relative` and paints above the stretched target, so a control in
it keeps its own clicks.

Without `onActivate` the title is plain text and the row paints **no** hover
surface. A hover surface is a promise, and a row that paints one while doing
nothing is the defect §4 took off `Card variant="outline"`.

## Anatomy

| | |
|---|---|
| Plate | 26rem wide, `max-w-full`, 1px `--stroke-border`, `--surface-card`, radius 10px, `--shadow-overlay-soft`, clipped |
| Header bar | 6 / 8 padding, gap 4 |
| Toggle | 4px left padding, gap 10, Label 14 (500), `--ink-primary`, no hover surface, **inset** focus ring |
| Header glyph | 16px, `--ink-secondary` |
| Chevron | the tertiary `IconButton` recipe at `xs` — 28px box, 14px glyph, `--ink-body`, `--state-hover` under the pointer |
| ✕ | `IconButton variant="tertiary" size="xs"`; no styling of the tray's own, no divider |
| List | top divider, `max-height: 14rem`, 4px padding, `ScrollShadow`, the thin scrollbar |
| Row | gap 10, 8px padding, radius 6 |
| Row glyph | 16px, `--ink-secondary`; 2px down when the row has a second line |
| Title | Body 14, `--ink-body`, truncates |
| Progress | `ProgressBar size="md"` (4px), full row width |
| Error | Body 12, `--fb-red-text`, balanced |
| Description | Body 12, `--ink-secondary`, balanced |
| Right slot | Body 12, `--ink-secondary`, tabular |
| Trailing icon | 16px; 2px down when the row has a second line |

The focus ring is inset rather than the package's usual offset ring: the plate
is `overflow: hidden` so its corners clip, and an outside ring on a full-bleed
bar would be clipped away with them.

There is no `pressed:` on the toggle. `pressed:` also matches
`[aria-expanded="true"]` (SPEC decision 6), and the toggle carries that the
whole time the list is open — the bar would sit permanently on the pressed
fill. The chevron takes the icon-button recipe's `pressed:`, but it is a span
with no `aria-expanded`, so only `:active` reaches it.

## Departures from the kit

**The chevron is inside the toggle.** The kit's header note makes the whole bar
except the ✕ the expand target, with the chevron a state indicator inside it;
its later chevron note puts the chevron in its own `.iconbtn` beside the head.
`ActivityTray` follows the first and draws the indicator with the icon-button
recipe, so it looks like the second.

**A one-line row centres.** The kit's `align-items: flex-start` plus the 2px
nudge is right for a row with a progress bar or a sentence under the title — the
glyph belongs to the first line, not to the block. A row with only a title has
no second line to align away from, and the same two rules would sit the glyph
2px below the text it labels.

**26rem is a width, not a cap.** The kit caps a 100% width at 26rem. Measured
against a shrink-to-fit dock, that let the plate narrow as its rows left.

## Usage

```jsx
<ActivityTray
  headerTitle="1 of 3 uploads failed"
  headerIcon={<CircleAlert aria-hidden />}
  onDismiss={dismiss}
>
  <ActivityTrayItem
    icon={<FileText aria-hidden />}
    title="giffycanvas.gif"
    trailingIcon={<CircleCheck aria-hidden className="text-fb-green" />}
  />
  <ActivityTrayItem
    icon={<FileText aria-hidden />}
    title="dataset-full-export.csv"
    errorText="The file is larger than the 25 MB limit"
    rightSlot={
      <LinkButton asChild>
        <button type="button" onClick={retry}>Retry</button>
      </LinkButton>
    }
    trailingIcon={<CircleAlert aria-hidden className="text-fb-red-text" />}
  />
</ActivityTray>
```

While a row is moving, it takes a progress bar:

```jsx
<ActivityTrayItem
  icon={<FileText aria-hidden />}
  title="quarterly-report.pdf"
  hasProgress
  progress={62}
  progressLabel="Uploading quarterly-report.pdf"
  rightSlot="62%"
/>
```

Open state is the plate's own unless you pass `open` — `defaultOpen` seeds it,
and `onOpenChange` reports every toggle either way.
