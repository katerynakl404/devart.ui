# Design-system changes found while building on it

Every change here was made to **`@devart/ui-react` itself**, not to a page, and
every one was found the same way: by assembling a real screen out of real
components. In Storybook a component stands alone. On a page it stands next to
others, and that is where states, sizes and colours drift apart.

It is kept as its own file rather than inside each component's `.md`: component
sources are periodically refreshed from upstream, and anything written into them
is lost on the next sync.

## The constraint that shapes all of this

**Two products share one library**, and a change that fixes one and breaks the
other is not a fix. Section 9 is a worked example of that mistake — made,
caught, and corrected.

The sidebar is the web shape and only that: the product mark, the name and the
collapse control live in it, because a browser tab is no place for them.

---

## What changed

One row per section. `draft` means the thing is new and has not been signed
off — nothing should be built on it yet.

| § | Component | Change |
|---|---|---|
| §1 | `Button` | a neutral label under a red border |
| §2 | `tokens` | dark destructive border — hover made the control *less* visible |
| §3 | `Autocomplete` | selected and highlighted painted the same |
| §4 | `Card` | `outline` — the hover border tint is gone |
| §5 | `tokens` | no token for a standalone icon — new `--ink-icon` / `--ink-icon-hover` |
| §6 | `TableHead` | the sort glyph did not hover with its label |
| §6a | `Table` | interaction states were absolute colours, and two were the same colour |
| §7 | `InputGroupAddon` | resized glyphs it did not own |
| §8 | `TabsContent` | the inactive panel came back as an empty box |
| §9 | `InputGroup` | a field label as loud as the hint beneath it |
| §10 | `SidebarHeader` | lost its horizontal inset |
| §11 | `SidebarMenuButton` | rendered tooltips with no styling at all |
| §12 | `SidebarMenuButton` | a 32px box its own padding did not fit |
| §13 | `Tooltip` | the arrow put the gap off the 4px scale |
| §14 | `Sidebar` | collapsing could remove the only way to expand |
| §15 | `PageHeader` | a page title with a back arrow was hand-assembled on every page, differently each · **draft** |
| §16 | `PageHeader` | the title row: back control, h1, badge slot, actions · **draft** |
| §17 | `ConnectorLogo` | 23 connector marks as data-URIs, with a monogram fallback · **draft** |
| §18 | `StatusView` | `EmptyStateIllustration` |
| §19 | `tokens` | a variant that is not enumerated is never compiled |
| §20 | `Sidebar` | and `pnpm check-bundle-css` |
| §21 | `Badge` | the hairline is the default, not a second variant |
| §22 | `Sidebar` | five controls still fade at `opacity-50` |
| §23 | `Toast` | has no width, so Sonner's does |
| §24 | `Sheet` | the default side is the one without a border |
| §25 | `Button` | a brand label on the neutral tertiary pill · **draft** |
| §26 | `Tabs` | no flush tabset, so two rules stack |
| §27 | `Sidebar` | no badge or counter on a nav row |
| §28 | `InputGroup` | the search clear button is a recipe, not a part |
| §29 | `Datepicker` | one bespoke focus ring, not three missing states |
| §30 | `TextArea` | counter — one ink step too loud |
| §31 | `Toast` | the toast close button is off the 24px ladder |
| §32 | `tokens` | one of the three "unrelated" ones is not |
| §33 | `Badge` | the hairline is the base, not a second variant |
| §34 | `PopoverContent` | a closed panel stayed painted |
| §35 | `Sidebar` | the fixed panel was pinned to the viewport |
| §36 | `StepperIndicator` | ships **no rail** — so every consumer draws its own numbered circles out of raw · **draft** |
| §37 | `StepperIndicator` | the numbered rail the headless Stepper never shipped · **draft** |
| §39 | `SidebarMenu` | nav rows 4px apart where the kit says 2 |
| §41 | `TextArea` | the counter row had a slot nothing could fill |
| §43 | `DropdownMenu` | two kinds of row it could not draw · **draft** |
| §45 | `InputGroupAction` | the trailing control of a field: · **draft** |
| §46 | `InputGroupAction` | a field’s trailing control: 24px box, no surface, colour-only hover · **draft** |
| §47 | `Link` | the kit’s text link, which the package never had · **draft** |
| §48 | `StatTile` | label / value / caption — one number and what it counts · **draft** |
| §49 | `CodeBlock` | a snippet and the control that copies it, as one object · **draft** |
| §50 | `TableCell` | pressed belonged to whatever was pressed |
| §51 | `StatusView` | the illustration is a pack, not a rule — **revised** |
| §52 | `MetaRow` | the line above a list — "5 connections · Select all", and the Delete that · **draft** |
| §53 | `MetaRow` | the line above a list, and the 4px to it, stated once · **draft** |
| §54 | `TableRow` | nesting was a number one table owned |
| §55 | `DropdownMenu` | a link may open a menu · **draft** |
| §56 | `DropdownMenu` | a link may open a menu · **draft** |
| §57 | `Table` | `density` — a compact row step · **draft** |
| §58 | `DataSourceCard` | the tile could be narrower than its own action |
| §59 | `Card` | one elevation recipe instead of two copies |
| §60 | `Card` | two variants had no box, and one had a shape a card cannot take |
| §61 | `DataSourceCard` | the popular flame is gone |
| §62 | `Autocomplete` | the clear and the chevron painted as placeholders |
| §63 | `Tooltip` | the delay before it opens |
| §64 | `SidebarContent` | the nav column had no gutter |
| §65 | `Badge` | a fixed-height pill whose label could wrap |
| §66 | `Button` / `IconButton` | a switched-off control lit up under the pointer |
| §67 | `PageHeader` | `condensed` — the state a sticky header takes once the page scrolls · `draft` |
| §68 | `SidebarBrand` | the collapsed state was undefined |
| §69 | `AccordionTrigger` | `size` — a trigger that is a section heading · `draft` |
| §70 | `TextArea` | the hint under a field was 500, and nothing asked for it |
| §71 | `Modal` | `size="xl"` — a dialog holding a tree, not a form · `draft` |
| §72 | `Sidebar` | the collapsed rail — no tooltips, a 500ms delay, a leaning header |
| §73 | `SegmentedControlTrigger` | `tone` — a selected half that means included or excluded · `draft` |
| §74 | `DropdownMenuContent` | the focus ring left on a trigger after the menu was closed with the mouse |
| §75 | `toast` | a stack of toasts, each a different width |
| §76 | `TableRow` | a row that declares itself clickable kept the text cursor |
| §77 | `DataSourceCard` | the one control on the tile could not be hovered |
| §78 | `Card` | `variant="row"` stated its height as a ceiling as well as a floor |
| §79 | `UploadTray` | **new** — the upload plate production raises on /files · **draft** |
| §80 | `Button` / `IconButton` | a disabled `secondary` still had a surface — white, and invisible only on white |
| §81 | `Banner` | the dismiss was a tertiary button on a painting |
| §82 | `Pagination` | a stream read in order has no use for page numbers · **draft** |
| §38 | `StepSlider` | four measurements against a spec that argues for each one |
| §40 | `tokens` | the size ladder |
| §42 | `TableCell` | a row that could not grow, under a comment saying it could |
| §44 | `DropdownMenu` | two rows a menu could not draw — an accent action and a reading · **draft** |

# Colour and state

## 1. `destructiveOutline` — a neutral label under a red border

`src/components/Button/index.tsx`, `src/components/IconButton/index.tsx`

```diff
- 'border-outlineDestructive-border bg-transparent text-ink-body',
+ 'border-outlineDestructive-border bg-transparent text-fb-red-text',
```

Next to an ordinary secondary button the difference came down to one thin line,
and the control stopped reading as destructive.

`IconButton` shares the variant scale with `Button` by convention but keeps its
own definition, so it needed the same edit — it was missed the first time. Rule:
**every `destructiveOutline` has a red label**, text and icon alike.

## 2. Dark destructive border — hover made the control *less* visible

`globals.css`, `.dark`

Dark inherited the light values as-is: Red-700 at rest, Red-800 on hover. On
white that works — darker reads as more prominent. On the near-black Card
`#17171E` it inverts: **hover dropped contrast 2.76 → 2.15**. It was the only
place in the kit where pointing at a control made it fainter; everything else
goes lighter on dark (`--btn-secondary-border`: Grey-600 → Grey-500, 2.30 →
3.69).

The border had also drifted from its own label: after §1 the dark label is
Red-400, while the frame stayed Red-700 — text lighter than the frame around it.

```diff
- --btn-outline-destructive-border: var(--red-700);       /* #B91C1C */
- --btn-outline-destructive-border-hover: var(--red-800); /* #991B1B */
+ --btn-outline-destructive-border: var(--red-500);       /* #EF4444 — CR 4.74 */
+ --btn-outline-destructive-border-hover: var(--red-400); /* #F25555 — CR 5.27 */
```

Same rule as light — **border = label colour, hover one step more prominent** —
with the direction of the step mirrored because the ground is dark.

> **Revised.** The first fix used Red-400 → Red-300. Red-300 is a pale pink, and
> measured against its own rest state it gave a **×1.79** jump where light rises
> by ×1.22 — the step was correct in direction and far too big in size. Red-500 →
> Red-400 keeps the direction and matches light's proportion. The earlier
> document still quoted the 400/300 pair; it was wrong at the time of reading.

## 3. `Autocomplete` — selected and highlighted painted the same

`src/components/Autocomplete/OptionItem.tsx`

```diff
  'data-[highlighted=true]:bg-state-hover',
- 'aria-selected:bg-state-hover',
- 'aria-selected:text-ink-primary',
+ 'aria-selected:bg-state-pressed',
+ 'aria-selected:font-medium',
+ 'aria-selected:text-ink-highlight',
```

Both states resolved to `--state-hover`, so the moment the cursor entered the
list the current value became invisible — two different states rendered as one.
Selected now takes the step the system already uses for a chosen item, and stays
readable while the pointer is elsewhere.

> Also recorded as **#43** in the Insightis UX audit — `reports/2026-09-04-insightis-ux-audit.md`
> in the **Insightis** project, not in this repository.

## 4. `Card` / `outline` — the hover border tint is gone

`src/components/Card/index.tsx`

```diff
- border border-stroke hover:border-card-border-hover
+ border border-stroke
```

One line against the released library. An `outline` card is a surface, not a
control: it tinted its border toward brand on hover while doing nothing when
clicked, so the tint promised an interaction the card did not have. Cards that
are controls say so — `Card variant="ghost"` is the browse-more tile, and a
clickable row uses the table's own interactive states.

> Filed originally as "a surface that wrongly answered hover **and press**".
> The press half never existed in any published version — it was added and
> removed inside this branch — so only the hover line is a change anybody
> outside it can see.

## 5. No token for a standalone icon — new `--ink-icon` / `--ink-icon-hover`

`globals.css` (Layer 2), `src/lib/constants.ts`

The system had no colour token for a glyph. The ink ladder is primary / body /
secondary / inactive / highlight, and icons simply inherited their container's
text colour.

That is fine for an `IconButton`: it has a box, and hover fills the box. It is
not fine for an icon **without** a box — an ⓘ beside a name, a sort arrow in a
header. There is nothing to fill, so colour is the only thing that can answer the
pointer, and nothing in the system said which colour.

```css
--ink-icon: var(--ink-secondary);        /* #5A6A80 */
--ink-icon-hover: var(--ink-primary);    /* #0F172A */
```

Both alias Layer-2 roles, so neither needs a `.dark` twin. Exposed as
`text-ink-icon` / `text-ink-icon-hover`.

Rule: **a standalone interactive icon changes colour only.** If it also needs a
fill, it is an `IconButton` and should be one.

## 6. `TableHead` — the sort glyph did not hover with its label

`src/components/Table/TableHead.tsx`

```diff
- 'transition-colors hover:text-ink-body',
+ 'group transition-colors hover:text-ink-icon-hover',
```

The label moved to `--ink-body` on hover and the chevrons stayed at
`--ink-inactive`, so a header read as two controls. `group` on the button and
`group-hover:text-ink-icon-hover` on the glyph move them together.

No press state. A sort commits on click and the feedback is the table
reordering; a press colour on a control with no box reads as a flicker.

## 6a. Interaction states were absolute colours, and two were the same colour

`globals.css`, `src/lib/constants.ts`, `src/components/Table/TableCell.tsx`

| theme | `--state-hover` | `--tbl-row-pressed` |
|---|---|---|
| light | `slate-100` = **#F1F5F9** | `surface-card2` = **#F1F5F9** |
| dark | `grey-800` = **#21212C** | `surface-card2` = **#21212C** |

Identical in both themes, so a control's hover inside a selected row painted the
colour already under it — invisible. On prod that was ten ⋮ buttons on one page.

Not a tuning miss: an absolute colour eventually equals the surface it lands on,
and absolute colours cannot stack. A control has no way to be "one step deeper
than whatever is under it".

Each state is now a translucent wash, so states composite. One base and four
strengths per theme; the four state tokens read them, so retuning a theme needs
no `.dark` copy of a state token.

- **`--state-overlay`** — `--brand-300` on light, `--slate-400` on dark. A
  coloured wash over the near-black card reads as a cast, not a lift.
- **4 / 8 / 8 / 12**, one set for both themes: `--slate-400` moves against the
  dark card at roughly the rate `--brand-300` moves against white.
- **`--brand-300` retuned** `#5DA0A8` → `#46A6B9` (190°, 45%), no consumers.
  The old step had the right hue at 29% saturation, and a desaturated wash reads
  dirty rather than soft.
- **`--tbl-row-selected-hover` removed**, with the two `TableCell` utilities
  that named it. A selected row keeps its surface and controls composite on top;
  the old token made a row read as *less* selected the moment you touched it.

Rows are lighter than controls: a row is wide and sits in a stack, where a heavy
wash turns a list into stripes. Inside a row the two composite, so a control on
a hovered row is always the deeper of the pair.

Composited over the card, measured from `globals.css`:

| | strength | light | Δ | dark | Δ |
|---|---|---|---|---|---|
| row hover | `--tint-4` | `#F8FBFC` | 7 | `#1C1D24` | 5 |
| row pressed / selected | `--tint-8` | `#F0F8F9` | 15 | `#21222A` | 10 |
| control hover | `--tint-8` | `#F0F8F9` | 15 | `#21222A` | 10 |
| control pressed | `--tint-12` | `#E9F4F7` | 22 | `#262830` | 15 |

`--tbl-row-pressed` and `--state-hover` are the same declaration on purpose: a
control hovering on a selected row lands at 8% over 8% ≈ 15% and reads a clear
step deeper. A check asserting the four raw values are distinct tests the wrong
thing.

**The Tailwind mapping is the part that fails silently.** A `color-mix()` token
must be exposed as a bare `var()`; wrapped in `hsl(var(…))` it emits invalid
CSS and the declaration is dropped whole. The four state keys in
`src/lib/constants.ts` are bare `var()` for that reason, which also means they
take no alpha modifier.

## 7. `InputGroupAddon` resized glyphs it did not own

`src/components/InputGroup/InputGroupAddon.tsx`

```diff
- xs: '[&_svg]:size-4',  sm: '[&_svg]:size-5',  md: '[&_svg]:size-5',
+ xs: '[&>svg]:size-4',  sm: '[&>svg]:size-5',  md: '[&>svg]:size-5',
```

A descendant selector reaches into every control nested in the addon and
out-specifies its own size step. The rule now means what it was meant to mean:
the addon sizes **its own** decorative glyph; a nested control sizes its own.

### The "before", measured rather than remembered

An earlier draft of this section described the old behaviour from the diff and
got it wrong in the detail. Measured in the published Storybook
(`origin/master`, the pre-audit baseline), `PasswordInput` rendered:

| field | leading `Lock` | trailing `Eye`, inside an `IconButton` |
|---|---|---|
| xs · 28px | 16 | **18** |
| sm · 32px | 20 | **18** |
| md · 36px | 20 | **18** |
| lg · 40px | 20 | **18** |
| xl · 44px | 20 | **18** |

Two things follow, and neither is what the first draft said.

**The leading glyph carried no override at all.** It tracked the addon's ladder
exactly — 16 at `xs`, 20 everywhere else — because it is a direct child and the
addon was entitled to size it. Nothing was fighting there.

