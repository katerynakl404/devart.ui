# Design-system changes found while building on it

Where **`@devart/ui-react`** differs from the developers' library — `upstream`,
`devart/components/devart.ui.react`, at their 1.2.0 (8d69821). A change the
developers have since shipped, and this package has taken, leaves this file and
its number is listed under *Retired numbers*; what is left is what a developer
would not find in `upstream`.

Every one was found the same way: by assembling a real screen out of real
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

## How a fix reaches the products

The fixes are in the source, so both products get them — but propagation is a
**copy, not a subscription**:

- `ds-bundle` must be rebuilt and copied into each product.
- The corporate repository `devart/components/devart.ui.react` has none of this;
  the work sits on `design-sync/insightis-audit` in `katerynak/design-system`.

Any bridge duplicating a fix in a product's own CSS — `_shared/pages.css` carries
a few, each signed with a comment — must be removed once the bundle lands. Left
in place it does not merely duplicate, it **masks**: the next regression in the
library would look fine on the page carrying the override and ship broken to the
one without it.

---

## What changed

By component, its changes in number order; the number is its section below.
`draft` — new and not signed off: nothing should be built on it yet. `open` —
found and written down, not fixed.

| Component | Changes |
|---|---|
| `Accordion` | §49 `AccordionItem` `standalone` — an item that is its own surface<br>§69 `AccordionTrigger` `size` — a trigger that is a section heading · draft |
| `ActivityTray` | §79 the kit's values on their tray — the chevron, the scrollbar, the exits |
| `Alert` | §95 `title` is optional — a description-only Alert |
| `AlertStack` | §149 **new** — several notices as one deck · draft |
| `Annotation` | §121 **new** — `AnnotationGroup`, labels that point at controls inside a lit area · draft |
| `Autocomplete` | §3 selected and highlighted painted the same<br>§62 the clear and the chevron painted as placeholders |
| `Badge` | §33 the hairline is the base, not a second variant<br>§65 a fixed-height pill whose label could wrap<br>§83 `leading-none` clipped every descender<br>§86 `xs` was the same pill as `sm` — removed |
| `Banner` | §85 the dismiss was a tertiary button on a painting<br>§90 `sm` kept the default's line gap |
| `Button` and `IconButton` | §66 a switched-off control lit up under the pointer<br>§80 a disabled `secondary` has no fill, and `destructiveSecondary` disables the same<br>§101 `IconButton` `3xs` — 20px, the tree-row toggle · draft<br>§147 `destructiveOutline` → `destructiveSecondary` — the secondary's destructive form |
| `Card` | §4 `outline` — the hover border tint is gone<br>§59 `liftOnHover` — one elevation recipe, 1px<br>§60 `elevated` and `ghost` carry the card's box<br>§78 `variant="row"` — its height is padding, not a ceiling<br>§123 `CardFooter` `sticky` — a tall card keeps its actions in reach · draft |
| `Checkbox` | §57 the tick and the bar at one weight, 1.5px |
| `ChoiceCard` | §118 **new** — `ChoiceGroup` · `ChoiceCard`, a card-sized answer to a question · draft |
| `Coachmark` | §120 **new** — the card next to what a spotlight lights · draft |
| `CodeBlock` | §48 a snippet and the control that copies it, as one object · draft<br>§81 scrolled with the browser's own bar<br>§127 a header, line numbers, a height, wrapping<br>§128 `variant="error"`<br>§129 syntax colours — `--code-*`, `codeSyntaxVariants` |
| `ConnectorLogo` | §16 connector marks as data-URIs, a monogram for the rest · draft<br>§108 the DB2 mark — it fell back to a "D"<br>§115 the SQLite mark — it fell back to an "S" |
| `DropdownMenu` | §43 two rows it could not draw — `accent`, `DropdownMenuRow` · draft<br>§55 a link may open a menu · draft<br>§74 the focus ring a closed menu left behind<br>§130 `DropdownMenuItem` `isExternal`<br>§131 **new** — `DropdownMenuSegmentedItem`, a choice that keeps the menu open · draft |
| `FilterMenu` | §148 **new** — a filter as a pill, plain or a hierarchy, with counts and a ✕ · draft |
| `HighlightText` | §109 **new** — what a search matched, marked in the name · draft |
| `InlineRename` | §132 **new** — a row title edited in place · draft |
| `InputGroup` | §7 `InputGroupAddon` resized glyphs it did not own<br>§9 a field label as loud as the hint beneath it<br>§45 `InputGroupAction` — the docked-icon inks<br>§102 `xs` — the clear ✕ where the search icon is<br>§106 `InputGroupAddon` — the glyph in the placeholder's grey |
| `LinkButton` | §46 the kit's text link, which the package never had · draft |
| `ListPageLayout` | §133 the header condenses, and the body takes a class |
| `MetaRow` | §52 the line above a list, and the 4px to it · draft<br>§134 `sticky` and `stickyOffset` |
| `Modal` | §71 a `size` ladder — sm, md, lg, xl — and a height it cannot pass · draft |
| `PageHeader` | §15 the back control; `titleLeft` first, `titleRight` 12px from the title · draft<br>§67 `condensed` — the header once the page scrolls · draft<br>§111 the collapse animates whole — title, arrow, 240ms · draft<br>§135 the title truncates; `wrapTitle` wraps it |
| `Pagination` | §82 `showPageNumbers` — a stream read in order · draft<br>§93 a `size` rung, and the `pageFloor` recipe · draft |
| `PinToggle` | §136 **new** — pin a row · draft |
| `Popover` | §34 a closed panel stayed painted<br>§88 floated on the page colour |
| `ProgressBar` | §105 `trackVariant` — a bar split in two · draft |
| `PromoCard` | §116 the hover holds over the dismiss |
| `RowMenuButton` | §137 **new** — the ⋮ at the end of a list row · draft |
| `SearchInput` | §145 `results` — the matches while typing; `variant`, `disabled`, `autoFocus` and the rest passed through · draft |
| `SegmentedControl` | §73 `tone` — a selected half that means included or excluded · draft<br>§96 `tinted` — an inherited value; tone fills in dark · draft<br>§103 `deselectable` — none is a state · draft |
| `SelectableListCard` | §138 keyboard, `aria-selected`, `menu` |
| `Sidebar` | §10 `SidebarHeader` owns the horizontal inset<br>§11 `SidebarMenuButton` tooltips had no styling<br>§12 `SidebarMenuButton` — a 32px box its padding did not fit<br>§14 collapsing could remove the only way to expand<br>§35 the fixed panel was pinned to the viewport<br>§39 `SidebarMenu` rows 4px apart where the kit says 2<br>§64 `SidebarContent` — the nav column had no gutter<br>§72 the collapsed rail was never finished<br>§94 the product shape — sections, chat row, promo slot, compact footer<br>§139 `SidebarUser` — the rail lost the name<br>§140 `SidebarProvider` — the sheet outlived the phone layout<br>§141 `SidebarChatItem` — the ⋮ where there is no hover, `countLabel`<br>§142 `SidebarNavItem` `badge`, an element as `icon`<br>§143 the triggers' tooltips<br>§144 `SidebarStat` `asChild` |
| `Spotlight` | §119 **new** — the scrim around a lit target, and `useTargetRect` · draft |
| `StatTile` | §47 label, value, caption — one number and what it counts · draft |
| `StatusView` | §51 the illustration is a pack — empty, and empty search<br>§104 a wider message, 48ch<br>§107 `EmptySearchIllustration` visible on a white card |
| `StepProgress` | §117 `counter`, `showStepTitle`, `fill`, `size`, and read-only bars · draft |
| `Stepper` | §36 `StepperIndicator` — the numbered rail the headless Stepper never shipped · draft |
| `Table` | §6 `TableHead` — the sort glyph did not hover with its label<br>§42 `TableCell` — a row that could not grow<br>§50 `TableCell` — pressed belonged to whatever was pressed<br>§53 `TableHead` `width` — a share, not a size<br>§54 `TableRow` `nested` — the child row's 8px<br>§56 `density` — a compact row step · draft<br>§76 a clickable row kept the text cursor |
| `Tabs` | §8 `TabsContent` — the inactive panel came back as an empty box |
| `TextArea` | §41 `hintText` — the counter row's empty slot<br>§70 the hint at 400; the counter and error lines |
| `Toast` | §75 a stack of toasts, each a different width |
| `Tooltip` | §13 the arrow put the gap off the 4px scale<br>§63 the delay before it opens |
| `Tour` | §122 **new** — a guided walk: Spotlight, Coachmark, annotations · draft |
| `Typography` | §100 an 18px rung, as prod sets it<br>§113 `lineThrough` ran along the tops of the lowercase |
| Tokens and colour | §2 dark destructive border — hover made it *less* visible<br>§5 `--ink-icon` / `--ink-icon-hover` — a standalone icon<br>§6a table rows as washes that stack; `--brand-300` retuned<br>§87 **new** — colour packs, `palettes.css` · draft<br>§129 `--code-*` — syntax colours, AA in both themes |
| Sizes and glyphs | §40 the size ladder<br>§44 the icon surface — the glyph ladder, and the bundle that had none<br>§92 glyph stroke — one weight, set in CSS |
| Across components | §98 `Table`, `ModalBody` — the system's scrollbar<br>§99 disabled controls — the not-allowed cursor |
| Build and tooling | §19 a variant that is not enumerated is never compiled<br>§20 `pnpm bundle` and `pnpm check-bundle-css`<br>§37 `bg-surface-card/85` compiles to nothing · open<br>§84 the class list — list markers, `last:` borders |
| Synced from upstream | §97 the developers' 1.1.0 parts — what stays different<br>§146 the developers' 1.2.0 parts — what stays different |

Retired numbers, and where what they said lives now: §18 → §51 · §21 → §33 ·
§23 → §75 · §27 → §142 · §58, §61, §77 → §97 (`IconCard`) · §110 → §67 ·
§1, §17, §25, §28, §30, §68, §89, §91 → in `upstream` · §116 was given twice —
`PromoCard` keeps it, `SearchInput` is §145.

Open, and the same in `upstream`, so under *Open against the kit*: §22, §24,
§26, §29, §31, §32, §38.

---

# `Accordion`

## 49. `AccordionItem` — an item that is its own surface

`src/components/Accordion/AccordionItem.tsx`

```ts
variant: 'divided' | 'standalone'   // default 'divided'
```

`divided` is what it always did: a rule under every item but the last, items
stacked inside one surface — `border-b last:border-b-0` since §97 (it was
written as `not-last:border-b`, a Tailwind v4 variant this build compiles to
nothing). `standalone` drops the rule, for one `Card` per section.

The two are not a style choice. A shut section inside a shared surface reads as
a gap in that surface; a shut section that IS a card reads as a closed object,
which is what it is. Without the variant the consumer cancels the divider with
`border-b-0` on every item — a page overriding a component because the component
has one layout and the page needs two.

**Both products.** Additive; every existing item keeps the divider.

## 69. `AccordionTrigger` — `size` · **DRAFT**

One size, `text-sm`, which is right for an accordion inside a card and wrong for
an accordion that IS the section. In the connection form each settings group is
its own card with the trigger as its heading, so the heading of a section read
one step smaller than the `title16` headings of the sections around it — the
reviewer's note was that the section names had to be *more prominent*.

`size="md"` puts the trigger on `text-base`, matching `title16`. `sm` stays the
default, so nothing that exists changes.

Draft for the same reason as §67: it exists for one concept's form.

---

# `ActivityTray`

## 79. `ActivityTray` — the kit's values on their tray

`src/components/ActivityTray/`

The tray is the developers' (their AIINS-1948, in `upstream` since). On top of
it:

- **The chevron** takes `iconButtonVariants({ variant: 'tertiary', size: 'xs' })`.
- **The list** carries `scrollbar-thin` (§98) under its 14rem cap, the kit's
  `.upl-list`.
- **A row's error** is `text-balance` — the kit's
  `.upl-item-err{text-wrap:balance}`.
- **Leaving** — a row or the plate on its way out is `pointer-events-none`
  (`.animate-row-out`, `.animate-panel-out`).

---

# `Alert`

## 95. `Alert` — the title is optional

- **`Alert`** — `title` is now optional (`title?: string`). Without it the
  title line is not rendered, the description is the whole message, and the
  glyph sits on the description's first line (same line box at both sizes).
