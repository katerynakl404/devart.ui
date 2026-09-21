# Design-system changes found while building on it

Every change here was made to **`@devart/ui-react` itself**, not to a page, and
every one was found the same way: by assembling a real screen out of real
components. In Storybook a component stands alone. On a page it stands next to
others, and that is where states, sizes and colours drift apart.

This file replaces `CHANGES-from-connections.md`, `CHANGES-round-2-ux-review.md`
and `CHANGES-round-3-two-shells.md`, which recorded the same work in three
passes. Merging them removed three contradictions where a later pass had revised
an earlier one without amending it — those are marked **Revised** below, because
the reasoning matters more than the final value.

It is kept as its own file rather than inside each component's `.md`: component
sources are periodically refreshed from upstream, and anything written into them
is lost on the next sync.

## The constraint that shapes all of this

**Two products now share one library.**

- **AI Connectivity** is a desktop application. It owns a window bar, so the
  product mark, the name and the collapse control belong there.
- **Insightis** is a web application. A browser tab is no place for a product
  mark, so the sidebar carries it.

A change that fixes one and breaks the other is not a fix. Section 9 is a worked
example of that mistake — made, caught, and corrected.

---

## By feature

The file is one file on purpose — a per-feature file was tried and produced
three documents recording the same change three times, which is what the
preamble above is about. What was missing was not separate files but a way in
from the feature you are working on, so here it is. Section numbers are stable;
the groups are the reading order.

| Feature / occasion | Sections |
|---|---|
| **Connections — the list** (Devart LinkAI, DW-10365) | 1, 3, 6, 7, 17, 18, 20 |
| **Connections — the create/edit form** | 4, 5, 8, 9, 10, 19 |
| **Connections — round 4, "everything from the library"** (2026-09-19) | 35 – 39, 41, 43, 45, 47 – 60 |
| **Two shells: a desktop window bar and a web sidebar** | 11 – 16, 37 |
| **Interaction states, found by auditing production** | 2, 7a, 25 |
| **Kit ↔ Storybook audit** (no feature — a component-by-component sweep) | 23 – 34 |
| **Build and tooling** | 21, 22, 39 |
| **Documentation** | the "Documentation that was missing or wrong" block, 41 (`Badge.md`) |

**New components added, all rounds:** `PageHeader` (§17), `ConnectorLogo`
(§18), `StatusView.EmptyStateIllustration` (§20), `StepperIndicator` (§38),
`DropdownMenuRow` (§45), `InputGroupAction` (§47), `Link` (§48),
`StatTile` (§49), `CodeBlock` (§50), `MetaRow` (§55).

---

## Summary

| Area | Component | Change |
|---|---|---|
| Colour | `Button`, `IconButton` | `destructiveOutline` label is red, not neutral |
| Colour | `globals.css` | dark destructive border re-stepped so hover *raises* contrast |
| Colour | `constants.ts` | `--tbl-row-hover` wrapped in `hsl()` — the hover was emitting invalid CSS |
| Colour | `Autocomplete` | selected and highlighted no longer paint the same |
| Colour | `Card` / `outline` | the hover border tint is gone — a surface stopped promising an interaction it did not have |
| Colour | **new tokens** `--ink-icon`, `--ink-icon-hover` | the colour of a standalone glyph |
| Colour | `TableHead` | sort control gained a press state |
| Colour | **state tokens** | interaction states became relative overlays — they composite instead of replacing |
| Colour | **new** `--state-overlay` | one wash base per theme; four percentages shared by both |
| Colour | **removed** `--tbl-row-selected-hover` | a selected row is no longer repainted on hover |
| Colour | `Button`, `IconButton` | destructive tertiary re-stepped to hold parity with the neutral ladder |
| Size | `TabsContent` | inactive panel no longer returns as an empty box |
| Size | `InputGroupAddon` | `[&_svg]` → `[&>svg]` — stops resizing glyphs it does not own |
| Size | `InputGroup`, `TextArea` | field label Secondary → Body, so the hint is subordinate |
| Sidebar | `SidebarHeader` | horizontal inset restored; `empty:pb-0` tells the two shells apart |
| Sidebar | `SidebarBrand` | its own inset removed, so nesting does not double it |
| Sidebar | `SidebarMenuButton` | tooltips through the package's own `Tooltip`; collapsed box fixed |
| Sidebar | `Tooltip` | arrow `8x4`, putting the visible gap on the 4px scale |
| New | `PageHeader` | new component, plus a `badge` slot inside the title cluster |
| New | `ConnectorLogo` | new component — connector marks as data-URIs |
| New | `TextArea` | character counter |
| New | `StatusView` | `EmptyStateIllustration` — the standard empty-state artwork |
| Docs | `Card.md`, `Table.md`, `Switch.md`, `Sidebar.md` | recipes that every page was otherwise inventing |
| Build | `gen-classlist.mjs` | `empty:*` enumerated, or the rule above is never compiled |
| Build | `pnpm bundle`, `pnpm check-bundle-css` | one command, and a gate for silent CSS gaps |
| Kit gap | `Sidebar`, `Autocomplete`, `Datepicker` | raw `opacity-50` where the system agreed on `opacity-disabled` |
| Kit gap | `Toast` | no width band, so Sonner's fixed 356px wins over the kit's 280–600 |
| Kit gap | `Sheet` | `side="right"` — the default side is the one with no edge border |
| Kit gap | `Button`, `IconButton` | `tertiaryBrand` — a brand label on the neutral tertiary pill |
| Kit gap | `Tabs` | no flush tabset, so two bottom rules stack into a 2px edge |
| Kit gap | `Sidebar` | no menu badge / counter part |
| Kit gap | `InputGroup` | the clear-button reveal ships as a story recipe, not as a prop |
| Kit gap | `Datepicker` | the one focus ring in the package that is not the shared recipe |
| Kit gap | `TextArea` | counter ink one step too loud |
| Fixed | `Button`, `IconButton`, `Input`, `InputGroup`, `TextArea` | §42 — one ladder per axis, canonical table at the top of §42: button padding 8/12/12/16/20 (the field holds 12 from `sm`), gap 4/6/8/8/8, label 12/14/14/16/16, glyph 14/16/16/20/20 |
| Fixed | `Table` | §44 — the cell wraps, so a row grows with its content; the clamp is scoped to layout="fixed" |
| Fixed | `Typography` | `label16` — the rung the `lg` control ladder needs (added in §46, which also capped the scale) |
| Fixed | `InputGroupAddon` | leading glyph takes the placeholder ink; a docked control lifts to Text/Body on hover |
| **Build** | `gen-classlist.mjs` | the library’s whole glyph surface was absent from the bundle vocabulary (§46) |
| Kit gap | `StepSlider` | dot colour, dot size, width and hit area all off the kit s own numbers |
| Kit gap | `Badge` | `--badge-border` shipped — the hairline is the base of every variant |
| Colour | `PopoverContent` | closed state holds its faded-out frame instead of snapping back |
| Size | `Sidebar` | fixed panel takes its height from `inset-y-0`, not `h-svh` |
| New | `StepperIndicator` | new component — the rail the headless `Stepper` never shipped |
| Docs | `Badge.md` | when a state is a badge and when it is text |
| Build | `gen-classlist.mjs` | no opacity modifiers for `bg-surface-card` — `/85` paints nothing |
| Kit gap | `SidebarMenu` | nav rows sat 4px apart; the kit says 2 |
| New | `TextArea` | `hintText` — the half of the counter row nothing could fill |
| Kit gap | `DropdownMenuItem` | `accent` — the one row in a menu that IS the action |
| Kit gap | **new** `DropdownMenuRow` | a menu row that is a reading, not an action |
| Kit gap | **new** `InputGroupAction` | a field's trailing icon has no surface of its own |
| Size | `InputGroup` | the field yields its trailing inset instead of stacking with it |
| New | **new** `Link` | the kit's text link, which the package never had |
| New | **new** `StatTile` | label / value / caption — one number and what it counts |
| New | **new** `CodeBlock` | a snippet and the control that copies it, as one object |
| Size | `AccordionItem` | `standalone` — an item that is its own surface |
| Colour | `TableCell` | the row's pressed fill belongs to whatever was pressed |
| Revised | `StatusView` | the illustration is a replaceable pack of two, not one artwork |
| Kit gap | `Toggle` | `ghost` is `Button`'s removed variant under another name |
| Kit gap | **missing** `DropZone` | its own component in the kit; `--dropzone-*` ships in both themes with zero call sites |
| Docs | `Card.md` | `ghost` described as the "browse more" tile it is, not as a drop target |
| Docs | `DropdownMenu.md` | a menu may be opened by a `Link` — **draft**, tied to one unchosen concept (§61) |
| Fixed | `Card` / `ghost` | `bg-bg` named a token this branch deleted — now `bg-transparent`, the intended surface |
| New | **new** `MetaRow` | the line above a list — and the 4px to it, stated once (§55) |
| Size | `TableHead` | `width` — column widths are shares of the table, replacing five hand-set pixel widths (§56) |
| Fixed | `Link` | `font-[inherit]` was read as a weight and deleted `font-medium`; every link rendered at 400 (§57) |
| Size | `TableHead` | fixed 36px — a selection checkbox no longer makes the header 2px taller than the table next to it (§59) |
| Size | `PageHeader` | the back control's hover pill ran under the title and overhung the page's left rail (§60) |
| Size | `TableRow` | `nested` — 8px for a child row, lifted out of one table's local override (§58) |

---

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

## 3. Table row hover was not faint — it was not painted at all

`src/lib/constants.ts`

```diff
- 'row-hover': 'var(--tbl-row-hover)',
+ 'row-hover': 'hsl(var(--tbl-row-hover) / <alpha-value>)',
```

Dark defined the token through `color-mix()` — a finished colour. Light defined
it as an HSL triplet. Exposed as a bare `var()`, light emitted
`background-color: 210 40% 98%`, which is not a value: the rule was dropped
whole. The defect was twice diagnosed as "not enough contrast" before anyone
measured it.

This is the `<alpha-value>` invariant in `SPEC.md` seen from the other side: a
triplet token **must** be wrapped, a `color-mix()` token must **not** be.