**The trailing glyph was pinned to 18px with `!important`** — `!size-[1.125rem]`
on both `Eye` and `EyeOff`. That is the real cost of the descendant rule: a
nested control could not state its own size, so the only way out was `!` plus a
literal. And 18px is on **no** ladder — not the old 16/20, not the kit's
14/16/16/20/24, not anything. It was chosen to sit between the 20px lock and
whatever looked balanced, which is what a workaround looks like when the system
gives you no step to ask for.

So the field's two glyphs disagreed at every size except one, and the disagreement
was invisible in review because both halves looked deliberate: one followed a
ladder, the other was explicitly pinned.

> The earlier text claimed "three `!size-4`" and a clear button rendering 20px.
> The overrides were one `!size-4` and two `!size-[1.125rem]`, and the trailing
> glyph measured 18px, not 20px. Corrected against the published build rather
> than the diff — the diff shows what changed, not what rendered.

### It took two more passes to actually finish

Removing the `!` marks was necessary and not sufficient. The lock then followed
the addon (correct), while the toggle fell back to whatever the nested
`IconButton`'s own `size` prop said — a hardcoded `sm`, so 16px at every step.
The two ends of the field still disagreed, just less visibly.

The ladder is only shared once the size is passed **to the button** rather than
written on the icon (§44): a class on the glyph loses to the addon's child
selector in one direction and to the IconButton's own descendant selector in the
other, so the icon's own `className` was never going to decide anything.

## 8. `TabsContent` — the inactive panel came back as an empty box

`src/components/Tabs/TabsContent.tsx`

```diff
+ 'data-[state=inactive]:!hidden',
```

Radix hides the inactive panel with the `hidden` attribute — a UA-stylesheet
`display:none`, which any display class from the consumer (`flex`, `grid`)
beats. The panel came back as an empty block and pushed the active one down.

## 9. A field label as loud as the hint beneath it

`src/components/InputGroup/index.tsx`, `src/components/TextArea/index.tsx`

```diff
- textColor="secondary"
+ textColor="body"
```

Label and helper both resolved to `--ink-secondary`; only weight separated them.
A hint as loud as the label it belongs to stops being subordinate to it.

The hint was **not** moved down instead: `--ink-secondary` is its role, and the
step below (`--ink-inactive`) is the placeholder/disabled role — a hint rendered
in it says "this field is switched off". Moving the label up gives the pair a
clean step of hierarchy with no new token.

---

# The sidebar

## 10. `SidebarHeader` lost its horizontal inset

`src/components/Sidebar/SidebarHeader.tsx`

The header had been changed from `flex gap-2 p-4` to `flex flex-col gap-0 pt-3
pb-2` — all horizontal padding removed — on the theory that rows inside would
carry their own inset via the new `SidebarBrand`. The docstring stated it as a
rule: *"Put `SidebarBrand` inside rather than laying the row out by hand."*

Measured on the Connections page: the brand mark sat at **x = 0**, flush against
the rail edge, while every navigation icon below sat at **x = 16**. The page lays
its header row out by hand, as most consumers do, so the inset did not exist.

**Why this is a library defect, not a page defect.** The component became unsafe
by default. Nothing errors; a consumer who has not read the docstring gets a
broken rail. A rule that must be known to avoid breakage is the same class of
failure as the token invariants in `SPEC.md` — a wrong pixel, never an error.

The inset is back on the header: `ps-4` puts a leading icon on the same 16px line
as the navigation icons, `pe-2` matches the nav container so a trailing collapse
button lines up with the menu edge. `SidebarBrand` drops its own copy so nesting
does not double it. A row that genuinely needs the edges opts out with `-ms-4
-me-2` — the rarer case, and one that fails visibly rather than silently.

## 11. `SidebarMenuButton` rendered tooltips with no styling at all

`src/components/Sidebar/SidebarMenuButton.tsx`

In the collapsed rail the labels showed as loose text floating over the page.
Measured, not guessed: the tooltip carried `className: ""` and
`background-color: rgba(0, 0, 0, 0)`.

The component imported `Tooltip`, `TooltipContent` and `TooltipTrigger` from
`@radix-ui/react-tooltip` — the **raw primitives** — instead of from `../Tooltip`.
Radix ships behaviour, not appearance: no bubble, no arrow, and no portal
container. The last part matters beyond looks — `TooltipContent` is what honours
`PortalContainerProvider`, so a sidebar tooltip was also ignoring scoped theming
and portal retargeting that every other tooltip respects.

Not configurable, and should not be: a sidebar tooltip has no reason to look
unlike every other tooltip in the system.

## 12. `SidebarMenuButton` — a 32px box its own padding did not fit

The account avatar was visibly clipped on its right side in the collapsed rail.

Collapsed, the component forces `!size-8` — 32×32 — while the consumer keeps
`px-2`, leaving **16px** of usable width. A 16px navigation icon fits exactly,
which is why this surfaced on the 28px avatar and nowhere else; the overflow was
then cut by the component's own `overflow-hidden`. The trap was already known in
one place: the `lg` size carried `group-data-[collapsible=icon]:!p-0`, the
default size did not.

**The second half of the same defect.** Adding `justify-center` alone did
nothing, because the label span was still in the row: `icon + text` is wider than
32px, so the content overflowed and centring was meaningless — the icon stayed
pinned to the left edge.

Three parts, all in the component: `!px-0` so the 32px box is usable,
`justify-center` to replace the alignment the padding provided, and
`[&>span:last-child]:hidden` so the label goes with it. That selector is the one
the neighbouring truncate rule already uses, chosen for what it does *not* match:
a nav row is `icon, span` so the label matches, while the footer row is `avatar,
span, chevron` — the span is not the last child, so an avatar-led row is left
alone rather than blanked.

Verified: every mark centres at **24** regardless of its own size — 16px icons,
the 28px avatar, and the window-bar logo.

## 13. `Tooltip` — the arrow put the gap off the 4px scale

`src/components/Tooltip/TooltipContent.tsx`

Radix's default arrow is 10×5 and is drawn **into** the `sideOffset` gap rather
than beside it. The distance a reader sees is `sideOffset - arrowHeight` = 8 − 5
= **3px**; neither 5 nor 3 is on the 4px scale. The arrow is now **8×4**, putting
the tip exactly 4px from the trigger — all three numbers on the grid.

**A second cause, in the consumer.** Radix measures `sideOffset` from the
trigger, not from the glyph inside it. An icon-only trigger left as a plain
inline `<span>` grows to the line box — **20px around a 14px icon** — so the tip
drifted a further 6px. `inline-flex` makes the box hug the icon.

That half is not fixed in the package because the trigger belongs to the
consumer, but it is a consequence of a package decision:
`.design-sync/tailwind-export.css` overrides preflight with `svg { display:
inline-block }`. That is one of the two reasons a component can behave
differently in a bundle than in Storybook — see §20.

## 14. Collapsing could remove the only way to expand

`src/components/Sidebar/Sidebar.md`, shell example

Reproduced on the prototype: with `collapsible="icon"` and the trigger inside
`SidebarHeader` under `group-data-[collapsible=icon]:hidden`, collapsing leaves
**no control on screen that can expand it**. There is no expand-on-hover in this
package, and the doc's shell example did not include `SidebarRail` — so an app
that copied the doc inherited the dead end.

New rule, plus `SidebarRail` in the example: a `SidebarTrigger` may not be the
only way back if it hides when collapsed. Either render the rail, keep the
trigger visible, or move it outside the sidebar entirely — a page
header — where collapsing cannot take it away.

---

# New in the system

## 15. `PageHeader` · **DRAFT**

`src/components/PageHeader/index.tsx`

A page title with a back arrow was hand-assembled on every page, differently each
time. Now a component with fixed metrics: the arrow glyph is 20px and sits 8px
from the title, not the 12px used between the rest of the row — at 12px the arrow
visually detaches from the text it belongs to.

It later gained a **`badge` slot** inside the title cluster. The component had
`leading` (before the arrow) and `actions` (pushed to the opposite edge), and a
badge that belongs to the title — the source a form connects to, an environment
tag — fits neither: in `actions` it lands at the right edge and reads as one more
control next to Save. The badge renders right after the `h1`, at the same `gap-2`
the arrow uses, for the same reason.

```jsx
<PageHeader
  title="Connect to DB2"
  onBack={…}
  badge={<Badge variant="secondary" leftSlot={<ConnectorLogo connector="DB2" size="2xs" />}>DB2</Badge>}
/>
```

## 16. `ConnectorLogo` · **DRAFT**

`src/components/ConnectorLogo/` + `scripts/gen-connector-logos.mjs`

Connector marks are embedded as data-URIs: nothing is fetched at runtime, so a
logo cannot arrive as a broken image in a consumer's build, in Storybook, or on a
design canvas. An unknown connector renders a monogram, not an empty square.
Names resolve loosely — `PostgreSQL`, `postgresql`, `Postgres` all find the same
mark — so a page never needs to know the slug.

The pack is deliberately small: it is generated from the app's SVG folder by a
script, so extending it is a re-run, not a code change.

## 17. `TextArea` character counter

`src/components/TextArea/index.tsx`

There was none, so pages wrote it by hand: "0 characters / 4000 max".

```tsx
<TextArea label="AI instructions" maxLength={4000} showCount />
```

- **Digits only — `0/4000`.** A worded phrase reads as a sentence, and a screen
  reader re-reads it on every keystroke. `0/4000` is a readout: the eye catches
  the changing number without parsing words around it.
- `tabular-nums`, so the number does not jitter as digit widths change.
- Error text and counter share one line under the field — both describe the same
  field, and a separate line would shift the next field down on every appearance.
- Works controlled (measured from `value`, so a programmatic change updates it)
  and uncontrolled (`defaultValue` plus internal state).

## 18. `StatusView` — `EmptyStateIllustration`

`src/components/StatusView/index.tsx`

`StatusView` offered only a lucide glyph in a tinted halo, which at page scale
reads as a notification icon rather than an empty region.

The new export is a 150×104 SVG: a crisp top card fading into two ghosts — the
shape of the very list that is missing. Deliberately not a magnifier: "nothing
found" is already said by the title, and a magnifier repeats it while saying
nothing about *what* is absent.

Every colour is a token (`--surface-card`, `--stroke-border`, `--ink-inactive`),
so it re-themes with the page and needs no dark variant. Use it as
`icon={<EmptyStateIllustration />}` with `withIconHalo={false}`.

---

# Documentation that was missing or wrong

These are not code changes. Each is a place where every page was inventing its
own answer, which is how two products drift apart without either being "wrong".

- **`Card.md` — `ghost`.** ~~Documented as a drop target.~~ **Withdrawn.** The
  doc and the implementation did disagree, but the correction went the wrong
  way: `ghost` is the dashed *"browse more" tile* — `Card.stories.tsx` has
  always called it that, and `CardIcon variant="ghost"` is its centred dashed
  icon well, which is not the anatomy of a drop target. A dashed edge in this
  system means *nothing here yet*; sometimes that empty thing accepts a drop and
  sometimes you click it. `Card.md` now says so, and `DropZone` (§32) is the
  component that owns the drop case.
- **`Table.md` — the empty state.** The doc asked for "a single row with
  `colSpan` and `h-24 text-center`" and stopped, so every page improvised. Now
  specified: `StatusView` with `surface="embedded" tone="transparent"` in that
  row, `py-12` on the cell, and three things spelled out — the empty state lives
  *inside* the table so the header and toolbar stay put; a first run and a
  filtered miss are two different texts; both carry an action, because an empty
  state is never a dead end.
- **`Switch.md` — which size where.** Both sizes existed (`default` 36×20, `sm`
  28×16); what was missing was the choice. In a table row the default toggle sits
  a step louder than everything around it and pulls the eye off the name it
  belongs to — you end up reading a column of switches instead of a list of
  connections. **`sm` in a table or dense list row, `default` in forms and
  settings.** The doc also covers when a toggle should confirm: only when
  switching **off** has a consequence invisible from where the user stands, and
  then in that direction only — switching back on is its own undo, and a dialog
  in both directions teaches people to dismiss it.
- **`InputGroup.md` — where the clear button goes.** `InputGroupAddon` defaults
  to `align="inline-start"`, so an addon written without an explicit `align`
  lands **before** the input, beside the magnifier. Every search field in the
  prototype had its × there. The documented recipe is `align="inline-end"` with
  `IconButton size="2xs"` — a 24px box and a 14px glyph, the row-action step.
  `InputGroup`'s existing `has-[>[data-align=inline-end]]:[&>input]:pr-2` supplies
  the gap, so nothing else is needed.

---

# Build and tooling

## 19. A variant that is not enumerated is never compiled

`.design-sync/gen-classlist.mjs`

`ds-bundle` — the CSS the products load — is compiled from an enumerated list
of classes, not scraped from the components. A variant missing from that list
produces no rule and no error.

`empty:` was missing, so `empty:pb-0` (§11) worked in Storybook and did nothing
in the products. `empty:pb-0`, `empty:pt-0` and `empty:hidden` are now
enumerated.

## 20. `pnpm bundle` and `pnpm check-bundle-css`

**`pnpm bundle`** runs the six-command chain that used to be typed by hand. The
order is load-bearing — `package-build` reads `dist`, so an edit made after
`pnpm build` never reached the bundle — and a skipped step does not fail:
skipping the Storybook build once dropped `FilterChips` from a bundle that
reported no diagnostics, because the roster comes from the Storybook index.

It decides the Storybook step itself, by diffing the component directories
against what the last bundle holds. `--storybook` / `--no-storybook` override
it; skipping warns if the roster did change.

**`pnpm check-bundle-css`** catches the two ways a component looks right in
Storybook and wrong on a page:

1. Storybook compiles Tailwind from the sources; the bundle compiles from an
   enumerated class list, so a missing class produces no CSS and no error (§19).
2. `tailwind-export.css` overrides preflight with `svg { display: inline-block }`,
   which Storybook does not have. That is what made a tooltip trigger 20px in a
   bundle and 14px under preflight (§13).

It compiles a second stylesheet with the built components as Tailwind's content
and diffs the class selectors, letting Tailwind's own extractor decide what is a
class — a regex first attempt produced 163 false positives from import
specifiers and `data-slot` values. One-directional: the vocabulary is
deliberately wider than what components use.

A class assembled at runtime from a variable is in no compiled text, so this
narrows the gap rather than closing it. The pixel comparison in
`.ds-sync/storybook/compare.mjs` is what would close it.

## The matrix — every component in the Storybook, against the kit

All 44 components the published Storybook exposes, each walked against its kit
section. **✅** the kit is satisfied · **⚠** it is not · **—** the kit has no
counterpart. Where a row says ⚠ the detail is in the numbered section it names;
where it says *undoc.* the package already satisfies the kit but the change is
written down nowhere — that is the coverage audit that follows.