- **`Alert`** — a description with no title reads in `text-ink-primary`;
  under a title it stays `text-ink-secondary`.
- **Stories** — new `DescriptionOnly`.

Raised by the workspaces prototype: the Permissions and Effective Access panes
explain the rules of the tree in a paragraph (PRD Workspaces F-25, F-31). As a
titled Alert the first sentence had to be lifted out of the paragraph to serve
as a title, which read as a heading that repeated the copy beneath it. There
was no way to say "an info block, no headline" short of passing an empty string,
which still rendered an empty line box above the text.

Without a title the description is the message, and in secondary ink the whole
block read grey — a footnote under a heading that is not there.

---

# `Annotation`

## 121. New — `AnnotationGroup` · `Annotation` · **DRAFT**

`src/components/Annotation/index.tsx`

Labels that point at specific controls inside a lit area. Every label sits on
one line (`top`) and fans out from its target without overlapping its
neighbour; a curved Brand/Primary arrow runs from it to a dashed ring 3px
around the target, concentric with it (the target's radius + 3). Rings side
by side never touch — they split the gap and keep 6px apart.
`<Annotation target icon>text</Annotation>` renders nothing on its own — the
group reads its children and draws them, portalled above the spotlight;
`leaving` fades it out. Hidden at 640px and below, where the coachmark lists
the same texts instead (`Tour` does that).

**Both products.** New components, no call sites in the package.

---

# `Autocomplete`

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

## 126. `Autocomplete` — its label is every other field's label

`src/components/Autocomplete/index.tsx`

Every field draws its label the same way — `InputGroup`, `PasswordInput` (through
`inputGroupProps`) and `TextArea`: Text/Body, medium, 4px over the field.
`Autocomplete` drew its own in **Text/Secondary** with **6px** under it, so in one
form (Insightis "Create metric": Name · Alias · Definition · Data Source) the last
label read as a hint and sat 2px further from its field. Owner's call (2026-10-16):
all labels identical.

```diff
- textColor="secondary"
- className="mb-1.5 block"
+ textColor="body"
+ className="mb-1 block"
```

Text/Secondary stays the hint's colour (`hintText` under the field), which is
what the InputGroup comment already says. A recipe fix with no API change:
**patch** (`.changeset/autocomplete-label.md`).

---

# `Badge`

## 33. `Badge` — the hairline is the base, not a second variant

`globals.css`, `src/lib/constants.ts`, `src/components/Badge/index.tsx`

The kit defines one border and applies it to every chip, mixed from
`currentColor`, so the border *is* the chip — teal on Primary, neutral on
Secondary, green on Success, red on Error; `.badge-flat` opts out. The package
had it inverted: five of seven variants `border-transparent`, and the bordered
forms as extra variants (`brand`, `green`) with tokens of their own, so
`attention`, `success` and `error` could not be bordered at all. Shipped because
the page could not stop drawing the border by hand until it was — `.sync-chip` in `_shared/pages.css` was exactly the kit's rule, written
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

## 83. `Badge` — the pill cut the tail off a g

`src/components/Badge/index.tsx`

Reported as text being cut in a badge, and it was — downward, not sideways.
`PostgreSQL` lost the bottom of its **g** while every other letter looked
whole, which is why it read as a rendering fault rather than as a measurement.

The label carried `leading-none`: a line box exactly the size of the font, 14px
for a 14px label. A descender lives BELOW that box, and the pill hides its
overflow (§65) — so the tail was clipped by the chip that was
supposed to contain it. Nothing was wrong with the width, which is where the
first look goes.

`leading-none` and the `align-text-top` beside it are gone. The label now takes
the line-height the type scale pairs with its size, which is also what the kit
states for `.badge` — `line-height: var(--ts-label-m-lh)`. Measured across the
four sizes, every line box is 4px taller than its font and sits clear of both
edges:

| Pill | Font | Line box | Clearance |
|---|---|---|---|
| 20px | 12 | 16 | 2 / 2 |
| 28px | 12 | 16 | 6 / 6 |
| 32px | 14 | 20 | 6 / 6 |
| 36px | 14 | 20 | 8 / 8 |

The pill does not grow: its height comes from `size` and the row is
`items-center`, so the taller line box centres inside the same chip.

## 86. `Badge` — a step that was not a step

`src/components/Badge/index.tsx`

Reported from a call site moving a pill from `sm` to `xs`: the result looked
like a mistake, because nothing anyone could see had changed.

Measured, it had not. Both steps were **20px tall with 12px text** and differed
only in their sides — and backwards at that: the step named smaller carried the
LARGER inset.

| | Height | Sides |
|---|---|---|
| `xs` | 20px | 8px |
| `sm` | 20px | 6px |
| `md` | 28px | 10px |

`xs` is gone and `sm` keeps its own 6px. Nothing in the kit is contradicted by
either half: the kit has **one** badge — 28px with 10px sides, which is this
ladder's `md` — so `xs`, `sm`, `lg` and `xl` are all the package's own, and
the one that was indistinguishable from its neighbour is the one that went.

Call sites: `BADGE_SIZE_MAP` in `Autocomplete/BadgeList.tsx` now maps the
field's two smallest steps onto the same badge step, since there is no second
20px rung to tell them apart with; the catalogue's `Sizes` story and its
`size` control lost the rung; the AI connectivity prototype moved 12 pills.

---

# `Banner`

## 85. `Banner` — the dismiss answers with colour, not a fill

`src/components/Banner/index.tsx`

`upstream`'s dismiss is `IconButton variant="tertiary" size="xs"`, a box with a
hover fill, as the kit's `.banner-close` fills on hover (`--state-hover`). On the
gradient variants that fill is a pale box sitting on the artwork, and the ✕
stops reading as part of the banner.

Here it answers with colour only — `--ink-icon` to `--ink-icon-hover` on the
solid variant, `--banner-grad-sub` to `--banner-grad-text` on the gradients — in
a 32px box, which is the hit area. Measured: background `rgba(0, 0, 0, 0)` on
both, ink `rgb(90, 106, 128)` solid and white at 80% on the gradient.

The same rule as `InputGroupAction` (§45): an icon docked on a surface that
already owns hover does not get a surface of its own.

## 90. `Banner` — `sm` kept a line gap chosen for a larger title

- **`Banner`** — `size="sm"`: title→description gap `gap-1.5` → **`gap-0.5`**.
- **`Banner`** — the body gains `data-slot="banner-body"`, so the size can reach it.

`sm` already steps the title down to 14/20, but the gap under it stayed at the
default's 6px — a value chosen for a 16px title. Beside an `Alert size="md"`,
which states the same kind of thing at the same type with 2px between its
lines, the two read as different components rather than as two sizes of one
system.

The default size is untouched: its 16px title and taller block still want the
air.

---

# `Button` and `IconButton`

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

## 80. A disabled `secondary` has no fill

`src/components/Button/index.tsx`, `src/components/IconButton/index.tsx`

`upstream` paints a disabled `secondary` `--state-disabled`
(`disabled:bg-state-disabled`), as the kit's `.s-disabled.btn-secondary` does.
Here it is transparent, which is what `outline` does: the border
(`--btn-secondary-border`) and the inactive label carry the state. Reported as
'disable secondary should have no fill'. An opaque fill depends on where it
lands — on a tinted surface (a chips row, a banner, a table header) a switched-off
button became the brightest thing in the row. `primary` keeps
`--state-disabled`: a filled button switched off has nothing else to be.

Measured: `rgba(0, 0, 0, 0)`, the border at `--btn-secondary-border`, the label
at `--ink-inactive`.

**`destructiveSecondary` is switched off the same way** (§147): disabled it is
the disabled `secondary` — `--btn-secondary-border`, no fill, the label at
`--ink-inactive` — on `Button` and `IconButton`. Both read one fragment,
`secondaryDisabled` (`src/lib/utils.ts`). `upstream` and the kit
(`.s-disabled.btn-outline-destructive`) give it the outline's `--ink-inactive`
border.

## 101. `IconButton` — `3xs`, the tree-row toggle · draft

- **`IconButton`** — new `size` value `3xs`: `size-5` (20px) with a 12px
  glyph (`[&_svg]:size-3`), the `rounded` radius as on `2xs` / `xs`, the
  `xs` spinner. Story `Sizes` and `IconButton.md` list it.

`2xs` (24px) was the smallest box, and it is the expand / collapse at the start
of every row in the workspaces' data trees (Data model, Permissions, Effective
access). One to a row, beside a 14px name, it outweighed the names. Asked for
in review of the workspaces prototype. Row actions stay `2xs`.


## 147. `destructiveOutline` → `destructiveSecondary` — the secondary's destructive form

`src/components/Button/index.tsx`, `src/components/IconButton/index.tsx`,
`src/lib/constants.ts`, `globals.css`

A red border, a red label, no fill: the bordered destructive button is the
`secondary`'s destructive form, not the `outline`'s (designer, 2026-10-20) — the
brand-bordered `outline` is a different button. Named the way its tertiary
sibling already is, `destructiveTertiary`:

| `upstream` | here |
|---|---|
| `variant="destructiveOutline"` | `variant="destructiveSecondary"` |
| `outlineDestructive.*` (`border-outlineDestructive-border`) | `destructiveSecondary.*` (`border-destructiveSecondary-border`) |
| `--btn-outline-destructive-{border,border-hover,bg-hover,bg-press}` | `--btn-destructive-secondary-{border,border-hover,bg-hover,bg-press}` |

Switched off it is the disabled `secondary` (§80). Values unchanged. Call sites
updated: `Button` and `IconButton` stories, `Modal` stories, the AI connectivity
prototype (`form.jsx`, `workspaces.jsx`) and the Insightis kit (`AcctModal`,
`AcctSettings`, `DsConnectionPanel`, `MxMetricSheet`, `SidebarChats`). **major**
(`.changeset/destructive-secondary.md`).

---

# `Card`

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

## 59. `liftOnHover` — one elevation recipe, 1px

`src/lib/utils.ts`, `src/components/Card/index.tsx`,
`src/components/IconCard/index.tsx`

`upstream` writes the lift into `Card` `elevated` —
`transition-all duration-slow hover:-translate-y-0.5` — and `IconCard` inherits
it, 2px. Here it is one recipe both import:

```ts
export const liftOnHover = (distance: 1 | 2 = 1) => cn(
  'transition-[box-shadow,border-color,transform] duration-base',
  distance === 1 ? 'hover:-translate-y-px' : 'hover:-translate-y-0.5',
  'hover:border-card-lift-border hover:shadow-lift-hover'
);
```

The distance is a parameter because it is the one part that legitimately
differs — the kit lifts a catalog tile 1px and a larger card 2px, since the
same travel reads bigger on a smaller box. Everything else is fixed, and the
transition is a scoped list: a card that animates every property also animates
its own content reflowing.

**Not a component.** `Card` is a `<div>` surface, the tile a `role="button"`
with a hover scrim and a revealed action, so the shared part is a recipe both
import, not a base component both extend.

## 60. `Card` — `elevated` and `ghost` carry the card's box

`src/components/Card/index.tsx`

`secondary` and `outline` draw `flex flex-col gap-3 p-4`. In `upstream`
`elevated` and `ghost` draw neither layout nor padding, so the card that lifts
on hover is the one every page pads itself, and an `outline` card beside an
`elevated` one sits on a different inset. Here all four carry the same box, and
`ghost`'s `items-center justify-center` has a `flex` to act on.

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

## 123. `CardFooter` — `sticky` · **DRAFT**

`src/components/Card/CardFooter.tsx`

```ts
sticky?: boolean   // default false; true → sticky bottom-0 z-10 bg-surface-card
```

A card taller than the window keeps its actions in reach. Without it the footer
scrolls with the card, so the actions of a long card sit below the fold until
the reader reaches its end. With `sticky` the footer sticks to the bottom of
the scroller while the card scrolls under it, and settles in place at the
card's end. It carries the card's own surface, so the content passing under it
does not show through, and `z-10`, so that content stays under it.

`cardFooterVariants` is exported from `@devart/ui-react/Card` now — it was
declared and never reachable — so a consumer can tell whether its build has
the variant (`cardFooterVariants({ sticky: true })` yields `sticky`).

