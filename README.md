# @insightis/ui

Shared component library built on Radix UI primitives, Tailwind CSS, and CVA variants.

## Peer dependencies

Consumers must provide:

| Peer | Range | Notes |
|---|---|---|
| `react` | `^19` | Never nested from this package — dual React → "Invalid hook call" |
| `react-dom` | `^19` | Required by Radix primitives |
| `tailwindcss` | `^3.4` | Required by `@insightis/ui/tailwind-preset` |
| `@types/react` | `^19` | Optional (`peerDependenciesMeta`) |

## Importing

Always use subpath imports — never barrel-import from `@insightis/ui`:

```ts
import { Button } from '@insightis/ui/Button';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@insightis/ui/Modal';
import { cn } from '@insightis/ui/cn';
import { useIsMobile } from '@insightis/ui/use-mobile';
```

To set up Tailwind in a consuming app:

```ts
// tailwind.config.ts
import { preset, contentGlobs } from '@insightis/ui/tailwind-preset';

export default {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}', ...contentGlobs],
  theme: { extend: { /* app-own additions only */ } },
};
```

Tailwind v3 presets do not merge `content` — spreading `contentGlobs` (absolute globs into the package's `src` and `dist`) is mandatory, not optional, or the package's own class names never get generated.

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import '@insightis/ui/globals.css'; /* tokens only */
@import '@insightis/ui/fonts.css';   /* optional: self-hosted DM Sans — skip if you ship your own font and set --font-sans */
```

`@insightis/ui/globals.css` is pure CSS-variable declarations, with no `@tailwind` directives of its own — the consumer owns those, so Tailwind's base/reset never runs twice.

---

## Client-only package

`@insightis/ui` is a client-only package — every component and hook it ships requires the React client runtime. Every public entry point carries the `'use client'` directive, so a consumer using React Server Components can import any of them directly from a server component without adding its own `'use client'` boundary.

- The public API is subpath-only (`@insightis/ui/Button`, `@insightis/ui/cn`, `@insightis/ui/use-mobile`, …) — there is no root entry, and internal modules are not reachable; deep imports into the package's internals are not part of the supported API.
- The package contains no server components and none are planned. A `components.json` that previously claimed `"rsc": true` has been removed.

---

## Theming and overrides

Dark mode is `darkMode: ['class']`: tokens are declared for `:root` and `.dark` only, and the cascade does the rest. There is no `data-theme` attribute and no bare `prefers-color-scheme` fallback in the token file itself — a consumer that offers a "system" option must resolve it in JS and toggle the `dark` class (this is what `apps/web`'s `ThemeProvider` does).

Override any token by redefining its `--*` variable after the import. Whether a class takes a Tailwind alpha modifier (`/20`) depends on how `src/lib/constants.ts` wraps the variable:

- HSL-triplet tokens are wrapped `hsl(var(--x) / <alpha-value>)`, so `bg-brand-primary/20` works.
- `color-mix()` tokens are exposed as bare `var(...)` and accept **no** alpha modifier — wrapping one in `hsl()` would emit invalid CSS. Current bare-`var()` keys: `--btn-secondary-bg-hover`, `--btn-outline-bg-hover`, `--btn-outline-bg-press`, `--btn-outline-destructive-bg-hover`, `--btn-outline-destructive-bg-press`, `--badge-brand-bg`, `--badge-brand-border`, `--badge-brand-text`, `--badge-green-bg`, `--badge-green-border`, `--badge-green-text`, `--toast-bg-*`, `--toast-border-*`, `--segctrl-btn-hover-bg`, `--tbl-row-selected-hover`, `--icon-wrapper-bg`, `--card-border-hover`, `--card-border-press`, `--card-lift-border`, `--plan-card-featured-border`, `--dropzone-border-active`, `--dropzone-bg-active`, `--banner-grad-sub`, `--banner-grad-ic-bg`, `--banner-grad-ic-border`, `--banner-grad-ic-shadow`, `--overlay-scrim`.

Geometry and typography axes are token-driven the same way, all seeded with Tailwind's own default values so adopting them changes nothing visually: `--radius-sm` / `--radius` / `--radius-md` / `--radius-lg` / `--radius-xl`, `--sidebar-width` / `--sidebar-width-icon` / `--sidebar-width-mobile`, `--shadow-thumb` / `--shadow-thumb-hover`, `--font-sans` (redefine the variable, or override `theme.fontFamily.sans` in your own preset extension, to ship a different typeface), the type scale — `--font-size-{xxs,xs,compact,sm,base,lg,xl,2xl,3xl,4xl}`, with `--line-height-{xs,sm,base,lg,xl,2xl,3xl,4xl}` paired for every step but `xxs`/`compact` (override the `sm` step, for example, by redefining both `--font-size-sm` and `--line-height-sm` in your own `:root`) — and the weight scale, `--font-weight-{light,normal,medium,semibold,bold,extrabold,black}` (override `--font-weight-semibold` in your own `:root`, for example, to change what `font-semibold` renders).

Deliberately **not** tokenized: `spacing` (default Tailwind scale), `letterSpacing`, and z-index; `lineHeight` is tokenized only as the half Tailwind itself pairs with a font size, so the standalone `leading-*` scale is not.

Breakpoints behave unlike every other token. `--breakpoint-sm` / `--breakpoint-md` / `--breakpoint-lg` / `--breakpoint-xl` do exist and are readable from JS or `calc()`, but the preset generates them from the `BREAKPOINTS` constant (exported by `@insightis/ui/use-mobile`) that also drives `theme.extend.screens` and `useIsMobile`/`useMaxWidth` — so redefining one in your own `:root` moves nothing, because a CSS variable cannot appear in a `@media` query. To actually change a breakpoint, set `screens` in your own Tailwind config (as `theme.extend.screens`, if you want Tailwind's default `2xl` to survive) and pass the matching pixel value through `useIsMobile(breakpoint)`, `DateRangePicker`'s `mobileBreakpoint` prop, or `SidebarProvider`'s `sheetBreakpoint` prop.

---

## Component catalog

| Component | Based on | Variants |
|---|---|---|
| **Accordion** | Radix | — |
| **Autocomplete** | Custom | — |
| **Avatar** | Radix | — |
| **Badge** | CVA | `variant`, `size`, `rounded` |
| **Button** | CVA + Radix Slot | `variant`, `size`, `align`, `rounded`, `fullWidth` |
| **Card** | HTML | — |
| **Checkbox** | Radix + CVA | `variant`, `size`, `rounded`, `labelPosition` |
| **CircularProgress** | Custom | — |
| **Collapsible** | Radix | — |
| **Datepicker** | Custom | — |
| **DropdownMenu** | Radix | — |
| **File** | Custom | — |
| **IconButton** | CVA | `variant`, `size`, `rounded` |
| **Input** | HTML | — |
| **InputGroup** | Custom | — |
| **Modal** | Radix Dialog | — |
| **Pagination** | Custom | — |
| **PasswordInput** | Custom | — |
| **Popover** | Radix | — |
| **ProgressBar** | Radix + CVA | `variant`, `size`, `rounded` |
| **ScrollShadow** | Custom | — |
| **Separator** | Radix | — |
| **Sheet** | Radix Dialog | — |
| **Sidebar** | Custom | — |
| **Skeleton** | CSS | — |
| **Spinner** | Custom | — |
| **Switch** | Radix | — |
| **Table** | HTML | — |
| **Tabs** | Radix | — |
| **Toast** | Sonner | — |
| **Tooltip** | Radix | — |
| **Typography** | HTML | — |

---

## Button variants

Button is the best reference for how CVA components work in this package:

```tsx
// Variants
<Button variant="primary">Save</Button>       // default
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Edit</Button>
<Button variant="destructive">Delete</Button>
<Button variant="transparent">Learn more</Button>

// Sizes: xs | sm | md (default) | lg | xl
<Button size="sm">Small</Button>

// Slots for icons
<Button leftSlot={<PlusIcon />}>Add item</Button>
<Button rightSlot={<ChevronRightIcon />}>Next</Button>

// Full width
<Button fullWidth>Submit</Button>

// Render as a different element
<Button asChild><a href="/settings">Settings</a></Button>
```

All CVA components accept `className` which is merged via `cn()` and appended after variant classes.

---

## Radix composition pattern

Radix-based components are exported as composable named parts. Example with Modal:

```tsx
import {
  Modal, ModalContent, ModalHeader, ModalTitle,
  ModalBody, ModalFooter, ModalTrigger, ModalClose
} from '@insightis/ui/Modal';

<Modal open={isOpen} onOpenChange={setIsOpen}>
  <ModalTrigger asChild>
    <Button>Open</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Title</ModalTitle>
    </ModalHeader>
    <ModalBody>Content here</ModalBody>
    <ModalFooter>
      <ModalClose asChild><Button variant="secondary">Close</Button></ModalClose>
    </ModalFooter>
  </ModalContent>
</Modal>
```

The same compositional pattern applies to `Popover`, `DropdownMenu`, `Tabs`, `Tooltip`, and `Sheet`.

---

## cn() and cva() — mandatory conventions

### cn()

`cn()` is the **only** way to construct class strings in this package. Never concatenate strings or use template literals for Tailwind classes.

```ts
import { cn } from '@insightis/ui/cn';

// correct
cn('px-2 py-1', isActive && 'bg-primary', className)

// wrong — cn() resolves conflicts between Tailwind utilities; raw concatenation does not
`px-2 py-1 ${isActive ? 'bg-primary' : ''} ${className}`
```

### cva()

Any component with visual variants **must** define them with `cva()`. Do not branch on variant props with conditionals or string maps — CVA is the single source of truth for variant classes and enables typed `VariantProps`.

```ts
// correct
const badgeVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      primary: 'bg-primary text-white',
      secondary: 'bg-chip text-content-body',
    },
    size: { sm: 'h-5 text-xs', md: 'h-6 text-sm' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
}