| # | Component | Kit section | Verdict |
|---|---|---|---|
| 1 | `Accordion` | `#accordion` | ⚠ kit calls open/close *"instant … no CSS transition"*; the package animates (`accordion-up/down`). Ratify or revert — Open questions |
| 2 | `Autocomplete` | `#autocomplete` | ✅ highlighted = `State/Hover`, selected distinct (§3) · ⚠ `aria-disabled:opacity-50` (§22) |
| 3 | `Avatar` | `#avatar` | ✅ deliberate divergence: kit says `--brand-primary`, package uses `--avatar-bg` because brand lifts on dark and white initials fell to 3.94:1. In `theme-contrast.md` |
| 4 | `Badge` | `#badge` | ✅ hairline now the base (§21 → shipped in §33) · the `sm` radius is in the archive · glyph 16→14px *undoc.* |
| 5 | `Banner` | `#banner` | ⚠ kit agrees **one** gradient (`.banner-grad`, `--grad-teal-dark`); package ships four (`horizontalWide`, `diagonalAiry`, `diagonalFade`, `horizontalSlab`). Geometry matches — icon 60→40px at `sm`, radius 12px |
| 6 | `Button` | `#button` | ✅ §40 **fixed** — `lg`/`xl` now hold 12px padding and grow the label to 16/18; gap 8, glyph 20/24 · ⚠ §25 `tertiaryBrand` still missing |
| 7 | `Card` | `#card` | ⚠ §32 `Card.md` redefines `ghost` as a drop target · hover/press deliberately removed (§4) · kit's focus + disabled still ⚠ *to define* |
| 8 | `Checkbox` | `#checkbox` | ✅ hover, neutral focus ring, 10×2 indeterminate bar, `aria-invalid` error, `opacity-disabled` — all five |
| 9 | `CircularProgress` | `#circularprogress` | ✅ size 40, stroke 2.5, track `--surface-page`, indicator brand |
| 10 | `Collapsible` | `#collapsible` | ✅ pure Radix re-export on both sides; nothing to diverge |
| 11 | `Datepicker` | `#datepicker` | ⚠ §29 the one focus ring in the package that is not the shared recipe · §22 `opacity-50`. Hover, `today`, `outside` and `disabled` are all present — my earlier "three missing states" was wrong |
| 12 | `DropdownMenu` | `#dropdown` | ✅ 6/12 padding, 8px gap, 16px glyph @1.75, 4-inside-8 radius, disabled = ink only · radius, disabled recipe, focus removal and `portalContainer` all *undoc.* |
| 13 | `File` | `#file` | ✅ 4/8 padding, card surface, medium name, interactive hover/press/focus · all of it *undoc.* |
| 14 | `IconButton` | `#iconbutton` | ✅ `2xs` rung present; §40 **fixed** — glyph now 14/16/16/20/24, the same ladder Button and the field carry |
| 15 | `Input` | `#input` | ✅ §40 **fixed** — padding, field text and glyph now match at all five steps |
| 16 | `InputGroup` | `#inputgroup` | ✅ §40 **fixed** — padding, `sm` text 12→14, addon glyph and the 4px `xs` gap · ⚠ §28 clear button is still a story recipe |
| 17 | `Modal` | `#modal` | ✅ 360/480/576 sizes, 14px radius (filed as a defect, retracted — in the archive), `min-h-0` body, scrim token · footer divider *undoc.* |
| 18 | `Pagination` | `#pagination` | ✅ active = Button `primary`, other pages `secondary`, nav = IconButton `secondary` |
| 19 | `PasswordInput` | `#passwordinput` | ✅ delegates to InputGroup, toggle sits in the field's trailing slot · `Eye`/`EyeOff` were inverted and are now fixed — *undoc.* |
| 20 | `Popover` | `#popover` | ✅ **retracted** — the kit’s base `.pop` is `--surface-page` too; I measured a composed variant by mistake. In the archive |
| 21 | `ProgressBar` | `#progress` | ✅ kit states no component change |
| 22 | `RadioButton` | — | — no kit section. Its raw `opacity-50` was already fixed and is in the audit changeset |
| 23 | `Resizable` | `#resizable` | ⚠ kit draws a 6px handle, the package a 1px line plus a grip; hover/drag tints match exactly. Neither clears 24px — Open questions |
| 24 | `ScrollShadow` | `#scrollshadow` | ✅ size 40 / offset 0 / orientation / visibility; the gradient tracks the surface |
| 25 | `SegmentedControl` | `#segctrl` | ✅ sm 20 / md 32, container tokens, all five states · type 11→12 and 13→14 is the agreed scale winning over the kit's own numbers · new `rounded` axis *undoc.* · list is `inline-flex` where the kit is `width:100%` |
| 26 | `Separator` | `#separator` | ✅ three variants × two orientations · kit's `muted` still ⚠ *optional* |
| 27 | `Sheet` | `#sheet` | ⚠ §24 `side="right"` — the default side is the only one with no edge border · scrim token, card surface and the `2xs` close button all match now, *undoc.* |
| 28 | `Sidebar` | `#sidebar`, `#sidebar-subparts` | ⚠ §27 no menu badge / counter · §22 `opacity-50` and no `Text/Inactive` on disabled · states, insets and sub-parts otherwise match (§10–16) |
| 29 | `Skeleton` | `#skeleton` | ✅ shimmer is the default, pulse and none opt-in, radius `md` |
| 30 | `Spinner` | `#spinner` | ✅ |
| 31 | `StatusView` | `#statusview` | ✅ ladder re-scaled to 32/40/56 circles and 16/24/32 padding, `neutral` halo fixed, `EmptyStateIllustration` (§18) · the rescale is *undoc.* |
| 32 | `StepSlider` | `#stepslider` | ⚠ **new** — four measured mismatches, §38 |
| 33 | `Stepper` | `#stepper` | ✅ headless on both sides; the consumer styles it |
| 34 | `Switch` | `#switch` | ✅ 36×20 / 28×16, `--switch-off-bg` pair, 44×44 hit area, neutral ring, `opacity-disabled` · label ink + disabled treatment *undoc.* |
| 35 | `Table` | `#table` | ✅ 10/16 padding, 12px header, selection holds under the pointer · §42 **fixed** — the cell wraps again, so the row height follows its content |
| 36 | `Tabs` | `#tabs` | ⚠ §26 no flush tabset, so two bottom rules stack · underline, hover, focus and disabled match · kit's counter/badge still ⚠ *to define* |
| 37 | `TextArea` | `#textarea` | ✅ §40 **fixed** — padding at four steps and font at three · ⚠ §30 counter ink still `--ink-secondary` |
| 38 | `Timeline` | — | — no kit section |
| 39 | `Toast` | `#toast` | ⚠ §31 close button off the `2xs` rung · stack gap 8 vs 10 · §23 width **mostly retracted** — a stacked kit toast is 360px, Sonner’s is 356px |
| 40 | `Toggle` | `#chip` | ⚠ §32 `ghost` is `Button`'s removed variant under another name · the kit's chip hover also shifts text to `--ink-primary`; the package only fills |
| 41 | `ToggleGroup` | `#chip` | ⚠ the kit specifies the count as part of the chip (`.chip-n` — 11px tabular-nums, `--ink-inactive`, 70% `--ink-highlight` when active); the package renders it in a story |
| 42 | `Tooltip` | `#tooltip` | ✅ 288px ceiling with `w-max`, 8×4 arrow, Surface/Card ink (§13) |
| 43 | `TruncatedTitleTooltip` | `#truncated` | ✅ default side is now `top` as the kit states, and it inherits Tooltip's surface instead of re-declaring `max-w-52` — *undoc.* |
| 44 | `Typography` | `#typography` | ✅ **fixed in §44** — `label16` added and the 18px rungs taken out again; the named scale and the control ladder now agree |

**Fourteen components need work** — 4, 5, 6, 7, 11, 16, 20, 23, 27, 28, 32, 36,
37, 39, 40, 41, 44, which is seventeen rows and fourteen distinct components once
`Toggle` / `ToggleGroup` and the paired tooltip rows collapse. **Two have no kit
counterpart** (`RadioButton`, `Timeline`). The remaining twenty-eight satisfy the
kit today — but eleven of them only through changes that nobody wrote down.

### Where each says what

Both sides quoted, both addressed. Package lines are this repository; kit lines
are `Insightis/pages/kit-theme.css` — the stylesheet the kit renders from, not
its prose, because on three of these the prose and the stylesheet disagree and
**the stylesheet is what the design actually ships**.

| § | The package says | The kit says |
|---|---|---|
| 25 | `tertiary: cn('border-transparent bg-transparent text-ink-body', 'hover:bg-state-hover', …)` — one tertiary, neutral label<br>`Button/index.tsx:57`, `IconButton/index.tsx:48` | `.btn-tertiary.is-brand{color:var(--brand-primary)}`<br>`.btn-tertiary.is-brand:hover{background:var(--state-hover);color:var(--brand-hover)}`<br>`.btn-tertiary.is-brand:active{…color:var(--brand-press)}` — a second tertiary whose *label* moves<br>`kit-theme.css`, `#button` (kit html 513) |
| 24 | `right: cn('inset-y-0 right-0', 'h-full w-3/4 sm:max-w-sm', /* no border */)`<br>`Sheet/index.tsx:122`<br>…while `top` has `border-b`, `bottom` `border-t`, `left` `border-r` | *"Right · right (default) · `border-l` · slide-from-right"*<br>kit html `#sheet` (2731), side-variants block |
| 26 | `'inline-flex items-center gap-2 border-stroke border-b'` — unconditional<br>`Tabs/TabsList.tsx:17` | `.tabset.var-flush{border-bottom:none}`<br>`kit-theme.css:1206` |
| 27 | no `SidebarMenuBadge` — the string `MenuBadge` does not occur in `src/components/Sidebar/` | `.sbx-nav-item .nav-badge{margin-left:auto;background:color-mix(in srgb,var(--brand-primary) var(--tint-15),transparent);color:var(--brand-primary);font-size:var(--ts-label-s-size);padding:1px 6px;border-radius:var(--radius-full);font-variant-numeric:tabular-nums}`<br>`kit-theme.css`, `#sidebar` (1986) |
| 22 | `'disabled:opacity-50'`, `'aria-disabled:opacity-50'` — `SidebarMenuButton.tsx:59,61`<br>`'aria-disabled:opacity-50'` — `Autocomplete/OptionItem.tsx:52`<br>`'…aria-disabled:opacity-50'` ×2 and `'text-ink-secondary opacity-50'` — `Datepicker/Calendar.tsx:70,75,158` | *"opacity:`--opacity-disabled` (.65) + pointer-events:none — same recipe as Switch / Checkbox / Button"*, stated under `#checkbox`, `#switch`, `#segctrl`, `#tabs`. `--opacity-disabled` is `.65`, not `.5` |
| 28 | `className="group-has-[input:placeholder-shown]/input-group:hidden"` — in a **story**<br>`InputGroup/InputGroup.stories.tsx:210`; `InputGroup/index.tsx` has no `clearable` | `.igrp .igrp-clear{display:none}`<br>`.igrp:has(.igrp-input:not(:placeholder-shown)) .igrp-clear{display:inline-flex}` — in the **component's own stylesheet**<br>`kit-theme.css:2462-2463` |
| 29 | `'group-data-[focused=true]/day:ring-[3px]'`<br>`'group-data-[focused=true]/day:ring-focus-ring-brand/50'` — 3px at 50%, no gap<br>`Datepicker/CalendarDayButton.tsx:74-75` | *"Focus (keyboard) → `--shadow-focus` 2px + 2px gap"* — the ring `focusRing` in `src/lib/utils.ts` now exists to enforce<br>kit html `#datepicker` (3004), day-cell state table |
| 30 | `textColor="secondary"` → `--ink-secondary`<br>`TextArea/index.tsx:256` | `.ta-count{text-align:right;font-size:var(--ts-body-s-size);color:var(--ink-inactive);margin-top:.25rem}`<br>`kit-theme.css:1087` — everything else (12px, right-aligned, 4px above) already matches |
| 31 | `variant="transparent" size="sm"` + the `mt-0.5 text-ink-body` those force<br>`Toast/ToastMessage/index.tsx:100-101` | `.toast-x` is enumerated on the **24px `2xs` rung** — *"the row kebab, `.toast-x`, `.sht-x`"*. `Sheet/index.tsx:186` already took it (`variant="tertiary" size="2xs"`) |
| 32 | `ghost: cn('border-transparent bg-transparent text-ink-body','hover:bg-state-hover active:bg-state-pressed', …)`<br>`Toggle/index.tsx:63` | the same recipe is `Button`'s **`tertiary`**; `Button.md:9` says *"There is **no `ghost`** — use `tertiary`"*. The kit's chip itself is `.chip{height:1.75rem;border-radius:var(--radius-full);border:1px solid var(--stroke-border);background:var(--surface-card);color:var(--ink-body)}` — `kit-theme.css:2706` |
| 32 | `Card.md:14-15`: *"a dashed edge means a drop target, so `ghost` is for an area that **receives something**"* | `Card.stories.tsx:98`: *"Ghost — dashed 'browse more' tile."* — **both are ours**; the doc contradicts the story, and the story is right |
| — | count rendered in a story: `{option.count}` in a plain `<span>`<br>`ToggleGroup/ToggleGroup.stories.tsx:273` | `.chip-n{font-size:var(--ts-label-m-size);color:var(--ink-inactive);font-variant-numeric:tabular-nums}`<br>`.chip.is-active .chip-n{color:color-mix(in srgb,var(--ink-highlight) var(--tint-70),transparent)}`<br>`kit-theme.css:2713-2714` — part of the component |
| 32 | `body16`, `body14`, `body12` · `label14`, `label12`, `label10`<br>`Typography/index.tsx:60-67` | the nineteen include **Body XL 18/28**, **Label 2XL 18/28**, **Label XL 16/24** — kit html `#typography` (311), *"UI text — the 19 named styles"* |
| 38 | track `bg-surface-chips` · dot `size-1` (4px) `bg-ink-secondary` · `w-20` (80px) · hit ring `before:-inset-2` (20×20)<br>`StepSlider/index.tsx:18, 56, 32, 60` | `.stps{height:1.25rem;padding:0 2px;background:var(--surface-card2);gap:.5rem;flex:none}`<br>`.stps-dot{width:6px;height:6px;background:var(--ink-inactive)}`<br>`kit-theme.css:1132, 1140` — and the kit derives its width from content rather than fixing it |
| — | five variants: `default` + `horizontalWide` + `diagonalAiry` + `diagonalFade` + `horizontalSlab`, each repeated across five cva maps<br>`Banner/index.tsx:75-78, 102-105, 115-118, 130-133, 152-155` | one: `.banner-grad{background:var(--grad-teal-dark);border:none}` — `kit-theme.css:1307`, with the comment at `:277` *"override `--grad-teal-dark` per-instance to swap the fill"*. The kit's answer to "four gradients" is one variant and an instance override |

### Two entries above were wrong, and quoting both sides is what exposed them

**`Popover` — retracted, and archived.** I reported the package painting `--surface-page`
where the kit painted Surface/Card. The kit's base popover is
`.pop{…background:var(--surface-page);…}` (`kit-theme.css:2530`) — **the same
token the package uses**. What I actually measured was `#sbx-pop-account`, one of
the two *composed* variants (`.sbx-pop{background:var(--surface-card)…}`,
`kit-theme.css:2058`), because my selector listed three candidates and matched
the wrong one. Those variants are app-level compositions, not the primitive.
`PopoverContent.tsx:31` is correct as written.

**§23 `Toast` width — mostly retracted.** `.toast{min-width:280px;max-width:600px}`
(`kit-theme.css:2596`) is the standalone toast. In the stacking context the kit
constrains it: `.toast-stack{…width:min(360px,calc(100vw - 3rem))}` and
`.toast-stack .toast{width:100%}` (`:2594-2595`). So a stacked kit toast is
**360px**, and Sonner's default is 356px — a 4px difference, not a 244px one.
What survives is the gap: `.toast-stack{gap:.625rem}` = 10px against
`Toaster.tsx:10`'s `gap = 8`.

Both errors came from reading a rendered page instead of the stylesheet, and
both were caught the moment the two sides had to be quoted side by side rather
than summarised.

## 21. `Badge` — the hairline is the default, not a second variant

`src/components/Badge/index.tsx`

The kit defines one token and applies it to every chip:

```css
--badge-border: color-mix(in srgb, currentColor 25%, transparent);
```

Because it mixes from `currentColor`, the border *is* the chip: teal on Primary,
neutral on Secondary, green on Success, red on Error — never a uniform grey, and
never a per-variant token. Measured on the kit, all six rendered badges carry it.
`.badge-flat` is the borderless opt-out.

The package inverted that. Five of seven variants are `border-transparent`, and
the two bordered forms exist as *extra variants* — `brand` and `green` — each
with its own pair of tokens (`--badge-brand-border`, `--badge-green-border`).
There is no `--badge-border`, so `attention`, `success` and `error` have no way
to be bordered at all, and a consumer who wants a bordered secondary chip has to
reach for `brand`, which also changes the fill.

The cost is not decorative, and the Table section of the kit names it: a
Secondary badge is filled with `--surface-card2`, which is what a selected row
lands on. With the hairline the chip stays defined on a hover/selected row; with
`border-transparent` it dissolves into the row, and every table would need its
own context rule to put the edge back.

Shape of the fix: add `--badge-border` (Layer 3, `color-mix` from
`currentColor`), make it the base of `badgeVariants`, and turn `brand`/`green`
into what they actually are — fill choices — with a `flat` variant dropping the
border.

## 22. Five controls still fade at `opacity-50`

The audit produced one unified disabled recipe — `opacity: var(--opacity-disabled)`
(0.65) plus `pointer-events: none` — and the kit repeats it under Checkbox,
Switch, SegmentedControl, Tabs, Button and IconButton: *"same recipe as Switch /
Checkbox / Button"*. Five call sites never took it:

| File | Line |
|---|---|
| `src/components/Sidebar/SidebarMenuButton.tsx` | `disabled:opacity-50`, `aria-disabled:opacity-50` |
| `src/components/Autocomplete/OptionItem.tsx` | `aria-disabled:opacity-50` |
| `src/components/Datepicker/Calendar.tsx` | `aria-disabled:opacity-50` ×2, `text-ink-secondary opacity-50` |

