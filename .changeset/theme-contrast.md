---
'@devart/ui-react': minor
---

Fix three colour defects that only appear in one theme, and add the audit that
found them.

**`Avatar` initials failed AA on dark.** The fill followed `--brand-primary`,
which lifts to a lighter step there, dropping white text to 3.94:1 against the
4.5 floor for body text. A new `--avatar-bg` holds brand-600 in both themes:
4.77:1 either way. The `Banner` icon well and the `Checkbox` tick keep
`--brand-primary` on purpose — they are glyphs, judged at 3:1, and they pass.

**The destructive tertiary fill was measured, not guessed.** `hover:bg-fb-red/8`
and `pressed:bg-fb-red/12` were raw alphas beside a neutral tertiary that uses
`--state-hover`. Red-700 is darker and more chromatic, so the same alpha lands
47% heavier on light and 66% lighter on dark. New `--btn-destructive-tertiary-bg-*`
tokens carry a per-theme ratio; the two variants now sit within 0.3 dL* of each
other in both themes.

**`--tbl-header-bg` had drifted.** It had no call site anywhere in `src/`, and
its value had slid onto the group-band step — the failure mode the spec names
outright. It is unused by the default table, which is unbanded, and is now
documented as being kept for a banded variant.

`.design-sync/theme-audit.mjs` resolves the whole token graph in both themes and
fails on a state-ladder collision, an inverted step, a broken equality, a parity
gap between a neutral and destructive pair, or a contrast miss. Nothing in the
build could catch any of these: two roles resolving to the same colour render as
one flat surface with no error anywhere.