// wrong — ad-hoc branching instead of cva
const cls = variant === 'primary' ? 'bg-primary text-white' : 'bg-chip text-content-body';
```

Always export the variants object (e.g. `badgeVariants`) alongside the component so consumers can reuse the classes without rendering the component.

---

## Color tokens

**Never use arbitrary color values** — no hex (`#1a2b3c`), no raw hsl (`hsl(192 89% 21%)`), no Tailwind arbitrary syntax (`bg-[#1a2b3c]`). Every color must come from a token.

Most tokens support the Tailwind alpha modifier (`/value`); `color-mix()`-backed ones do not — see Theming and overrides above.

```ts
// correct — token with opacity
'bg-brand-primary/20'
'text-ink-secondary/60'
'border-fb-red/30'

// wrong — arbitrary values
'bg-[#0a3d52]'
'text-[hsl(179,94%,26%)]'
```

Design System v2 is the only token system (the pre-redesign palette has been deleted). A compact sample by group — the full surface is `THEME_COLORS` in `src/lib/constants.ts`:

| Group | Example classes |
|---|---|
| `brand` | `bg-brand-primary`, `text-brand-secondary` |
| `ink` | `text-ink-primary`, `text-ink-body`, `text-ink-secondary` |
| `surface` | `bg-surface-page`, `bg-surface-card`, `bg-surface-card2` |
| `stroke` | `border-stroke`, `border-stroke-hover` |
| `state` | `bg-state-hover`, `bg-state-pressed`, `bg-state-disabled` |
| `fb` (feedback) | `text-fb-red`, `bg-fb-green/10`, `text-fb-attention` |
| `table` / `tbl` | `bg-table-row-hover`, `bg-tbl-row-pressed` |
| `badge` | `bg-badge-primary-bg`, `text-badge-secondary-text` |
| `btn` | `bg-btn-primary-bg`, `bg-btn-primary-bg-hover` |
| `toast` | `bg-toast-bg-success`, `border-toast-border-error` (no alpha) |
| `dropzone` | `border-dropzone-border`, `bg-dropzone-bg-active` (no alpha) |

Both light and dark values are defined for theme-dependent tokens — theming is automatic. To add a new color token: define it in `globals.css` for `:root` (and `.dark` if it is theme-dependent), then expose it in `src/lib/constants.ts`'s `THEME_COLORS`. For a non-color axis (radius, shadow, duration, …) expose it in `tailwind-preset.ts` instead.

---

## Adding a new component

1. Create `src/components/<Name>/index.tsx`
2. Define variants with `cva()` if the component has visual variants; export the variants object alongside the component
3. Use only token-based color classes — no arbitrary values; add new tokens to `globals.css` + `src/lib/constants.ts` (or `tailwind-preset.ts` for non-color axes) if needed
4. Construct all class strings with `cn()`
5. Use a Radix primitive for any interactive behavior (focus, keyboard, a11y)
6. Support `className` prop merged via `cn(variants(...), className)`
7. Export the component and any variant types from `index.tsx` — the wildcard export in `package.json` handles the rest
