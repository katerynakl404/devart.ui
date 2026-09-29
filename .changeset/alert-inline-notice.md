---
'@devart/ui-react': minor
---

`Alert` — the inline notice the package was missing, plus the first blue in the palette.

Banner is a large onboarding card and Toast floats over the page and takes itself
away. Neither fits a condition that has to sit INSIDE a surface, state itself
quietly and offer the way out: "the queue is paused because the assistant is
waiting for you", "the last reply failed", "you are out of credits". Consumers
were writing that block per page — the Insightis message queue had it as a
private CSS family — which is how a component ends up with four spellings.

**It is Toast standing still.** The roster, the accents, the glyphs and the
surface recipe are Toast's token for token: `success` · `info` · `warning` ·
`error`, the same semantics, the same SVG paths, and a `color-mix()` wash over
Surface/Card with a hairline of the accent at `--tint-30`. A family that changes
colour when it stops moving is two families, and a reader should not have to
learn that an orange triangle floating past and an orange triangle sitting in the
page mean the same thing.

Two deliberate departures, both recorded so they are not "corrected" later:

- **Info is Brand/Tertiary, not Brand/Primary.** Toast can afford the brand
  colour because it is gone in four seconds; an inline notice that stays reads as
  the product talking about itself.
- **`neutral` exists and has no Toast counterpart** — nothing floats over the
  page to say something colourless, but a queue paused because *you* pressed Stop
  is exactly that. It takes Surface/Card2 rather than Surface/Chips: on dark,
  Chips resolves to the same grey as Stroke/Border, so fill and edge collapse
  into one bright slab while on light they sit clearly apart.

There is no `brand` variant: with info on Tertiary the two would be the same teal
a shade apart.

**Token changes that reach every consumer, not just Alert:**

- **New `--fb-info`**, the fourth feedback colour beside Red, Attention and
  Green, and with it the palette's first blue — Brand and Tertiary are both teal,
  so an informational surface had no colour to be that was not also the product's
  own voice. Blue-600 on white = 5.17:1, Blue-400 on dark Surface/Card = 6.4:1.
- **New `--alert-bg-*` / `--alert-border-*`** (four each, per theme), shaped
  exactly like `--toast-*`, and an `alert` key in the Tailwind colour map.
- **`--fb-attention` moved `#FF6900` → `#F97316`** and **`--fb-green` moved
  `#009966` → `#059669` (light) / `#03AF76` → `#10B981` (dark).** Both primitives
  were single steps carrying custom values under a scale's name — `--orange-500`
  alone, and green as two theme-named steps (`--green-light-600` /
  `--green-dark-500`, a primitive that knew which theme it was for). A step that
  does not belong to the ramp it is named after is what makes every neighbouring
  step unusable, so both were pulled onto their Tailwind values and green was
  renamed to `--green-600` / `--green-500`, with the per-theme choice moved to
  `--fb-green` where it belongs. `--chart-series-4` follows green.

Anything reading `--fb-attention`, `--fb-green`, `--chart-series-4` or the badge
and toast tokens derived from them shifts by that much — hence minor, not patch.
