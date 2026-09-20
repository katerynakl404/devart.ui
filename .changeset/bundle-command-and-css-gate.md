---
'@devart/ui-react': patch
---

Add `pnpm bundle` — one command for the `ds-bundle` build — and a check that
catches the reason a component can look right in Storybook and wrong on a page.

The bundle was built by typing six commands in order, and both halves of that
failed silently in practice. A skipped step does not error: skipping the
Storybook build once dropped `FilterChips` from a bundle that reported zero
diagnostics, because the component roster is read from the Storybook index, not
from `dist`. And the order is load-bearing: `package-build` reads `dist`, so a
source edit made after `pnpm build` already ran never reaches the bundle — again
with no error, just a stale component. A second team working from another
checkout could not find how to run it at all.

`scripts/bundle.mjs` runs the chain and decides the Storybook step for itself by
diffing the component directories against what the last bundle holds, which is
the only step that depends on the roster. Class strings, tokens and props are
picked up by `pnpm build` alone, so the common case — a styling fix — skips the
slowest step instead of paying for it. `--storybook` / `--no-storybook` override
the decision, and the skip warns when the roster did change.

`scripts/check-bundle-css.mjs` (also `pnpm check-bundle-css`, and the last step
of `pnpm bundle`) addresses the divergence itself. Storybook compiles Tailwind
from the source files, so every class a component writes gets a rule. The bundle
compiles from `.design-sync/.cache/ds-classlist.txt`, an *enumerated* vocabulary
written by hand in `gen-classlist.mjs` — a class the enumeration missed produces
no CSS and nothing complains. The check compiles a second stylesheet with the
built components as Tailwind's content and diffs the class selectors against the
bundle, so Tailwind's own extractor decides what counts as a class rather than a
regex guessing at it. Currently clean: 964 rules needed, all shipped.

It narrows the gap rather than closing it — a class assembled at runtime from a
variable is not in the compiled text for any extractor to find. The pixel
comparison in `.ds-sync/storybook/compare.mjs` is what closes that last part.
