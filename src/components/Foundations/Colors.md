Every semantic and component-scoped colour token, grouped by role. Generated
from the tokens themselves, so it cannot drift from what the components use.

**The primitive ramps are deliberately absent.** `--brand-*`, `--slate-*`,
`--red-*` and friends exist in CSS so the semantic layer can reference them, but
they are never exposed to Tailwind — there is no `bg-slate-200` in this system.
That indirection is exactly what lets a colour pack re-theme everything by
redefining the primitives and the semantic layer only, with no component change.

So: **name a role, never a shade.** `bg-surface-card`, `text-ink-body`,
`border-stroke`. A class naming a token that does not exist compiles to nothing
at all — no error, just a wrong pixel — so read this card rather than guessing a
name.

Tints use one scale: `/5 /6 /8 /10 /12 /15 /20 …`. Tokens built with
`color-mix()` (most `badge-*`, `toast-*`, `card-border-*`, and the destructive
button fills) take **no** opacity modifier — `bg-badge-brand-bg/50` silently
emits nothing.
