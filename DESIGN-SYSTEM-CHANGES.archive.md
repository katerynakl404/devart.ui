# Archived entries

Sections that were written into `DESIGN-SYSTEM-CHANGES.md` and then taken out
of it. They are kept, not deleted: the reasoning is worth having, and a
recommendation that was withdrawn is easier to re-open than to rediscover.

Nothing here is a change this branch makes. The numbering is the one the entry
had in the main document, so a reference to it from an older message still
lands somewhere.

---

## `--font-size-compact` — a note, never a change

**Why it is here and not in the change log:** it describes nothing this branch
does. It is an observation about a token that already existed, written into
`DESIGN-SYSTEM-CHANGES.md` as though it were a numbered change, which it never
was. Taken out of there with its number; kept here as the note it always was.
The token stays in place.

`globals.css` — `--font-size-compact: 0.8125rem` (13px), exposed as `text-compact`.

Zero call sites in `src/`. The kit's type section lists `13` under *"Не на шкалі"*
with a stated migration direction of 13→14, which means the package is right to
avoid it — the comments in `InputGroupInput` and `textAreaVariants` ("13px is off
the agreed eight-size scale") are correct and now have a citation.

That leaves a token whose only effect is to make the off-scale size reachable as
a first-class utility. It should be removed, or it will be used, and the comments
explaining why 13px was refused will read as arbitrary next to a `text-compact`
that ships.

The same is not true of `--font-size-xxs` (10px), which is Label S / Overline and
is used.

## Badge — the `tooltip` prop

**Why it is here:** it is in the code — it shipped in `cf21296` — but it was
never asked for. The request against `Badge` was the hairline and nothing else.
Kept because the change is real and somebody will want to know where it came
from; out of the change log because that document is the list of what was asked
for.

### As it was written, when it was numbered §45

**`Badge` — a status that is not a control**

`src/components/Badge/index.tsx`

```ts
tooltip?: ReactNode;
tooltipSide?: 'top' | 'right' | 'bottom' | 'left';  // default 'top'
```

A badge has no action. Its only behaviour is a tooltip, and until now the system
gave it no way to have one — so the page wrapped it:

```jsx
<TooltipTrigger asChild>
  <button type="button" className="flex rounded-full">{pill}</button>
</TooltipTrigger>
```

That gives a read-only status `role="button"`, a press state from the theme, a
pointer cursor, and a promise of an action it does not keep. It also introduced
a layout bug the page had to comment around: a default `<button>` is a block
container with its own line box, 22.6px around a 20px pill, so the pill moved
~1px vertically every time the state changed.

With `tooltip` the trigger is the badge itself — `tabIndex={0}` for keyboard
reach and nothing else. No wrapper, no role, no line box.

**Both products.** Additive. A badge with no `tooltip` renders exactly as
before, down to the DOM.


## Badge — the stepping gap and glyph

**Why it is here:** it is in the code — it shipped in `cf21296` — but it was
never asked for. The request against `Badge` was the hairline and nothing else.
Kept because the change is real and somebody will want to know where it came
from; out of the change log because that document is the list of what was asked
for.

### As it was written, when it was numbered §62

**`Badge` — the gap and the glyph did not step with the size**

`src/components/Badge/index.tsx`

Reported as "this does not render like a design-system component", and the
measurement says why. At `sm`:

| | ours | kit |
|---|---|---|
| height | 20px | 20px ✓ |
| horizontal inset | 6px | 6px ✓ |
| **gap, glyph → label** | **8px** | **4px** |
| **glyph** | **14px** | **12px** |

`gap-2` sat in the shared base, so every size got 8px. At `sm` that makes the
space *inside* the chip wider than the chip's own distance to its edge — 8
against 6 — and a pill whose interior gap beats its inset reads as an icon and
a label in a box rather than as one chip. That is the whole of the report.

The kit sets both per size and writes the reason for the glyph next to it:

```css
.badge         { gap:.5rem;  height:1.75rem }              /* 8px · 28px */
.badge-sm      { gap:.25rem; height:1.25rem; padding:0 .375rem }
.badge .b-ic    { width:var(--icon-xs) }                   /* 14px */
.badge-sm .b-ic { width:12px }
/* "A 14px glyph in a 20px pill leaves 3px of air — step down" */
```

```diff
- 'inline-flex items-center gap-2 border border-badge-border',
+ 'inline-flex items-center border border-badge-border',
...
-   xs: 'h-5 px-2 text-xs [&_svg]:size-3',
-   sm: 'h-5 px-1.5 text-xs [&_svg]:size-3.5',
-   md: 'h-7 px-2.5 text-xs [&_svg]:size-3.5',
+   xs: 'h-5 gap-1 px-2 text-xs [&_svg]:size-3',
+   sm: 'h-5 gap-1 px-1.5 text-xs [&_svg]:size-3',
+   md: 'h-7 gap-2 px-2.5 text-xs [&_svg]:size-3.5',
```

**How it hid.** The page had been passing `<I.Alert size={12} />` into the
badge's `leftSlot` — the right value, arrived at by eye — and
`[&_svg]:size-3.5` overrode it to 14 every time. A consumer correcting a
component by hand and silently losing is the failure this file exists to catch;
the size attribute is gone from the pages now, because inside a badge the glyph
belongs to the badge.

**Both products.** Only `sm` changes (4px gap, 12px glyph); `md` and up keep
the 8px gap they already had, and no height or inset moves.

## Badge — the `sm` radius

*Numbered §27 when it was in the change log.*

**Why it is here:** it was never asked for. The kit does say `.badge-sm` is 4px
where the package renders 6, but the request against `Badge` was the hairline
and nothing else, and a finding filed among changes reads as one. No code was
ever changed for it.

## 27. `Badge size="sm"` rounds one step too far

`rounded` defaults to `md` (6px) for every badge size. The kit's small chip
renders at **4px** — measured, `border-radius: 4px`, height 20px. A 20px chip at
a 6px radius reads softer than the 28px chip above it, which is the wrong way
round. A `{ size: 'sm', rounded: 'md' }` compound variant dropping to `rounded`
is the same one-line fix `IconButton` already uses for its two smallest boxes.

## Popover — the floating surface

*Numbered §24 when it was in the change log.*

**Why it is here:** It argued for `bg-surface-card` and the code still ships `bg-surface-page`,
because the finding was retracted afterwards: the kit's base `.pop` is
`--surface-page` too, and the composed variant I measured was not the base. The
section kept its diff and its argument while the retraction lived two hundred
lines away in the audit matrix, so it read as an open recommendation for a
change that had been withdrawn.

### As it was written

#### 24. `Popover` paints the page, not the card

`src/components/Popover/PopoverContent.tsx`

```diff
- 'border-stroke bg-surface-page text-ink-primary',
+ 'border-stroke bg-surface-card text-ink-primary',
```

Every other floating surface in the package is `--surface-card`: `ModalContent`,
`DropdownMenuContent`, `SheetContent`, the toast shell. `PopoverContent` is the
one exception, and the kit renders its popovers on `#FFFFFF` — Surface/Card —
in both the plain preview and the two composed variants (Account menu,
Subscription credits), each of which states *"Surface `Surface/Card`"*.

On light the error is nearly invisible (`#F8FAFC` against `#FFFFFF`). It is not
invisible on dark, and it is not invisible when a popover opens over a card,
which is the normal case: the floating surface reads as *recessed* relative to
what it floats above, which is backwards.

The kit's own Sheet entry flags the same class of question — *"Surface
harmonization ⚠ peers (Modal / Dropdown) use card — settle one"*. It is settled
everywhere except here.


## Table — hover must not repaint a selected row

*Numbered §25 when it was in the change log.*

**Why it is here:** Raised as a gap and retracted: the kit has no `--tbl-row-selected-hover` at
all. A real change did ship with it — the token and its two `!important` cell
rules are gone — but that is recorded where it belongs, in the interaction-state
section and in the Summary. This section only recorded the wrong reading.

### As it was written

#### 25. `Table` — hover must not repaint a selected row · **Retracted**

Raised as a gap, and fixed while this audit was being written. The kit's rule is
two declarations and no third colour — `tr:hover td` then `tr.is-selected td`,
same specificity, `.is-selected` emitted second, so selection simply holds under
the pointer. `--tbl-row-selected-hover` **is not defined in the kit at all**
(verified by reading the computed value off its document root).

`TableCell` used to invent it and force it with `!important`. It no longer does:
the token is gone from `globals.css` and `THEME_COLORS`, and selected + hover now
resolves to `--tbl-row-pressed`, which is the kit's behaviour exactly. The two
`!important`s remain, and are still load-bearing — Tailwind emits the
`.is-selected` variants before the `data-interactive` ones, so at equal
specificity plain hover would win and the selection would visibly disappear.

**Covered by** `.changeset/interaction-states-relative-overlays.md`, which removes
the token by name and gives the reason ("the old token made a selected row read
as *less* selected the moment you touched it"). Nothing to do.


## Modal — the dialog radius

*Numbered §28 when it was in the change log.*

**Why it is here:** Filed as "`rounded-2xl` is a stock 16px radius, off the `--radius-*` scale".
Both halves were wrong. `--radius-2xl: 0.875rem` is in `globals.css`, the preset
maps `borderRadius['2xl']` to it, and 0.875rem is 14px — the kit's `.dlg` to the
pixel. Nothing was changed because nothing was wrong.

The lesson is worth keeping, which is why this is archived rather than deleted:
in this package a Tailwind utility name tells you nothing about whether it is
tokenized. Only `tailwind-preset.ts` and `THEME_COLORS` are evidence.

### As it was written

#### 28. `Modal`'s dialog radius · **Retracted — it was already right**

Filed as "`rounded-2xl` is a stock 16px radius off the `--radius-*` scale". Wrong
on both halves, and worth keeping as a worked example of how to misread this
system.

`--radius-2xl: 0.875rem` exists in `globals.css`, the preset maps
`borderRadius['2xl']` to it, and `0.875rem` is **14px** — the kit's `.dlg` radius
to the pixel. The scale does not stop at `xl`; I read the SPEC's list of radius
tokens (`sm/DEFAULT/md/lg/xl`) as the whole scale instead of checking the preset,
which is the one place that decides what a utility resolves to.

The lesson generalises: in this package a Tailwind utility name tells you nothing
about whether it is tokenized. `rounded-2xl` is; `bg-bg` is not (§38). Only
`tailwind-preset.ts` and `THEME_COLORS` are evidence.


## Typography — three of the agreed nineteen

*Numbered §34 when it was in the change log.*

**Why it is here:** Superseded. The rungs it asked for were added, then two of them removed
again, and the whole question is settled in the size-ladder section. Two
sections describing one outcome is one too many.

### As it was written

#### 34. `Typography` — three of the agreed nineteen are missing · **Fixed in §46**

`src/components/Typography/index.tsx`

The kit's type section is unusually firm: *"Every text style in the product is
one of these nineteen — a size/weight/line-height combination that is not on this
list is drift."* Lining its list up against `textStyle`:

| Kit style | `textStyle` |
|---|---|
| Heading L/M/S/XS/16 | `heading36` `heading30` `heading24` `heading20` `heading16` |
| Title 30/24/20/16/14/12 | `title30` … `title12` |
| Body L / M / S | `body16` `body14` `body12` |
| **Body XL — 18/28 · 400** | **absent** |
| Label L / M / S | `label14` `label12` `label10` |
| **Label 2XL — 18/28 · 500** | **absent** |
| **Label XL — 16/24 · 500** | **absent** |
| Overline | `overline` |
| — | `display` *(package addition, not on the kit's list)* |

The three absences are not exotic: Label XL is *"лейбл великої кнопки (lg)"* and
Label 2XL is the `xl` button's label — that is `Button size="lg"` and
`size="xl"`, both of which the package ships and both of which currently render
their label at `text-sm`/500 because the ladder tops out there. Body XL is *"текст
значення в xl-контролах"*.

The docstring says "Nineteen styles on eight size rungs", which is true only by
counting `display` into the nineteen — so the count matches the kit's while the
set does not. Adding `body18`, `label18`, `label16` and describing `display`
separately makes the claim true again.

> Unresolved, and it blocks two of the three: the same kit section lists
> `18px` under *"Не на шкалі"* (not on the scale, migrate upward 18→20) while
> `Body XL` and `Label 2XL` are both 18/28 and both on the list of nineteen. The
> kit contradicts itself. `Label XL` (16/24) is unaffected and can be added now.

## Table row hover — "not painted at all"

*Numbered §3 when it was in the change log.*

**Why it is here: it is not true.** `upstream/master` already has
`'row-hover': 'hsl(var(--tbl-row-hover) / <alpha-value>)'` — the hover works in
the published catalog. The diff below points the other way, and the direction
that is real belongs to §7a: the interaction-state work turned the token into a
`color-mix()`, which has to be exposed as a bare `var()`. So the branch now has
what this section calls the defect, on purpose.

### As it was written

#### 3. Table row hover was not faint — it was not painted at all

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

## Link — the weight `font-[inherit]` deleted

*Numbered §57 when it was in the change log.*

**Why it is here:** `Link` is new on this branch. The bug it describes was introduced and fixed inside the branch, so nothing published ever had it: it is a self-correction, not a change anybody outside can see.

### As it was written

#### 57. `Link` — `font-[inherit]` silently deleted the weight

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


## TableHead — a checkbox made the header 2px taller

*Numbered §59 when it was in the change log.*

**Why it is here:** The "before" it measures is `px-4 py-2.5`, which is an intermediate state of this branch. The published header is `ps-3 pe-2` with no vertical padding at all, so it was never 2px taller. Self-correction.

### As it was written

#### 59. `TableHead` — a checkbox made the header 2px taller

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


## PageHeader — the back control’s pill overhung the page

*Numbered §60 when it was in the change log.*

**Why it is here:** `PageHeader` is new on this branch. The negative insets it removes were added inside the branch, so this records a draft being revised rather than a change to the library.

### As it was written

#### 60. `PageHeader` — the back control's pill overhung the page

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

## InputGroup — two insets on one edge

*Numbered §53 when it was in the change log.*

**Why it is here:** the 24px it measures only existed once `InputGroupAction`
did, and that part is new on this branch. The published field has no trailing
action to stack against, so nothing outside the branch ever had this. The rule
that came out of it — the shell yielding its trailing inset — belongs to the
new part and is recorded there.

### As it was written

#### 53. `InputGroup` — two insets on one edge

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
part is new in §46, so no existing field changes.

## SidebarHeader — the two shells, told apart by `:empty`

*Numbered §11 when it was in the change log.*

**Why it is here:** the library ships one sidebar, the web one. The section
exists to reconcile it with a desktop shell that puts the product mark in a
window bar, and that shell is out of scope. `empty:pb-0` stays in the component
— a header with nothing in it should not keep a gap under nothing — but it is a
detail of the header, not a second shape.

### As it was written

#### 11. `SidebarHeader` — the two shells, told apart by `:empty`

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
must know which shape it is and say so, and per §10 a rule a consumer has to
remember is a rule that eventually is not followed. Here there is nothing to
decide and nothing to get wrong.

Verified: desktop shell header height 12, `padding-bottom: 0`, gap from window
bar to first nav row 12. Web shell keeps `pb-2`. Both are in Storybook as
`Sidebar / ShellShapes` — the only place the two can be compared, and the thing
that fails visibly if either breaks.