> **Revised — and the more useful half.** The same commit also moved the step
> itself: hover from `slate-50` to `--state-hover`, pressed a notch further. That
> part was reverted. It pulled the package away from the Insightis kit, which is
> what users actually see. Current values are the kit's: `--tbl-row-hover:
> var(--slate-50)`, `--tbl-row-pressed: var(--surface-card2)` — so a selected row
> equals the header band in both themes.
>
> The lesson is the commit, not the colour: **a bug and a taste travelled
> together**. The bug was real — the hover was not rendering. The taste was not,
> and it shipped under the bug's justification. Separate them.

## 4. `Autocomplete` — selected and highlighted painted the same

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

## 5. `Card` / `outline` — the hover border tint is gone

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

## 6. No token for a standalone icon — new `--ink-icon` / `--ink-icon-hover`

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

## 7. `TableHead` sort control had hover but no press

`src/components/Table/TableHead.tsx`

```diff
- 'transition-colors hover:text-ink-body',
+ 'transition-colors hover:text-ink-icon-hover active:text-ink-icon-hover',
```

A label plus a standalone glyph — the case §6 exists for.

## 7a. Interaction states were absolute colours, and two of them were the same colour

`globals.css`, `src/lib/constants.ts`, `src/components/Table/TableCell.tsx`

Found by auditing prod (`insightis-app.devart.info`, 2026-09-19) rather than the
package, but the defect is the package's: the same two tokens collide here.

| theme | `--state-hover` | `--tbl-row-pressed` |
|---|---|---|
| light | `slate-100` = **#F1F5F9** | `surface-card2` = slate-100 = **#F1F5F9** |
| dark | `grey-800` = **#21212C** | `surface-card2` = grey-800 = **#21212C** |

Identical in both themes, so **a control's hover inside a selected row is
invisible** — it paints the colour already under it. On prod that was ten ⋮
buttons on one page, each appearing to have no hover at all.

**This is not a tuning miss.** Any absolute colour eventually equals the surface
it lands on, and absolute colours cannot stack — a control can never be "one step
deeper than whatever is under it", because it has no way to know what that is.

Each state is now a translucent wash, so states composite. Each theme declares
**one base and four strengths**; the four state tokens are written once in
`:root` and read them, so retuning a theme touches no consumer and needs no
`.dark` copy of a state token.

- **`--state-overlay`** — `--brand-300` on light, `--slate-400` on dark. Dark
  uses a cold neutral because a coloured wash over the near-black card reads as a
  cast rather than a lift.
- **Four percentages — 4 / 8 / 8 / 12 — shared by both themes**, written inline.
  One set serves both because `--slate-400` moves against the near-black card at
  roughly the rate `--brand-300` moves against white. A base that moved at a
  different rate would force a second ladder.
- **`--brand-300` retuned** `#5DA0A8` → `#46A6B9` (190°, 45%), and it had no
  consumers. The brand ramp drifts from ~194° at its pale end to 179° at
  `--brand-600`, so washing with the brand *role* lands green; `--tertiary-600`
  reads minty; the old step had the right hue at 29% saturation, and **a
  desaturated wash reads dirty, not soft** — that, not strength, is what makes a
  pale tint look muddy.
- **`--tbl-row-selected-hover` removed**, with the two `TableCell` utilities that
  named it. A selected row keeps its own surface under the pointer and the
  controls on it composite on top; the old token made a row read as *less*
  selected the moment you touched it.

Rows are deliberately lighter than controls: a row is wide and sits in a stack,
where a heavy wash turns a list into stripes; a control is small and often sits
alone. Inside a row the two composite, so a control on a hovered row is always
the deeper of the pair — which is the entire point.

Composited over the card and measured from `globals.css`, matching the values the
prod audit measured independently, to the hex, in both themes:

| | strength | light | Δ | dark | Δ |
|---|---|---|---|---|---|
| row hover | `--tint-4` | `#F8FBFC` | 7 | `#1C1D24` | 5 |
| row pressed / selected | `--tint-8` | `#F0F8F9` | 15 | `#21222A` | 10 |
| control hover | `--tint-8` | `#F0F8F9` | 15 | `#21222A` | 10 |
| control pressed | `--tint-12` | `#E9F4F7` | 22 | `#262830` | 15 |

**`--tbl-row-pressed` and `--state-hover` share a strength, and that is the
point rather than the bug it would once have been.** Absolute colours *replace*,
so equal values meant invisible; overlays *composite*, so a control hovering on
a selected row lands at 8% over 8% ≈ 15%:

| | selected row | control hovering on it | step |
|---|---|---|---|
| light | `#F0F8F9` | `#E3F1F4` | 13.6 |
| dark | `#21222A` | `#2A2C36` | 9.2 |

A check asserting the four *raw* token values are distinct therefore tests the
wrong thing — it reads declarations, and the defect lives in the composite.

**The Tailwind mapping is the part that breaks silently if missed.** The four
tokens are finished colours carrying their own alpha, so their mapping is now
bare `var()`. Left wrapped in `hsl(... / <alpha-value>)` the declaration is
invalid and the fill disappears with no error — the same failure §3 describes
from the other direction. They also stop accepting an opacity modifier; the
package had no `bg-state-hover/50`-style call site, and neither did prod.

`--state-disabled` is untouched on purpose: it is a rest surface, never stacked
on another state, and has to stay an opaque fill.

### What this broke, and what caught it

Moving the neutral ladder moved it **away from its destructive sibling**, which
had been tuned to match it. The audit caught both halves:

| | neutral | destructive | Δ | tolerance |
|---|---|---|---|---|
| light hover | 2.99 | 4.01 | 1.02 | 0.5 |
| light press | 4.48 | 5.35 | 0.87 | 0.7 |

Light was re-stepped by solving for the target ΔL* rather than by eye: hover
`--tint-6`→`--tint-4` and press `--tint-8`→`--tint-6`. These alias the outline
sibling, so it moves with them — keeping the two one control family, which is
how they were designed.

**Dark needed no change at all, and finding that out cost a round trip.** An
earlier draft of the migration used a second, heavier ladder on dark, and the
destructive tokens were re-stepped `--tint-20`→`--tint-30` and
`--tint-30`→`--tint-40` to chase it. When the design settled on one set of
percentages for both themes, the neutral ladder came back down and those values
were suddenly too heavy — the original 20 / 30 had been in parity all along.
Re-measured, dark press now lands **0.01** apart.

The strengths still differ between neutral and destructive because the **bases**
differ: the same percentage of a dark red and of a mid teal do not move lightness
by the same amount. Percentages are shares, not steps — they cannot be copied
between hues, which is also why the two themes can share one set while the two
hues cannot.

`theme-audit.mjs` needed fixes of its own before it could say any of this. Its
ladder model assumed opaque grounds, so measuring against the now-translucent
`--tbl-row-hover` compared an overlay with an overlay and returned 0. One entry
was also miscategorised — a neutral and a destructive row action are *siblings*
that must weigh the same, not two rungs of one ladder, so it moved to the parity
checks. (Its resolver also had to learn the `--step-*` hop the earlier draft
introduced, and reported ten tokens as "unresolved" until it did — which on that
report looks exactly like a missing token. That hop is gone now, but the
substitution loop stays: it costs nothing and the next indirection will not
silently read as a missing token.)

---

# Size and spacing

## 8. `InputGroupAddon` resized glyphs it did not own

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
written on the icon (§46): a class on the glyph loses to the addon's child
selector in one direction and to the IconButton's own descendant selector in the
other, so the icon's own `className` was never going to decide anything.

## 9. `TabsContent` — the inactive panel came back as an empty box

`src/components/Tabs/TabsContent.tsx`

```diff
+ 'data-[state=inactive]:!hidden',
```

Radix hides the inactive panel with the `hidden` attribute, which is only a
UA-stylesheet `display:none` — any display class from the consumer (`flex`,
`grid`) beats it. The panel returned as an empty block and pushed the active one
down. That was the source of the "extra padding under the tabs".

## 10. A field label as loud as the hint beneath it

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

# The sidebar under two shells

## 11. `SidebarHeader` lost its horizontal inset

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

## 12. `SidebarHeader` — the two shells, told apart by `:empty`

The desktop shell renders `<SidebarHeader />` with nothing inside, purely for the
top inset; without the element at all, the first navigation row butted into the
window bar with **gap = 0**. But with it, `pb-2` was dead space under nothing.

**The mistake, and why it was wrong.** The request — "remove the bottom padding"
— was made while looking at the desktop shell, and it was applied to the shared
component. That silently removes the spacing from Insightis too, where the header
*does* carry a brand row and the padding is what separates it from the
navigation. A product-specific request applied to a shared component is how one
product's fix becomes another product's regression.

**Fix:** `empty:pb-0`. The element reads its own content — a header with a brand
row is spaced off the navigation, an empty one is pure top inset.

Deliberately `:empty` rather than a `variant` prop. A prop means every product
must know which shape it is and say so, and per §11 a rule a consumer has to
remember is a rule that eventually is not followed. Here there is nothing to
decide and nothing to get wrong.

Verified: desktop shell header height 12, `padding-bottom: 0`, gap from window
bar to first nav row 12. Web shell keeps `pb-2`. Both are in Storybook as
`Sidebar / ShellShapes` — the only place the two can be compared, and the thing
that fails visibly if either breaks.

## 13. `SidebarMenuButton` rendered tooltips with no styling at all

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

## 14. `SidebarMenuButton` — a 32px box its own padding did not fit

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

## 15. `Tooltip` — the arrow put the gap off the 4px scale

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
differently in a bundle than in Storybook — see §22.

## 16. Collapsing could remove the only way to expand

`src/components/Sidebar/Sidebar.md`, shell example

Reproduced on the prototype: with `collapsible="icon"` and the trigger inside
`SidebarHeader` under `group-data-[collapsible=icon]:hidden`, collapsing leaves
**no control on screen that can expand it**. There is no expand-on-hover in this
package, and the doc's shell example did not include `SidebarRail` — so an app
that copied the doc inherited the dead end.

New rule, plus `SidebarRail` in the example: a `SidebarTrigger` may not be the
only way back if it hides when collapsed. Either render the rail, keep the
trigger visible, or move it outside the sidebar entirely — a window bar, a page
header — where collapsing cannot take it away.

---

# New in the system

## 17. `PageHeader`

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

## 18. `ConnectorLogo`

`src/components/ConnectorLogo/` + `scripts/gen-connector-logos.mjs`

Connector marks are embedded as data-URIs: nothing is fetched at runtime, so a
logo cannot arrive as a broken image in a consumer's build, in Storybook, or on a
design canvas. An unknown connector renders a monogram, not an empty square.
Names resolve loosely — `PostgreSQL`, `postgresql`, `Postgres` all find the same
mark — so a page never needs to know the slug.

The pack is deliberately small: it is generated from the app's SVG folder by a
script, so extending it is a re-run, not a code change.

## 19. `TextArea` character counter

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

## 20. `StatusView` — `EmptyStateIllustration`

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
  sometimes you click it. `Card.md` now says so, and `DropZone` (§34) is the
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

## 21. A variant that is not enumerated is never compiled

`.design-sync/gen-classlist.mjs`

`empty:pb-0` (§12) was written into the component and would have done
**nothing**. The bundle's CSS is compiled from an enumerated vocabulary, not
scraped from the components, and `empty:` was not in it — no rule, no error,
header keeps its padding.

Checked before rebuilding rather than after: the variant was absent from the
generator, from `ds-classlist.txt`, and from the bundle's CSS. `empty:pb-0`,
`empty:pt-0` and `empty:hidden` are now enumerated, with a comment stating that
anything relying on a variant must be added deliberately.

## 22. `pnpm bundle` and `pnpm check-bundle-css`

Two gaps made this work slower to verify than the changes warranted.

