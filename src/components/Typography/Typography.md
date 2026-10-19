Every piece of text in the system. **Type is chosen as a named style, never as a
size.**

```jsx
<Typography element="h1" textStyle="title20">Connections</Typography>
<Typography element="p" textStyle="body14" textColor="secondary">
  2.4 GB of 10 GB used.
</Typography>
```

## The scale

| Family | Steps | Weight | Use |
|---|---|---|---|
| `display` | — | — | hero numerals only |
| `heading` | `36 30 24 20 18 16` | 500 | section headings |
| `title` | `30 24 20 18 16 14 12` | 600 | page and card titles |
| `body` | `16 14 12` | 400 | prose, table cells, descriptions |
| `label` | `14 12 10` | 500 | form labels, chips, metadata |
| `overline` | — | — | small-caps section eyebrows |

Each style carries size, weight **and** line-height together — so never pair a
`textStyle` with your own `text-*` or `leading-*` class.

There are exactly nine sizes in the system: 10 / 12 / 14 / 16 / 18 / 20 / 24 /
30 / 36. **13px and 11px are not part of it** — if a design shows one, it is
pre-migration. Never write `text-[13px]`.

**18 is back** for what prod sets at 18: the profile dialog's plan panel
("Choose a plan" at 500, the plan names at 600) and its balance panel (the
credit amounts at 600) — `heading18` and `title18`. There is no `body18`. Its
leading is 24px, the `leading-6`
prod declares there — not the 28px Tailwind pairs with `text-lg`.

## Element vs style

`element` picks the semantic tag and is chosen **independently** of the visual
weight: heading level follows content hierarchy, and there is one `h1` per page.
A card title that looks like a `title16` may still need to be an `h2`.

```jsx
<Typography element="h2" textStyle="title16">Storage</Typography>
```

Each style has a sensible default tag, so `element` is only needed when the
semantics and the visuals disagree — which is most of the time in real layouts.

## Colour

`textColor`: `primary` (headings), `body` (prose — the default for reading
text), `secondary` (supporting copy, table headers), `inactive` (disabled),
`highlight`. Never name a raw colour; these are the only ink roles, and they are
what makes text legible in both themes without a second thought.