**Both products.** Additive; every existing footer keeps scrolling with its
card.

---

# `Checkbox`

## 57. `Checkbox` — the tick and the bar at one weight

`src/components/Checkbox/Checkbox.tsx`

`upstream` draws lucide `Check` and `Minus` at 14px (`[&>svg]:size-3.5`) at
Lucide's default stroke. Here both marks are 12px at stroke 3 — 1.5px rendered,
the kit's tick (`<svg width="12" stroke-width="3">`) — and the bar is a stroke
in the tick's own viewBox, `M2 12h20`: 10px long, where Lucide's `Minus`
(`M5 12h14`) is 7px.

A stroke rather than a box of the same height: a stroke with a round cap
antialiases across more pixels than a rectangle, so at 1.5px a box bar read
thinner than the tick beside it. A mark below 16px keeps the weight its
component gives it (§92).

---

# `ChoiceCard`

## 118. New — `ChoiceGroup` · `ChoiceCard` · **DRAFT**

`src/components/ChoiceCard/`

A card-sized answer to a question: a title, an optional description, badge
and leading icon, and the chosen state — the Brand/Primary border over a 5%
brand wash. The chat's question card and the onboarding wizard's role and goal
pickers are the same row.

- **`ChoiceGroup`** — `type` `single` | `multiple`, `value`,
  `onValueChange`, `columns` 1 | 2 (side by side from 640px up),
  `aria-label` / `aria-labelledby`, `disabled`, `name`. `single` is a
  radiogroup with a roving tab stop: the arrow keys move and choose, wrapping
  and skipping disabled cards. `onPick` (single only) reports a deliberate
  pick — a click, Enter or Space — and not an arrow key walking the group, so a
  one-answer question can move on by itself; `onValueChange` reports both.
  `multiple` is a group of checkbox cards.
- **`ChoiceCard`** — `value`, `title`, `description`, `badge`, `icon`,
  `indicator` (`auto` | `none` | `radio` | `checkbox`), `disabled`. `auto`
  is a checkbox in a multiple group and nothing anywhere else: in a single
  group the card itself shows the choice and still carries `role="radio"`
  and `aria-checked`. `radio` draws the RadioButton mark on request.
  Standalone (no group) the card is a button with `aria-pressed` —
  `selected` + `onSelect` — or, with `indicator="checkbox"`, a label around
  a Checkbox.
- **`children`** — content revealed inside the card while it is chosen (an
  "Other" answer's field). The head becomes the button, with `aria-expanded`.

The leading icon is a 36px disc on the same wash. It leads the row,
top-aligned, and does not re-centre it: the padding stays the same and the
indicator stays on the title line, icon or not. A chosen card holds steady
under the pointer — only an unchosen one takes the hover recipe; pressed
shows on both.

The single group's keyboard is the card's own rather than Radix
`RadioGroup`, kept from the Insightis bridge it was ported from: Enter
chooses, and a click on the chosen card reports it again. Radix does
neither.

**Both products.** New components, no call sites in the package.

---

# `Coachmark`

## 120. New — `Coachmark` · **DRAFT**

`src/components/Coachmark/index.tsx`

The explanation next to what a spotlight lights: a popover-surface card
(Surface/Card, Stroke/Border, `shadow-dropdown`) with an arrow at the
target. `header` (a `StepProgress size="sm" fill`), `icon` (a 32px disc),
`title`, the body, `footer`; `width` `md` (352px) | `lg` (464px); `side` —
the preferred sides in order, default bottom, top, right, left.

It takes the first preferred side where it fits whole without covering the
target, 14px off it and 8px inside the bounds. When no side fits it takes
the first with 75% of the card free, else the roomiest, and pins to that
edge. It re-places itself as the page moves and reports where it went
(`onPlace`). At 640px and below it is a bottom sheet with no arrow.

`role="dialog"`, non-modal, labelled by its title, `tabIndex={-1}` so a tour
can move focus to it. `nudge` is a number; each change shakes the card once.
The shake keeps the entry animation in the `animation` list while it runs —
swapped out for the shake alone, the entry restarts when the shake ends and
the card blinks out and fades back in after every click on the scrim.
`leaving` fades it out and drops it 8px, taking no clicks.

**Both products.** New component, no call sites in the package.

---

# `CodeBlock`

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

## 81. `CodeBlock` scrolled with the browser's own bar

`src/components/CodeBlock/index.tsx`

A command wider than the block got a horizontal scrollbar, and it was the
platform's: on Windows a 16px trough with stepper arrows at both ends, drawn
under a block whose own radius is 4px and whose only other control is a 20px
copy button. Every other scroller the package ships is the kit's hairline —
`DropdownMenuContent`, `Autocomplete`'s list, `ActivityTray`'s rows all carry
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

## 127. `CodeBlock` — a header, line numbers, a height, wrapping

`src/components/CodeBlock/index.tsx`

A chat answer that ran code shows the source and what it printed, and the block
had none of what that needs. Insightis carried its own copy of this in its custom kit; owner's call (2026-10-19): what the kit duplicates comes from the library, and what the library lacks is added here, one capability at a time.

- `header` — a bar above the code (`data-slot="code-block-header"`) on
  Surface/Card with a hairline under it, for a file name, a language glyph or a
  status `Badge`. Copy moves into it, at its end, and lands on the spot it held
  in the corner: the bar is 40px at `md`, so the button stays 8px from the top
  and the end. A bare `<svg>` in it is set at 14px.
- `lineNumbers` — a gutter in Ink/Inactive that a selection and a screen reader
  both skip (`select-none`, `aria-hidden`). It counts the lines of `code`; a
  trailing newline is not a line and CRLF is one break. Not meant with `wrap`.
- `maxHeight` — the code scrolls inside it; the header stays put.
- `wrap` — output read as prose wraps instead of scrolling sideways.

The padding moved from the root to the `<pre>` and the root clips, so the header
and both scrollbars reach the edges. **One visible change to the default:** the
horizontal scrollbar sits on the box's bottom edge, not 16px inside it.

## 128. `CodeBlock` — `variant="error"`

`src/components/CodeBlock/index.tsx`

A traceback is tinted: Feedback/Red-text at the 8% step over the block's own
Surface/Page (`[&>[data-slot=code-block-body]]:bg-fb-red-text/8`), the same mix
the kit used, and no new token. The border and the header stay neutral — the
header is where the failure is named, the code under it is what failed.

## 129. `CodeBlock` — syntax colours: `--code-*` and `codeSyntaxVariants`

`globals.css` · `src/lib/constants.ts` · `src/components/CodeBlock/index.tsx`

The library ships no parser and still does not. What it adds is the palette a
caller's highlighter paints with, so highlighted code looks the same in every
product: `codeSyntaxVariants({ variant: 'keyword' | 'string' | 'number' | 'comment' })`
returns the class for a span, and `code` stays the plain text Copy copies.

| Token | Light | Dark |
|---|---|---|
| `--code-keyword` | Violet-600 #7C3AED | Violet-400 #A78BFA |
| `--code-string` | Green-700 #047857 | Green-500 #10B981 |
| `--code-number` | Blue-600 #2563EB | Blue-400 #60A5FA |
| `--code-comment` | Text/Secondary | Text/Secondary |

All four are AA on Surface/Page (light 4.9–5.5:1, dark 7.1–7.6:1). Three
primitives are new — `--violet-400`, `--violet-600`, `--green-700` — because
Chart Violet is 4.6:1 on dark and Green-600 is 3.6:1 on light. **One departure
from the kit:** comments are Text/Secondary, not Ink/Inactive, which is 3.3:1 and
fails AA. `--code-comment` joins the scoped-theme mirrors (43 → 44).

New props, a new export and new tokens: **minor** (`.changeset/code-block-header.md`).

---

# `ConnectorLogo`

## 16. `ConnectorLogo` · **DRAFT**

`src/components/ConnectorLogo/` + `scripts/gen-connector-logos.mjs`

Connector marks are embedded as data-URIs: nothing is fetched at runtime, so a
logo cannot arrive as a broken image in a consumer's build, in Storybook, or on a
design canvas. An unknown connector renders a monogram, not an empty square.
Names resolve loosely — `PostgreSQL`, `postgresql`, `Postgres` all find the same
mark — so a page never needs to know the slug.

The pack is deliberately small: it is generated from the app's SVG folder by a
script, so extending it is a re-run, not a code change.

## 108. `ConnectorLogo` — the DB2 mark

- **`ConnectorLogo`** — `db2` added to `logos.ts`, between `databricks` and
  `dynamics`, encoded as `gen-connector-logos.mjs` encodes a mark. Before,
  `connector="DB2"` had no mark and fell back to a letter.

The mark is Devart's own, from the dotConnect pages
(`cdn0.devart.com/images/logo/database/logo-db2.svg`, 60×60), not from the
Insightis app's folder the generator reads — that folder has no DB2. Its tile
filled 90% of the file and stood a size larger than the marks beside it, so it
is drawn in a 94-unit box (`viewBox="-17 -17 94 94"`): the tile takes 57% of
it, as FreshBooks' does (146 of 256). Before
the generator is next run against it, put the same file there as `db2.svg`,
or the run drops the mark.

## 115. `ConnectorLogo` — the SQLite mark

- **`ConnectorLogo`** — `sqlite` added to `logos.ts`, between `sqlazure` and
  `sqlserver`, encoded as `gen-connector-logos.mjs` encodes a mark. Before,
  `connector="SQLite"` had no mark and fell back to an "S" on a grey tile —
  in the LinkAI catalog, the one source of the six with no logo.

Devart's own mark again, from the same place as §108
(`cdn0.devart.com/images/logo/database/logo-sqlite.svg`, 60×60): the blue
square and the feather, the vendor's colours. The figure filled 81% of its
file where the marks beside it fill 64–70% (measured off the rendered images:
PostgreSQL 64, MySQL 63, SQL Server 70, Oracle 70), so it is drawn in a
74-unit box (`viewBox="-7 -7 74 74"`) and fills 66%. Before the generator is
next run against the app's folder, put the same file there as `sqlite.svg`,
or the run drops the mark.

---

# `DropdownMenu`

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

## 130. `DropdownMenuItem` — `isExternal`

`src/components/DropdownMenu/DropdownMenuItem.tsx`

A menu row that opens a new tab — Help, Terms — says so the way
`SidebarMenuRow` already does: a 14px trailing arrow in Text/Secondary, and
visually hidden text, `externalLabel` (default "(opens in new tab)"). With
`asChild` both go inside the caller's link. Insightis carried its own copy of this in its custom kit; owner's call (2026-10-19): what the kit duplicates comes from the library, and what the library lacks is added here, one capability at a time.

## 131. New — `DropdownMenuSegmentedItem` · **DRAFT**

`src/components/DropdownMenu/DropdownMenuSegmentedItem.tsx`

A menu row holding a segmented choice — the theme in an account menu — changed
without closing the menu. `label`, `options` (`{ value, label, icon? }`),
`value` / `defaultValue` / `onValueChange`, `hint`, `disabled`.

- ←/→ step and wrap; Enter and Space step forward; the menu stays open. A click
  picks the segment under it.
- A screen reader hears "Theme: Light" and the hint.
- Icon-only options name themselves in a tooltip, so it needs a
  `TooltipProvider` above.

The label sits on the left and the control on the right. The kit's row was the
control alone, full width, so the Insightis account menu changes when it moves
onto this. Both are **minor** (`.changeset/dropdown-menu-external-and-segmented.md`).

---

# `HighlightText`

## 109. `HighlightText` — what a search matched, marked · **DRAFT**

- **`HighlightText`** — new: `text`, `query`, `className`. Every occurrence of
  the query, case-insensitive, plain substring, as a `<mark>`:
  `bg-badge-brand-bg text-ink-primary font-medium rounded-sm`
  (`data-slot="highlight-text-match"`). An empty query renders the text as it is.
- **Stories** — `Default`, `InATree`.

**Where it goes: a tree, or text long enough to hide the match** — not a flat
list of short names filtered by name. There the filter already says why a row
stayed, and most products leave the rows unmarked; a mark on every row is
noise. In a tree a search shows each match with the path above it (catalog,
schema, table), and only the mark tells the matching row from the rows shown
to place it — a table kept for a column inside it, a schema kept for one of a
thousand tables.

A highlighter, because that is what a reader recognises as "this is what you
searched for": the brand tint behind the match — `--badge-brand-bg`, the
`brand` badge's fill, 1.34:1 against the card in light and 1.31:1 in dark —
under the name's own ink (`text-ink-primary`, 13:1 and 11:1 on it), with one
step of weight so the mark does not rest on colour alone. No new token: the
fill is the one the system already uses for a brand chip.

Two tries went before it, both not seen on the connections list: ink alone
(`--ink-highlight`, no fill) on a 500-weight name, and the Primary badge's
Brand-50 fill (1.14:1 against white). The `brand` badge's own text is not
used — 4.30:1 on its fill in dark. The kit's weight-only `.cl-mention-hl`
says even less on a 400 body.

What is marked is the test the list keeps a row by (`includes`, lowercased), so
the mark is exactly why the row is there. No regular expressions: a query is
text, and `a.b` means a, a dot, b.

Used in the AI connectivity prototype's data trees — the Data model, the
configure window and page, Permissions — and the connection form's scope tree.
Tried on the flat lists and pickers too, and taken off them again.

---

# `InlineRename`

## 132. New — `InlineRename` · **DRAFT**

`src/components/InlineRename/index.tsx`

A row's title becomes a 24px field in place — Rename in a row menu. Insightis carried its own copy of this in its custom kit; owner's call (2026-10-19): what the kit duplicates comes from the library, and what the library lacks is added here, one capability at a time.

`defaultValue`, `aria-label` (required), `onCommit(trimmed)`, `onCancel()`.
Enter or blur commits, once; Esc, an empty value and an unchanged one cancel;
Enter while an IME is composing is ignored. Its clicks and keys never reach the
row it sits in.

It focuses and selects one tick after mounting: Radix runs a menu item's
`onSelect` while the menu's focus trap still holds, so focusing at once would
blur and commit before the person typed anything. Built on the bare `Input` at
24px with `-my-0.5`, so a 44px row stays 44px — `InputGroup`'s smallest is 28px.

**minor** (`.changeset/list-row-actions.md`).

---

# `InputGroup`

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

## 45. `InputGroupAction` — the docked-icon inks

`src/components/InputGroup/InputGroupAction.tsx`

The action is `upstream`'s — a 24px box around a 16px glyph, no surface, the
field's `pe-2` inset. It answers the pointer in the inks every docked icon here
uses: `--ink-icon` → `--ink-icon-hover` (§5), where `upstream`'s goes
`text-ink-secondary` → `hover:text-ink-primary`.

## 102. `InputGroup` `xs` — the clear ✕ where the search icon is

- **`InputGroupAction`** — at `xs` (read from the group) the box is the
  14px glyph itself (`size-3.5 [&>svg]:size-3.5`), with the field's own 8px
  trailing inset (`pe-2`, unchanged); every other size keeps the 24px box and
  16px glyph. (A first pass used an 18px `size-4.5` box with `pe-1.5`; the
  shipped scale has no `size-4.5`, so the box collapsed and the ✕ sat 6px in.)

The leading glyph at `xs` is 14px, 8px from the border (`px-2`). The action
kept the `sm`+ geometry — 8px of field inset plus 4px inside its 24px box —
so the ✕ sat 12px in and a size larger than the search icon opposite it.
From `sm` up both are 12px in, so only `xs` showed it. Seen on the
workspaces prototype's list search beside a tree.

## 106. `InputGroupAddon` — the glyph in the placeholder's grey

- **`InputGroupAddon`** — `[&>svg]:text-ink-inactive`: a decorative glyph (the
  search icon) takes the placeholder's colour. A text addon keeps
  `text-ink-secondary`; a docked button keeps `ink-icon` / `ink-icon-hover`.

The glyph inherited the addon's `--ink-secondary` (the kit's `.igrp-add`) while
the placeholder beside it is `--ink-inactive`: a step darker in light theme,
a step lighter in dark (rgb 209 213 219 against 148 163 184) — two greys for
one hint. The rule existed once and was taken out as unasked-for; it was asked
for now.