**The bundle was built by typing six commands in order**, and both halves of that
failed in practice. A skipped step does not fail: skipping the Storybook build
once dropped `FilterChips` from a bundle that reported zero diagnostics, because
the roster is read from the Storybook index and not from `dist`. The order is
load-bearing too — `package-build` reads `dist`, so an edit made after `pnpm
build` already ran never reaches the bundle. A second team working from another
checkout could not find how to run it at all.

`pnpm bundle` runs the chain and decides the Storybook step for itself, by
diffing the component directories against what the last bundle holds — the only
step that depends on the roster. A styling fix therefore skips the slowest step
instead of paying for it. `--storybook` / `--no-storybook` override the decision,
and the skip warns when the roster did change.

**`pnpm check-bundle-css`** addresses the reason a component can look right in
Storybook and wrong on a page. There are exactly two:

1. **The CSS is not the same CSS.** Storybook compiles Tailwind from the source
   files, so every class a component writes gets a rule. The bundle compiles from
   the enumerated list, so a class it missed produces no CSS silently — §21 is a
   live example.
2. **The base layer differs on purpose.** `tailwind-export.css` overrides
   preflight with `svg { display: inline-block }`, which Storybook does not have.
   That is what made the tooltip trigger 20px in a bundle and 14px under
   preflight (§15).

The check compiles a second stylesheet with the built components as Tailwind's
content and diffs the class selectors against the bundle, letting Tailwind's own
extractor decide what counts as a class — a regex first attempt produced 163
false positives from import specifiers and `data-slot` values. It is also
one-directional: the vocabulary is deliberately wider than what components use,
so "shipped but unused" is expected and not reported.

It narrows the gap rather than closing it — a class assembled at runtime from a
variable is in no compiled text for any extractor to find. The pixel comparison
in `.ds-sync/storybook/compare.mjs` is what closes that part, and has not been
run yet.

---

# Kit ↔ Storybook audit

Everything above was found by building a screen. This section was found the
other way round: by walking the published Storybook
(`devart-ui-react-a83534.gitlabpages.devart.com`) component by component against
the agreed reference kit (`Insightis/insightis-preview-kit.html`), and reading
the kit's *rendered* CSS rather than its prose wherever the two could disagree.

**What the published Storybook actually is.** It is built from
`origin/master` — `81a8b0f`, the corporate `devart/components/devart.ui.react`
repository — and generated 2026-09-17T14:14Z. Identified by fingerprint, not by
assumption: it still has the `Ghost` button variant, a neutral
`destructiveOutline` label, no `--ink-icon`, no `--tint-*` scale, no
`destructiveTertiary`, and an `IconButton` `Sizes` story that renders 28→44 with
12/16/20px glyphs. That is the package **before** this branch.

So the Storybook ↔ kit difference splits in three, and only the third is new
work:

| | |
|---|---|
| **A** | changed on this branch **and** written down — 1–22 above, plus the changesets |
| **B** | changed on this branch and **written down nowhere** — the coverage audit below |
| **C** | never changed anywhere — the kit gaps, 23–39 |

Group **A** is not repeated here. Group **C** comes first, then **B**.

The kit was read as *rendered CSS*, not as prose, wherever the two could
disagree — which turned out to matter: the kit contradicts itself in three
places (listed under Open questions), and four of my own first-pass findings
were wrong against the current tree and are marked **Retracted** below rather
than deleted, because the wrong reading is the instructive part.

The items are ordered the way the rest of this file is: colour and state, then
size, then what is simply absent.

## The matrix — every component in the Storybook, against the kit

All 44 components the published Storybook exposes, each walked against its kit
section. **✅** the kit is satisfied · **⚠** it is not · **—** the kit has no
counterpart. Where a row says ⚠ the detail is in the numbered section it names;
where it says *undoc.* the package already satisfies the kit but the change is
written down nowhere — that is the coverage audit that follows.

| # | Component | Kit section | Verdict |
|---|---|---|---|
| 1 | `Accordion` | `#accordion` | ⚠ kit calls open/close *"instant … no CSS transition"*; the package animates (`accordion-up/down`). Ratify or revert — Open questions |
| 2 | `Autocomplete` | `#autocomplete` | ✅ highlighted = `State/Hover`, selected distinct (§4) · ⚠ `aria-disabled:opacity-50` (§24) |
| 3 | `Avatar` | `#avatar` | ✅ deliberate divergence: kit says `--brand-primary`, package uses `--avatar-bg` because brand lifts on dark and white initials fell to 3.94:1. In `theme-contrast.md` |
| 4 | `Badge` | `#badge` | ✅ hairline now the base (§23 → shipped in §35) · the `sm` radius is in the archive · glyph 16→14px *undoc.* |
| 5 | `Banner` | `#banner` | ⚠ kit agrees **one** gradient (`.banner-grad`, `--grad-teal-dark`); package ships four (`horizontalWide`, `diagonalAiry`, `diagonalFade`, `horizontalSlab`). Geometry matches — icon 60→40px at `sm`, radius 12px |
| 6 | `Button` | `#button` | ✅ §42 **fixed** — `lg`/`xl` now hold 12px padding and grow the label to 16/18; gap 8, glyph 20/24 · ⚠ §27 `tertiaryBrand` still missing |
| 7 | `Card` | `#card` | ⚠ §34 `Card.md` redefines `ghost` as a drop target · hover/press deliberately removed (§5) · kit's focus + disabled still ⚠ *to define* |
| 8 | `Checkbox` | `#checkbox` | ✅ hover, neutral focus ring, 10×2 indeterminate bar, `aria-invalid` error, `opacity-disabled` — all five |
| 9 | `CircularProgress` | `#circularprogress` | ✅ size 40, stroke 2.5, track `--surface-page`, indicator brand |
| 10 | `Collapsible` | `#collapsible` | ✅ pure Radix re-export on both sides; nothing to diverge |
| 11 | `Datepicker` | `#datepicker` | ⚠ §31 the one focus ring in the package that is not the shared recipe · §24 `opacity-50`. Hover, `today`, `outside` and `disabled` are all present — my earlier "three missing states" was wrong |
| 12 | `DropdownMenu` | `#dropdown` | ✅ 6/12 padding, 8px gap, 16px glyph @1.75, 4-inside-8 radius, disabled = ink only · radius, disabled recipe, focus removal and `portalContainer` all *undoc.* |
| 13 | `File` | `#file` | ✅ 4/8 padding, card surface, medium name, interactive hover/press/focus · all of it *undoc.* |
| 14 | `IconButton` | `#iconbutton` | ✅ `2xs` rung present; §42 **fixed** — glyph now 14/16/16/20/24, the same ladder Button and the field carry |
| 15 | `Input` | `#input` | ✅ §42 **fixed** — padding, field text and glyph now match at all five steps |
| 16 | `InputGroup` | `#inputgroup` | ✅ §42 **fixed** — padding, `sm` text 12→14, addon glyph and the 4px `xs` gap · ⚠ §30 clear button is still a story recipe |
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
| 27 | `Sheet` | `#sheet` | ⚠ §26 `side="right"` — the default side is the only one with no edge border · scrim token, card surface and the `2xs` close button all match now, *undoc.* |
| 28 | `Sidebar` | `#sidebar`, `#sidebar-subparts` | ⚠ §29 no menu badge / counter · §24 `opacity-50` and no `Text/Inactive` on disabled · states, insets and sub-parts otherwise match (§11–16) |
| 29 | `Skeleton` | `#skeleton` | ✅ shimmer is the default, pulse and none opt-in, radius `md` |
| 30 | `Spinner` | `#spinner` | ✅ stroke 2.5 — the kit's value, changed on this branch, *undoc.* |
| 31 | `StatusView` | `#statusview` | ✅ ladder re-scaled to 32/40/56 circles and 16/24/32 padding, `neutral` halo fixed, `EmptyStateIllustration` (§20) · the rescale is *undoc.* |
| 32 | `StepSlider` | `#stepslider` | ⚠ **new** — four measured mismatches, §40 |
| 33 | `Stepper` | `#stepper` | ✅ headless on both sides; the consumer styles it |
| 34 | `Switch` | `#switch` | ✅ 36×20 / 28×16, `--switch-off-bg` pair, 44×44 hit area, neutral ring, `opacity-disabled` · label ink + disabled treatment *undoc.* |
| 35 | `Table` | `#table` | ✅ 10/16 padding, 12px header, selection holds under the pointer · §44 **fixed** — the cell wraps again, so the row height follows its content |
| 36 | `Tabs` | `#tabs` | ⚠ §28 no flush tabset, so two bottom rules stack · underline, hover, focus and disabled match · kit's counter/badge still ⚠ *to define* |
| 37 | `TextArea` | `#textarea` | ✅ §42 **fixed** — padding at four steps and font at three · ⚠ §32 counter ink still `--ink-secondary` |
| 38 | `Timeline` | — | — no kit section |
| 39 | `Toast` | `#toast` | ⚠ §33 close button off the `2xs` rung · stack gap 8 vs 10 · §25 width **mostly retracted** — a stacked kit toast is 360px, Sonner’s is 356px |
| 40 | `Toggle` | `#chip` | ⚠ §34 `ghost` is `Button`'s removed variant under another name · the kit's chip hover also shifts text to `--ink-primary`; the package only fills |
| 41 | `ToggleGroup` | `#chip` | ⚠ the kit specifies the count as part of the chip (`.chip-n` — 11px tabular-nums, `--ink-inactive`, 70% `--ink-highlight` when active); the package renders it in a story |
| 42 | `Tooltip` | `#tooltip` | ✅ 288px ceiling with `w-max`, 8×4 arrow, Surface/Card ink (§15) |
| 43 | `TruncatedTitleTooltip` | `#truncated` | ✅ default side is now `top` as the kit states, and it inherits Tooltip's surface instead of re-declaring `max-w-52` — *undoc.* |
| 44 | `Typography` | `#typography` | ✅ **fixed in §46** — `label16` added and the 18px rungs taken out again; the named scale and the control ladder now agree |

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
| 27 | `tertiary: cn('border-transparent bg-transparent text-ink-body', 'hover:bg-state-hover', …)` — one tertiary, neutral label<br>`Button/index.tsx:57`, `IconButton/index.tsx:48` | `.btn-tertiary.is-brand{color:var(--brand-primary)}`<br>`.btn-tertiary.is-brand:hover{background:var(--state-hover);color:var(--brand-hover)}`<br>`.btn-tertiary.is-brand:active{…color:var(--brand-press)}` — a second tertiary whose *label* moves<br>`kit-theme.css`, `#button` (kit html 513) |
| 26 | `right: cn('inset-y-0 right-0', 'h-full w-3/4 sm:max-w-sm', /* no border */)`<br>`Sheet/index.tsx:122`<br>…while `top` has `border-b`, `bottom` `border-t`, `left` `border-r` | *"Right · right (default) · `border-l` · slide-from-right"*<br>kit html `#sheet` (2731), side-variants block |
| 28 | `'inline-flex items-center gap-2 border-stroke border-b'` — unconditional<br>`Tabs/TabsList.tsx:17` | `.tabset.var-flush{border-bottom:none}`<br>`kit-theme.css:1206` |
| 29 | no `SidebarMenuBadge` — the string `MenuBadge` does not occur in `src/components/Sidebar/` | `.sbx-nav-item .nav-badge{margin-left:auto;background:color-mix(in srgb,var(--brand-primary) var(--tint-15),transparent);color:var(--brand-primary);font-size:var(--ts-label-s-size);padding:1px 6px;border-radius:var(--radius-full);font-variant-numeric:tabular-nums}`<br>`kit-theme.css`, `#sidebar` (1986) |
| 24 | `'disabled:opacity-50'`, `'aria-disabled:opacity-50'` — `SidebarMenuButton.tsx:59,61`<br>`'aria-disabled:opacity-50'` — `Autocomplete/OptionItem.tsx:52`<br>`'…aria-disabled:opacity-50'` ×2 and `'text-ink-secondary opacity-50'` — `Datepicker/Calendar.tsx:70,75,158` | *"opacity:`--opacity-disabled` (.65) + pointer-events:none — same recipe as Switch / Checkbox / Button"*, stated under `#checkbox`, `#switch`, `#segctrl`, `#tabs`. `--opacity-disabled` is `.65`, not `.5` |
| 30 | `className="group-has-[input:placeholder-shown]/input-group:hidden"` — in a **story**<br>`InputGroup/InputGroup.stories.tsx:210`; `InputGroup/index.tsx` has no `clearable` | `.igrp .igrp-clear{display:none}`<br>`.igrp:has(.igrp-input:not(:placeholder-shown)) .igrp-clear{display:inline-flex}` — in the **component's own stylesheet**<br>`kit-theme.css:2462-2463` |
| 31 | `'group-data-[focused=true]/day:ring-[3px]'`<br>`'group-data-[focused=true]/day:ring-focus-ring-brand/50'` — 3px at 50%, no gap<br>`Datepicker/CalendarDayButton.tsx:74-75` | *"Focus (keyboard) → `--shadow-focus` 2px + 2px gap"* — the ring `focusRing` in `src/lib/utils.ts` now exists to enforce<br>kit html `#datepicker` (3004), day-cell state table |
| 32 | `textColor="secondary"` → `--ink-secondary`<br>`TextArea/index.tsx:256` | `.ta-count{text-align:right;font-size:var(--ts-body-s-size);color:var(--ink-inactive);margin-top:.25rem}`<br>`kit-theme.css:1087` — everything else (12px, right-aligned, 4px above) already matches |
| 33 | `variant="transparent" size="sm"` + the `mt-0.5 text-ink-body` those force<br>`Toast/ToastMessage/index.tsx:100-101` | `.toast-x` is enumerated on the **24px `2xs` rung** — *"the row kebab, `.toast-x`, `.sht-x`"*. `Sheet/index.tsx:186` already took it (`variant="tertiary" size="2xs"`) |
| 34 | `ghost: cn('border-transparent bg-transparent text-ink-body','hover:bg-state-hover active:bg-state-pressed', …)`<br>`Toggle/index.tsx:63` | the same recipe is `Button`'s **`tertiary`**; `Button.md:9` says *"There is **no `ghost`** — use `tertiary`"*. The kit's chip itself is `.chip{height:1.75rem;border-radius:var(--radius-full);border:1px solid var(--stroke-border);background:var(--surface-card);color:var(--ink-body)}` — `kit-theme.css:2706` |
| 34 | `Card.md:14-15`: *"a dashed edge means a drop target, so `ghost` is for an area that **receives something**"* | `Card.stories.tsx:98`: *"Ghost — dashed 'browse more' tile."* — **both are ours**; the doc contradicts the story, and the story is right |
| — | count rendered in a story: `{option.count}` in a plain `<span>`<br>`ToggleGroup/ToggleGroup.stories.tsx:273` | `.chip-n{font-size:var(--ts-label-m-size);color:var(--ink-inactive);font-variant-numeric:tabular-nums}`<br>`.chip.is-active .chip-n{color:color-mix(in srgb,var(--ink-highlight) var(--tint-70),transparent)}`<br>`kit-theme.css:2713-2714` — part of the component |
| 34 | `body16`, `body14`, `body12` · `label14`, `label12`, `label10`<br>`Typography/index.tsx:60-67` | the nineteen include **Body XL 18/28**, **Label 2XL 18/28**, **Label XL 16/24** — kit html `#typography` (311), *"UI text — the 19 named styles"* |
| 40 | track `bg-surface-chips` · dot `size-1` (4px) `bg-ink-secondary` · `w-20` (80px) · hit ring `before:-inset-2` (20×20)<br>`StepSlider/index.tsx:18, 56, 32, 60` | `.stps{height:1.25rem;padding:0 2px;background:var(--surface-card2);gap:.5rem;flex:none}`<br>`.stps-dot{width:6px;height:6px;background:var(--ink-inactive)}`<br>`kit-theme.css:1132, 1140` — and the kit derives its width from content rather than fixing it |
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