0.50 against 0.65 is a visible step, and it lands on exactly the controls a
keyboard user tabs through fastest. The Sidebar row misses the other half of the
kit's rule as well: *"text `Text/Inactive`, `aria-disabled="true"`"* — the
package only dims.

The Datepicker's third case is different and should not simply be swapped: it is
the outside-month day, which the kit specifies as `text content-secondary` with
no opacity at all.

## 23. `Toast` has no width, so Sonner's does

`src/components/Toast/Toaster.tsx`

The kit's toast is fluid inside a band — measured `min-width: 280px;
max-width: 600px`, with `width: 100%` between them. That band is the whole point:
*"Metric not saved — the alias @mrr_growth already belongs to another metric"* is
a sentence, and it wants the 600.

`ToastMessage` is `w-full`, which is correct, but nothing sets the band. Sonner
owns the width of the `<li>` it renders the message into and defaults it to a
fixed **356px**, so the kit's long toasts wrap into four lines and its short ones
never shrink. The fix is one variable on the `Toaster` (`--width`), not a change
to `ToastMessage`.

Same file, same reason: the kit's stack gap is `.625rem` (10px, measured); the
package passes `gap={8}`.

## 24. `Sheet` — the default side is the one without a border

`src/components/Sheet/index.tsx`, `sheetVariants`

```
top    → 'inset-x-0 top-0',    'border-b'
bottom → 'inset-x-0 bottom-0', 'border-t'
left   → 'inset-y-0 left-0',   'border-r'
right  → 'inset-y-0 right-0'            ← nothing
```

The kit lists all four: *"Right · right (default) · `border-l` · slide-from-right"*.
`right` is the default side, so the drawer most consumers get is the only one
with no edge against the scrim. It is a one-token omission that reads as a
rendering bug on a light theme, where panel and page are both near-white.

## 25. `tertiaryBrand` — a brand label on the neutral tertiary pill · **DRAFT**

`src/components/Button/index.tsx`, `src/components/IconButton/index.tsx`

The kit ships this as `.btn-tertiary.is-brand`, marked **new**, in four rules:

```css
.btn-tertiary.is-brand          { color: var(--brand-primary); }
.btn-tertiary.is-brand:hover    { background: var(--state-hover);   color: var(--brand-hover); }
.btn-tertiary.is-brand:active   { background: var(--state-pressed); color: var(--brand-press); }
.btn-tertiary.is-brand:disabled { color: var(--ink-inactive); background: transparent; }
```

**Shipped.** `Button` and `IconButton` both carry it:

```
border-transparent bg-transparent text-brand-primary
hover:bg-state-hover hover:text-brand-hover
pressed:bg-state-pressed pressed:text-brand-press
disabled:bg-transparent disabled:text-ink-inactive
```

Measured on `Components/Button → Variants`: label `rgb(7 128 126)` =
`--brand-primary`, surface transparent.

The label moves through the brand ramp; the pill and the focus ring stay the
plain tertiary recipe. It exists for standalone brand text actions — the
connection sidepanel's *Test Connection* is the named case — and the kit is
explicit that the global tertiary stays neutral, so this has to be a variant
rather than a redefinition.

This is the mirror of `destructiveTertiary`, which the package already has (§1's
sibling). Both are tertiary ghosts that recolour the label only; shipping one and
not the other is why pages keep hand-rolling a `text-brand-primary` button.

## 26. `Tabs` — no flush tabset, so two rules stack

`src/components/Tabs/TabsList.tsx`

`TabsList` always carries `border-b`. The kit adds `.tabset.var-flush`, which
drops it:

```css
.tabset.var-flush { border-bottom-style: none; }
```

Its reason is the common layout, not an exotic one — tabs on the left, controls
on the right, inside a row that already draws its own hairline. *"Without it the
two rules stack into a 2px edge."* The DS Connections tab row is the shipped
case. A `bordered` boolean variant on `TabsList` covers it.

## 27. `Sidebar` — no badge or counter on a nav row

The kit's row has one, fully specified:

```css
.sbx-nav-item .nav-badge {
  margin-left: auto;
  background: color-mix(in srgb, var(--brand-primary) var(--tint-15), transparent);
  color: var(--brand-primary);
  font-size: var(--ts-label-s-size);   /* Label S — 10/16/500 */
  padding: 1px 6px;
  border-radius: var(--radius-full);
  font-variant-numeric: tabular-nums;
}
```

`src/components/Sidebar/` has sixteen exported parts and none of them is this
one. Every tint it needs is already in the package (`bg-brand-primary/15`,
`text-brand-primary`, `label10`, `rounded-full`, `tabular-nums`), so the part is
assembly, not new tokens — but without it each product invents its own, and the
numeral alignment (`tabular-nums`) is the detail everyone forgets.

## 28. `InputGroup` — the search clear button is a recipe, not a part

The kit reveals the × only when there is something to clear:

```css
.igrp .igrp-clear                                          { display: none; }
.igrp:has(.igrp-input:not(:placeholder-shown)) .igrp-clear { display: inline-flex; }
```

A clear button on an empty field is a control that does nothing, and one keyed to
focus flickers on every tab-through; `:placeholder-shown` keys it to content.

**Downgraded from a gap.** The package reproduces this exactly — as a Storybook
story, not as a component feature:
`group-has-[input:placeholder-shown]/input-group:hidden` on the trailing addon
(`InputGroup.stories.tsx`). Together with the recipe in `InputGroup.md` (where the
button goes: `align="inline-end"`, `IconButton size="2xs"`) the behaviour is fully
specified and reachable.

What is left is a judgement call, not a defect: whether a search field is common
enough to deserve a `clearable` prop rather than four classes at each call site.
The classes are load-bearing and easy to get subtly wrong — the rule needs a
`placeholder` on the input to key off, and a search field without one silently
keeps the button on. That trap belongs in the `.md`, and is not there yet.

## 29. `Datepicker` — one bespoke focus ring, not three missing states

**Mostly retracted.** Filed as "no hover, no today, no disabled" after reading
`CalendarDayButton.tsx` alone. The per-day classes do not live there — they live
in `Calendar.tsx`'s `classNames` map, and all three are present:

```
day:      [&:not([data-selected=true])]:hover:bg-state-hover   ← the kit's State/Hover
today:    bg-state-hover text-ink-primary
outside:  text-ink-secondary                                    ← matches the kit exactly
disabled: text-ink-secondary opacity-50
```

So the kit's three ⚠ *needed* rows are answered. Two real items survive:

**The focus ring is the only one in the package that is not the shared recipe.**
The kit specifies *"Focus (keyboard) → `--shadow-focus` 2px + 2px gap"* — the ring
Button, IconButton, Switch, SegmentedControl and StepSlider all use, and which
`focusRing` / `formFocusRing` in `src/lib/utils.ts` now exist to enforce. The day
button rolls its own:

```
group-data-[focused=true]/day:ring-[3px]
group-data-[focused=true]/day:ring-focus-ring-brand/50
```

3px at 50% alpha with no offset gap. A calendar is precisely where a keyboard
user lives, and it is the one grid where "which cell am I on" is the entire
interaction.

**`disabled` fades at `opacity-50`** — §22, along with the two month-nav chevrons.

`dark:hover:text-ink-primary` on `CalendarDayButton` is also one of the two
`dark:`-class holdouts SPEC lists under *Creating a New Theme*. Now that the light
hover is a token (`bg-state-hover`), that line is the last piece of the day cell
that a third theme would not reach.

## 30. `TextArea` counter — one ink step too loud

`src/components/TextArea/index.tsx`

```diff
- <Typography variant="span" textColor="secondary" …>
+ <Typography variant="span" textColor="inactive" …>
```

The kit: *"`.ta-count`, Body 12 in `--ink-inactive`, right-aligned, 4px above."*
Everything else matches — `text-xs`, `gap-1`, `ms-auto`, `aria-live="polite"`,
digits only. Only the ink step is off, and it is the step that decides whether
the counter reads as *information about the field* or as *part of the field's
content*. `--ink-secondary` is the hint's own colour; §9 moved the label up
precisely so the hint would be subordinate, and the counter should sit below the
hint, not beside it.

## 31. The toast close button is off the 24px ladder

`src/components/Toast/ToastMessage/index.tsx`

The kit's `IconButton` section enumerates what lives on the `2xs` rung: *"the row
kebab `[data-kbp]` (chats, files, metrics, connections, sidebar), `.toast-x`,
`.sht-x`"*. `Sheet` already took it — `variant="tertiary" size="2xs"`, with a
comment saying so. `Toast` did not:

```
<IconButton variant="transparent" size="sm" className="mt-0.5 shrink-0 text-ink-body">
```

`transparent` has no box, so it has no hover pill and no press state; `size="sm"`
is 32px, off the rung; `mt-0.5` and `text-ink-body` are the bespoke corrections
that having neither forces. Matching `Sheet` deletes all three.

---

The fixes are in the source, so both products get them — but propagation is a
**copy, not a subscription**:

- `ds-bundle` must be rebuilt and copied into each product.
- **Insightis' copy is older than AI Connectivity's** and will not pick these up
  until it is re-synced.
- The corporate repository `devart/components/devart.ui.react` has none of this;
  the work sits on `design-sync/insightis-audit` in `katerynak/design-system`.

Any bridge duplicating a fix in a product's own CSS — `_shared/pages.css` carries
a few, each signed with a comment — must be removed once the bundle lands. Left
in place it does not merely duplicate, it **masks**: the next regression in the
library would look fine on the page carrying the override and ship broken to the
one without it.

## 32. `ghost` — one of the three "unrelated" ones is not

`Button`'s `ghost` was removed in favour of `tertiary`, and the changeset says
`Card`, `CardIcon` and `Toggle` keep their own **unrelated** `ghost`. Two of
those are unrelated. `Toggle`'s is the removed variant under another name:

| | |
|---|---|
| `Button` `tertiary` | `border-transparent bg-transparent text-ink-body` · `hover:bg-state-hover` · `pressed:bg-state-pressed` |
| `Toggle` `ghost` | `border-transparent bg-transparent text-ink-body` · `hover:bg-state-hover` · `active:bg-state-pressed` |

Class for class the same, except `active:` where `Button` uses `pressed:`.
`Toggle` sits on the same variant scale, so a consumer reads in `Button.md` that
the name does not exist and finds it on the sibling meaning what it used to.

**To do:** rename to `tertiary`, switch `active:` → `pressed:`.

`Card.ghost` stays: it is the dashed "browse more" tile — an empty slot that
adds the thing the grid is full of — and `CardIcon.ghost` is its icon well.
`Card.md` describes it as a drop target, which is a different component
(`DropZone`); that line is what needs fixing, not the variant.

## 33. `Badge` — the hairline is the base, not a second variant

`globals.css`, `src/lib/constants.ts`, `src/components/Badge/index.tsx`

§21 diagnosed this from the kit and stopped at "shape of the fix". This round
shipped it, because the page could not stop drawing the border by hand until it
did — `.sync-chip` in `_shared/pages.css` was exactly the kit's rule, written
out on the consumer:

```css
.sync-chip { border: 1px solid color-mix(in srgb, currentColor 22%, transparent); }
```

```css
/* globals.css */
--badge-border: color-mix(in srgb, currentColor 25%, transparent);
```

```diff
- 'inline-flex items-center gap-2 border',
+ 'inline-flex items-center gap-2 border border-badge-border',
...
-   primary: 'border-transparent bg-badge-primary-bg text-badge-primary-text',
+   primary: 'bg-badge-primary-bg text-badge-primary-text',
```

`brand` and `green` keep their own opaque border tokens — their fill is opaque
too, so a `currentColor` mix would read differently there. A new `flat` variant
puts `border-transparent` back for a chip on a surface it already contrasts
with.

**Why it is not decoration.** `secondary` is filled with `--surface-card2`,
which is also where a hovered or selected table row lands. On the Last check
column the pill and the row underneath it became one shape on hover. Any table
in either product hits this, which is why the answer is a token and not a rule
in one page's stylesheet.

**Both products.** The border is mixed from `currentColor` at 25% alpha, so it
is per-variant and per-theme by construction and needs no `.dark` twin and no
per-product value. Every existing call site gains a hairline it did not have;
none loses a fill or changes size — `border` was already in the base class, so
the box model is untouched.

## 34. `PopoverContent` — a closed panel stayed painted

`src/components/Popover/PopoverContent.tsx`

```diff
  'data-[state=closed]:animate-out',
+ 'data-[state=closed]:fill-mode-forwards',
  'data-[state=closed]:fade-out-0',
  'data-[state=closed]:zoom-out-95',
```

Measured in the browser with the page's bridge removed: after clicking a second
row's trigger, the first popover held `display: block` and **`opacity: 1`** for
over 700ms before Radix unmounted it — two panels on screen at once, one of them
belonging to a row already left.

The cause is in the compiled rule:

```css
.data-\[state\=closed\]\:animate-out[data-state=closed]{animation-name:exit;animation-duration:.15s}
@keyframes exit{to{opacity:var(--tw-exit-opacity,1); transform:…}}
```

`exit` has only a `to` frame and nothing sets `animation-fill-mode`, so the
moment the 150ms run ends the element **snaps back** to its own opacity and sits
there fully painted until the unmount lands. `forwards` holds the faded-out end
frame instead.

The page's bridge was `[role='dialog'][data-state='closed'] { display: none }`,
which is worse than it looks: `display:none` also stops the animation, and the
`animationend` Radix is waiting on to unmount never fires.

**Both products.** Purely additive — it changes nothing while the popover is
open or opening. The same pattern (`animate-out` with no fill mode) is on
`DropdownMenuContent`, `TooltipContent` and `SheetContent`; none of them was
reported, so they are left alone and noted here rather than changed blind.

## 35. `Sidebar` — the fixed panel was pinned to the viewport

`src/components/Sidebar/index.tsx`

```diff
  'fixed inset-y-0 z-10',
  'hidden lg:flex',