---

# `LinkButton`

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

---

# `ListPageLayout`

## 133. `ListPageLayout` — the header condenses, and the body takes a class

`src/components/ListPageLayout/index.tsx` · `use-list-header-height.ts`

The layout owns the scroller, so it is where condensing is decided; `PageHeader`
still has no scroll listener (§67). Insightis carried its own copy of this in its custom kit; owner's call (2026-10-19): what the kit duplicates comes from the library, and what the library lacks is added here, one capability at a time.

- `condenseAfter` — past that many pixels, below `lg`, the header condenses: its
  padding tightens to 6px over `--motion-slow` and the wrapper carries
  `data-condensed`. From `lg` up the header scrolls away and never condenses.
- `stickyHeader` also takes a function, `({ condensed }) => node`, so the header
  can pass `condensed` on to `PageHeader`. No context, no new hook, no
  `cloneElement` guessing which child is the header. The type is
  `ListPageLayoutHeaderState`.
- `bodyClassName` reaches the body's own `pb-3` and `gap-3`, which
  `contentClassName` cannot — it sits on the column that also holds the header,
  so its padding stacks. A page's 4rem bottom room is `bodyClassName="pb-16"`.
- `data-slot` on both parts: `list-page-layout-header`, `list-page-layout-body`.

**A flicker the simple rule has.** `scrollTop > 60` — what the Insightis kit did
— loops under scroll anchoring: stop just past the line, the header shrinks, the
browser takes the difference off `scrollTop`, the header grows back, and it
repeats every frame (62 ↔ 48, measured in Chromium). The layout adds back the
height the header lost since it condensed, so the test is stable; a unit test
holds it there.

**minor** (`.changeset/list-page-condense.md`).

---

# `MetaRow`

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

## 134. `MetaRow` — `sticky` and `stickyOffset`

`src/components/MetaRow/index.tsx`

The line above a list can stay at the top of its scroller, on the page colour,
the way `ListSelectionBar` does — the two stay separate components. `sticky` is
a recipe axis (`true` → `sticky z-10 bg-surface-page`, `false` →
`bg-transparent`, moved out of the base); `stickyOffset` sets `top` (default
0) and merges with `style`. Insightis carried its own copy of this in its custom kit; owner's call (2026-10-19): what the kit duplicates comes from the library, and what the library lacks is added here, one capability at a time. **minor** (`.changeset/list-row-actions.md`).

---

# `Modal`

## 71. `Modal` — a `size` ladder, and a height it cannot pass · **DRAFT**

`src/components/Modal/ModalContent.tsx`, `globals.css`

`upstream`'s `ModalContent` is one width and one cap: `max-w-lg`,
`max-h-[90dvh]`. Here it takes `size` — `sm` 22.5rem, `md` 30rem (the default),
`lg` 36rem, `xl` 56rem — from `--modal-w-*` (`max-w-modal-*`), and caps at
`--modal-max-h`.

**`xl`.** The ladder stopped at `lg`, 36rem, described as "for a multi-step wizard" —
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

---

# `PageHeader`

## 15. `PageHeader` — the back control, and where the slots sit · **DRAFT**

`src/components/PageHeader/index.tsx`

`upstream`'s `PageHeader` is `titleLeft`, the `h2` title, `titleRight` and
`actions`: a `div` with `mb-2`, the title cluster at `gap-2`, the actions at the
far edge at `gap-2`. On top of that, here:

- **`onBack`** (`backLabel`) — a tertiary back control before the title: a 36px
  box with a 24px glyph, the glyph 12px from the title (the cluster's `gap-1`
  plus `me-0.5`). At 12px the arrow still reads as the title's own; the rest of
  the row is spaced wider.
- **`titleLeft` opens the row** — before the back control when there is one;
  the mobile sidebar trigger goes there. `upstream` describes it as immediately
  before the title.
