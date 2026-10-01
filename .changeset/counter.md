---
'@devart/ui-react': minor
---

`Counter` — a small round count, for wherever the product says "N of these are waiting".

It is deliberately **not** Badge. A badge labels a thing — "Recommended", "Beta",
"12 sources" — and sizes itself to its label, which is why it is a pill. A counter
holds a number, the number is the whole content, and it keeps a 1:1 box: a column
of counts has to read as a column, and a row of differently-wide pills does not.
A second digit therefore does not widen it.

Two states and no more:

- **default** — the quiet surface with Text/Body on it. A count is content, not a
  status, and most of the time nothing is happening to it.
- **`active`** — filled, and it means one thing only: *this is moving on its own
  right now*.

The active fill is Button/Primary's own pair rather than Brand/Primary raw, because
white on Brand/Primary measures 3.93:1 on dark — under the floor for 12px text. The
button's fill and ink are already maintained to stay legible in both themes, so this
tracks them if the brand ever moves. Measured: 4.77:1 active in both themes, 9.45:1
light / 14.49:1 dark at rest.

Introduced because the same object had grown twice in a consumer — once as the order
number on a queued message, once as the per-chat count in the sidebar — as a 20px
circle in one place and a padded pill in the other.
