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