**§25 `Toast` width — mostly retracted.** `.toast{min-width:280px;max-width:600px}`
(`kit-theme.css:2596`) is the standalone toast. In the stacking context the kit
constrains it: `.toast-stack{…width:min(360px,calc(100vw - 3rem))}` and
`.toast-stack .toast{width:100%}` (`:2594-2595`). So a stacked kit toast is
**360px**, and Sonner's default is 356px — a 4px difference, not a 244px one.
What survives is the gap: `.toast-stack{gap:.625rem}` = 10px against
`Toaster.tsx:10`'s `gap = 8`.

Both errors came from reading a rendered page instead of the stylesheet, and
both were caught the moment the two sides had to be quoted side by side rather
than summarised.

## 23. `Badge` — the hairline is the default, not a second variant

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

## 24. Five controls still fade at `opacity-50`

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

## 25. `Toast` has no width, so Sonner's does

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

## 26. `Sheet` — the default side is the one without a border

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

## 27. `tertiaryBrand` — a brand label on the neutral tertiary pill

`src/components/Button/index.tsx`, `src/components/IconButton/index.tsx`

The kit ships this as `.btn-tertiary.is-brand`, marked **new**, in four rules:

```css
.btn-tertiary.is-brand          { color: var(--brand-primary); }
.btn-tertiary.is-brand:hover    { background: var(--state-hover);   color: var(--brand-hover); }
.btn-tertiary.is-brand:active   { background: var(--state-pressed); color: var(--brand-press); }
.btn-tertiary.is-brand:disabled { color: var(--ink-inactive); background: transparent; }
```

The label moves through the brand ramp; the pill and the focus ring stay the
plain tertiary recipe. It exists for standalone brand text actions — the
connection sidepanel's *Test Connection* is the named case — and the kit is
explicit that the global tertiary stays neutral, so this has to be a variant
rather than a redefinition.

This is the mirror of `destructiveTertiary`, which the package already has (§1's
sibling). Both are tertiary ghosts that recolour the label only; shipping one and
not the other is why pages keep hand-rolling a `text-brand-primary` button.

## 28. `Tabs` — no flush tabset, so two rules stack

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

## 29. `Sidebar` — no badge or counter on a nav row

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

## 30. `InputGroup` — the search clear button is a recipe, not a part

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

## 31. `Datepicker` — one bespoke focus ring, not three missing states

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

**`disabled` fades at `opacity-50`** — §24, along with the two month-nav chevrons.

`dark:hover:text-ink-primary` on `CalendarDayButton` is also one of the two
`dark:`-class holdouts SPEC lists under *Creating a New Theme*. Now that the light
hover is a token (`bg-state-hover`), that line is the last piece of the day cell
that a third theme would not reach.

## 32. `TextArea` counter — one ink step too loud

`src/components/TextArea/index.tsx`

```diff
- <Typography variant="span" textColor="secondary" …>
+ <Typography variant="span" textColor="inactive" …>
```

The kit: *"`.ta-count`, Body 12 in `--ink-inactive`, right-aligned, 4px above."*
Everything else matches — `text-xs`, `gap-1`, `ms-auto`, `aria-live="polite"`,
digits only. Only the ink step is off, and it is the step that decides whether
the counter reads as *information about the field* or as *part of the field's
content*. `--ink-secondary` is the hint's own colour; §10 moved the label up
precisely so the hint would be subordinate, and the counter should sit below the
hint, not beside it.

## 33. The toast close button is off the 24px ladder

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

## 34. `ghost` — one name, two component families, one wrong doc

`Button`'s `ghost` was removed this cycle in favour of `tertiary`, and
`Button.md` says so outright: *"There is **no `ghost`** — use `tertiary`."* The
changeset records the removal and then adds a clearing sentence:

> `Card`, `CardIcon` and `Toggle` keep their own **unrelated** `ghost` variants.

One of those three is not unrelated. The other two are, and belong exactly where
they are.

### `Toggle.ghost` is the removed variant under another name

Its off-state, class for class:

| | |
|---|---|
| `Button` `tertiary` | `border-transparent bg-transparent text-ink-body` · `hover:bg-state-hover` · `pressed:bg-state-pressed` · `disabled:bg-transparent disabled:text-ink-inactive` |
| `Toggle` `ghost` | `border-transparent bg-transparent text-ink-body` · `hover:bg-state-hover` · `active:bg-state-pressed` · `disabled:bg-transparent disabled:text-ink-inactive` |

The only difference is `active:` where `Button` uses `pressed:` — the same
oversight the audit already fixed on `destructiveTertiary`. `Toggle` is a
button-shaped control on the same variant scale (`outline`, `stroke`, `ghost`,
`badge`), so a consumer reading `Button.md` is told the name does not exist and
then finds it on the sibling component, meaning what it used to mean. Rename it
to `tertiary` and switch `active:` → `pressed:`.

(`Toggle`'s `ghost` and `badge` share that off-state verbatim and differ only in
the on-state chip. Unlike `Button`'s two these are **not** duplicates — worth a
line in the `.md`, because it looks like the defect that justified the removal.)

### `Card.ghost` stays — and `Card.md` is what says otherwise

`Card.ghost` is the dashed **"browse more" / add-new tile**: an empty slot the
user clicks to add the thing the surrounding grid is full of. `CardIcon.ghost`
is its icon well — `mx-auto mb-3 size-10 rounded-full`, dashed, an 18px glyph
centred above the label. The two are one pattern, and it is a *placeholder*, not
a target.

`Card.stories.tsx` says so in as many words — *"Ghost — dashed 'browse more'
tile."* `Card.md` says the opposite:

> `ghost` — no fill, and a **dashed** 1px border. The dash is the point: in this
> system a dashed edge means a drop target, so `ghost` is for an area that
> **receives something**, not for "a card without chrome".

That sentence is wrong, and it is load-bearing wrong: it redefines the variant by
its border rather than its job, and then spends a paragraph forbidding the uses
that follow from the redefinition. It is also the reason this audit initially
proposed deleting the variant in favour of a `DropZone` — the doc had already
made the conflation, and I repeated it. A dashed edge in this system means
*"nothing here yet"*; sometimes that empty thing accepts a drop, and sometimes
you click it. The dash is the emptiness, not the drop.

