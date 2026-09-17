The radius scale, each step at its real value.

| Class | Value | Use |
|---|---|---|
| `rounded-sm` | 2px | hairline chips, kbd keys |
| `rounded` | 4px | the default step |
| `rounded-md` | 6px | buttons, inputs, menu items |
| `rounded-lg` | 8px | cards, popovers, tables, accordion rows |
| `rounded-xl` | 12px | banners, large surfaces |
| `rounded-full` | pill | avatars, pills, switch thumbs |

Nest downward: something inside an `lg` surface takes `md`, so the inner corner
never looks flatter than the outer one. Per-corner and per-side forms
(`rounded-t-lg`, `rounded-tl-md`) are available on every step.
