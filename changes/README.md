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

## Where it lives, and why not in `src/`

Outside `src/` on purpose. `tsconfig.build.json` builds from `src`, and
`package.json#files` ships `dist` — so nothing here can reach a consumer, and no
demo import can be mistaken for a package entry point. Three places register it,
all Storybook-only:

| File | Line |
|---|---|
| `.storybook/main.ts` | `'../changes/**/*.stories.tsx'` in `stories` |
| `.storybook/preview.tsx` | `storySort` puts the section above the catalog |
| `tailwind.config.ts` | `'./changes/**/*.tsx'` in `content`, so the classes compile |

`tailwind.config.ts` is itself Storybook-only (SPEC.md, Package Surface):
consumers get `src/tailwind-preset.ts`, not this file.

## The rule for a Before panel

The *After* half is the live component. The *Before* half is one of three
things, and each case states which under the comparison:

1. **A token override** — the old value re-declared on a wrapper. Exact.
2. **The old class string, reapplied through `className`** — twMerge keeps the
   last class in a group, so the old rendering comes back. Exact.
3. **A replica** — only where the old markup is unreachable from a prop
   (an internal component, a class on an element the component renders itself).
   A replica can drift; the first two cannot.

Prefer 1 and 2. If a case needs 3, say so in `beforeSource` — a reviewer who
cannot tell a replica from the real thing cannot trust either.

## Adding a case

```tsx
<ChangeCase
  n={23}
  title="What changed, in the words of the section heading"
  files={['src/components/Thing/index.tsx']}
  state="working-tree"        // | 'committed' | 'docs-only'
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

`state` is where the change currently sits — working tree, committed to this
branch, or documentation only. It is not decoration: per the Propagation section
of `DESIGN-SYSTEM-CHANGES.md`, neither product picks a change up until its
`ds-bundle` copy is rebuilt, so "committed" is not "shipped".
