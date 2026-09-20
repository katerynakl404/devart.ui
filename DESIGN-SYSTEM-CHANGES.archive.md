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