- 'h-svh w-[--sidebar-width]',
+ 'w-[--sidebar-width]',
```

`inset-y-0` already sets `top: 0; bottom: 0`, so the panel's height is its
containing block's height. `h-svh` overrode that with the **viewport's** height,
and the two are the same only while the app shell *is* the viewport.

`position: fixed` resolves against the nearest transformed ancestor, and the
shell that found this had one (`translateZ(0)`), with a bar above it. So
`inset-y-0` was correct and `h-svh` was 40px too tall, which slid the account
row off the bottom edge. The page's answer was an override on a design-system component:

```css
.app-viewport div.fixed.inset-y-0 { height: 100%; }
```

**Both products.** Insightis is a web application with no transformed ancestor
above the shell, so its containing block *is* the viewport and `inset-y-0`
resolves to exactly what `h-svh` was giving it. Nothing changes there. This is
the §8-class check the constraint at the top of this file asks for, and it comes
out clean: one product is fixed, the other is unaffected, because the removed
declaration was redundant in the case that still works.

## 36. New — `StepperIndicator` · **DRAFT**

`src/components/Stepper/StepperIndicator.tsx`

`Stepper` is headless. It owns the index and hands it to a render function, and
ships **no rail** — so every consumer draws its own numbered circles out of raw
utilities. Three of them were doing it: the connections wizard, and the
package's own `Stepper.stories.tsx`, twice over (`StepIndicator` in the story
file was not exported and not reusable). The wizard's version was this:

```jsx
<span className="flex size-5 shrink-0 items-center justify-center rounded-full text-xs …">
```

— a component the system does not have, invented on the page, which is the case
the whole review was about.

```ts
interface StepperIndicatorProps {
  steps: { id: string; label: ReactNode }[];
  current: number;
  orientation?: 'horizontal' | 'vertical';   // default horizontal
  navigable?: 'completed' | 'all' | 'none';  // default completed
  onStepSelect?: (index: number) => void;
  size?: 'sm' | 'md';                        // 20px / 28px marker
}
```

Three states on system tokens: active `bg-brand-primary` + `text-content-on-solid`,
done `bg-state-pressed` + `text-ink-body` and a check glyph, upcoming
`bg-state-disabled` + `text-ink-inactive`.

`navigable="completed"` is the create-flow rule made a prop rather than a
convention every consumer re-derives: going back to correct a port is normal,
going forward is not, because the reason a sequence exists is that the later
steps depend on the earlier ones.

Deliberately **uncoupled from `Stepper`** — it takes `current` and reports a
selection, so it also sits on top of a tab set, which is what the connections
form drives it from.

**Both products.** New surface area, no existing call site, nothing to break.
Insightis gets a rail it does not have to build.

**One defect found while writing it.** The page was passing
`textColor="inactive"` to `Typography`, and there is no such key — the ladder is
`primary` / `secondary` / `light` / `body` / `accent` / … with `light` being
`text-ink-inactive`. `cva` emits nothing for an unknown key, silently, so every
upcoming step label had been inheriting its parent's colour rather than reading
as not-yet-reached. TypeScript catches it in the library; it cannot in a `.jsx`
prototype, which is an argument for the rail living in the library and not on
the page.

## 37. Build — `bg-surface-card/85` is a class that compiles to nothing

`.design-sync/gen-classlist.mjs`

`--surface-card` is an HSL triplet exposed with `<alpha-value>`, so
`bg-surface-card/85` is valid Tailwind. The enumerated class list does not carry
it, the bundle therefore has no rule for it, and the element renders with **no
background at all** — no error, no warning, nothing in `check-bundle-css`,
because the class was never asked for.

This is the §19 failure mode on a different axis: §19 was a *variant* that was
not enumerated, this is a *modifier*. `_shared/card-scrim` writes the mix by
hand for that reason.

Not fixed here, because enumerating an opacity ladder for every colour is a
decision about bundle size rather than a defect: the useful shape is probably a
short list of steps the system actually uses. Recorded so the next person who
finds a silently unpainted element has somewhere to look.

## 39. `SidebarMenu` — nav rows 4px apart where the kit says 2

`src/components/Sidebar/SidebarMenu.tsx`

```diff
- 'flex w-full min-w-0 flex-col gap-1',
+ 'flex w-full min-w-0 flex-col gap-0.5',
```

Reported by eye, confirmed against the kit, which states both halves:

```css
.sbx-nav      { display:flex; flex-direction:column; gap:2px; padding:0 8px 16px }
.sbx-nav-item { height:2rem; padding:0 .5rem; border-radius:.375rem; … }
```

and, in its spacing section, *"Spacing on a 4px step with a **2px fine
sub-step**"* — so 2 is on the scale, not an exception to it. Everything else on
that row already matched: 32px height, 8px inset, 6px radius, 16px glyph.

4px between 32px rows reads as a list of separate buttons; 2px reads as one
navigation block, which is what it is. The difference is small per row and
compounds: seven rows put the account footer 14px lower than the design.

Worth noting **how this was missed**. Both bundles — the one committed and the
one rebuilt — carry `gap-1`, so this is not a regression and no rebuild
introduced it; the value has been wrong since the component was written, and the
kit↔package audit (§21–40) walked components rather than composed screens, where
a 2px difference in a list of seven is what you actually see.

**Both products.** The kit is the shared reference — Insightis' own sidebar is
built from `.sbx-nav`, which is already at 2px, so this moves the package
towards what that product ships rather than away from it.

## 41. `TextArea` — the counter row had a slot nothing could fill

`src/components/TextArea/index.tsx`

`showCount` (§17) draws the counter into a two-column row whose left half only
ever held `errorText`. F-25 in the connections PRD wants a standing caveat
there — *"Do not include passwords, API tokens, or personal data…"* — beside the
counter, and the component had no way to put it there. So the page turned
`showCount` off and rebuilt the row by hand:

```jsx
<div className="-mt-2 flex items-start justify-between gap-4">
  <Typography … className="min-w-0 flex-1">{AI_WARNING}</Typography>
  <Typography … className="shrink-0 whitespace-nowrap tabular-nums">
    {instructions.length}/4000
  </Typography>
</div>
```

Three utilities and a negative margin to reproduce a row the component already
draws, and a counter the component already counts — including the
`aria-live="polite"` the hand-built one lost.

```ts
hintText?: ReactNode;
```

It takes the left half, and **yields it to `errorText` when the field is
invalid**: an error about what you just typed outranks advice about what to
type. That ordering is the reason it is one slot and not two.

**Both products.** Additive; a `TextArea` without `hintText` renders exactly as
before. Any field with a limit and a caveat stops hand-building the row.

## 43. `DropdownMenu` — two kinds of row it could not draw · **DRAFT**

`src/components/DropdownMenu/DropdownMenuItem.tsx`,
`src/components/DropdownMenu/DropdownMenuRow.tsx` (new)

A menu could only draw one kind of row: an item that highlights on hover and
does something when clicked. Two shapes the kit specifies had nowhere to go, so
pages built them out of a `Popover` instead.

**`variant="accent"`** — the one row in a menu that *is* the action, such as
"Choose File" or "Manage Connections":

```
accent: 'font-medium text-ink-highlight'   // + the same hover/pressed as any row
```

Ink and weight, on the same rail as everything else. Not a bordered button: at
4px of menu padding a second edge lands against the divider and outweighs the
list it belongs to. `--ink-highlight` is Brand-600 on light and Tertiary-400 on
dark, so one value holds AA in both.

**`DropdownMenuRow`** — a label with its own control (a switch, a badge, a
counter) or a plain reading. Same `px-3 py-1.5` as an item, so every label in
the menu shares one left edge. **No hover fill, no pointer cursor** — a hover
surface promises the row does something.

`DropdownMenuLabel` is not this: it is the 10px caps heading that captions a
group.

## 45. New — `InputGroupAction` · **DRAFT**

`src/components/InputGroup/InputGroupAction.tsx`

The trailing control of a field: a clear ✕, a password toggle, a unit picker.

A 24px box around the field's own 16px glyph, 8px from the edge, with **no
surface** — no background, no border, no hover pill. The field already owns
hover, focus and press, and a second filled box inside it reads as a control on
top of a control. It answers the pointer with colour instead:
`--ink-icon` → `--ink-icon-hover`.

```css
/* the kit's rule, which this is */
.igrp .igrp-act      { width: calc(var(--icon-md) + 8px); background: none }
.igrp .igrp-act svg  { width: var(--icon-md) }
.igrp .igrp-act:hover{ color: var(--ink-body) }
```

Not `IconButton size="2xs"`: that is the same 24px box with a 14px glyph and a
hover fill, one step small and one surface too many.

**The field yields its inset to it.** `InputGroup` swaps its own `px-3` for
`pe-2` when a `data-slot="input-group-action"` is present — a `has-` selector
rather than a prop, because the markup already says whether there is one.
Without it the shell's 12px and the action's own box stack, and the ✕ sits
further from the border than the glyph opposite it.

Used by `Autocomplete` (§62) and by the search field's clear button (§28).

## 46. New — `LinkButton` · **DRAFT**

`src/components/LinkButton/index.tsx`

The kit ships `.link`; the package did not, so "Permissions →" and "Manage
connections →" were built out of `Button variant="transparent"` — which is a
control with a hit box and a size ladder, dropped into a card heading it then
failed to line up with.

```
text-ink-highlight · font-medium · no underline at rest
hover:underline · text-underline-offset:25% · text-decoration-thickness:1px
font-size, line-height and font-family all inherited
```

The inheritance is the point and is why it is not on the size ladder: a link
belongs to a sentence or to a heading, and a size of its own is a licence to
disagree with the line it sits in. The underline sits a quarter of the font-size
below the baseline so it clears descenders, and is pinned to 1px so it does not
thicken as the inherited size grows — both straight from the kit's note.

Three tones, because the ink has to survive its background: `brand`
(`--ink-highlight`, the default — Brand-600 light, Tertiary-400 dark, AA in
both), `body` (inside copy, highlighting only on hover), `onSolid` (on a brand
fill, where the highlight would vanish). `asChild` renders a router link or a
button in its place.

**Both products.** New surface area; nothing to break. Insightis gets, as a
component, what it has as a class.

**Named `LinkButton`, not `Link`.** It renders an `<a>` but it is a control in
the kit’s sense — it has hover, focus and disabled states and is often not
navigation at all (“Select all”). A bare `Link` in a React codebase reads as the
router’s.

**Two variants.** `standalone` (default) carries no rule until hover — in a
column of row actions a permanent underline reads as a table of contents.
`inline` is for a link inside a sentence, where nothing else marks it: the rule
is always there at **25% of the ink**, and hover brings it to full strength
rather than adding it. Measured: `color(srgb … / 0.25)`, thickness 1px.

## 47. New — `StatTile` · **DRAFT**

`src/components/StatTile/index.tsx`

A workspace's Overview is three numbers — Users, Connections, Queries — each
with a caption above and a sentence below. There was nothing to build them
from, which is how a dashboard ends up with three different number styles on one
row.

```
label        overline · Text/Secondary        what you are looking at
value        title20 (sm) / title24 (md)      the answer
description  body12 · Text/Secondary          why the answer matters
```

The order is the reading, and it is fixed: a tile that puts the number first and
the label under it reads as a score. The value is `tabular-nums`, because a row
of tiles whose digits are different widths shifts every time the data refreshes.

Sizes are the two rungs the other padded surfaces use — `sm` 16px inset, `md`
20px — rather than a ladder of its own. `rightSlot` takes a badge or a trend, so
"3 · 1 not configured" is one tile and not two.

**Both products.** New component, no call sites.

## 48. New — `CodeBlock` · **DRAFT**

`src/components/CodeBlock/index.tsx`

A snippet the user is meant to paste somewhere else, and the button that copies
it, are one object. Separating them is how a page ends up with a copy control
that is not obviously attached to anything, and the MCP setup panel needs four
of these.

`code` is both what is rendered and what is copied, so they cannot drift. The
confirmation is the control itself — the glyph becomes a tick for two seconds —
rather than a toast, which is a page-level interruption for something the user
is already watching happen.

One thing worth knowing: `navigator.clipboard` needs a **secure context**, and a
page opened from the filesystem is not one. The component falls back to the
deprecated `execCommand`, so the button keeps its promise instead of silently
doing nothing. Any product that ships an offline or `file://` surface hits this.

**Both products.** New component, no call sites.

## 49. `AccordionItem` — an item that is its own surface

`src/components/Accordion/AccordionItem.tsx`

```ts
variant: 'divided' | 'standalone'   // default 'divided'
```

`divided` is what it always did: `not-last:border-b`, items stacked inside one
surface. `standalone` drops the rule, for one `Card` per section.

The two are not a style choice. A shut section inside a shared surface reads as
a gap in that surface; a shut section that IS a card reads as a closed object,
which is what it is. Without the variant the consumer cancels the divider with
`border-b-0` on every item — a page overriding a component because the component
has one layout and the page needs two.

**Both products.** Additive; every existing item keeps the divider.

## 50. `TableCell` — pressed belonged to whatever was pressed

`src/components/Table/TableCell.tsx`

```diff
- 'group-data-[interactive]/row:group-active/row:bg-tbl-row-pressed',
+ 'group-[[data-interactive]:active:not(:has(button:active)):not(:has(a:active)):not(:has([data-state=open]))]/row:bg-tbl-row-pressed',
```

`:active` fires while the pointer is held **anywhere inside** the row. So
pressing a toggle, a checkbox, a kebab or a disclosure inside a clickable row
painted the entire row as though the row had been clicked, and an open menu kept
it painted afterwards — the user cannot tell which of the four things they just
pressed, because all four look the same from the row's point of view.

The rule, stated as a product rule during the review: **in a table the click
target is the object, not the row, and the row takes the pressed fill only when
the row itself is what went down.** This is the same guard `Card variant="row"`
already carries (`:not(:has(button:active))`), applied where it was missing.

Hover is left alone: a clickable row answering the pointer is correct, and it is
the press that was lying about what had been pressed.

**Both products.** Strictly narrows when the fill paints; no row loses a state
it should have had.

## 51. `StatusView` — the illustration is a pack, not a rule — **revised**

`src/components/StatusView/index.tsx`

§18 added `EmptyStateIllustration` and read as though the system had picked the
artwork. It had not, and should not: `StatusView` takes whatever goes in its
`icon` slot — a lucide glyph, one of these, or a product's own drawing — and
that was already true before §18.

What was actually missing is that **one picture cannot say two things**. "There
is nothing here yet" and "your search matched nothing" are different states, and
a list that shows the same artwork for both is telling the user the query made
no difference. So the pack is two:

| | |
|---|---|
| `EmptyStateIllustration` | three list rows fading out — the shape of the list that is missing |
| `EmptySearchIllustration` | a search field with a query in it, over two dashed empty rows |

The magnifier in the second one is **part of the depicted field**, not a symbol
standing in for "not found" — which is the objection §18 raised against using a
magnifier as the whole picture, and it still stands.

Every colour is a token, so both re-theme with the page and neither needs a dark
variant.

## 52. New — `MetaRow` · **DRAFT**

`src/components/MetaRow/index.tsx`

The line above a list — "5 connections · Select all", and the Delete that
appears once something is ticked. Every list in both products has one, none of
them came from anywhere, and so no two of them agreed on the distance to the
list underneath.

It is deliberately **not** a toolbar. No background, no border, no card: the
row belongs to the list under it, and a surface of its own turns it into a
strip that sits *above* the list rather than introducing it. Everything in it
reads at one typographic level, so it is one sentence rather than three
controls that happen to share a line.

**The spacing contract is the reason the component exists**, and it has two
halves:

| | |
|---|---|
| the row's own padding | 6px top and bottom |
| **minimum height** | **44px** |
| between the row and the list | **4px**, as a stack gap |
| outer margin | **none** |

A gap on the stack, not a margin on either, and **never both** — a row with its
own padding, a margin under it and a gap around it is three answers to one
question, which is exactly how this distance drifts from page to page.

The 44px floor is not decoration. 44px is the height the row has **with**
actions in it — a 32px `sm` button plus the padding — so the row is already
that tall when empty and the list does not jump the moment a selection appears.
A shorter floor was tried first and did exactly that.

**`onClear` is part of the component, not something each page adds.** A
selection changes what the row says and what the list under it means, so the
row that announces the selection is also the row that ends it; the alternative
is untick-every-row. It renders at the very end, outside `MetaRow.End`,
because everything in that cluster *acts on* the selection and leaving one is
not one of those actions.

**Both products.** New component, no call sites. Insightis has the same row in
CSS; this is where it becomes a part.

## 53. `TableHead` — a column width is a share, not a size

`src/components/Table/TableHead.tsx`

```ts
width?: 'auto' | 'control' | 'actions' | 'sm' | 'md' | 'lg'   // default 'auto'
```

| | |
|---|---|
| `auto` | no width — takes whatever is left. The reading column. |
| `control` | 48px. A checkbox or a single toggle. |
| `actions` | 112px. The row's trailing cluster, matching `TableActionsCell`. |
| `sm` | 12% — a toggle with its label, a short flag. |
| `md` | 16% — a connector mark and a word, a status badge, a timestamp. |
| `lg` | 20% — a count with a disclosure, or text with a control beside it. |

The connections table set five column widths by hand — `w-12`, `w-48`,
`w-44`, `w-52`, `w-28` — because the component had nothing to say about
width, so the page said it. Each of those is a **reservation**: Data source held
192px for a connector mark and one word, Last check held 208px for a badge, and
the Name column — the only one where truncation costs the reader anything —
lived on what was left over. None of them narrowed when the window did.

`sm`/`md`/`lg` are **shares of the table, not sizes**, and that distinction
is the whole reason this ladder is allowed to exist where a pixel ladder is
not: 16% narrows when the table narrows, `w-48` does not. `control` and
`actions` stay in pixels because a checkbox and a row's action cluster each
have exactly one correct size and gain nothing from more.

### The version of this that was wrong, and what it taught

This first shipped as `width: 'auto' | 'fit'`, where `fit` was `w-0` — "ask
for nothing and the table's auto layout answers with your content width". The
argument was right; the mechanism was not. Measured on the page:

- Tables that load, filter or paginate **must** be `layout="fixed"` — it is
  the standing rule in `Table.md`, and it exists because under `auto` the
  columns visibly jump between the empty state, the loading `colSpan` row and
  every page of data. The connections table filters, so it is `fixed`.
- Under `fixed`, the specified widths **are** the algorithm. Content sizes
  nothing, so `w-0` means zero: four columns collapsed to their 32px of
  padding and the Name column took 975 of 1150px.
- `min-width` on a `th` is **ignored outright** under `fixed` — verified at
  three table widths, where columns with `width:5%; min-width:144px` rendered
  46px. So "a percentage with a pixel floor under it" is a floor that never
  holds, and the floor has to be the scroll container's own `min-width`
  instead: one number, in one place, from which every percentage column
  inherits a sensible minimum.