Fix the prose, keep the variant. Story and implementation already agree; the
`.md` is the outlier.

### `Card.ghost` was painting a token this branch deleted — **fixed**

```diff
  ghost: cn(
    'cursor-pointer items-center justify-center',
    'border border-ink-secondary/35 border-dashed',
-   'bg-bg text-center',
+   'bg-transparent text-center',
    'hover:border-ink-secondary/55 hover:bg-state-hover'
  ),
```

`--bg` was removed from `globals.css` on this branch and `THEME_COLORS` has no
`bg` key, so `bg-bg` named nothing: the class generated no CSS and the tile
rendered with no background at all — silently, with nothing failing. This is the
invariant SPEC states in so many words ("A class naming a key absent from
`THEME_COLORS` generates no CSS. A typo in a token name is invisible").

Transparent is the intended surface, so the fix is also the correct value rather
than a restoration: a placeholder tile sits on whatever the grid sits on, and
pinning it to a surface token would break the moment the grid moved from
`--surface-page` to a card. The rendered result is unchanged from what shipped —
`bg-bg` was already painting nothing — so this closes a latent trap rather than
altering a pixel. Had `--bg` still existed, the same line would have been an
actual regression.

In neither the report nor any changeset before this entry.

### `DropZone` is a separate, genuinely missing component

Unrelated to `Card.ghost`, and worth separating precisely because the doc above
ran them together. The kit ships **DropZone** as its own component, with an
anatomy no card variant has — upload icon inline with the title, a helper line,
a **Browse Files** button — and three specified states:

| State | Kit |
|---|---|
| Rest | dashed `Stroke/Border` on `Surface/Card2`, icon `Text/Secondary` |
| Hover / focus | border + icon tint toward `Brand/Primary`, faint brand wash |
| Drag over | solid `Brand/Primary` border + `State/Hover` fill |

The package already carries its tokens — `--dropzone-border`,
`--dropzone-border-active`, `--dropzone-bg-active`, declared in both themes and
exposed through `THEME_COLORS` as `dropzone.*`. **Nothing in `src/components/`
reads any of them.** That is the drift failure mode SPEC names outright, and the
same one `.changeset/theme-contrast.md` caught on `--tbl-header-bg`: a token with
no call site is a token nobody is checking.

---

# Connections — round 4 (UX review, 2026-09-19)

The review that produced this round asked one question of the whole page:
**does anything on it come from somewhere other than the library?** The answer
was thirteen blocks in `_shared/pages.css` — eight labelled BRIDGE (a library
defect patched on the page) and five labelled PAGE — plus a hand-built step
rail, a hand-built tooltip trigger and a hand-built character counter.

Checking them one at a time, against the *compiled* bundle in a running browser
rather than against the source, produced the first result worth recording:

| Bridge | Verdict |
|---|---|
| row-hover utility not generated | **stale** — the named-group compound is in the bundle (§21 landed) |
| `--ink-icon` / `--ink-icon-hover` missing | **stale** — both tokens are in the bundle (§6 landed) |
| `InputGroupAddon` resizing nested glyphs | **stale** — `[&>svg]` and the 16/20 ladder are in the bundle (§8 landed) |
| field label as loud as its hint | **stale** — `InputGroup` renders the fixed ink (§10 landed) |
| inactive tab panel returns as an empty box | **stale** — `data-[state=inactive]:!hidden` is in the bundle (§9 landed) |
| card press state flashing | **stale** — `outline` carries neither state (§5 landed) |
| dark `destructiveOutline` border | **stale** — and now *contradicting* the library, which re-stepped to Red-500 → Red-400 (§2) |
| closed `Popover` stays painted | **real** — §36 below |

**Seven of eight bridges were dead code**, and the last of them had drifted into
actively overriding a fix that had already shipped. That is the failure mode the
end of this file warns about, observed: a bridge does not merely duplicate, it
masks. The rule that follows is not "write fewer bridges" but **"verify against
the compiled artefact, not the source"** — every one of these was correct on the
day it was written.

## Summary — this round

| Area | Component | Change |
|---|---|---|
| Kit gap | `Badge` | `--badge-border` shipped; the hairline is the base of every variant, `flat` is the opt-out |
| Colour | `PopoverContent` | closed state gets `fill-mode-forwards`, so it stops snapping back to full opacity |
| Size | `Sidebar` | fixed panel takes its height from `inset-y-0`, not from `h-svh` |
| New | **`StepperIndicator`** | the visual rail the headless `Stepper` never shipped |
| Docs | `Badge.md` | when a state is a badge and when it is text — the product-wide rule |
| Build | `gen-classlist.mjs` | no opacity modifiers for `bg-surface-card`, so `/85` emits nothing |
| Kit gap | `SidebarMenu` | `gap-1` → `gap-0.5` — the kit's nav rows are 2px apart, not 4 |
| New | `TextArea` | `hintText` — standing guidance beside the character counter |
| Kit gap | `DropdownMenuItem` | `accent` variant — brand ink + medium weight for a menu's primary action |
| Kit gap | **new** `DropdownMenuRow` | label + its own control on the item rail, with no hover surface |
| Kit gap | **new** `InputGroupAction` | 24px box, 16px glyph, no fill — colour-only hover |
| Size | `InputGroup` | `has-[…input-group-action]:pe-2` — one inset on that edge, not two |
| New | **new** `Link` | `--ink-highlight`, medium, size inherited from the text it sits in |
| New | **new** `StatTile` | overline label · title20/24 value · body12 caption, `tabular-nums` |
| New | **new** `CodeBlock` | copy inside the block, tick for two seconds, `execCommand` fallback |
| Size | `AccordionItem` | `variant="standalone"` drops the divider for one card per section |
| Colour | `TableCell` | pressed guarded against `button:active` and an open menu inside the row |
| Revised | `StatusView` | `EmptySearchIllustration` added — the pack is two, and the slot was always open |

**New props this round:** `Badge.flat`, `TextArea.hintText`,
`DropdownMenuItem variant="accent"`, `AccordionItem variant="standalone"`.

**New components this round: six** — `StepperIndicator` (§38),
`DropdownMenuRow` (§45), `InputGroupAction` (§47), `Link` (§48),
`StatTile` (§49) and `CodeBlock` (§50).

## 35. `Badge` — the hairline is the base, not a second variant

`globals.css`, `src/lib/constants.ts`, `src/components/Badge/index.tsx`

§23 diagnosed this from the kit and stopped at "shape of the fix". This round
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

## 36. `PopoverContent` — a closed panel stayed painted

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

## 37. `Sidebar` — the fixed panel was pinned to the viewport

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

AI Connectivity is a desktop application: the shell sits under a window bar, and
the review harness adds a bar above that. `position: fixed` resolves against the
nearest transformed ancestor, which the shell has (`translateZ(0)`, deliberately
— without it the sidebar would cover the window bar). So `inset-y-0` was
correct and `h-svh` was 40px too tall, which slid the account row off the bottom
edge. The page's answer was an override on a design-system component:

```css
.app-viewport div.fixed.inset-y-0 { height: 100%; }
```

**Both products.** Insightis is a web application with no transformed ancestor
above the shell, so its containing block *is* the viewport and `inset-y-0`
resolves to exactly what `h-svh` was giving it. Nothing changes there. This is
the §9-class check the constraint at the top of this file asks for, and it comes
out clean: one product is fixed, the other is unaffected, because the removed
declaration was redundant in the case that still works.

## 38. New — `StepperIndicator`

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

## 39. Build — `bg-surface-card/85` is a class that compiles to nothing

`.design-sync/gen-classlist.mjs`

`--surface-card` is an HSL triplet exposed with `<alpha-value>`, so
`bg-surface-card/85` is valid Tailwind. The enumerated class list does not carry
it, the bundle therefore has no rule for it, and the element renders with **no
background at all** — no error, no warning, nothing in `check-bundle-css`,
because the class was never asked for.

This is the §21 failure mode on a different axis: §21 was a *variant* that was
not enumerated, this is a *modifier*. `_shared/card-scrim` writes the mix by
hand for that reason.

Not fixed here, because enumerating an opacity ladder for every colour is a
decision about bundle size rather than a defect: the useful shape is probably a
short list of steps the system actually uses. Recorded so the next person who
finds a silently unpainted element has somewhere to look.

## 41. `SidebarMenu` — nav rows 4px apart where the kit says 2

*Numbered 48: 47 and 49 are taken by entries under Open questions. This file
is being written from two sides; if a number collides, the heading text is the
stable reference.*

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
kit↔package audit (§23–40) walked components rather than composed screens, where
a 2px difference in a list of seven is what you actually see.

**Both products.** The kit is the shared reference — Insightis' own sidebar is
built from `.sbx-nav`, which is already at 2px, so this moves the package
towards what that product ships rather than away from it.

## 43. `TextArea` — the counter row had a slot nothing could fill

*Numbered 50: 47 and 49 are taken by entries under Open questions.*

`src/components/TextArea/index.tsx`

`showCount` (§19) draws the counter into a two-column row whose left half only
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

## 45. `DropdownMenu` — a menu had no way to say "this row is the action"

*Numbered 52: 47, 49 and 51 are taken by entries under Open questions.*

`src/components/DropdownMenu/DropdownMenuItem.tsx`,
`src/components/DropdownMenu/DropdownMenuRow.tsx` (new)

Reported against the shipped product: the workspaces panel was expected to look
like the composer's **Connections** menu — a short list, a full-bleed divider,
and *"⚙ Manage Connections"* — and did not.

Two parts of that shape were missing from the package, and the panel had been
built out of a `Popover` to compensate, which meant re-deciding the shell, the
padding, the item rail and the divider by hand.

### The action row

```ts
variant: 'default' | 'danger' | 'accent'
```

```
accent: 'font-medium text-ink-highlight'
        + the same neutral State/Hover · State/Pressed as every other row
```

The kit specifies this for the Attach menu's "Choose File" and states the reason
in the same breath: *"`--ink-highlight` brand colour + medium weight — **not** a
bordered button, so it doesn't dominate the popover or double-up a border
against the divider; it gets the same padding/breathing room as every row. The
leading icon + brand colour make it scan instantly as the primary action."*

That is worth spelling out because the obvious correction is the wrong one. The
row's first version was a plain item and read as a fourth workspace in a list of
three; the fix attempted here was a bordered `Button secondary`, which inside a
4px-padded surface puts a second edge 4px from the divider and outweighs the
list it belongs to. The distinction a menu actually uses is **ink and weight at
the same size, on the same rail**.

`--ink-highlight` is Brand-600 on light and Tertiary-400 on dark, so it holds AA
in both without a variant-specific value.

### The reading row

`DropdownMenuRow` — a label and its own control (a switch, a badge, a counter),
or a plain reading, on the item rail: the same `px-3 py-1.5`, so every label in
the menu shares one left edge. **No hover fill, no pointer cursor.**

The kit names this too — *"a menu may also carry non-item settings rows — a
label plus its own control, not an activatable `.mi` and therefore with no
hover surface"* — and the package had nowhere to put it. `DropdownMenuLabel` is
the Overline section heading (10px, caps, Text/Inactive) that captions a group,
not a row of content, and `DropdownMenuItem` paints a hover fill, which in a
menu is a promise that the row does something.

**Both products.** `accent` is a third variant with no existing call site;
`DropdownMenuRow` is new surface area. Insightis gets, as components, two things
its own CSS already has as `.mi` + `--ink-highlight` and `.cl-model-opt`.

## 47. `InputGroupAction` — an icon docked in a field is not an icon button

`src/components/InputGroup/InputGroupAction.tsx` (new part)

§30 recorded that the search clear button was "a recipe, not a part". Every page
therefore built it, and every page built it out of the nearest control on the
ladder — `IconButton size="2xs" variant="tertiary"`. That is the right 24px box
and two wrong things: a **14px** glyph where the field's own step is 16, and a
**hover pill**.

The kit is explicit that this slot has no surface:

> The `InputGroup` trailing slot is NOT on this ladder at all: an icon docked in
> a field is a sub-part of the field (`.igrp-act`) with the field's glyph step
> and **no surface of its own** — no background, no border, no hover pill,
> because the field already owns hover, focus and press.

```css
.igrp .igrp-act      { width:calc(var(--icon-md) + 8px); height:…; margin-right:8px; background:none }
.igrp .igrp-act svg  { width:var(--icon-md); height:var(--icon-md) }
.igrp .igrp-act:hover{ color:var(--ink-body) }
```

So the part is a 24px box around a 16px glyph, 8px from the edge, with no fill
at any state — it answers the pointer through `--ink-icon` → `--ink-icon-hover`,
the pair §6 added for exactly this case ("a standalone interactive icon changes
colour only; if it also needs a fill, it is an `IconButton` and should be one").

One deliberate difference from the kit: the kit hovers to `--ink-body`, this
hovers to `--ink-icon-hover`, which is `--ink-primary` — one ink step further.
The pair is the system's own answer to this question and is already shipping;
the kit's value is a step short of it. Worth settling, one way, in one place.

**Both products.** A new part, no existing call site. Insightis' own `.igrp-act`
is the same shape, so this gives it a component where it has CSS.

## 48. New — `Link`

`src/components/Link/index.tsx`

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

## 49. New — `StatTile`

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

## 50. New — `CodeBlock`

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

## 51. `AccordionItem` — an item that is its own surface

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

## 52. `TableCell` — pressed belonged to whatever was pressed

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

## 53. `StatusView` — the illustration is a pack, not a rule — **revised**

`src/components/StatusView/index.tsx`

§20 added `EmptyStateIllustration` and read as though the system had picked the
artwork. It had not, and should not: `StatusView` takes whatever goes in its
`icon` slot — a lucide glyph, one of these, or a product's own drawing — and
that was already true before §20.

What was actually missing is that **one picture cannot say two things**. "There
is nothing here yet" and "your search matched nothing" are different states, and
a list that shows the same artwork for both is telling the user the query made
no difference. So the pack is two:

| | |
|---|---|
| `EmptyStateIllustration` | three list rows fading out — the shape of the list that is missing |
| `EmptySearchIllustration` | a search field with a query in it, over two dashed empty rows |

The magnifier in the second one is **part of the depicted field**, not a symbol
standing in for "not found" — which is the objection §20 raised against using a
magnifier as the whole picture, and it still stands.

Every colour is a token, so both re-theme with the page and neither needs a dark
variant.

## 54. `InputGroup` — two insets on one edge

`src/components/InputGroup/index.tsx`, `src/components/InputGroup/InputGroupAction.tsx`

Reported by eye, and the measurement was worse than it looked:

| | |
|---|---|
| the field's own `px-3` | 12px |
| the margin `InputGroupAction` carried | 8px |
| centring a 16px glyph in its 24px box | 4px |
| **✕ to the border** | **24px** |

The search glyph on the other side sits at 12. So the clear button was **twice
as far in** as the icon opposite it, on the same field.

The kit does not have this problem because its field has no padding at all —
`.igrp-add { padding: 0 0 0 12px }` supplies the left inset and
`.igrp-act { margin-right: 8px }` the right, and both glyphs land on 12. Our
field carries the inset instead, so an action that adds its own stacks with it.

```diff
  // InputGroup, shared base
+ 'has-[[data-slot=input-group-action]]:pe-2'

  // InputGroupAction
- 'size-6 me-2 p-0',
+ 'size-6 p-0',
```

The field **yields** its trailing inset rather than the action adding to it:
8 + 4 = 12, symmetric with the leading glyph, at every size on the ladder.

A `has-` selector rather than a prop, deliberately. Whether a field has a
trailing action is something the markup already states; a prop for it is a
second place to get it wrong, and it would be wrong silently — the only symptom
is a few pixels.

**Both products.** It fires only when an `InputGroupAction` is present, and that
part is new in §47, so no existing field changes.

## 55. New — `MetaRow`

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

## 56. `TableHead` — a column width is a share, not a size

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

## 57. `Link` — `font-[inherit]` silently deleted the weight

`src/components/Link/index.tsx`

```diff
- 'font-medium font-[inherit] text-[length:inherit] leading-[inherit]'
+ 'font-medium text-[length:inherit] leading-[inherit]'
```

Every link in the product rendered at **400**. The kit's `.link` is 500, §48
specified 500, the class list contained `font-medium`, and the computed style
still said 400.

`font-[inherit]` was there to inherit the font *family*, alongside the size
and line-height either side of it. But Tailwind reads `font-[…]` with a
non-family value as a font-**weight** arbitrary value, so tailwind-merge saw
two classes in the `font-weight` group and dropped the loser — `font-medium`,
every time. The class never reached the output.

An anchor inherits its family from its parent anyway, so the class was buying
nothing and costing the one weight the component is specified to have.

Worth remembering as a shape, not just a fix: **an arbitrary-value class whose
group you guessed wrong does not error — it deletes its own group-mate.** The
symptom is a prop that has no effect, which is the hardest kind to see.

**Both products.** Restores the specified weight; nothing that reads correct
today changes.

## 58. `TableRow` — nesting was a number one table owned

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

## 59. `TableHead` — a checkbox made the header 2px taller

`src/components/Table/TableHead.tsx`

```diff
- 'px-4 py-2.5 align-middle',
+ 'h-9 px-4 py-0 align-middle',
```

Measured across the three concepts on one screen: the header row is **36.5px**
in a table with no selection column and **38.5px** in one with it. The
selection checkbox is an 18px control, the labels sit on a 16px line, and
padding adds to whichever is taller — so two tables in the same product have
two header heights for a reason that has nothing to do with the header.

**`h-9` alone does not fix it.** On a table cell `height` behaves as a
minimum, so 20px of padding around an 18px control still wins. The padding has
to yield: at `py-0` the cell is exactly 36px and `align-middle` centres
whatever is in it, which leaves a 16px label at the same 10px from the top it
had before. The label does not move; the extra 2px under a checkbox goes.

36px is also what the kit's `table.tbl th` computes to — `.625rem` of padding
around a 16px line — so this is the height the header always meant to be. A
fixed height is safe here and **only** here: a header never wraps
(`whitespace-nowrap` is two lines below) and nothing in one is taller than the
control that caused this. `TableCell` keeps its padding and still grows with
its content, which is §44 — a body row has to be able to hold two lines, a
header does not.

> An earlier draft of this section blamed the sortable head's `inline-flex`
> button and claimed the header shrank when a search stopped matching. Both
> were wrong, and measuring said so: filled and empty both read 38.5px, because
> the checkbox sets the floor either way. The fix that shipped is the one the
> measurement pointed at, not the one the theory did.

**Both products.** Only headers that carry a control change, and only by 2px.

## 60. `PageHeader` — the back control's pill overhung the page

`src/components/PageHeader/index.tsx`

```diff
- className="-ms-1.5 -me-1.5 shrink-0"
+ className="me-0.5 shrink-0"
```

Two separate faults in one class string.

**The end margin was a defect.** `-me-1.5` against the title cluster's 4px gap
put the box's right edge 2px **inside** the title, so on hover the pill ran
under the first letter. A small positive margin instead: 6px of clearance for
the pill, 12px from the glyph to the title — still tighter than the 12px the
rest of the row is spaced at, which is what says the arrow belongs to the title
rather than being its neighbour.

**The start margin was a principle that does not survive a surface.**
`-ms-1.5` pulled the 36px box 6px past the header's inset so that the 24px
*glyph* landed on the page's content rail. The reasoning — a tertiary control
is measured by its glyph, not by the box its hover state happens to paint —
holds for a control with **no** surface. This one has one. The pill appears on
hover and on focus, and when it did it started 6px left of everything under it:
the search field, the table and the cards all begin at the header's own inset,
so the page's left edge visibly broke every time the pointer crossed the arrow.

A glyph sitting inset inside its own control is how every other icon control on
the page already reads. A painted surface overhanging the rail is not. So the
box starts on the inset and the glyph sits 6px inside it.

Worth keeping as the general rule: **align by the glyph only when there is no
box; align by the box as soon as the box can be seen.**

**Both products.** Every page title with a back arrow moves its arrow 6px
inward; nothing else in the row moves.

## 61. `DropdownMenu` — a link may open a menu · **DRAFT**

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

## 62. `Table` — `density` · **DRAFT**

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

**Draft**, for the same reason as §61: it exists for a screen that has not been
chosen yet. Nothing changes for any existing table, since `comfortable` is
what they all render today.

## What this round did **not** change, and why

- **`ScrollShadow` and `scrollbar-gutter`.** The prototype reserves the
  scrollbar gutter on its own scroll container. That is page layout, not a
  component override — and `ScrollShadow` also paints edge shadows the container
  does not want. Left on the page.
- **`DropdownMenuContent` / `TooltipContent` / `SheetContent` exit animations.**
  Same missing fill mode as §36, no reported symptom. Changing three more
  floating surfaces on the strength of one measurement is how a fix becomes a
  regression.
- **`Badge size="sm"` radius.** Archived — the request against `Badge` was the hairline, and this was never part of it.
  Out of scope for a round that was about where components come from.

## 63. `Checkbox` — the tick and the bar were two different weights

`src/components/Checkbox/Checkbox.tsx`, `Insightis/pages/kit-theme.css`

```diff
- <span className="… h-0.5 w-2.5 …" />   /* 2px */
+ <span className="… h-[1.5px] w-2.5 …" /> /* 1.5px */
```

The tick is a 12px lucide glyph at `strokeWidth={3}`; in a 24-unit viewBox that
renders at **1.5px**. The indeterminate mark is not a glyph at all — it is a
`<span>` — and it took `h-0.5`, the nearest step Tailwind offers, which is
**2px**. So one control drew its two states at two weights, and switching a
checkbox from checked to indeterminate made the mark visibly heavier.

1.5 rather than 2, because the tick’s weight is the one the icon system sets:
it comes from the stroke ladder every other glyph in the package uses, while
the bar’s 2px came from a spacing scale that has no 1.5 step. `h-[1.5px]` is an
arbitrary value on purpose — the alternative is to bend the glyph to the
spacing scale, which would make one checkbox heavier than every icon beside it.

**The kit had the same mismatch**, and for the same reason: its tick is
`<svg width="12" stroke-width="3">` and `.cbx.is-indeterminate::before` was
`height:2px`. Both are 1.5px now.

## 64. `DataSourceCard` — the tile could be narrower than its own action

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

## 65. `liftOnHover` — one elevation recipe instead of two copies

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

## 66. `Card` — two variants had no box, and one had a shape a card cannot take

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

## 67. `DataSourceCard` — the popular flame is gone

`src/components/DataSourceCard/index.tsx`

The `isPopular` prop, the inlined `FlameMark` and the 18px ring it sat in are
removed, with the `Popular` story. The tile is a connector and its name; a
second mark on the logo was an editorial signal the catalog does not need.

It also took the last positioned element out of the content layer, which is
what had made the scrim ordering fragile.

## 68. `Autocomplete` — the clear and the chevron painted as placeholders

`src/components/Autocomplete/index.tsx`

Both controls were `IconButton asChild`, which renders the child instead of a
button — so what reached the addon was a bare `<svg>`, and the addon’s rules
read that literally. `[&>svg]:text-ink-inactive` is the DECORATIVE glyph rule,
while `[&>button]:text-ink-secondary` and its hover step matched nothing at
all. Two clickable controls painted at the placeholder step and never answered
the pointer. Measured: `rgb(124 140 162)` — `--ink-inactive`.

Both are `InputGroupAction` now (§47), which is also a real `<button>` under
the `aria-label`: an `<svg>` with a label and a click handler is not a control
to a screen reader. Measured after: two buttons, 24px, `rgb(90 106 128)` =
`--ink-icon`, and no bare `svg` left as a direct child of the addon.

Separate from §24, which lists Autocomplete for a different defect — its
disabled option still fades at `opacity-50`.

## 40. `StepSlider` — four measurements against a spec that argues for each one

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
Same trick as `.swt::before`, which the package did implement correctly (§30 of
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

## 42. The size ladder — the package grows the box, the kit grows the type · **Fixed**

**The canonical ladder. Four sources carry this table and they must agree:** this
file, `Insightis/reports/2026-09-04-insightis-ux-audit.md` (#15, #36),
`Insightis/reports/2026-09-19-prod-interaction-states-migration.md` and
`Insightis/pages/kit-theme.css`. The package is the implementation of it.

| step | height | button padding | field padding | gap | label | glyph |
|---|---|---|---|---|---|---|
| xs | 28 | 8 | 8 | 4 | 12 | 14 |
| sm | 32 | 12 | 12 | 6 | 14 | 16 |
| md | 36 | 12 | 12 | 8 | 14 | 16 |
| lg | 40 | **16** | 12 | 8 | 16 | 20 |
| xl | 44 | **20** | 12 | 8 | 16 | 20 |

The button opens out at `lg` and `xl`; the field family — `Input`,
`InputGroup`, `Autocomplete`, `TextArea` — holds 12px and does not. They share
an edge at `xs`, `sm` and `md`, which is every step the product uses. The gap
has three steps, not two. There are no half-steps.

Missed on the first pass, and it is the largest single divergence in this audit.
I checked heights and stopped, because `insightis-audit-implementation.md` states
the padding ladder as settled — *"`Button`, `InputGroup` and `TextArea` horizontal
padding now follows one ladder (8/12/12/16/20 for xs/sm/md/lg/xl)"* — and I took
the changeset's word for it instead of measuring the kit. The heights do match,
all five steps, in all four components. Nothing else about `lg` and `xl` does.

### `Button`

`kit-theme.css` `.btn`, `.btn-xs` … `.btn-xl` · `src/components/Button/index.tsx:112-118`

| size | height | padding — kit | padding — package | label — kit | label — package |
|---|---|---|---|---|---|
| xs | 28px | `.5rem` = 8 | `px-2` = 8 ✅ | Label M — 12 | `text-xs` = 12 ✅ |
| sm | 32px | `.75rem` = 12 | `px-3` = 12 ✅ | Label L — 14 | `text-sm` = 14 ✅ |
| md | 36px | `.75rem` = 12 | `px-3` = 12 ✅ | Label L — 14 | `text-sm` = 14 ✅ |
| **lg** | 40px | `.75rem` = **12** ❌ | `px-4` = **16** | Label XL — **16** | `text-sm` = **14** ❌ |
| **xl** | 44px | `.75rem` = **12** ❌ | `px-5` = **20** | Label 2XL — **18** | `text-sm` = **14** ❌ |

> **Amended (label).** 18px was taken out again after review — too large for a
> control label at any step. `xl` sits at 16px, the same rung as `lg`, in the
> package *and* in `kit-theme.css`. See §46.
>
> **Amended 2026-09-20 (padding) — the ❌ moved to the other column.** This
> section read the kit as the reference and marked the package's 16/20 as the
> defect. It is the other way round: the UX audit's tables (#15, #36) are the
> spec, they say 8/12/12/16/20, and `kit-theme.css` was the copy that had not
> caught up — every `.btn` step from `sm` up carried `padding: 0 .75rem`. The
> kit now carries 16 and 20, and the paragraph below about "what a bigger button
> means" is kept only as the record of the wrong reading.

Gap too: `.btn{gap:.5rem}` = 8px, tightening to `.25rem` = 4px at `xs`. The
package is `gap-1.5` = 6px at every size.

> **Revised 2026-09-20 — the gap ladder has three steps, not two: 4 / 6 / 8 / 8 / 8.**
> 8px reads loose at 32px against a 14px label, and `sm` is the step the product
> uses most — so the published package's flat 6px was right *there* and wrong
> everywhere else. `.btn-sm` now carries `gap:.375rem` in the kit, `sm` carries
> `gap-1.5` in the package, and the field ladder takes the same step:
> `.field.is-sm`, `.igrp.is-sm .igrp-input` (glyph → text) and
> `.igrp.is-sm .igrp-add` (between two addon children).

~~**The two systems disagree about what "a bigger button" means.** The kit holds
the horizontal inset at 12px from `sm` upward and lets the *label* grow —
14 → 16 → 18. The package holds the label at 14px and lets the *padding* grow —
12 → 16 → 20. Both produce a wider control; only one produces a more prominent
one.~~

**Struck 2026-09-20.** It is not either/or: a bigger control grows **both**. The
padding opens to 16 and 20 *and* the label steps to 16, which is what the
canonical table at the top of this section says. The reading above came from
treating `kit-theme.css` as the reference when the audit report is.

### `InputGroup` / `Input`

`kit-theme.css` `.field`, `.field.is-*`, `.igrp`, `.igrp-add`, `.igrp-input` ·
`src/components/InputGroup/index.tsx`

**Measured, not read.** An earlier draft took these numbers from `.field` and
presented them as the InputGroup's. They are not the same component: the kit has
two field implementations, and they put the edge in different places.

| | shell padding | where the inset actually lives |
|---|---|---|
| `.field` — the plain Input | 8 / 12 / 12 / 12 / 12 | on the shell |
| `.igrp` — the composite | **0 at every step** | on the parts: `.igrp-add{padding-left:12px}`, `.igrp-input{padding:0 12px 0 8px}` |

So the only comparable number is the one a reader sees — the distance from the
field's border to its first glyph. Measured in the rendered kit:

| size | height | edge → glyph | glyph | trailing action → edge |
|---|---|---|---|---|
| xs | 28 | **8** | 14 | 4 |
| sm | 32 | 12 | 16 | 8 |
| md | 36 | 12 | 16 | 8 |
| lg | 40 | 12 | 20 | 8 |
| xl | 44 | 12 | 20 | 8 |

The package reaches the same edges by a different route, and deliberately: the
audit moved the inset **onto the shell** so one component owns the field edge
instead of three. That is a structural difference from the kit, not a
discrepancy — the rendered result is what has to match, and now does at four of
five steps.

~~The fifth is a decision taken at the screen: **`xs` is 6px in the package
against the kit's 8px.**~~ **Reverted 2026-09-20 — `xs` is 8px and the ladder
has no half-steps.** The argument was that at 28px tall with a 14px glyph an 8px
edge leaves the icon nearer the border than the text it introduces. It cost the
one thing this section exists to restore: `Button` `xs` stayed at 8, so a field
and a button beside it stopped sharing an edge at exactly that step — and it
left the package as the only one of four sources carrying 6. Settled at 8. See
§46, "The 28px field tightens to a 6px edge".

Field text, which the shell padding says nothing about: `sm` 12 → **14px**,
`lg` and `xl` 14 → **16px**. The `sm` step is a correction in its own right —
the earlier "13 → 14" migration rounded it down to 12 where the kit's `sm` field
has always been Body M.

The addon gap at `xs` tightens to 4px through a compound variant, matching the
kit's `.field.is-xs` and its trailing `action → edge` of 4px.

### `TextArea`

`kit-theme.css` `.ta`, `.ta.is-*` · `src/components/TextArea/index.tsx:45-51`

| size | padding y/x — kit | padding y/x — package | font — kit | font — package |
|---|---|---|---|---|
| xs | `.25rem .5rem` = 4/8 | `px-2 py-2` = 8/8 ❌ | Body S — 12 | `text-xs` = 12 ✅ |
| sm | `.375rem .75rem` = 6/12 | `px-3 py-2` = 8/12 ❌ | Body M — 14 | `text-xs` = **12** ❌ |
| md | `.5rem .75rem` = 8/12 | `px-3 py-2` = 8/12 ✅ | Body M — 14 | `text-sm` = 14 ✅ |
| **lg** | `.5rem .75rem` = 8/12 | `px-4 py-2.5` = 10/16 ❌ | Body L — **16** | `text-sm` = **14** ❌ |
| **xl** | `.625rem .75rem` = 10/12 | `px-5 py-3` = 12/20 ❌ | Body XL — **18** | `text-sm` = **14** ❌ |

`sm` is the one place the package's own "13 → 14" migration overshot: the kit's
`sm` is Body M (14), and the package reads `text-xs` (12).

### The glyph ladder — one scale, read by four things

`kit-theme.css` declares it once — `--icon-xs:14px`, `--icon-sm:16px`,
`--icon-md:16px`, `--icon-lg:20px`, `--icon-xl:24px` — and four selectors read
it: `.btn svg`, `.iconbtn svg`, `.field .field-icon`, `.igrp .igrp-add svg`. The
same five values in all four.

| size | kit | Button was | IconButton was | InputGroupAddon was |
|---|---|---|---|---|
| xs | 14 | 14 ✅ | 14 ✅ | **16** ❌ |
| sm | 16 | 16 ✅ | 16 ✅ | 16 ✅ |
| md | 16 | 16 ✅ | 16 ✅ | **20** ❌ |
| lg | 20 | **16** ❌ | **16** ❌ | 20 ✅ |
| xl | 24 → **20** | **16** ❌ | **16** ❌ | **20** ❌ |

A field and a button of the same size carried different glyphs — at `md`, 20px
in the field against 16px in the button standing beside it. Every step except
`sm` disagreed with something.

The package has no `--icon-*` tokens, so the three cva ladders have to agree by
hand. Each now carries a comment naming the ladder it belongs to, which is the
only guard available: nothing in the build compares them, and a fourth component
adopting a glyph size would have no scale to read.

### This is why the rung was missing

The three `textStyle` rungs missing from `Typography` are **Label XL (16/24)**,
**Label 2XL (18/28)** and **Body XL (18/28)** — and this section is what they are
for. `.btn-lg` is Label XL, `.btn-xl` is Label 2XL, `.ta.is-xl` is Body XL. The
package omitted the rungs and kept the labels flat, which is at least
self-consistent; it is simply a different design from the one the kit ships.

It also **closes the 18px open question**. I flagged the kit as contradicting
itself — listing 18px under *не на шкалі* while Body XL and Label 2XL are both
18/28. The stylesheet settles it: `--ts-label-2xl-size: var(--text-18)` and
`--text-18: 1.125rem`. 18px is a real rung; the *не на шкалі* line is about 18px
used with a weight and line-height that are not one of the nineteen, not about
the size itself.

### What was done

The kit's model, applied. `lg` and `xl` hold their padding at 12px and grow the
label, the field text and the glyph instead; `InputGroup`'s `sm` field text is
corrected from 12 to 14; the `xs` addon gap tightens to 4px through a compound
variant; and `Typography` gains `body18`, `label16` and `label18` — the three
rungs this ladder needs, which settles the missing-rung question along with it.

| | before | after |
|---|---|---|
| `Button` / `IconButton` padding | `lg` 16, `xl` 20 | both **12** |
| `Button` label | `lg` 14, `xl` 14 | **16**, **16** (18 reverted — §46) |
| `Button` gap | 6 everywhere | **8**, tightening to **4** at `xs` |
| glyph, all three ladders | 14/16/16/16/16 and 16/16/20/20/20 | **14/16/16/20/20** |
| `InputGroup` padding | `lg` 16, `xl` 20 | both **12** |
| `InputGroup` field text | 12/12/14/14/14 | **12/14/14/16/16** |
| `TextArea` padding y/x | 8·8 / 8·12 / 8·12 / 10·16 / 12·20 | **4·8 / 6·12 / 8·12 / 8·12 / 10·12** |
| `TextArea` font | 12/12/14/14/14 | **12/14/14/16/16** |
| `Typography.textStyle` | 18 styles + `display` | **19** + `display` — `label16` only (§46) |

`.changeset/size-ladder-kit-alignment.md` carries the per-step detail and the
breaking-change note. It is a **major**: an `xl` button gets narrower and its
label larger at the same time, so any layout sized around the old proportions
needs a second look, and anything reaching for `lg`/`xl` *because* they were
wider should ask for an explicit width instead.

`tsc --noEmit` passes. What it cannot tell you is whether the result looks right
— the ladder is class strings over tokens, so the gate is Storybook (SPEC
decision 10), and the published build is still the pre-audit baseline. Nothing
here is verifiable by eye until that is rebuilt.

Padding-driven scaling is what was wrong with the old model, beyond
non-conformance: `px-5` on a 44px control beside a 14px label — a label unchanged
since `sm` — reads as loose rather than large. Growing the content is the only
thing that makes a five-step ladder legible at a glance.

## 44. `TableCell` — a row that could not grow, under a comment saying it could

`src/components/Table/TableCell.tsx`, `.design-sync/gen-classlist.mjs`

The cell base carried this, and the comment above it was wrong:

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
hand — §21's failure mode exactly: un-enumerated, they compile to nothing in the
`ds-bundle` and a fixed-layout table silently stops truncating, with Storybook
still showing it working because Storybook compiles from source.

### Breaking

A table relying on single-line rows gets taller rows the moment a value wraps.
Two ways back, and the second is the better one: `layout="fixed"` on the table,
or `truncate` on the specific cells that should clamp — which is what the kit
does, and it keeps the decision beside the column it applies to.

## 46. The icon surface — a ladder the bundle never compiled, and three decisions on top of it

Four changes that arrived together while the size ladder (§42) was being
reviewed by eye. Three are design decisions taken at the screen; the fourth is
the reason none of them would have shipped.

### The ladder stops at 20px, and the type stops at 16px

`--icon-xl` in the kit is 24px. On a 44px field a 24px glyph reads as an icon
that outgrew its control, and it dwarfs the text beside it. The ladder now
repeats at both ends — **14 / 16 / 16 / 20 / 20** — the way it already repeats
16 across `sm` and `md`.

The type ladder took the same cap. `xl` was Label 2XL / Body XL at 18px; it is
now 16px, the same rung as `lg`. So `Typography` keeps **`label16`** and the two
18px rungs added an hour earlier — `body18`, `label18` — are gone again: nothing
in the control ladder reaches for them any more, and an unused rung on a named
scale is an invitation to use it.

**Changed in three places**, because the ladder exists in three: the package,
`Insightis/pages/kit-theme.css` (`.btn-xl`, `.igrp.is-xl .igrp-input`,
`.field.is-xl input`, `.ta.is-xl`), and this file. The kit is the reference the
audit measures against, so leaving 18px there would have made the package look
non-conformant at the next pass.

> `Typography`'s prose scale still has `text-lg` in `h4`, `h5` and `large`.
> Untouched deliberately: those are headings in running text, not control
> labels, and the 16px cap is about controls.

### A field's two glyphs were sized by two different mechanisms

`PasswordInput` showed it plainly: the leading lock grew with the field while the
trailing eye stayed 16px at every step.

The lock is a **direct child** of `InputGroupAddon`, so `[&>svg]:size-*` reaches
it — and out-specifies the `size-4` the component wrote on the icon, because a
child selector beats a plain class. The eye sits **inside an IconButton**, which
the addon deliberately does not reach (§8), and whose own `[&_svg]:size-*`
likewise beats any class on the glyph. So the icon's own `className` was
decorative in both cases, and the two ends of the field disagreed.

The fix is to stop writing sizes on icons at all: the lock carries no size class,
and the toggle receives the field's step as the IconButton's `size` prop.

The kit is firmer still — a control docked in a field is a sub-part of the field
(`.igrp-act`, `width: calc(var(--icon-md) + 8px)`), not an entry on the
IconButton ladder. `variant="transparent"` gets the "no surface" half of that;
the size map gets the other half.

### The leading glyph takes the placeholder's ink

```
[&>svg]:text-ink-inactive          decorative glyph — reads as placeholder
[&>button]:text-ink-secondary      docked control — rest
[&>button:hover]:text-ink-body     docked control — hover
```

A decorative glyph belongs to the placeholder, not to the content: an empty
field should be one weight of grey, not two. Scoped to the addon's direct `svg`
so addon *text* and a `kbd` keep the addon's own colour — those are labels, and a
label at placeholder weight reads as disabled.

The hover half is the kit's `.igrp-act` recipe exactly — `--ink-secondary` at
rest, `--ink-body` on hover. It is written as `[&>button]` because the nested
IconButton sets its own `text-ink-body` and a plain class would lose to it, which
is the same specificity trap as the glyph sizes above.

**This is a deliberate step away from the kit**, and the only one in this
section: `.igrp .igrp-add` puts the leading glyph on `--ink-secondary`, one step
darker than the placeholder. Recorded here rather than silently absorbed.

### The 28px field tightens to a 6px edge — **reverted 2026-09-20**

`InputGroup` `xs` moved from 8px to 6px, the only half-step on the ladder, on
the argument that at 28px tall with a 14px glyph an 8px edge leaves the icon
nearer the border than the text it introduces.

It cost more than it bought. `Button` `xs` stayed at 8px, so at that one step a
field and a button beside it no longer lined up — the property §42 exists to
restore — and the package was then the only one of four sources carrying 6:
`kit-theme.css` (`.field.is-xs{padding:0 .5rem}`), the UX audit's table and the
prod-migration report all say 8. Settled in that direction. `xs` is 8px, and the
ladder has no half-steps.

### The whole icon surface was missing from the bundle's vocabulary

`.design-sync/.cache/ds-classlist.txt` contained **zero** `svg`-scoped classes.
Not one. Every glyph rule in the library is written as a child or descendant
selector on the control — `[&_svg]:size-4` in `Button`, `IconButton`, `Badge`,
`File`; `[&>svg]:size-*` in `InputGroupAddon`; `[&_svg]:stroke-[1.75]` in
`DropdownMenuItem` — and the enumerated vocabulary the `ds-bundle` compiles from
generated none of them.

So in the bundle none of those rules existed: no glyph ladder, no shrink guard,
no menu stroke weight. Every icon fell back to whatever `lucide-react` renders,
and nothing failed — this is §21's failure mode at library scale rather than on
one class.

It stayed invisible for the reason that mode always stays invisible: **Storybook
compiles Tailwind from source**, so the ladder worked perfectly everywhere it was
being reviewed. Only a page built from the bundle would have shown it, and a
wrong icon size looks like a design choice.

`gen-classlist.mjs` now enumerates the size steps in both `[&_svg]` and `[&>svg]`
forms, plus the colour, stroke and shrink rules. `pnpm check-bundle-css` is the
gate that should have caught this and is worth re-running against a fresh `dist`
— its last clean report predates every change in this section.

---

# Open questions

| | |
|---|---|
| **`Card variant="ghost"`** | Closed. The variant stays — it is the dashed "browse more" tile, as `Card.stories.tsx` always said; the surface is `bg-transparent` and is now written that way; `DropZone` is a separate component, not a rename of this one. The docs fix has landed: `Card.md` now describes the tile. |
| **Row density** | Still ~44px — web density. A desktop app runs 32–36px and fits half again as many rows. A system-level decision, not a page one. |
| **`TextArea` at the limit** | The counter is always neutral. Whether it should signal at the boundary — and whether that is an error or only a warning — is undecided. |
| **A subtree cannot opt back into light** | `globals.css` defines the light tokens on `:root` alone and the dark ones under `.dark`, so a subtree can be made dark inside a light app — a class is all the cascade needs — but **not the reverse**. Anything that wants to read as separate from the app (the prototype's review bar, a preview of light chrome inside a dark tool, an embedded document) therefore works in one direction only. The fix is one line — mirror the light block onto `:root, .light` — but it doubles a token block, so it is a decision, not a tidy-up. Referenced from `connections/page.jsx` and `workspaces/page.jsx`. |

## Raised by the kit ↔ Storybook audit

Three are contradictions **inside the kit**, and the package cannot implement
either side until the design answers:

| | |
|---|---|
| **`--tbl-row-pressed`** | Prose says neutral, `--tint-6` of `--ink-primary`. CSS says `color-mix(in srgb, #07807E 4%, transparent)` — brand teal, off the tint scale. |
| **18px in the type scale** | `Body XL` and `Label 2XL` are 18/28 and on the list of nineteen; the same section lists 18px under *не на шкалі* with migration 18→20. See §46. |
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
