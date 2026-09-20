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