A **share** is what the original argument was reaching for. A share is not a
reservation; it shrinks. The percentages are set from measured content at the
narrowest the table is allowed to be — a 58rem container gives 12% ≈ 111px,
16% ≈ 148px, 20% ≈ 186px, against columns whose widest content measured 102,
142 and 157px.

One thing to know: a `th`'s width is overruled by a body cell that sets one of
its own, so the page's `TableActionsCell className="w-28"` had to go with the
hand-set heads. Stated in `Table.md` rather than discovered twice.

**Both products.** Additive; every existing column keeps `auto`, which is what
it had.

## 54. `TableRow` — nesting was a number one table owned

`src/components/Table/TableRow.tsx`, `src/components/Table/TableCell.tsx`

```ts
nested?: boolean   // → data-nested on the <tr>
```
```diff
  // TableCell
+ 'group-data-[nested]/row:py-2',   // 8px, against a top-level row's 10px
```

A row that belongs to the row above it — a metric under its provider, a schema
under its connection, a child under its group — is 8px where a top-level row is
10px. The number was not new. It existed **once**, as a local override on the
Insightis metrics table (`.mx-metric-child td{padding:.5rem 1rem}`), which is
exactly why it needed moving: a number that lives on one table is a fact about
that table, so every other place that nests rows either invents its own or does
not tighten at all. The contract had already drifted off it — `changes/Table.md`
documented the same cell as `.4375rem` while the CSS said `.5rem`.

**Why 8 and not 10.** A child row set at the same height as its parent reads as
its *sibling*; the tighter rhythm is what says it is one level down. It is
deliberately the only difference — no tint, no smaller type, no separate border.
Those make a child look like a different **kind** of object rather than the same
object nested.

**What the prop does not do.** Horizontal padding is unchanged, and the first
cell's indent stays with the consumer: how far in a child sits depends on what
is in the parent's first cell — a chevron, a logo, both — which the table cannot
know. Locking an indent into the component would be the same mistake one level
up.

`data-nested` rather than a class because the padding lives on the **cells**,
and they read it back off the row through the `group/row` hook the row already
carries for its fills.

**Both products.** Additive; a row without the prop is the row it always was.
Shipped in parallel as `table.tbl tbody tr[data-nested] td` in the kit and
recorded in the prod migration report
(`Insightis/reports/2026-09-19-prod-interaction-states-migration.md`) — zero
visual delta, since the only rows carrying it today already had the 8px.

## 55. `DropdownMenu` — a link may open a menu · **DRAFT**

`src/components/DropdownMenu/DropdownMenu.md`, `changes/Harness.tsx`

**Nothing in the library changed.** `DropdownMenuTrigger asChild` already
accepts any child and `Link` already inherits its font-size from the line it
sits in. What is new is the statement that this is allowed, and the two rules
that go with it — one menu whatever the handle, and the state glyph outside the
trigger, because it marks the row rather than the destination.

**Why it is marked draft.** It is written down for one of three design concepts
for the Connections list. The concept that keeps a Workspaces *column* hangs
the menu off a disclosure control and has no use for this; the concept that
carries the answer as a sentence under the connection's name has no other
handle that fits. If that concept is not chosen the section goes and nothing
else moves, so nothing should be built on it meanwhile.

The storybook harness gained a `draft` state for exactly this
(`changes/Harness.tsx`), distinct from `proposed`: a proposal has not been
made yet, a draft has — what is undecided is whether it gets to stay. It paints
on the attention tokens, which is what this system already uses for "needs a
decision".

**Both products.** Documentation and a storybook state; no component code.

## 56. `Table` — `density` · **DRAFT**

`src/components/Table/index.tsx`, `TableCell.tsx`, `TableHead.tsx`

```ts
density?: 'comfortable' | 'compact'   // default 'comfortable'
```

`compact` is 6px of vertical cell padding against the default 10, and the
header tightens with it (36px → 28). Stamped on the table as `data-density`
and read by the cells, the same mechanism `layout` already uses — the row's air
is a decision about the whole table, and a cell that took its own would let two
columns disagree.

**Why it exists now.** Row density had been sitting in Open questions as an
observation with no argument attached: ours is ~44px, which is web density. The
argument arrived with the audience. AI Connectivity is for technical
administrators, who *scan* a list rather than read it, and four more rows on
screen is worth more to them than breathing room. Insightis' users are asking
questions of data and are better served by the comfortable default — which is
why this is a prop and not a new number for everybody.

**Draft**, for the same reason as §55: it exists for a screen that has not been
chosen yet. Nothing changes for any existing table, since `comfortable` is
what they all render today.

## What this round did **not** change, and why

- **`ScrollShadow` and `scrollbar-gutter`.** The prototype reserves the
  scrollbar gutter on its own scroll container. That is page layout, not a
  component override — and `ScrollShadow` also paints edge shadows the container
  does not want. Left on the page.
- **`DropdownMenuContent` / `TooltipContent` / `SheetContent` exit animations.**
  Same missing fill mode as §34, no reported symptom. Changing three more
  floating surfaces on the strength of one measurement is how a fix becomes a
  regression.
- **`Badge size="sm"` radius.** Archived — the request against `Badge` was the hairline, and this was never part of it.
  Out of scope for a round that was about where components come from.

## 57. `Checkbox` — the tick and the bar were two different weights

`src/components/Checkbox/Checkbox.tsx`, `Insightis/pages/kit-theme.css`

```diff
- <span className="… h-0.5 w-2.5 …" />   /* 2px */
+ <span className="… h-[1.5px] w-2.5 …" /> /* 1.5px */
```

The tick is a 12px lucide glyph at `strokeWidth={3}`; in a 24-unit viewBox that
renders at **1.5px**. The indeterminate mark was not a glyph at all — it was a
`<span>` — and it took `h-0.5`, the nearest step Tailwind offers, which is
**2px**. One control, two states, two weights.

Equalising the numbers was not enough: at 1.5px the bar then read **thinner**
than the tick. A diagonal stroke with a round cap antialiases across more pixels
than a rectangle of the same height, so the two are only comparable if they go
through the same renderer. The bar is now drawn as a stroke — same viewBox, same
`stroke-width: 3`, same cap — with `M2 12h20`, which is 10px long at this size,
the width the bar always had. (Lucide’s own `Minus` is `M5 12h14` = 7px.)

1.5 rather than 2, because the tick’s weight is the one the icon system sets:
it comes from the stroke ladder every other glyph in the package uses, while
the bar’s 2px came from a spacing scale that has no 1.5 step. `h-[1.5px]` is an
arbitrary value on purpose — the alternative is to bend the glyph to the
spacing scale, which would make one checkbox heavier than every icon beside it.

**The kit had the same mismatch**, and for the same reason: its tick is
`<svg width="12" stroke-width="3">` and `.cbx.is-indeterminate::before` was
`height:2px`. Both are 1.5px now.

## 58. `DataSourceCard` — the tile could be narrower than its own action

`src/components/DataSourceCard/index.tsx`

The scrim that reveals **Connect** was `absolute inset-0`, and an absolutely
positioned child contributes nothing to its parent’s intrinsic size. So the
tile’s minimum width was set by a connector name — “DB2” — while the thing that
has to fit inside it is a 104px button. On the narrow steps of the catalog grid
the action reached the tile’s edges, and the first fix was a 16px gutter on the
scrim, which moved the clipping rather than removing it.

The two layers now stack in one grid cell (`[grid-area:1/1]`) instead of one
floating over the other, so the action counts:

| | before | after |
|---|---|---|
| tile min-content width | the connector name | **122px** = the action + 8px either side |
| does the grid respect it | — | `min-w-fit`, because Tailwind’s `grid-cols-N` is `minmax(0, 1fr)` and a track may shrink below its item’s min-content |
| scrim gutter | 16px | **8px**, the kit’s |
| width above the minimum | `w-full` | `w-full` — unchanged, the grid decides |

Measured in `Components/DataSourceCard → CatalogGrid`. 8px rather than 16 is
the kit’s number; the minimum is not a number at all any more but the action’s
own width plus that pair, so a longer `connectLabel` moves it without anybody
editing a constant.

> **Why this is its own component and not a `Card` variant.** `Card` is a
> surface: five variants, all of them a box with padding and a border. A
> catalog tile is a *control* — a `<button>` with a hover scrim, a revealed
> action, a popular badge and a fixed 8rem height — and putting it behind
> `Card variant="tile"` would mean `Card` renders a button for one of its six
> values and a div for the other five. The two do share their lift recipe, and
> that is the part worth keeping in sync by hand.

## 59. `liftOnHover` — one elevation recipe instead of two copies

`src/lib/utils.ts`, `src/components/Card/index.tsx`,
`src/components/DataSourceCard/index.tsx`

The lift — border tints toward brand, shadow grows, box rises — was written out
twice: once in `Card` `elevated`, once in `DataSourceCard`. Three classes each,
and two chances to change the shadow in one of them.

```ts
export const liftOnHover = (distance: 1 | 2 = 1) => cn(
  'transition-[box-shadow,border-color,transform] duration-base',
  distance === 1 ? 'hover:-translate-y-px' : 'hover:-translate-y-0.5',
  'hover:border-card-lift-border hover:shadow-lift-hover'
);
```

The distance is a parameter because it is the one part that legitimately
differs — the kit lifts a catalog tile 1px and a larger card 2px, since the
same travel reads bigger on a smaller box. Everything else is fixed.

`Card` changed behaviour slightly with it: `transition-all` became the scoped
list the tile already used. A card that animates every property also animates
its own content reflowing.

**Not a component.** The two are not the same thing — `Card` is a `<div>`
surface, the tile is a `<button>` with a hover scrim and a revealed action — so
the shared part is a recipe both import, not a base component both extend.

## 60. `Card` — two variants had no box, and one had a shape a card cannot take

`src/components/Card/index.tsx`

**Padding.** `secondary` and `outline` draw `flex flex-col gap-3 p-4`.
`elevated` and `ghost` drew neither layout nor padding — so the card that lifts
on hover was the one every page had to pad itself, and an `outline` card beside
an `elevated` one sat on a different inset. Both now carry the same box.
`ghost` also had `items-center justify-center` with no `flex` for them to act
on; they work now.

**`rounded="full"` removed.** A pill is a shape for something whose height is
its own — a chip, an avatar. On a card it makes the corner radius a function of
how much text the card happens to hold, and the 40px sample in the radius story
showed exactly that. The step was added on this branch, so nothing published
loses it.

## 61. `DataSourceCard` — the popular flame is gone

`src/components/DataSourceCard/index.tsx`

The `isPopular` prop, the inlined `FlameMark` and the 18px ring it sat in are
removed, with the `Popular` story. The tile is a connector and its name; a
second mark on the logo was an editorial signal the catalog does not need.

It also took the last positioned element out of the content layer, which is
what had made the scrim ordering fragile.

## 62. `Autocomplete` — the clear and the chevron painted as placeholders

`src/components/Autocomplete/index.tsx`

Both controls were `IconButton asChild`, which renders the child instead of a
button — so what reached the addon was a bare `<svg>`, and the addon’s rules
read that literally. `[&>svg]:text-ink-inactive` is the DECORATIVE glyph rule,
while `[&>button]:text-ink-secondary` and its hover step matched nothing at
all. Two clickable controls painted at the placeholder step and never answered
the pointer. Measured: `rgb(124 140 162)` — `--ink-inactive`.

Both are `InputGroupAction` now (§45), which is also a real `<button>` under
the `aria-label`: an `<svg>` with a label and a click handler is not a control
to a screen reader. Measured after: two buttons, 24px, `rgb(90 106 128)` =
`--ink-icon`, and no bare `svg` left as a direct child of the addon.

Separate from §22, which lists Autocomplete for a different defect — its
disabled option still fades at `opacity-50`.

## 63. `Tooltip` — the delay before it opens

`src/components/Tooltip/index.tsx`

`TooltipProvider` was a bare re-export of Radix’s, so the delay was whatever
each call site passed: 200ms in `ModalContent` and three stories, 500ms in the
sidebar rail, and Radix’s own 700ms anywhere a consumer forgot.

It now defaults to **300ms**, the kit’s value — `[data-tip]` opens on
`transition: opacity .12s .3s`. At 200 the bubble appears while the pointer is
still crossing the row; at 700 it reads as never coming.

The three 200s are removed so they take the default. The sidebar keeps 500:
there the pointer crosses eight icons on the way to one.

Unchanged, and worth knowing: the bubble itself is not a transition but a
`tailwindcss-animate` keyframe — 150ms `ease`, `fade-in-0 zoom-in-95` plus an
8px slide from the trigger’s side. That 150 is the plugin’s default, not
`--motion-*`.

## 64. `SidebarContent` — the nav column had no gutter

`src/components/Sidebar/SidebarContent.tsx`

```diff
- 'flex min-h-0 flex-1 flex-col gap-2'
+ 'flex min-h-0 flex-1 flex-col gap-2 px-2 pb-4'
```

Nothing between the sidebar edge and a row button supplied a horizontal inset,
so the nav sat on 8px while §10 had moved the brand mark to 16. The catalog
story hid it by giving its own wrapper `p-2`, which meant the story certified a
rail the library does not draw.

Measured after: the row fill starts 8px from the edge and the glyph lands on
16 — the brand mark’s line, and what the product renders.

## 65. `Badge` — a fixed-height pill whose label could wrap

`src/components/Badge/index.tsx`

```diff
  'inline-flex items-center border border-badge-border',
+ 'whitespace-nowrap overflow-hidden',
```

```diff
- <span className="inline-block align-text-top leading-none">
+ <span className="inline-block min-w-0 truncate align-text-top leading-none">
    {children}
  </span>
```

with `leftSlot` and `rightSlot` wrapped in `shrink-0` spans, as the dot and the
delete control already were.

Every size sets the height (`xs`/`sm` 20px, `md` 28px, `lg` 32px, `xl` 36px), so a
label that wraps does not make the pill taller — the second line is drawn
outside it, across the border and whatever sits below. Found on a dashboard
tile: `1 not configured` in a 213px tile broke across two lines and the chip
read as a rendering fault.

`Badge.md` already carried the rule in prose — "keep the label to one or two
words; a chip that wraps is a sentence wearing a chip's clothes" — which holds
only while the author can see the narrow case. A three-digit count, a longer
locale or a column the page did not size is exactly where they cannot.

**When a badge does not fit, the one allowed outcome is a truncated label.** Not
a second line, and not text running out over the neighbour: `nowrap` alone would
have swapped one broken frame for another. `overflow-hidden` is what makes the
pill able to give way at all — a flex item's automatic minimum size is its
content width until the item hides its overflow, and then it is 0 — and
`truncate` on the label span puts the ellipsis inside the border. The glyphs
hold their size, so a squeezed chip reads `⚠ Not config…`, never half a glyph.

The ellipsis is a fallback, not a layout: it says the label wants shortening or
the column widening, and a badge whose text can be cut should carry `tooltip`.

## 66. `Button` / `IconButton` — a switched-off control lit up under the pointer

Reported plainly: *"a disabled button cannot hover."* It did. `:hover` matches a
disabled button — it is not focusable and it does not fire, but it is still hit
by the pointer — and each variant's hover recipe was a plain `hover:` utility,
so a disabled Secondary took the hover border and the hover fill and then sat
there looking pressable with an inactive label.

Every variant now switches its own hover recipe off again, at the same
specificity the state deserves: `disabled:hover:*` is `:disabled:hover`, three
compound selectors against `hover:*`'s two, so the disabled recipe wins without
`!important`.

**Not `disabled:pointer-events-none`**, which is the one-line version of this
fix and would have been wrong. A disabled control is exactly the one that needs
a tooltip saying why it is disabled, and a tooltip needs the pointer events it
would have removed — the same reason the `aria-disabled` form of these variants
is the one that carries `pointer-events-none`, where the control keeps focus and
a screen reader reads the reason instead.

`cursor-not-allowed` stays on both forms, and now means something: the cursor is
the only thing that changes under the pointer.

## 67. `PageHeader` — `condensed` · **DRAFT**

A header that stays on screen while the page scrolls spends window on a line
already read. On a 900px window — the minimum this product supports — the
72px header plus a 32px window bar is a fifth of the height, in front of the
form the person came for.

`condensed` is the same row at 40px: `py-2.5` instead of `py-5`, and the `h1`
at `title16` instead of `title24`. The back control, the title cluster and the
actions keep their columns, so it is a shrink and not a relayout — nothing moves
sideways as it changes, which is what would have made it read as two different
headers.

The padding transition is animated (`duration-fast`) because the row is on
screen while it changes; the type is not, because a font-size transition is a
reflow every frame to smooth one 8px step.

