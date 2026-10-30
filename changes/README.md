# `changes/` — the review section of Storybook

Every numbered **change** in `DESIGN-SYSTEM-CHANGES.md`, rendered as **Before |
After** so it can be reviewed by eye before it is reviewed in a diff.

**A new component is not a change and gets no panel here.** It has no Before, so
the panel would be a one-sided box that reviews nothing — the catalogue entry,
shown a second time. A `New — …` section in `DESIGN-SYSTEM-CHANGES.md` is
therefore expected to have no counterpart in this section; that is not a gap.
The place to look at a new component is its own story under **Components**.

It exists because of SPEC.md decision 10: Storybook is this package's only
verification surface. There are no unit tests, and a class naming a token that
does not exist compiles to nothing rather than to an error — so a change that is
correct in prose and wrong in pixels fails silently everywhere else.

```
pnpm storybook     # http://localhost:6006 -> "Proposed changes"
```

## How it is laid out

The section reads like the change log's own index:

| Page | File | Draws |
|---|---|---|
| Overview | `overview.stories.tsx` | every index line, and whether a page draws it |
| Tokens and colour · Sizes and glyphs · Across components | `<name>.stories.tsx` | the index rows of the same names |
| Components / *Name* | `components/<Name>.stories.tsx` | one index row — `Checkbox`, `Button and IconButton` |

Nothing that counts is typed by hand. `journal.ts` reads, each time a story
renders, the index of `DESIGN-SYSTEM-CHANGES.md`, the `## Packages` table of
`HANDOFF.md`, and the source of every page here. From that:

- the overview lists every § with its state — drawn, no panel yet, new
  component, nothing to render;
- a page given `group="<index row>"` counts itself ("3 of 4 changes drawn") and
  lists under its cases what the row has and the page does not draw yet;
- a case whose § went out in a handoff package carries the package id.

A § counts as drawn when some page carries `n={57}` (or `n="6a"`). A case whose
`n` is not a number — `"Docs · Switch.md"` — is drawn but counted nowhere.

A § with no honest Before — the part is not in the developers' library at the
design base, or the change moves no pixel — gets `<NoPanel section={94}
title="…" why="…" />` on its page instead of a case. It says why, and the § is
counted as answered rather than missing. `section`, not `n`, so it is never
mistaken for a drawn §.

`group` is the index row spelled as the index spells it, backticks dropped. A
row the index renames, or a page whose `group` matches nothing, simply shows no
count — check the overview after renaming either.

## Where it lives, and why not in `src/`

Outside `src/` on purpose. `tsconfig.build.json` builds from `src`, and
`package.json#files` ships `dist` — so nothing here can reach a consumer, and no
demo import can be mistaken for a package entry point. Three places register it,
all Storybook-only:

| File | Line |
|---|---|
| `.storybook/main.ts` | `'../changes/**/*.stories.tsx'` in `stories` |
| `.storybook/preview.tsx` | `storySort` puts the section above the catalog, and its pages in the index's order |
| `tailwind.config.ts` | `'./changes/**/*.tsx'` in `content`, so the classes compile |

`tailwind.config.ts` is itself Storybook-only (SPEC.md, Package Surface):
consumers get `src/tailwind-preset.ts`, not this file.

## The rule for a Before panel

The *After* half is the live component. The *Before* half is one of four
things, and each case states which under the comparison:

1. **A token override** — the old value re-declared on a wrapper. Exact.
2. **The old class string, reapplied through `className`** — twMerge keeps the
   last class in a group, so the old rendering comes back. Exact.
3. **The developers' file itself**, copied unchanged from the design base into
   `upstream/` (import paths alone rewritten) — for a change in markup rather
   than in a class, such as a glyph swapped for a drawn mark. Exact, and frozen:
   when the base moves, the file is replaced whole, never edited.
4. **A replica** — only where none of the above reaches (an internal
   component, a class on an element the component renders itself). A replica
   can drift; the first three cannot.

Prefer 1–3. If a case needs 4, say so in `beforeSource` — a reviewer who
cannot tell a replica from the real thing cannot trust either.

## Adding a case

On the page of its index row — `components/<Name>.stories.tsx`; if the row has
no page yet, copy one, set `title: 'Proposed changes/Components/<Name>'`, keep
the one story named `Page`, and give `ChangePage` the row as `group`. Cases go in
§ order.

```tsx
<ChangeCase
  n={23}
  title="What changed, in the words of the section heading"
  files={['src/components/Thing/index.tsx']}
  state="draft"               // optional: | 'proposed' | 'docs-only' | 'not-a-library-change'
  why="Why the old state was wrong — one or two sentences."
  before={<Thing className={OLD_CLASSES} />}
  beforeSource="how this half is produced"
  after={<Thing />}
/>
```

`before` is expected. A case with no Before renders as one wide panel, and there
are exactly two honest reasons to reach for that: the change is `proposed` and
not built yet, so there is no After to set against anything either; or the gap
was filed and downgraded to a recipe (`state="not-a-library-change"`), where the
single panel IS the recipe. "The subject is new, so there is nothing to compare
against" is not one of them — see the rule at the top. Say which in `footnote`.

`state` is set only when the kind of case changes how to read it — a `draft`
nothing should be built on yet, a `proposed` change not made anywhere, a
`docs-only` recipe. Git state is deliberately not one of them (see `Harness.tsx`):
a design review is about pixels, not branches.