- **`titleRight`** sits 12px from the title (`ms-2` on the cluster's `gap-1`).
- **The row** is a `<header data-slot="page-header">` with no margin of its
  own, its parts and its actions 12px apart (`gap-3`).
- **`condensed`** (§67) and the truncating title (§135).

```jsx
<PageHeader
  title="Connect to DB2"
  onBack={…}
  titleRight={<Badge variant="secondary" leftSlot={<ConnectorLogo connector="DB2" size="2xs" />}>DB2</Badge>}
/>
```

## 67. `PageHeader` — `condensed` · **DRAFT**

A header that stays on screen while the page scrolls spends window on a line
already read. On a 900px window — the minimum this product supports — the
header plus a 32px window bar is a fifth of the height, in front of the form the
person came for.

`condensed` is the same row with the title at `heading20` — the kit's
`.cl-page-title` once the sticky head has scrolled — where the full title is
`upstream`'s `h2` (`text-2xl md:text-3xl`). The back control steps down with it,
from a 36px box with a 24px glyph to 32/16: it is sized against the title, not
against the row. The back control, the title cluster and the actions keep their
columns, so it is a shrink and not a relayout.

**The consumer decides when.** The component has no scroll listener and should
not: which element scrolls is the page's fact, not the header's. The page owns
the padding, too, and animates it over the same `--motion-slow` the title and
the arrow take (§111).

Draft because the flow it was built for is a concept: if that concept is not the
one chosen, this state is not needed either.

## 111. `PageHeader` — the collapse animates whole · **DRAFT**

- **`PageHeader`** — the title takes `transition-all duration-slow`; the back
  control's box `duration-slow` (over its own `transition-all`) and its glyph
  `transition-all duration-slow`. All three `motion-reduce:transition-none`.

Condensing moved the title 30 → 20px and the arrow 24 → 16px in one frame,
while the consumer's padding glided: the header read as a jump. Now the title,
the arrow's box and its glyph move over `--motion-slow` (240ms) on the standard
curve, and a consumer animates its padding over the same — the AI connectivity
shell does (`duration-slow`, `transitionProperty: padding`) — so the header
shrinks as one thing. The kit's own `.cl-page-title` animates its size too
(`transition: font-size .18s, line-height .18s`).

§67 held the type still on the argument that a font-size transition reflows
every frame. It does, for one line of one header, for a quarter of a second;
the jump was the cost that showed. Asked for in review of the AI connectivity
prototype, where it replaces a page-level bridge.

## 135. `PageHeader` — the title truncates; `wrapTitle` wraps it

`src/components/PageHeader/index.tsx`

`upstream`'s title has no `truncate`, so it always wraps. Here it truncates by
default, one line beside the actions, and `wrapTitle` wraps it instead
(`min-w-0 break-words`), so on a phone "Data Sources" beside Create Connection
does not read "Data So…". Insightis carried its own copy of this in its custom
kit; owner's call (2026-10-19): what the kit duplicates comes from the library,
and what the library lacks is added here, one capability at a time.

---

# `Pagination`

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

## 93. `Pagination` takes a rung, and the page gets a floor · **DRAFT**

- **`Pagination`** — new `size` prop: `sm` (32px, default) · `xs` (24px).
  Threaded to `PageButton`, `NavButton` and `EllipsisIndicator`; the row gap
  closes with it (8px → 4px). New `Pagination/size.ts` holds the type and the
  box map, so one file decides what a rung measures.
- **`lib/utils`** — new `pageFloor` recipe (`pb-8`), beside `focusRing` and
  `glyphStroke`.

### The rung

Every part was hard-coded to `size-8` with `size="sm"` underneath it. That is
right when the pager is the page’s own control, and wrong under a table: there
it shares a footer band with the range it annotates — "Showing 1–20 of 300" at
`body12` — and a 32px control beside 12px text is the loudest thing in a strip
whose whole job is to be quiet. 24px is the floor for the hit target, so the
ladder is two rungs and stops.

### The floor

Raised by the connections prototype, where the last table row finished flush
against the bottom of the window — for the second time.

The reason it comes back is that the padding looks present and does nothing.
A page puts `pb-8` on its content box, that box is `min-h-0 flex-1`, and such
a box is sized to the SCROLLPORT: its padding is drawn at its own bottom edge,
which is the bottom of the window, and the content scrolls straight past it.

Padding on the scroll container is the other wrong answer — it moves the sticky
constraint rectangle, and a `sticky bottom-0` commit bar then stops short of the
window with the form scrolling visibly underneath it.

So the recipe names where it goes as much as what it is: the element that GROWS
with the content. `lib/utils` is re-exported into the design-sync bundle, so a
consumer gets the name rather than a number it picks for itself.

---

# `PinToggle`

## 136. New — `PinToggle` · **DRAFT**

`src/components/PinToggle/index.tsx`

Pin a row: an outline glyph when off (`tertiary`), a filled brand glyph turned
30° when on (`primaryTertiary`), both keyed on `aria-pressed`. Insightis carried its own copy of this in its custom kit; owner's call (2026-10-19): what the kit duplicates comes from the library, and what the library lacks is added here, one capability at a time.

`pressed` / `defaultPressed` / `onPressedChange`, `pinLabel` ("Pin"),
`unpinLabel` ("Unpin"), `size` (default `2xs`). The accessible name stays
"Pin" in both states — the pressed state says the rest — and only the tooltip
flips. Its clicks and keys never open the row. Not taken from the kit: the glyph
straightening on hover. **minor** (`.changeset/list-row-actions.md`).

---

# `Popover`

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

## 88. `Popover` floated on the page colour

- **`PopoverContent`** — background `bg-surface-page` → **`bg-surface-card`**.

Surface/Page is the colour the page is painted. A popover wearing it had no
surface of its own: over the page body only the 1px border said where the
panel began, and over a card — which is where most of them open — it read as
a hole cut in the card rather than a panel above it.

`DropdownMenuContent` has always been `bg-surface-card`, and the two are the
same family of floating panel with the same elevation shadow. One of them
wearing the page colour was the defect; the shade itself was never the
decision.

Raised by the connections prototype, where a popover carrying a connection’s
description and its problems opens over the catalog table.

---

# `ProgressBar`

## 105. `ProgressBar` — `trackVariant` · draft

- **`ProgressBar`** — new `trackVariant?: 'default' | 'destructive'`. The
  track's `bg-surface-chips` moves from the base into `default`;
  `destructive` is `bg-fb-red`. The indicator's `variant` is unchanged.

For a bar that splits a whole into two answers — the workspaces prototype's
"Members with access": 12 Allowed · 12 Denied — the grey track read as "nothing
yet", so the Denied half looked empty. With `variant="green"` and
`trackVariant="destructive"` both halves show.

---

# `PromoCard`

## 116. `PromoCard` — the hover holds over the dismiss

The dismiss is a sibling of the link laid over its corner, and `upstream`'s
hover is `hover:bg-state-hover` on the link. So the pointer moving from the card onto
the ✕ left the link — and the card dropped its hover while the pointer was still
on it. The Insightis original does the same (`.promo-card:hover` on the anchor,
the ✕ beside it, and there the card also fell 1px as its lift went), which is
how it reached the package.

The hover now hangs on the root: `group/promo-card` there,
`group-hover/promo-card:bg-state-hover` on the link. Over the ✕ the card keeps
its fill and the ✕ adds its own tertiary wash on top. The hit areas do not change:
the link is still the card, the ✕ still its own control.

---

# `RowMenuButton`

## 137. New — `RowMenuButton` · **DRAFT**

`src/components/RowMenuButton/index.tsx`

The ⋮ at the end of a list row and the menu it opens — what every list with a
row menu hand-rolled. It is not a new look (`IconButton` `tertiary` `2xs`),
so it is not a variant, and it is not a part of `SelectableListCard`: exports
are by subpath, and a `TableRow` would otherwise import a list card to get a
kebab. Insightis carried its own copy of this in its custom kit; owner's call (2026-10-19): what the kit duplicates comes from the library, and what the library lacks is added here, one capability at a time.

- `reveal` (default on) fades it in off `group/row` — hover, focus inside the
  row, open — by opacity only, so nothing in the row moves. Below `md` and with
  `(hover:none)` it is always there.
- Its clicks and keys, and the portalled menu's, never reach the row.
- A menu item that moves focus keeps it: Radix hands focus back to the trigger
  only when it went nowhere (`document.body`), so Rename's field is not robbed.
- It names itself in a tooltip, the same as `SidebarChatItem`'s ⋮, so the two
  row menus read alike. Needs a `TooltipProvider` above.

**minor** (`.changeset/list-row-actions.md`).

---

# `SearchInput`

## 145. `SearchInput` — the matches while typing, and the pass-throughs · **DRAFT**

`src/components/SearchInput/`

`upstream`'s `SearchInput` is the field: `value`, `onValueChange`, `onClear`,
`placeholder`, `clearLabel`, `size`, `ref`, and the ✕ while there is text. On
top of it, here:

- **`results`** — with `getResultLabel`, `renderResult`, `onSelect`,
  `emptyText` (`No matches`), `maxVisibleResults` (5.5). What matches the
  query, in a list under the field that opens only while something is typed:
  not on focus, not on a click into the field, not with the picked name still
  in it — there is no whole list to browse, so there is no chevron. At most
  five and a half rows, measured off the rendered rows; the half says there is
  more. Picking puts the result's name in the field and calls `onSelect`. The
  caller matches; the field shows what it is given. The list is `Autocomplete`'s
  combobox mechanics (`useAutocomplete`) and its option row, so the two lists
  look and behave alike.
- **Pass-throughs** — `variant`, `disabled`, `autoFocus`, `id`, `style`,
  `onKeyDown`, `aria-label`.

First call sites: every search field in the LinkAI prototype, and its Effective
access search with results. Written as `SearchField` until §146.

---

# `SegmentedControl`

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

## 96. `SegmentedControlTrigger` — `tinted`, and tone fills in dark · **DRAFT**

- **`SegmentedControlTrigger`** — new `tinted?: boolean`: a value in effect
  without being chosen on this row (inherited, a default), on an unselected
  option — the tone's fill at 15% with the tone's text: `positive`
  `bg-fb-green/15 text-fb-green`, `negative` `bg-fb-red/15 text-fb-red-text`
  (the success / error Badge fills), `neutral` `bg-surface-card/60
  text-ink-primary`. Sets `data-tinted`. Inactive only. The solid pill stays
  "chosen here". Hovered, a tinted option deepens to 30% and keeps its tone's
  text, no rim — "confirm it here"; the base white lift bleached it, which
  read as a fault. A plain unselected option keeps the neutral hover whatever
  its tone: a grey option turning red under the pointer offered a Deny nobody
  had chosen.
- **`SegmentedControlTrigger`** — `positive` / `negative` add
  `dark:data-[state=active]:bg-fb-green` / `bg-fb-red`. The base recipe's
  `dark:data-[state=active]:bg-surface-chips` is more specific than the tone's
  bare `data-[state=active]:`, so in dark theme the selected Included / Allow
  was a grey chip with white text instead of green.

Raised by the workspaces prototype's Data model and Permissions trees.

## 103. `SegmentedControl` — `deselectable` · draft

- **`SegmentedControl`** — new `deselectable?: boolean`. `value` may be `''`;
  the root holds the value beside Radix (controlled or not) and puts
  `deselectable`, `value` and `clear()` on the context.
- **`SegmentedControlTrigger`** — with `deselectable`, a press (mouse down,
  or Enter / Space) on the selected, enabled option calls `clear()` →
  `onValueChange('')`. The consumer's own `onMouseDown` / `onKeyDown` run
  first; Radix's handler is stopped with `preventDefault`.
- **`SegmentedControl.md`** — the "exactly one active" rule now names its one
  exception; new sections **Tones**, **Nothing selected — `deselectable`**,
  **Disabled** (keeps tone and tint, dimmed) and **A tooltip on a trigger**
  (wrap it: `TooltipTrigger asChild` overwrites `data-state`).
- **Stories** — `Tones`, `Deselectable`, `Disabled`; `Tinted` is
  deselectable.

The docs said a segmented control always has one segment active, while §96's
own `tinted` example started from none. The workspaces prototype went back to
Inherit by catching the press on the selected half itself — on Permissions
only, so the Data model had no way back, and the two trees disagreed. The way
back is now the control's.

---

# `SelectableListCard`

## 138. `SelectableListCard` — keyboard, `aria-selected`, `menu`

`src/components/SelectableListCard/index.tsx`

The item opened on a click and nothing else. Now it is a tab stop; Enter and
Space call `onCardClick`, but only when the item itself has focus — a key from a
control inside it is that control's. It carries `aria-selected`, and the card
layout gets the system `focusRing`. Insightis carried its own copy of this in its custom kit; owner's call (2026-10-19): what the kit duplicates comes from the library, and what the library lacks is added here, one capability at a time.

The row layout takes `menu` (`DropdownMenuItem`s) and `menuLabel` (default
"More actions"): a `RowMenuButton` (§137) at the right edge, with `-my-0.5`
so a row with a menu stays 44px. The card layout puts one in `rightSlot`.
`aria-selected` means something to assistive tech only under a list or grid
role, which the caller gives. **minor** (`.changeset/list-row-actions.md`).

---

# `Sidebar`

## 10. `SidebarHeader` owns the horizontal inset

`src/components/Sidebar/SidebarHeader.tsx`

`upstream`'s header is `flex gap-2 p-4`, and `SidebarPanelHeader` adds its own
`pr-2 pl-4` on the row inside it. Here the header owns the inset —
`ps-4 pe-2 pt-3 pb-2`, `px-2` in the collapsed rail (§72) — and
`SidebarPanelHeader` has none, so the two never stack and a row laid out by hand
lands on the same 16px line as the nav glyphs. `pe-2` matches the nav column, so
a trailing collapse control lines up with the menu edge. A row that genuinely
needs the edges opts out with `-ms-4 -me-2`.

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
kit↔package audit walked components rather than composed screens, where
a 2px difference in a list of seven is what you actually see.

**Both products.** The kit is the shared reference — Insightis' own sidebar is
built from `.sbx-nav`, which is already at 2px, so this moves the package
towards what that product ships rather than away from it.

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
not the brand part — so it stacked an inset on `SidebarHeader`'s own and had
nothing to hide its label with, which is the overflow in the report. A story
that does not use the part cannot demonstrate the part. It uses
`SidebarPanelHeader` now, with `SidebarTrigger` as the trailing control.

## 94. The product sidebar — Pinned / Recent, the chat row, the promo slot, the compact footer

`src/components/Sidebar/SidebarSection.tsx`, `SidebarChatItem.tsx`, `SidebarAccount.tsx`

Storybook showed the old prod shape — Home / Search / a `Chats` row with a nested,
left-railed sub-list, a Settings line for a footer — long after Insightis had
replaced it. §10–§14, §35, §39, §64 and §72 ported the **shell**: insets, rows,
gutter, the collapsed rail. The redesign inside the shell (`Insightis/legacy-html/changes/Sidebar.md`)
is information architecture, and it never came across, because it needed parts the
package did not have. A `PromoCard` existed, but only as a separate story with
nowhere in the sidebar to put it.

**New parts**

- **`SidebarSection`** — a flat list with an overline label (`Text/Inactive`,
  brightening to `Text/Primary` under the pointer), a chevron that only appears on
  hover and stays when closed, and an `action` slot for "See all" that reveals on
  hover or focus and is always visible below `lg` and on touch. The whole label
  toggles; the action is a sibling and never collapses. Spacing is the
  component's: 16px under the nav, 12px between sections.
- **`SidebarChatItem`** — h28, 14px `Text/Secondary`, radius `md`; hover
  `State/Hover`, pressed and active `State/Pressed`, active ink `Text/Body`. The
  title **fades** rather than ellipsising: a 36px gradient in the row's own
  surface colour, widening to 72px on hover so the kebab sits on solid fill. The
  gradient takes a *pre-composited* colour — `--state-hover` is a translucent
  overlay, and a gradient ending in it would let the letters through.
  `status="loading" | "new"` (each with a spoken label) or a queue `count`
  (`Counter sm`, the fade off so the title stops before the number) share the
  right-edge slot and fade out for the kebab. `menu` takes `DropdownMenuItem`s;
  the kebab is the shared `IconButton` tertiary `2xs` and a **sibling** of the
  link.
- **`SidebarPromo`** — the slot for one `PromoCard`, above the footer rule, 8px
  gutter, hidden on the collapsed rail. No sidebar prop decides whether it shows:
  that is the product's (free plan, not yet dismissed).
- **`SidebarStat`** and **`SidebarUser`** — the compact footer. One figure,
  label left and value right with a 12px glyph on a round `State/Hover` chip; and
  the account row — 24px avatar, 12px semibold name, 10px meta, 14px up-down
  chevron at 70%. Both are buttons with the neutral hover / pressed recipe.
  Collapsed, the stat leaves and the account row keeps its avatar.

Measured against the kit's `chat-landing` at 1280×800: section, promo, footer, stat
and avatar boxes land on the same pixels.

**Stories.** Expanded, CollapsedIcon, Floating, Inset, AppShell and MobileOverlay
render the product shape; **Promo card** is a control on every one, and `WithPromo`
has it on. The nested-group tree moved to `NestedGroup`, since `NavigationGroup`
stays for consumers whose second level really is navigation.

**Not ported**, deliberately: the collapsed rail's single "Chats" icon that stands in
for the lists. It is a product affordance (where it links), not a sidebar part —
a `SidebarMenuButton` in the consumer's nav does it.

## 139. `SidebarUser` — the rail kept the avatar and lost the name

`src/components/Sidebar/SidebarAccount.tsx`

On the icon rail the name and the meta were `hidden`, so the account-menu
button had no name. They are `sr-only` there now: off the screen, still spoken.
**patch** (`.changeset/sidebar-small-fixes.md`).

## 140. `SidebarProvider` — the sheet outlived the phone layout

`src/components/Sidebar/SidebarProvider.tsx`

Widening the window past `sheetBreakpoint` left `openMobile` true: the sheet
stayed open behind the rail and came back the next time the window narrowed. It
closes when the layout stops being the phone one. **patch**
(`.changeset/sidebar-small-fixes.md`).

## 141. `SidebarChatItem` — the ⋮ where there is no hover, and `countLabel`

`src/components/Sidebar/SidebarChatItem.tsx`

On a touch screen and below `lg` (the sheet) a ⋮ that waits for the pointer is
a ⋮ that is not there. It now stays, the link keeps 32px for it (`pr-8`), and
the title's fade ends where that room begins; the status stays beside it. The
breakpoint is `SidebarSection`'s "See all" one, so a 768–1023px window does not
show one always and the other on hover. The ⋮ names itself in a tooltip
(`menuLabel`). `countLabel` says what the queue count means — "3 messages
queued, still sending" — in a tooltip, and is spoken in place of the bare
number; the count is inside the link, so it is not a tab stop. Insightis carried its own copy of this in its custom kit; owner's call (2026-10-19): what the kit duplicates comes from the library, and what the library lacks is added here, one capability at a time.
**minor** (`.changeset/sidebar-rows-and-triggers.md`).

## 142. `SidebarNavItem` — `badge`, and an element as `icon`

`src/components/Sidebar/SidebarNavItem.tsx`

A nav row takes a trailing `badge` — a `Counter` or a `Badge` —
hidden on the rail and read as the row's description (`aria-describedby`).
`icon` also takes an element, a product mark, set in the same 16/14px box as a
component icon. **minor** (`.changeset/sidebar-rows-and-triggers.md`).

## 143. `SidebarTrigger`, `SidebarMobileTrigger` — their tooltips

`src/components/Sidebar/SidebarTrigger.tsx` · `SidebarMobileTrigger.tsx`

Opening the sheet focuses its trigger, and the panel trigger's tooltip popped up
over the sheet; it has none while `isMobile`. The mobile trigger can name
itself the same way: `tooltip` and `tooltipSide` (default `bottom`). **minor**
(`.changeset/sidebar-rows-and-triggers.md`).

## 144. `SidebarStat` — `asChild`

`src/components/Sidebar/SidebarAccount.tsx`

A figure that opens nothing — a balance — was still a `<button>`. With
`asChild` the label and the value go inside the caller's element, a `<div>` or
a router link, with no `type` put on it. **minor**
(`.changeset/sidebar-rows-and-triggers.md`).

---

# `Spotlight`

## 119. New — `Spotlight` and `useTargetRect` · **DRAFT**

`src/components/Spotlight/index.tsx` · `src/hooks/use-target-rect/`

Dims and blurs the page around one or more targets. The cutout stays sharp
and live — clicks reach the controls inside it — and everything else takes
no clicks. The scrim is ONE layer over the bounds, the modal scrim under a
3px blur, with a rounded hole cut by its `clip-path` (an `evenodd` path), so
the dim follows the ring's corners and no corner is left undimmed. A 2px
Brand/Primary ring with a halo and a glow frames the cutout, concentric with
what it lights, pulses, and glides to the next target: the hole and the
ring's position and corner move on one curve.

`target` (a selector, an element, a ref, or an array of them — lit as one
union) or a measured `rect`; `radius` — the corner, by default the
targets' own radius + `padding`, else 12; `padding` (8); `boundary`, the
area the scrim may cover, so a strip above it stays uncovered;
`onScrimClick`; `pulse`; `leaving` — fades out and lets every click through
while a tour closes. Portalled to `document.body`, or the nearest
`PortalContainer`. While it is in the page, the Toaster drops one step under
the scrim (`--spotlight-z` − 1, through `:root:has()` on the layer itself):
sonner's own layer would lay a toast over the dimmed page and the tour.
What pops out of a lit control (Radix's popper wrapper: a tooltip, a menu, a
popover) goes one step over it (`--spotlight-z` + 1) — under the scrim it read
as a half-transparent grey box.

`useTargetRect(target, { padding, boundary })` →
`{ rect, bounds, radius, vw, vh }` comes from the same entry: the
measurement the whole tour family shares, kept current through resize,
scroll, document resize, DOM changes and font loading. `radius` is the
targets' `border-radius` — or, for a part with square corners such as a
table row, that of the nearest rounded ancestor up to four levels up — plus
the padding.

**Tokens.** `--spotlight-blur` (3px, `backdrop-blur-spotlight`);
`--spotlight-halo` and `--spotlight-glow` (Brand/Primary at `--tint-20` and
`--tint-30`) composed into `--shadow-spotlight` (`shadow-spotlight`);
`--spotlight-move`, one duration and curve for every move, read by a
`transition` shorthand; `--spotlight-z` (70 — annotations +1, the coachmark
+2). The halo, the glow and the shadow are mirrored in `.dark` for scoped
themes. The scrim has no colour of its own: it is `--overlay-scrim`
(`bg-overlay-scrim`).

The layer fades in and the ring breathes every 2.2s; all of it stops under
`prefers-reduced-motion`.

**Both products.** New component, no call sites in the package.

---

# `StatTile`

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

---

# `StatusView`

## 51. `StatusView` — the illustration is a pack, not a rule — **revised**

`src/components/StatusView/index.tsx`

`EmptyStateIllustration` came first — a 150×104 SVG, a crisp top card fading
into two ghosts, the shape of the very list that is missing — and read as
though the system had picked the artwork. It had not, and should not: `StatusView` takes whatever goes in its
`icon` slot — a lucide glyph, one of these, or a product's own drawing — and
that was already true before it.

What was actually missing is that **one picture cannot say two things**. "There
is nothing here yet" and "your search matched nothing" are different states, and
a list that shows the same artwork for both is telling the user the query made
no difference. So the pack is two:

| | |
|---|---|
| `EmptyStateIllustration` | three list rows fading out — the shape of the list that is missing |
| `EmptySearchIllustration` | a search field with a query in it, over two dashed empty rows |

The magnifier in the second one is **part of the depicted field**, not a symbol
standing in for "not found" — which is the objection to using a magnifier as the
whole picture, and it still stands.

Every colour is a token, so both re-theme with the page and neither needs a dark
variant. Use either as `icon={<EmptyStateIllustration />}` with
`withIconHalo={false}`.

## 104. `StatusView` — a wider message

- **`StatusView`** — the description's cap is `max-w-[48ch]`, where
  `upstream` has `max-w-md` and the kit's `.empty-msg` 32ch; `text-balance`
  unchanged. `StatusView.md`'s anatomy table says so.

At 32ch a message of two short sentences — what is empty, what to do — broke
into three or four lines of a few words each and read as fragments (the
workspaces prototype's empty Data model: "The linked connections returned no /
catalogs, schemas or tables. Check / what their user can read, then refresh.").
48ch keeps it to two lines; balancing still keeps a last word off a line of its
own. A departure from the kit's `.empty-msg`, on purpose.

## 107. `EmptySearchIllustration` — visible on a white card

- **`EmptySearchIllustration`** — the field's outline `stroke-stroke` →
  `stroke-stroke-hover`; the magnifier `stroke-ink-inactive/60` →
  `stroke-ink-inactive` (the field glyph's own grey, §106); the query bar
  `fill-ink-inactive/35` → `/55`. The two dashed rows under it: outline
  `stroke-stroke` → `stroke-stroke-hover`, opacity 0.4 / 0.2 → 1 / 0.5.

Every line of it was the lightest border grey, and the rows under the field were
that grey again at 40% and 20%, dashed, white on white: in the workspaces
prototype's "Find somebody" window only the field showed, and barely. Still the
same drawing — a search over rows that came back empty, fading — at the
strength `EmptyStateIllustration` beside it already has.

---

# `StepProgress`

## 117. `StepProgress` — a counter, a fill, a size, and read-only bars · **DRAFT**

`src/components/StepProgress/index.tsx`

On `upstream`'s `StepProgress` — the bars, their fills and hovers, the tooltip,
step `title` / `done` / `ariaLabel`, the `label` read-out — this package adds:

- **`counter`** — `(n, total) => ReactNode`, "Step N of M" by default.
- **`showStepTitle`** — the current step's title as a caption, Text/Secondary
  400 at both sizes.
- **`fill`** — the bars share the full width under a header, in place of 24px
  bars inline.
- **`size="sm"`** — the type one step down, the gaps one step tighter.
- **Read-only bars.** Without `onStepSelect` the bars are `aria-hidden` spans —
  no focus, no tooltip — and the read-out is `aria-live="polite"`; `upstream`'s
  bars are always buttons. `Tour` (§122) needs the read-only form.

Not `StepperIndicator` (§36): that is a numbered rail to travel along; this is
a read-out that fits on a header line.

---

# `Stepper`

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

---

# `Table`

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
(`Insightis/legacy-html/reports/2026-09-19-prod-interaction-states-migration.md`) — zero
visual delta, since the only rows carrying it today already had the 8px.

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

---

# `Tabs`

## 8. `TabsContent` — the inactive panel came back as an empty box

`src/components/Tabs/TabsContent.tsx`

```diff
+ 'data-[state=inactive]:!hidden',
```

Radix hides the inactive panel with the `hidden` attribute — a UA-stylesheet
`display:none`, which any display class from the consumer (`flex`, `grid`)
beats. The panel came back as an empty block and pushed the active one down.

---

# `TextArea`

## 41. `TextArea` — the counter row had a slot nothing could fill

`src/components/TextArea/index.tsx`

`showCount` (`upstream`'s) draws the counter into a two-column row whose left half only
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
draws, and a counter the component already counts.

```ts
hintText?: ReactNode;
```

It takes the left half, and **yields it to `errorText` when the field is
invalid**: an error about what you just typed outranks advice about what to
type. That ordering is the reason it is one slot and not two.

**Both products.** Additive; a `TextArea` without `hintText` renders exactly as
before. Any field with a limit and a caveat stops hand-building the row.

## 70. `TextArea` — the hint at 400, and the counter and error lines

`src/components/TextArea/index.tsx`, `TextAreaCount.tsx`

- **`hintText`** (§41) is `textStyle="body12"` — 12/400. Written as
  `variant="span"` it took that ladder's `font-medium`, and helper text sat a
  weight above the body copy around it ("why is the font still bold").
- **The counter** is `textStyle="body12"`, a 16px line, where `upstream`'s
  `TextAreaCount` is `leading-5`.
- **The error line** is `text-xs font-medium`, as in `InputGroup`, where
  `upstream`'s is `text-sm`.

---

# `Toast`

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

---

# `Tooltip`

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

## 63. `Tooltip` — the delay before it opens

`src/components/Tooltip/index.tsx`

`TooltipProvider` was a bare re-export of Radix’s, so the delay was whatever
each call site passed: 200ms in `ModalContent` and three stories, 500ms in the
sidebar rail, and Radix’s own 700ms anywhere a consumer forgot.

It now defaults to **300ms**, the kit’s value — `[data-tip]` opens on
`transition: opacity .12s .3s`. At 200 the bubble appears while the pointer is
still crossing the row; at 700 it reads as never coming.

The three 200s are removed so they take the default — `upstream`'s
`ModalContent` still passes 200 — and so is the sidebar's 500 (§72).

Unchanged, and worth knowing: the bubble itself is not a transition but a
`tailwindcss-animate` keyframe — 150ms `ease`, `fade-in-0 zoom-in-95` plus an
8px slide from the trigger’s side. That 150 is the plugin’s default, not
`--motion-*`.

---

# `Tour`

## 122. New — `Tour` · **DRAFT**

`src/components/Tour/index.tsx`

A guided walk over the real interface: per step a `Spotlight`, a
`Coachmark` and, when the step has annotations, an `AnnotationGroup`. The
caller holds the step (`step`, `onStepChange`); the tour reports how it
ended (`onClose('finish' | 'skip' | 'escape')`).

`steps` — `{ id, target, title, icon?, content, label?, side?, width?,
annotations? }`. `progress` — `{ steps, offset }`, the longer flow the tour
is part of, read out in the coachmark as `StepProgress size="sm" fill`;
default: the tour's own steps. `onBeforeFirst` — Back on the first step, for
a tour that continues an onboarding. `labels` (Back · Next · Skip · Done),
`boundary`, `padding`. Back is a plain tertiary button, like the question
card's.

Keyboard: → next, ← back, Esc closes — ignored while typing in a field.
Focus moves to the coachmark on every step, and a click on the scrim nudges
it. On a phone the annotations become a list inside the bottom-sheet
coachmark. Closing never just vanishes: `open` → false keeps the tour
mounted for 300ms while the scrim and the annotations fade, the coachmark
fades and drops 8px, and nothing takes a click.

**Both products.** New component, no call sites in the package.

---

# `Typography`

## 100. `Typography` — an 18px rung, as prod sets it

- **`Typography`** — new `textStyle` values `heading18` (500) and `title18`
  (600): `text-lg` with a 24px leading (`leading-6`). No `body18`.

The type-scale audit (Insightis, 2026-09-04) took 18 out of the set and moved
it to 20. Prod still sets it, measured on insightis-app.devart.info: the
profile dialog's **Manage plan** panel — "Choose a plan" at 18 / 500, the plan
names at 18 / 600 — and its **Balance** panel — the credit amounts at 18 / 600,
"left" at 18 / 400. The approved `user_profile-modal.ds.html` hand-rolls the
same credit amount (`.pack-credits`: `--font-size-lg`, semibold), because the
scale had no style for it. No other page in the app renders 18.

All four prod elements declare `leading-6`. On the plan panel they render 28px
anyway: `md:text-lg` comes later in the stylesheet and brings Tailwind's paired
28px with it. The style takes the 24px that was asked for.

## 113. `Typography` — `lineThrough` ran along the tops of the lowercase

`src/components/Typography/index.tsx`

```diff
- lineThrough: { true: 'line-through' }
+ lineThrough: { true: 'bg-[linear-gradient(currentColor,currentColor)]
+   bg-[length:100%_max(1px,0.075em)] bg-[position:0_calc(50%+0.107em)] bg-no-repeat' }
```

`line-through` draws where the font says: DM Sans's strikeout position sits at
the top of its x-height. Measured at 200px: the stroke at 70px from the top of
the line, the x-height from 62 to 120 — on the tops of the lowercase, not
through them. At 14px, in a struck-through tree row, it read as off-centre.

CSS cannot move a `line-through` (`text-underline-offset` is for underlines
only), so the stroke is a background band now. From the font's own metrics
(ascent 1.0em, descent 0.29em, x-height 0.5em): the middle of the x-height is
0.107em below the middle of the line box, at any line height, since leading is
added evenly above and below. Thickness `max(1px, 0.075em)` — 1px at 14, 2px
at 30, about what the browser drew.

Tied to DM Sans: another face would need its own offset.

---

# Tokens and colour

## 2. Dark destructive border — hover made the control *less* visible

`globals.css`, `.dark`

`upstream`'s dark theme keeps the light pair: Red-700 at rest, Red-800 on hover.
On the near-black Card `#17171E` that inverts — **hover drops contrast 2.76 →
2.15**, the only control that gets fainter under the pointer; everything else
goes lighter on dark (`--btn-secondary-border`: Grey-600 → Grey-500, 2.30 →
3.69). The frame also sits darker than its own label, Red-400 on dark.

```diff
- --btn-outline-destructive-border: var(--red-700);         /* #B91C1C */
- --btn-outline-destructive-border-hover: var(--red-800);   /* #991B1B */
+ --btn-destructive-secondary-border: var(--red-500);       /* #EF4444 — CR 4.74 */
+ --btn-destructive-secondary-border-hover: var(--red-400); /* #F25555 — CR 5.27 */
```

Light's rule — **border = label colour, hover one step more prominent** — with
the step mirrored because the ground is dark. Red-500 → Red-400 keeps light's
proportion, ×1.22; Red-400 → Red-300 was tried first and jumped ×1.79.

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

## 6a. Table rows as washes that stack

`globals.css`, `src/lib/constants.ts`, `src/components/Table/TableCell.tsx`

`upstream` makes the control states washes — `--state-overlay`, `--state-hover`
and `--state-pressed` at `--tint-8` / `--tint-12`, bare `var()`. Its table rows
stay solid: `--tbl-row-hover` / `--tbl-row-pressed` are Slate-50 / Slate-100
(Grey-800 on dark), with a third, `--tbl-row-selected-hover`.

Here the rows are washes over the same `--state-overlay`, lighter than the
controls — a row is wide and sits in a stack, where a heavy wash turns a list
into stripes. Inside a row the two composite, so a control on a hovered row is
always the deeper of the pair. Composited over the card, measured from
`globals.css`:

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

- **`--tbl-row-selected-hover` removed**, with the two `TableCell` utilities
  that named it. A selected row keeps its surface and controls composite on top;
  the token made a row read as *less* selected the moment you touched it.
- **`--brand-300`** is `#46A6B9` (190°, 45%), where `upstream` has `#5DA0A8`.
  The old step had the right hue at 29% saturation, and a desaturated wash reads
  dirty rather than soft.

## 87. New — colour packs (`palettes.css`) · **DRAFT**

`palettes.css`, `scripts/gen-palettes.mjs`

The system could be recoloured all along; nothing shipped that did it. The AI
connectivity prototype had worked this out and carried it locally, which meant
the one piece of the token system with no consumer-facing lever lived outside
the package. Ported, not redesigned.

**A pack redeclares Layer 1 and nothing else** — the `--brand-*` and
`--tertiary-*` ramps. Everything above re-resolves by itself, including every
`color-mix()`: hover fills, card borders, toast tints, banner gradients, the
pale fill behind a selected row. This is decision 3 paying for itself — no
component can name a ramp step, so no component is touched to change the colour
of the system.

```html
<html data-palette="blue">
```

One pack — `blue` — and no attribute leaves teal, which the file does not
declare. Azure, indigo and iris were generated and then dropped: four of them
made the palette read as a preference rather than as a product. `:root[data-palette]` (0,2,0) beats `:root` and
`.dark` (0,1,0); `:root[data-palette].dark` (0,3,0) beats the dark branch. So a
pack needs no `!important` and no load order beyond coming second.

Each pack takes the L and C profile of the default teal (C ≈ 0.09 in OKLCH) and
rotates the hue only, so none is louder than teal, and the key steps are solved
against contrast thresholds taken from the teal original. Feedback colours are
not packed: red and attention stay loud, which is their job.

Measured in Storybook: with `blue`, `--brand-600` and `--brand-primary` both
move to the pack's #3870B8; with no attribute they are back to
`179 89.6% 26.5%` and `rgb(7, 128, 126)`.

The catalogue carries a **Palette** toolbar switch, and that is the point of it
rather than a convenience: it is the only way to see a component that pinned
itself to a ramp step, because that one stays teal while the page around it
moves.

## 124. The chat-landing backgrounds were one product's, not the system's — removed

`globals.css` (`:root` and `.dark`), `src/tailwind-preset.ts`

`--chat-shell-bg` (a radial brand-tertiary tint at the top, 2% light / 4% dark)
and `--chat-glow-fill` (the soft pool behind the composer, `--tint-8` / `--tint-20`)
came over from the Insightis kit's `.cl-shell` together with two utilities,
`bg-chat-shell` and `bg-chat-glow`. No component here reads them: they paint one
screen of one product. Owner's call (2026-10-16) — the background is an Insightis
element, so its tokens live in the Insightis kit (`devart-ui/insightis-kit/core/ik-core.css`),
not in the system every product inherits.

```diff
- --chat-shell-bg: radial-gradient(at 50% 0%, color-mix(… --brand-tertiary 2%|4% …), … 55%);
- --chat-glow-fill: color-mix(in srgb, hsl(var(--brand-tertiary)) var(--tint-8|20), transparent);
- 'chat-shell': 'var(--chat-shell-bg)',
- 'chat-glow': 'radial-gradient(ellipse 55vw 45vh at 50% 50%, var(--chat-glow-fill), transparent 65%)',
```

A removed public token and utility: **major** (`.changeset/chat-backgrounds-to-insightis.md`).
The built `dist/` and `ds-bundle/` still carry them until the next `pnpm bundle`.

## 125. Dark scrim — on the page's grey, not on a navy

`globals.css`, `.dark`

Every dark surface is the Grey ramp (`--surface-page` Grey-950 `#0F0E14`, cards
Grey-900/800), but the scrim behind a Modal, a Sheet and the Spotlight tour was
**Slate-950** — `hsl(229 84% 5%)`, a saturated navy. At 60% over the grey page
everything outside the dialog or the lit target went visibly blue, sidebar
included (found in Insightis, step 4 of the onboarding tour). The scrim now
darkens with the page's own grey.

```diff
- --overlay-scrim: hsl(var(--slate-950) / 60%); /* #020617 @60% */
+ --overlay-scrim: hsl(var(--grey-950) / 60%);  /* #0F0E14 @60% */
```

Light keeps Slate-950 — over white it reads as a neutral dim, not as a colour.
Every reader of the token follows (`ModalOverlay`, `Sheet`, `Spotlight`,
`constants.ts` `scrim`). A token value change in `globals.css`: **minor**
(`.changeset/dark-scrim-neutral.md`).

---

# Sizes and glyphs

## 40. The size ladder

**The canonical ladder. Four sources carry this table and must agree:** this
file, `Insightis/legacy-html/reports/2026-09-04-insightis-ux-audit.md` (#15, #36),
`Insightis/legacy-html/reports/2026-09-19-prod-interaction-states-migration.md` and
`Insightis/legacy-html/pages/kit-theme.css`.

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

## 44. The icon surface

Three things, one of which is the reason the other two would not have shipped.

(A fourth — an ink rule on the leading glyph — is in the archive: it was
invented inside the package and stepped away from the kit.)

### The ladder stops at 20px, and the type at 16px

The kit's `--icon-xl` is 24px. On a 44px field that reads as an icon that
outgrew its control. The ladder repeats at both ends — **14 / 16 / 16 / 20 / 20** —
the way it already repeats 16 across `sm` and `md`.

The type took the same cap: `xl` was 18px, now 16, the same rung as `lg`. So
`Typography` keeps `label16` and the two 18px control rungs are gone again —
§100 brought `heading18` / `title18` back for headings, the one place prod still
sets 18.

Changed in three places, because the ladder exists in three: the package,
`Insightis/legacy-html/pages/kit-theme.css` (`.btn-xl`, `.igrp.is-xl .igrp-input`,
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
in `InputGroupAddon`; `[&_svg]:stroke-[1.75]` (now `stroke-2`, §92) in `DropdownMenuItem` — and the
enumerated vocabulary generated none of them.

So in the bundle no glyph ladder existed, no shrink guard, no menu stroke
weight: every icon fell back to whatever `lucide-react` renders, and nothing
failed. §19 at library scale.

## 92. Glyph stroke — one weight, set in CSS

- **`glyphStroke`** (`src/lib/utils.ts`) — `[&_svg]:stroke-2`, on `Button`,
  `IconButton`, `InputGroupAddon`, `DropdownMenuItem` and `Alert` at both sizes.
- **`gen-classlist.mjs`** — the enumerated form, so the bundle carries the same
  rule as Storybook (§19).

`upstream` sets no stroke on `Button`, `IconButton`, `InputGroupAddon` or
`Alert`, and draws `DropdownMenuItem` at 1.75 (`[&_svg]:stroke-[1.75]`). A CSS
`stroke-width` beats the attribute on the `<svg>`, so here a glyph passed in
with its own `strokeWidth`, or from a set that does not default to 2, comes out
at the weight of the glyph beside it. 2 is what prod draws: every UI glyph on
the live app is Lucide's default, `stroke-width="2"` in a 24 viewBox — 20
glyphs, 13 in a 16px box and 7 in a 14px one. The kit tried 1.75 and reverted
it; the same mark came out 12% lighter than production.

One component keeps a weight of its own: `Checkbox`'s tick and bar, 12px at 3
(§57) — below ~16px a stroke has to stay heavy enough to survive
rasterisation. The `StatusView` illustrations draw at 1.5 in a 150-unit
viewBox; they are artwork, not UI glyphs.

---

# Across components

## 98. `Table`, `ModalBody` — the system's scrollbar

- **`Table`** — the frame (`data-slot="table-container"`) adds
  `scrollbar-thin`. It is a scroller: across for a wide table, and down
  wherever a parent gives it a height — in a dialog it shrinks to the body and
  scrolls itself, with the platform's bar: 16px, arrows on Windows.
- **`ModalBody`** — adds `scrollbar-thin`. It wraps `ScrollShadow`, which sets
  no bar of its own, so a long dialog body scrolled with the platform's too.

Both now draw the bar the system's own lists draw (DropdownMenu,
Autocomplete, CodeBlock). Raised by the workspaces prototype's table preview
(PRD Workspaces F-21), twenty rows in a dialog.

## 99. Disabled controls — the not-allowed cursor

- **`SegmentedControlTrigger`**, **`TabsTrigger`**, **`Toggle`**,
  **`Checkbox`**, **`Switch`**, **`DropdownMenuItem`**,
  **`DropdownMenuCheckboxItem`**, **`DropdownMenuRadioItem`** — no
  `disabled:pointer-events-none` (`data-[disabled]:` on the menu items), which
  `upstream` still carries beside `cursor-not-allowed`. With no pointer events
  the cursor is never asked for, so a switched-off control showed the arrow,
  and a tooltip could not open on it. Hover recipes are behind `enabled:`, so
  nothing lights up.
- **`AccordionTrigger`** — `disabled:cursor-not-allowed`.
- **`Switch`** `tertiary` row — `has-[:disabled]:cursor-not-allowed` in place of
  `has-[:disabled]:pointer-events-none`; the row neither lights nor presses.

`RadioButton`, `Button` and `IconButton` already work this way in `upstream`.
Raised by the workspaces prototype: a Permissions row out of the data model
scope, whose Allow / Deny is switched off.

---


# `FilterMenu`

## 148. New — `FilterMenu` · **DRAFT**

`src/components/FilterMenu/index.tsx`

A filter as a pill — "Type: All ▾", "Owner: Anyone ▾", "Provider: Main CRM ✕ ▾" — and the menu it
opens. Insightis built it in its custom kit (`WsFilterMenu`, `WsTreeFilter`) for its Files, Metrics
and Data Sources lists; owner's call (2026-10-20): the filter, the alert kinds and the alert stack
belong in the library, the product only uses them.

- `options` — `{ value, label, count?, icon?, children? }`. Plain choices, or one level of
  hierarchy: a group (a source, with its mark in a fixed 20px slot) and its children (its
  connections) under it — a child's label starts exactly under its group's, the group reads at
  500, the child at 400. A plain first choice ("All") stands apart by a rule.
- `count` after the label in brackets, a step below it (12px, secondary); `0` still shows.
- The chosen one carries a check, the composer's model-menu pattern.
- **Clearable.** While a value other than `defaultValue` (default: the first option) is chosen, a ✕
  sits before the chevron and puts it back; the chevron stays, the pill still opens its menu. A
  press on the ✕ never opens the menu — the menu is controlled and the ✕ marks the press first.
  `clearLabel` names it (`Clear Type`).
- The pill is `Button` `secondary` `xs` `rounded="full"`, the size of the `FilterChips` chip beside
  it; truncates at 16rem.

**minor** (`.changeset/filter-menu-alert-stack.md`).

---

# `AlertStack`

## 149. New — `AlertStack` · **DRAFT**

`src/components/AlertStack/index.tsx`

Several notices as one group, so a page keeps one notice's height until the person asks for the
rest. Insightis built it as `WsAlertStack` (a page can carry a Blocked notice, a Restored one and the
trial's at once). Folded, it is a deck: the first notice on top, the next two behind it — each 8px
lower and 12px narrower a side, only their bottom edges showing, in their own colours (the
`--alert-bg-*` / `--alert-border-*` surfaces `Alert` paints with, read off the child's `variant`).

- The edges are the control — no "show more" button. They spread on hover (4px, 8px; no motion
  under `prefers-reduced-motion`), a press opens the pile, and the first one takes the focus and
  names what it opens (`moreLabel`, "Show 2 more notices").
- Opened: every notice 12px apart, then `Show Less` (`Button` `tertiary` `xs`, a chevron up).
- One notice is just that notice; none renders nothing.

**minor** (`.changeset/filter-menu-alert-stack.md`).

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

## 84. The class list — a list with markers, and the last band of a stack

`.design-sync/gen-classlist.mjs`

Six utilities added, because a consumer had no way to write two ordinary things
and the compiled sheet turned both into silent no-ops:

```
list-disc  list-decimal  list-none
last:border-b-0  last:border-0  first:border-t-0
```

**The list.** The preflight strips markers from every `ul`, which is right —
navigation and menus are lists too — but it leaves prose with no way back. The
case that raised it is a troubleshooting panel whose *Potential causes* and
*Suggested actions* are bulleted lists; they were written as `list-disc` and
have been rendering without markers since, because the class was never
enumerated.

**The stack.** `border-b` on every band and `last:border-b-0` on the stack is
the standard way to rule between bands without a trailing rule against the
container's own edge. Without the `last:` half a consumer either builds the
divider out of a separate element, or reaches for `not-last:` — a Tailwind v4
variant this v3 bundle compiles to nothing. The settings panel in the
connections prototype has been missing its dividers for exactly that reason.

**Why enumeration and not a safelist**: the file's own note at the top. A class
that is not in the list does not exist in the sheet, and nothing warns — which
is what both of these were.

---

# Synced from upstream

## 97. The developers' 1.1.0 parts — what stays different

`upstream` 1.1.0 (81596ad) and their AIINS-1948 `ActivityTray`, ported by hand:
their names, exports, props and variant keys. What differs on top:

- **`./cn` helpers.** `upstream`'s `src/lib/utils.ts` exports only `cn`.
  `focusRing`, `glyphStroke` (§92), `pageFloor` (§93) and `liftOnHover` (§59)
  are this package's.
- **The kit's values over theirs.** `FilterChips` — 6px between chips, 8px
  inside one, the selected count at 70%, scrolling below `md` (`.chip-row`,
  `.chip`, `.chip-n`). `Sidebar` — 120ms transitions where they have
  `duration-100` (`.sbx-nav-item`, `.sbx-brand-id`), the external arrow at
  14px, the burger glyph at 18px (`.cl-burger`). `ActivityTray` — §79.
- **`IconCard`** — the kit's tile: `h-32`, `p-4`, a 400 caption, the 1px lift
  (§59), the focus ring, `bg-ds-card-scrim`. Its floor is on the grid, where
  the kit puts it — `repeat(auto-fill, minmax(max(7rem, (100% - 7 * .75rem)/8), 1fr))`,
  never under 7rem, at most 8 a row, where `upstream`'s story uses
  `minmax(7.5rem, 1fr)`. A `min-w-fit` on the tile does not hold: `IconCard`
  is `content-visibility: auto`, and a skipped tile keeps its remembered width.
- **`File`** — the chip draws the ring through `:has()`, and takes the pressed
  fill only when the content area is pressed, not when dismiss is.
- **`scripts/lint-tokens.mjs`** — string literals read through the TypeScript
  parser and hex-escaped commas decoded; `upstream`'s regexes read prose in
  comments as classes.
- **Not brought back:** `Button ghost`, `Badge xs` (§86), and the tokens
  `--bg` (`surface-bg`), `--border-hover` (`stroke-border-hover`) and
  `--tbl-row-selected-hover` (§6a). `upstream` still has all five; this package
  removed them as duplicates, and that stands.

---

## 146. The developers' 1.2.0 parts — what stays different

`upstream` 1.2.0 (8d69821), ported by hand on the rule the designer set:
**their names and their base, this package's changes as extensions on top, and
nothing this package removed comes back** (`Button ghost`, `Badge xs`,
`--chat-*`, `--bg`, `--border-hover`, `--tbl-row-selected-hover` stay gone).
The extensions:

- **`SearchInput`** — the results list and the pass-throughs (§145).
- **`PageHeader`** — the back control, `condensed`, the truncating title, and
  `titleLeft` at the start of the row (§15, §67, §135).
- **`StepProgress`** — `counter`, `showStepTitle`, `fill`, `size`, read-only
  bars (§117).
- **`Alert`** — the optional `title` (§95), the `illustration` slot,
  `glyphStroke` (§92).
- **`TextArea`** — `hintText` (§41), `wrapperClassName`, and its type (§70).
- **`IconCard`** — the kit's tile (§97).
- **`InputGroupAction`** — the docked-icon inks (§45) and the `xs` box (§102).
- **`Popover`** — `portalContainer`, the trigger's focus ring, the kit's
  surface `bg-surface-card shadow-overlay-soft` where `upstream` has
  `bg-surface-page shadow-md` (§88), `fill-mode-forwards` (§34).
- **`PromoCard`** — the hover on the root (§116).
- **`ConfirmationDialog`** — on this package's `Modal` (§71): `size="sm"` is its
  360px, and `ModalFooter`'s own divider replaces theirs.
- **Storybook** — `Proposed changes` and `Foundations` are this package's
  sections, above `upstream`'s `Components` and `Compositions`.

# Documentation that was missing or wrong

These are not code changes, and `upstream` ships no component docs, so every
`.md` here is this package's. Each is a place where every page was inventing its
own answer, which is how two products drift apart without either being "wrong".

- **`Card.md` — `ghost`.** ~~Documented as a drop target.~~ **Withdrawn.** The
  doc and the implementation did disagree, but the correction went the wrong
  way: `ghost` is the dashed *"browse more" tile* — `Card.stories.tsx` has
  always called it that, and `CardIcon variant="ghost"` is its centred dashed
  icon well, which is not the anatomy of a drop target. A dashed edge in this
  system means *nothing here yet*; sometimes that empty thing accepts a drop and
  sometimes you click it. `Card.md` now says so.
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

---

# Open against the kit

## Raised by the kit ↔ Storybook audit

Three are contradictions **inside the kit**, and the package cannot implement
either side until the design answers:

| | |
|---|---|
| **`--tbl-row-pressed`** | Prose says neutral, `--tint-6` of `--ink-primary`. CSS says `color-mix(in srgb, #07807E 4%, transparent)` — brand teal, off the tint scale. |
| **18px in the type scale** | `Body XL` and `Label 2XL` are 18/28 and on the list of nineteen; the same section lists 18px under *не на шкалі* with migration 18→20. See §44 and §100. |
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

## Open here, and the same in `upstream`

Found while building on the package and not fixed. `upstream` has the same, so
none of it is a difference; kept with their numbers so the review pages still
find them.

- **`Alert` under a scoped `.dark`.** `--alert-border-*` has no `.dark` copy,
  so under a `.dark` on a wrapper the borders keep their light colours.

### 22. Five controls still fade at `opacity-50`

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

### 24. `Sheet` — the default side is the one without a border

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

### 26. `Tabs` — no flush tabset, so two rules stack

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

### 29. `Datepicker` — one bespoke focus ring, not three missing states

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

### 31. The toast close button is off the 24px ladder

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

### 32. `ghost` — one of the three "unrelated" ones is not

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

### 38. `StepSlider` — four measurements against a spec that argues for each one

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