**The consumer decides when.** The component has no scroll listener and should
not: which element scrolls is the page's fact, not the header's. A page that
does not scroll has no use for the prop.

**The back arrow steps down with the title.** The docblock's rule is that the
arrow is sized against the TITLE and not against the row, so `condensed` takes
it from a 36px box with a 24px glyph to 32/16 — beside 16px type a 24px arrow
stops reading as the title's own control and starts reading as one that outgrew
it. Measured: full 24px title / 36px box / 24px glyph / 76px header; condensed
16 / 32 / 16 / 52.

Draft because the flow it was built for is a concept: if that concept is not the
one chosen, this state is not needed either.

## 68. `SidebarBrand` — the collapsed state was undefined

The brand row had no answer for `collapsible="icon"`. At 32px wide it cannot
hold a 20px mark, a product name and a 24px control, so all three stayed and the
row overflowed its own column — the mark pushed off the icon grid the navigation
rows below it sit on.

Collapsed, the row now keeps its **trailing control**, centred, and hides the
leading cluster. Which survives is not arbitrary: in that state the control is
what the row is for — it is the way back out of a collapsed sidebar — while the
name is the part the width was taken from. It is the same trade
`SidebarMenuButton` already makes when it drops its label and keeps its icon.

Two classes, on the component rather than on the page:
`group-data-[collapsible=icon]:justify-center` and
`group-data-[collapsible=icon]:[&>*:first-child]:hidden`. They belong here for a
reason beyond tidiness — **a page cannot add them**. The bundle compiles only
the utilities the components name (§19), so a consumer writing
`group-data-[collapsible=icon]:hidden` on its own markup gets a class with no
CSS behind it, which is what the AI connectivity prototype had: labels that were
supposed to disappear when the sidebar collapsed, and did not.

## 69. `AccordionTrigger` — `size` · **DRAFT**

One size, `text-sm`, which is right for an accordion inside a card and wrong for
an accordion that IS the section. In the connection form each settings group is
its own card with the trigger as its heading, so the heading of a section read
one step smaller than the `title16` headings of the sections around it — the
reviewer's note was that the section names had to be *more prominent*.

`size="md"` puts the trigger on `text-base`, matching `title16`. `sm` stays the
default, so nothing that exists changes.

Draft for the same reason as §67: it exists for one concept's form.

## 70. `TextArea` — the hint under a field was 500, and nothing asked for it

Reported as "why is the font still bold". It was: the hint line and the
character counter rendered at `font-medium`, so a sentence of helper text sat
a weight above the body copy around it.

Neither asked for it. Both were written as `Typography variant="span"` with a
`text-xs` beside it — and the legacy `variant` ladder is **`font-medium`
`text-sm`**, so `text-xs` corrected the size and left the weight behind. The
same call would have been right with the named scale, where size and weight
are decided together: `textStyle="body12"` is `font-normal text-xs`.

Both now use it. The error line keeps `font-medium` — that one is deliberate
and matches `InputGroup` — and the two labels keep `weight="medium"`, which
they pass explicitly.

**The general lesson, because this will happen again:** `variant` is the old
prop and every one of its values carries a weight. `variant="span"` reads like
"render a span" and means "render medium 14px". Use `element` for the tag and
`textStyle` for the type, and the two cannot drift.

## 71. `Modal` — `size="xl"` · **DRAFT**

The ladder stopped at `lg`, 36rem, described as "for a multi-step wizard" —
which is a column of fields, the widest thing a form needs. A dialog holding
a **tree** or a **table** is not that: a row of the connection-scope tree
carries a disclosure, a name, a row count and a two-state control, and the
control alone is 150px. At 36rem the table names truncated to one word.

`xl` is 56rem — the same ratio step as 30 → 36 — and still leaves a page
gutter on a 1280px window, which is inside the 900px minimum this product
declares only because the dialog caps at the viewport anyway.

It is a last resort, and the docblock says so: a surface this wide covering
the page is usually the sign that the thing belongs on a screen of its own.
The case for using it has to say why the context behind must not be lost.

`--modal-w-xl` in `globals.css`, `max-w-modal-xl` in the preset, and the class
listed in `gen-classlist.mjs` — a `max-w` the enumeration does not know about
compiles to nothing (§19), and the ladder is enumerated by name.

### And a height it cannot pass

Widening the ladder made the other axis the problem: a dialog holding a tree
grows with its content, and `ModalContent` had `max-h-[90dvh]` — 10% of the
window left over, split between two ends, so on a 900px window the dialog
stopped 45px short of each edge and read as a page with a hairline round it.
A dialog has to be visibly ON something.

`--modal-max-h: 80dvh` in `globals.css`, `maxHeight: { modal: … }` in the
preset, `max-h-modal` on `ModalContent`, and `modal` in the `max-h` cross in
`gen-classlist.mjs`. Measured on a 900px window: 720px, with the tree
scrolling inside its own body. The arbitrary value had to go for the same
reason `max-w-[56rem]` could not stay — `max-h-[90dvh]` is not enumerated, so
it compiled to nothing and the cap was never applied at all.

`dvh`, not `vh`: on a window whose chrome can retract, `vh` measures the
larger state and a dialog sized against it is clipped in the smaller one.
## 72. The collapsed rail was never finished

Reported from the catalog's own `Collapsed Icon` story, where the product name
ran straight across a 48px rail and over the page behind it. Three things, one
cause: the rail had been given its width and nothing else.

**Nav rows had no tooltip.** `SidebarMenuButton` has carried a `tooltip` prop all
along — it renders the label to the side and hides it unless the sidebar is
collapsed — and `SidebarNavigationItems` passed it on none of the three rows it
can render collapsed. So the one state where a row has no label was the state
with nothing to supply one. Every collapsed row now passes its own title.

**The delay was overridden to 500ms.** `SidebarProvider` wrapped the shell in
`TooltipProvider delayDuration={500}`, with no note saying why. The package's
own value is 300, the kit's. A collapsed rail has the strongest claim on the
shorter one: the tooltip there is not extra information about the row, it is the
name of it. The override is gone.

**The header leaned 4px right of its own column.** `SidebarHeader` carries
`ps-4 pe-2` — correct expanded, where the mark lines up with the nav glyphs.
Collapsed, an asymmetric inset in a 48px rail stops being an inset: it put the
surviving control's centre on 28 while every nav glyph below centres on 24.
`group-data-[collapsible=icon]:px-2` makes it the same 8px gutter the nav column
uses. Measured after: both on 24.

**The story was the fourth thing, and it is why none of this showed.** The
catalog's header row was a hand-rolled `div` with its own `px-2` and an `h5`,
not `SidebarBrand` — so it stacked an inset on `SidebarHeader`'s own and had
nothing to hide its label with, which is the overflow in the report. A story
that does not use the part cannot demonstrate the part. It uses `SidebarBrand`
now, with `SidebarTrigger` as the trailing control, which is the shape §68
defined.

## 73. `SegmentedControlTrigger` — `tone` · **DRAFT**

The control had one selected state: a raised card-tone pill. That is right
when the two options are alternatives of the same kind — Read / Read & write,
Light / Dark, Create / Edit — where which half is selected means nothing
beyond "this one".

It is not right when the control states a **fact with a consequence**.
Included / Excluded on a row of a connection-scope tree is the case that
raised it: a column of forty of those is read down at a glance, and with a
neutral pill on every row the reader has to parse the label on each one to
find the exceptions — which is the only reason anybody scans a scope.

`tone="positive"` fills the selected half `--fb-green`, `tone="negative"`
fills it `--fb-red`, both with `--content-on-solid` and no pill shadow. Both
fills are theme-independent, like the destructive button: one green and one
red in both themes, so there is no `dark:` pair to keep in step.

**The tone is on the TRIGGER, not on the control.** Only the option itself
knows whether it is the permissive one; a control-level prop would have to be
told which of its children means "yes". Unselected, both tones are the same
neutral text as any other trigger — the colour is the answer, not the offer.

Listed in `gen-classlist.mjs`, because `CV` carries
`data-[state=open|on|checked]` and not `active`, which is the state Radix Tabs
stamps — a new colour on that state compiles to nothing otherwise (§19).
## 74. The focus ring a closed menu left behind

Reported from the connections list: open a row’s Workspaces menu with the
mouse, close it, and the trigger is left wearing a focus ring — on one row of
a table nobody is navigating with the keyboard, until the next click somewhere
else. It reads as "this row is selected", which is a state that column already
uses for something else.

Radix returns focus to the trigger when an overlay closes, and it has to: a
keyboard user who opened a menu from a row must land back on that row. It does
it with a programmatic `focus()`, and Chrome answers a programmatic focus with
`:focus-visible` — so the ring appears whether or not a keyboard was ever
involved. The browser’s own heuristic is what is wrong here, which is why no
stylesheet can fix it after the fact: by the time the ring is painted, the two
cases are indistinguishable in CSS.

So the component asks the question the heuristic cannot: `lib/focus-modality`
keeps one boolean — was the last interaction this document saw a keystroke or a
pointer — from a capture-phase `keydown`/`pointerdown` pair (modifier-only
presses do not count, or holding Shift before a click would make that click a
keyboard interaction). `DropdownMenuContent` now defaults `onCloseAutoFocus` to
restoring focus **only for the keyboard**; for the pointer it calls
`preventDefault`, which leaves focus where the click put it and no ring. A
consumer’s own handler runs first and its `preventDefault` still wins.

Kept deliberately narrow: this is the surface where it was reported, and the
helper is exported so `Modal`, `Popover` and `Select` can take the same
default when each one is looked at. `Autocomplete` already prevents the
restore outright — which is the right answer for a field that keeps its own
focus, and the wrong one for a menu on a table row.

## 75. A stack of toasts, each a different width

Three "connection OK" toasts from one bulk action stacked in the corner at
317, 296 and 268px — measured — because each one had sized itself to its own
message. Three ragged boxes down the edge of the screen read as three
unrelated events; one column of one width reads as what it is, a log of the
same action repeated.

`Toaster` already declares `--width: 356px`, and sonner applies it to toasts it
styles itself. `toast.custom` — which is how every toast in this system is
built, because the body is our own `ToastMessage` — is `data-styled="false"`,
so it fell through to fitting its content. `createToast` now passes
`style: { width: var(--width) }`, so the Toaster keeps ownership of the number
and an explicit `width` option still overrides it.

## 76. A clickable row kept the text cursor

`data-interactive` on `TableRow` is how a table says a row opens something, and
it already carried three fills: hover, pressed and focus, all painted on the
cells because a `<tr>` background renders under every `<td>`. It carried no
**cursor**. So the one row state whose entire meaning is "this is pressable"
answered the pointer with a text caret: the fill said pressable and the cursor
said selectable text, on the same pixel.

It went unnoticed because consumers documented it as though it were there — the
connections list has a comment promising "`data-interactive` — the hover fill
and the pointer cursor" — and no rule emitted one.

`data-[interactive]:cursor-pointer` on the row, and the class enumerated in
`gen-classlist.mjs`: the `cursor-*` cross there carries `disabled:` and nothing
else, so a `data-[…]` variant of it is never compiled unless it is named (§19).

On the row rather than on the cells, unlike the fills: a cursor is not painted,
so it inherits, and the row is the thing being described.

## 77. The one control on a catalog tile could not be hovered

`DataSourceCard` reveals its `Connect` action on hover inside a scrim, and the
scrim is `pointer-events-none` so the tile itself stays the click target. The
action inherited that, so the only button in the system that stayed completely
flat under the cursor was the one the whole tile exists to offer. Reported as
*"why is there no hover on the buttons"*.

`pointer-events-auto` on the action. It is still not the click target — a
click on it bubbles to the tile, which is the button, and it keeps
`tabIndex={-1}` and stays a `<span>` because a button inside a button is
invalid. All it takes back is the pointer, which is all a hover state needs.

## 78. A list item that could only ever be one line

`Card variant="row"` is the product’s clickable list item, and it carried `h-11`.
44px is right for the row it was drawn from — one line of `text-sm` — but a fixed
height states it as a ceiling as well as a floor, so the first consumer with a
name over a description had two bad choices: clip, or argue the component out of
its own height at the call site. The connection form did the second, with
`h-auto min-h-11 items-start py-3` — three layout classes to undo one.

The size is **padding** now: `px-4 py-3`, and no height at all. One line of
`text-sm` is 20px, plus 12 above and below, is the same 44 — so nothing that used
the row before changes height — and two lines grow to 64 instead of being cut off.
A list item does not know how many lines its consumer has; it knows how much air
belongs around them.

The horizontal inset is its own decision and it is 16, not the 12 the fixed-height
version carried: 12 read as tight the moment the row held two lines, and 16 is
where text starts from the edge in every other card in the system.

Nothing else in the variant changes: the pointer, the hover fill, the focus ring,
the press scale and the `:has()` guard that keeps the press off the card while a
button inside it is pressed or its menu is open are what make this a component
rather than a bordered div, and they are why the call site should not have been
reaching for its own box in the first place.

## 79. New — `UploadTray` · **DRAFT**

`src/components/UploadTray/index.tsx`

The plate production raises on `/files` after an upload — a summary bar that
expands into the per-file list, plus a dismiss ✕. The kit specifies it in full
(`.upl-tray`); the package had nothing, so any page needing it would have built
a card, a header row and a list by hand.

Copied rather than designed. Two parts of the kit's contract are load-bearing
and both are easy to lose:

**The whole bar except the ✕ is the expand target, and the ✕ is its sibling.**
Nesting the dismiss inside the head is invalid markup and unreachable by
keyboard. The chevron is a state indicator only — it flips off the head's own
`aria-expanded`, so the visual cannot disagree with what is announced.

**The plate is positioning-neutral.** A width and a cap, no placement. The page
docks it, the same division of labour `MetaRow` uses, and that is what lets one
plate serve a drawer, a panel and the bottom of a screen.

**Nothing in it is colour-only.** The summary glyph carries the batch outcome —
brand and spinning while uploading, green complete, red failed — and the title
says it in words beside it ("1 of 5 uploads failed"). A failed row says it three
ways: glyph, a 5% red tint, and the sentence in `error`.

**The spinner is a prop: `spinner` (draft, default `true`).** The three
statuses the kit specifies all assume a transfer — something is moving, or it
finished, or it broke — and the glyph for the first of them turns. A batch can
also be open and stopped on the PERSON, and the first such plate outside
`/files` is one: a connection form tracking which workspaces still have no
scope, where nothing advances until somebody goes and sets one. There the
loader promised progress nothing was making and, left on screen, read as an
upload that had hung — the one meaning a spinner must never carry. So the
status stays `uploading` and the turning is what the page decides: same ring,
same place, and the title still counts in words beside it.

A fourth status (`waiting`, still glyph, neutral ink) was tried first and
replaced by this: the fact in question is whether anything is moving, not what
kind of outcome the batch has, and a status is for outcomes.

One deviation from the package's own habits, and it is the kit's reasoning: the
head's focus ring is **inset**. The plate is `overflow: hidden` so its corners
clip, and the package's usual offset ring on a full-bleed bar would be clipped
away with them.

**It can clear itself, and that is a prop rather than a habit.** `autoDismiss`
is off by default: a plate that empties itself is right for a background upload
nobody is watching and wrong for one they are, so the page decides. With it on,
a row that reaches `done` is marked, waits, then fades out taking its own height
with it; when the last row goes the plate follows and `onDismiss` fires. A
`failed` row never retires — it is the only row still waiting for an answer.

Two details there are the kind that pass review and fail in use. Reduced motion
**shortens** the exit rather than removing it, because a row retires on
`animationend` and `motion-reduce:animate-none` would leave every row on screen
for ever. And `animationend` bubbles, so the plate accepts only its own — the
first row to finish would otherwise dismiss the whole plate.

Three classes are enumerated in `gen-classlist.mjs` — `max-w-[26rem]`,
`rounded-[0.625rem]` and the chevron's `aria-expanded` selector. All three are
values the kit states and no scale carries, so nothing derives them and §19
would otherwise ship the plate full-width with square corners.

## 80. A disabled `secondary` still had a surface

`src/components/Button/index.tsx`, `src/components/IconButton/index.tsx`

Reported as 'disable secondary should have no fill'. It had one — just not the
obvious one. The package had already refused the kit's `--state-disabled` here,
on the reasoning that swapping an opaque grey in for the chip's own surface
reads as a different control rather than as this one switched off. What it kept
instead was `--surface-card`: white.

Which is a fill, and a worse one for being conditional on where it lands. On a
white card it is invisible and the argument for keeping it never comes up; on a
tinted surface — a chips row, a banner, a table header — the same disabled
button reads as a white card of its own, switched off and yet the brightest
thing in the row.

Transparent is the one answer that holds on every surface, and it is what
`outline` has always done. The border and the inactive label carry the state.
Measured after: `rgba(0, 0, 0, 0)` with the border at `--btn-secondary-border`
and the label at `--ink-inactive`; `primary` still takes `--state-disabled`,
because a filled button switched off has nothing else to be.

**Still a divergence from the kit**, now a wider one: `.s-disabled.btn-secondary`
paints `--state-disabled`. It is recorded here rather than argued in a class
string.

## 81. `CodeBlock` scrolled with the browser's own bar

`src/components/CodeBlock/index.tsx`

A command wider than the block got a horizontal scrollbar, and it was the
platform's: on Windows a 16px trough with stepper arrows at both ends, drawn
under a block whose own radius is 4px and whose only other control is a 20px
copy button. Every other scroller the package ships is the kit's hairline —
`DropdownMenuContent`, `Autocomplete`'s list, `UploadTray`'s rows all carry
`scrollbar-thin` — so the code block was the one place where a scroller looked
like the operating system rather than like the kit.

It is not a new decision. The preset's own note says `scrollbar-thin` was copied
from `.cl-menu-scroll` / `.cl-mention-list` / **`.cp-code-pre`** in
`kit-theme.css`: the code block is one of the three rules the utility came FROM,
and the React component simply never applied it. One class on the `<pre>`:

```
'scrollbar-thin overflow-x-auto whitespace-pre'
```

10px track, 4px thumb inset by a transparent 3px border, `--stroke-border` at
rest and `--ink-inactive` on hover — the same bar as every menu in the package,
with the hit area a pointer can still find.

## 81. The banner's dismiss was a tertiary button on a painting

`src/components/Banner/index.tsx`

`.banner-close` fills on hover in the kit (`--state-hover`). On the solid
variant that is quiet enough to pass unnoticed; on the gradient ones it is a
pale box sitting on the artwork, and the ✕ stops reading as part of the banner
and starts reading as a control stuck onto it.

It answers with colour now and nothing else — `--ink-icon` to
`--ink-icon-hover` on the solid variant, `--banner-grad-sub` to
`--banner-grad-text` on the gradients. The 32px box stays: it is the hit area,
and a 16px glyph is not one. Measured after: background `rgba(0, 0, 0, 0)` on
both, ink `rgb(90, 106, 128)` solid and white at 80% on the gradient.

Third component on the same rule, after `InputGroupAction` (§45) and
`UploadTray`: an icon docked on a surface that already owns hover does not get
a surface of its own. Deliberate divergence from the kit, recorded here rather
than argued in a class string.

## 82. `Pagination` — a stream read in order has no use for page numbers · **DRAFT**

`src/components/Pagination/index.tsx`

New prop: `showPageNumbers` (default `true`, so nothing that exists moves).

The component always drew the numbered buttons. That is right wherever a page
number is a DESTINATION — a table somebody searches, sorts and comes back to,
where "page 4" is a place you meant to be. It is wrong for a stream that is read
in order. A connection's log is the case that raised it: three pages, three
number buttons, all of them doing what Next does, and the one that is current
doing nothing at all. What keeps the reader's place there is the range beside
the control — *Showing 51–100 of 118* — and what moves it is Prev and Next.

```jsx
<Pagination
  currentPage={page}
  totalPages={pages}
  onPageChange={setPage}
  showFirstLast={false}
  showPageNumbers={false}
/>
```

Pair it with `showFirstLast={false}`: First and Last are jumps of the same kind,
and leaving them in while the numbers go is half a decision.

**Numbering.** §81 is used twice in this file — `CodeBlock`'s scrollbar (landed)
and a `Banner` dismiss written in a parallel session. Two sessions took the next
free number at the same time. This takes §82, and one of the two §81s needs
renumbering by whoever owns the second.

## 38. `StepSlider` — four measurements against a spec that argues for each one

*Kit ↔ Storybook audit, finished after round 4 landed; numbered here to avoid
colliding with it.*

`src/components/StepSlider/index.tsx`

The kit's StepSlider entry is the most closely argued in the whole document: it
builds the control as a member of the Switch family and gives a reason for every
number. Four of them do not match.

| | Kit | Package |
|---|---|---|
| Track fill | `--surface-card2` | `bg-surface-chips` |
| Dot, at rest | 6px, `--ink-inactive` (4px at `sm`) | `size-1` = **4px**, `bg-ink-secondary` |
| Dot, on hover | lifts to `--ink-secondary` | — no hover rule |
| Width, default | **68px** (`2 + 3×1rem + 2×.5rem + 2`) | `w-20` = **80px** |
| Hit area | 24×24 via `::before {inset:-4px}` on a 1rem slot | `before:-inset-2` on a 4px dot = **20×20** |

The thumb is right — `size-4` / `size-3` matching Switch's 16/12px, with
`shadow-thumb`, which is the part the kit cares most about ("the mark grows to
fill its slot and becomes exactly the paired Switch's thumb"). So the family
resemblance holds; the rail it sits on does not.

**The dot colour is the one to fix first, because it collapses two states into
one.** The kit picks `--ink-inactive` deliberately and shows its work: the
obvious family choice, Switch's `--switch-off-bg`, gives *"1.34:1 on the
`--surface-card2` rail (1.10:1 dark)"*, and since the dots **are** the other
steps — the only cue that the control has three positions — WCAG 1.4.11's 3:1
applies to them. Hover then *"lifts one step along the ink ramp → `--ink-secondary`"*.

The package starts at `--ink-secondary`, which is where the kit's hover ends. So
the rest state is one step too loud and the hover step does not exist: pointing
at a dot changes nothing.

**The hit area misses the floor the kit claims it clears.** `before:-inset-2`
expands 8px around a 4px dot — 20×20, under WCAG 2.5.8's 24×24. The kit reaches
24 by insetting 4px around a **16px slot**, not around the mark: *"the slot plus
an invisible `::before` ring clears 24×24 on both axes without changing layout."*
Same trick as `.swt::before`, which the package did implement correctly (§28 of
the kit's Switch entry, `-inset-x-1 -inset-y-3`). The gap is that the dot here is
the mark, not the slot — the constant-slot layer the kit describes was not built,
which is also why the width came out at 80px instead of 68px.

**The track token matters for one reason the kit names.** `--surface-card2` is
*"one notch recessed from the popover's Surface/Card"*; `--surface-chips` is a
step further still. On the composer popover — the shipped consumer — the control
sits on Surface/Card, so the package's track reads as a deeper well than the
design intends, and the 4px dots on it are what has to carry the contrast.

None of these are visible in the published Storybook, which predates the
component's current form; all four were read off the kit's rendered CSS and the
package source side by side.

## 40. The size ladder

**The canonical ladder. Four sources carry this table and must agree:** this
file, `Insightis/reports/2026-09-04-insightis-ux-audit.md` (#15, #36),
`Insightis/reports/2026-09-19-prod-interaction-states-migration.md` and
`Insightis/pages/kit-theme.css`.

| step | height | button padding | field padding | gap | label | glyph |
|---|---|---|---|---|---|---|
| xs | 28 | 8 | 8 | 4 | 12 | 14 |
| sm | 32 | 12 | 12 | 6 | 14 | 16 |
| md | 36 | 12 | 12 | 8 | 14 | 16 |
| lg | 40 | **16** | 12 | 8 | 16 | 20 |
| xl | 44 | **20** | 12 | 8 | 16 | 20 |

The button opens out at `lg` and `xl`; the field family — `Input`,
`InputGroup`, `Autocomplete`, `TextArea` — holds 12px. They share an edge at
`xs`, `sm` and `md`, which is every step the product uses. The gap has three
steps, not two. No half-steps.

### What the package had

| | was | is |
|---|---|---|
| `Button` padding | `px-2.5` = 10 at every step | 8 / 12 / 12 / 16 / 20 |
| `Button` gap | `gap-1.5` = 6 at every step | 4 / 6 / 8 / 8 / 8 |
| `Button` label | 12 at `xs`, 14 above it | 12 / 14 / 14 / 16 / 16 |
| `Button` glyph | 12 at `xs`, 16 above it | 14 / 16 / 16 / 20 / 20 |
| `IconButton` glyph | 16 / 12 / 16 / 20 / 20 / 20 for `2xs`…`xl` | 14 / 14 / 16 / 16 / 20 / 20 |

Only the height was on a ladder. `IconButton` had no glyph ladder at all: 12px
at `xs`, one step *below* the 16px it gave `2xs`.

### The field is built differently from the kit, deliberately

The kit has two field implementations and they put the inset in different
places: `.field` carries it on the shell, `.igrp` carries it on the parts
(`.igrp-add{padding-left:12px}`, `.igrp-input{padding:0 12px 0 8px}`). The
package puts it on the shell in both cases, so one component owns the field
edge. Rendered result is what has to match, and does.

Field text also moved: `sm` 12 → 14, `lg`/`xl` 14 → 16. The `sm` step is a
correction in its own right — the earlier "13 → 14" migration rounded it down to
12, where the kit's `sm` field has always been Body M.

## 42. `TableCell` — a row that could not grow, under a comment saying it could

`src/components/Table/TableCell.tsx`, `.design-sync/gen-classlist.mjs`

Against the published catalog the cell is one clipped line —
`h-9 whitespace-nowrap p-2 text-xs`. This branch had already replaced that with
a scoped truncation rule and a comment claiming it only bit under
`layout="fixed"`; both are quoted below, and the comment was wrong:

```diff
- // Truncate rather than wrap. In an auto-layout table the column just
- // widens, so this only bites under `layout="fixed"` — which is exactly
- // where a long value must not blow its column open.
- 'overflow-hidden text-ellipsis whitespace-nowrap',
+ '[[data-layout=fixed]_&]:overflow-hidden',
+ '[[data-layout=fixed]_&]:text-ellipsis',
+ '[[data-layout=fixed]_&]:whitespace-nowrap',
```

`white-space: nowrap` stops text wrapping whatever `table-layout` is in effect.
Under `auto` the column widened instead and the table scrolled sideways; under
`fixed` it ellipsised. **A two-line cell was unreachable in both modes** — so the
row height was always one line plus padding, never the content.

Twelve lines further down the same file says the opposite:

> Height comes from the padding, never from an `h-*` lock — a two-line cell has
> to be free to grow.

Both comments were in the file at once. The class string won, and nothing
contradicted it, because a row that never wraps looks deliberate.

### What the reference does

```css
table.tbl td { padding: .625rem 1rem; border-bottom: 1px solid var(--stroke-border); color: var(--ink-body) }
```

No `white-space`, no `overflow`, no `text-overflow`. The cell wraps and the row
grows. Truncation exists in the kit twice, and both are opt-ins next to the thing
they affect:

- `.ds-conn-tbl .ds-conn-cell-desc` — the one description column in the
  Connections table, with `max-width:0` to make the ellipsis land;
- `.cp-tbl-scroll table.tbl th, td` — the horizontally scrolling variant, where
  wrapping would defeat the scroll.

### Where the clamp belongs

`layout="fixed"`, and only there. That mode takes its column widths from the
first row and never re-measures, which is the case where a long value genuinely
must not blow its column open — it is also the reason the prop exists (see
`table-composition.md`). The scope is a descendant selector on the `data-layout`
attribute the `Table` root already stamps, so the cell needs no new prop and no
context.

### The enumeration is part of the fix, not an afterthought

`[[data-layout=fixed]_&]:` is an arbitrary variant. Nothing in
`gen-classlist.mjs` generates that prefix, so all three classes are listed by
hand — §19's failure mode exactly: un-enumerated, they compile to nothing in the
`ds-bundle` and a fixed-layout table silently stops truncating, with Storybook
still showing it working because Storybook compiles from source.

### Breaking

A table relying on single-line rows gets taller rows the moment a value wraps.
Two ways back, and the second is the better one: `layout="fixed"` on the table,
or `truncate` on the specific cells that should clamp — which is what the kit
does, and it keeps the decision beside the column it applies to.

## 44. The icon surface

Three things, one of which is the reason the other two would not have shipped.

(A fourth — an ink rule on the leading glyph — is in the archive: it was
invented inside the package and stepped away from the kit.)

### The ladder stops at 20px, and the type at 16px

The kit's `--icon-xl` is 24px. On a 44px field that reads as an icon that
outgrew its control. The ladder repeats at both ends — **14 / 16 / 16 / 20 / 20** —
the way it already repeats 16 across `sm` and `md`.

The type took the same cap: `xl` was 18px, now 16, the same rung as `lg`. So
`Typography` keeps `label16` and the two 18px rungs are gone again.

Changed in three places, because the ladder exists in three: the package,
`Insightis/pages/kit-theme.css` (`.btn-xl`, `.igrp.is-xl .igrp-input`,
`.field.is-xl input`, `.ta.is-xl`) and this file.

`Typography`'s prose scale keeps `text-lg` in `h4`, `h5` and `large` — headings
in running text, not control labels.

### A field's two glyphs were sized by two mechanisms

`PasswordInput`: the leading lock grew with the field, the trailing eye stayed
16px at every step.

The lock is a direct child of `InputGroupAddon`, so `[&>svg]:size-*` reaches it
and beats the `size-4` written on the icon. The eye sits inside an
`IconButton`, which the addon does not reach (§7), and whose own
`[&_svg]:size-*` beats any class on the glyph. Either way the icon's own
`className` did nothing.

Fix: stop writing sizes on icons. The lock carries no size class; the toggle
takes the field's step as the `IconButton`'s `size` prop.

### `xs` field edge — 6px, reverted to 8px

Moved to 6px on the argument that an 8px edge crowds a 14px glyph at 28px tall.
Reverted: `Button` `xs` stayed at 8, so a field and a button beside it stopped
lining up, and the package was the only one of four sources carrying 6. The
ladder has no half-steps.

### The glyph rules were absent from the bundle

`.design-sync/.cache/ds-classlist.txt` contained zero `svg`-scoped classes.
Every glyph rule in the library is a child or descendant selector —
`[&_svg]:size-4` in `Button`, `IconButton`, `Badge`, `File`; `[&>svg]:size-*`
in `InputGroupAddon`; `[&_svg]:stroke-[1.75]` in `DropdownMenuItem` — and the
enumerated vocabulary generated none of them.

So in the bundle no glyph ladder existed, no shrink guard, no menu stroke
weight: every icon fell back to whatever `lucide-react` renders, and nothing
failed. §19 at library scale.

## Raised by the kit ↔ Storybook audit

Three are contradictions **inside the kit**, and the package cannot implement
either side until the design answers:

| | |
|---|---|
| **`--tbl-row-pressed`** | Prose says neutral, `--tint-6` of `--ink-primary`. CSS says `color-mix(in srgb, #07807E 4%, transparent)` — brand teal, off the tint scale. |
| **18px in the type scale** | `Body XL` and `Label 2XL` are 18/28 and on the list of nineteen; the same section lists 18px under *не на шкалі* with migration 18→20. See §44. |
| **Sidebar active ink** | The row table says active is *"`Text/Body` (no brand colour)"*; the Collapsed row two lines down says *"(active = teal icon)"*. The package follows the first. |

Eight more are the kit's own ⚠ markers — agreed to be *needed*, never specified,
so there is nothing to implement yet. Listing them so they are not rediscovered
as bugs:

| Component | What the kit leaves open |
|---|---|
| `Tabs` | tab with a counter / badge |
| `Card` | focus (for focusable cards) and disabled; self-hover on `secondary` |
| `DropdownMenu` | item keyboard focus; item selected / checked |
| `Toast` | pause countdown on hover; focus-visible |
| `File` | disabled; pressed (marked optional) |
| `Separator` | a `muted` variant between `border` and `primary` |
| `Sheet` | surface harmonization — the `Popover` half was retracted (archive), still open in the kit’s own text |
| `Resizable` | the kit draws a 6px handle, the package a 1px line plus a grip; neither clears 24px, and the kit has no `:active` rule to compare against |

One is a behaviour difference that may be intentional and is recorded rather
than "fixed": the kit's `Accordion` is *"an instant show/hide (no CSS
transition)"*, while the package animates with `accordion-up` / `accordion-down`.
The kit is describing production; the animation is an improvement, but it is a
divergence from the agreed reference and should be ratified, not assumed.
