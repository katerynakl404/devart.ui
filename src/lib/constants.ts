export const THEME_COLORS = {
  // Semantic + component tokens. Primitives intentionally NOT exposed here.
  // Spec: changes/colors.md.
  brand: {
    primary: 'hsl(var(--brand-primary) / <alpha-value>)',
    secondary: 'hsl(var(--brand-secondary) / <alpha-value>)',
    tertiary: 'hsl(var(--brand-tertiary) / <alpha-value>)',
    hover: 'hsl(var(--brand-hover) / <alpha-value>)',
    press: 'hsl(var(--brand-press) / <alpha-value>)',
  },
  ink: {
    primary: 'hsl(var(--ink-primary) / <alpha-value>)',
    body: 'hsl(var(--ink-body) / <alpha-value>)',
    secondary: 'hsl(var(--ink-secondary) / <alpha-value>)',
    inactive: 'hsl(var(--ink-inactive) / <alpha-value>)',
    highlight: 'hsl(var(--ink-highlight) / <alpha-value>)',
  },
  surface: {
    page: 'hsl(var(--surface-page) / <alpha-value>)',
    card: 'hsl(var(--surface-card) / <alpha-value>)',
    card2: 'hsl(var(--surface-card2) / <alpha-value>)',
    chips: 'hsl(var(--surface-chips) / <alpha-value>)',
    accent: 'hsl(var(--surface-accent) / <alpha-value>)',
  },
  stroke: {
    DEFAULT: 'hsl(var(--stroke-border) / <alpha-value>)',
    hover: 'hsl(var(--stroke-border-hover) / <alpha-value>)',
    'field-hover': 'hsl(var(--field-border-hover) / <alpha-value>)',
  },
  table: {
    'header-bg': 'hsl(var(--tbl-header-bg) / <alpha-value>)',
    'row-hover': 'hsl(var(--tbl-row-hover) / <alpha-value>)',
    'row-pressed': 'hsl(var(--tbl-row-pressed) / <alpha-value>)',
  },
  metrics: {
    'group-band': 'hsl(var(--mx-group-band) / <alpha-value>)',
  },
  overlay: {
    scrim: 'var(--overlay-scrim)',
  },
  state: {
    hover: 'hsl(var(--state-hover) / <alpha-value>)',
    pressed: 'hsl(var(--state-pressed) / <alpha-value>)',
    disabled: 'hsl(var(--state-disabled) / <alpha-value>)',
    'focus-ring': 'hsl(var(--state-focus-ring) / <alpha-value>)',
  },
  fb: {
    red: 'hsl(var(--fb-red) / <alpha-value>)',
    'red-text': 'hsl(var(--fb-red-text) / <alpha-value>)',
    'red-hover': 'hsl(var(--fb-red-hover) / <alpha-value>)',
    'red-press': 'hsl(var(--fb-red-press) / <alpha-value>)',
    'error-hover': 'hsl(var(--fb-error-hover) / <alpha-value>)',
    'error-press': 'hsl(var(--fb-error-press) / <alpha-value>)',
    attention: 'hsl(var(--fb-attention) / <alpha-value>)',
    green: 'hsl(var(--fb-green) / <alpha-value>)',
  },
  logo: {
    ink: 'hsl(var(--logo-ink) / <alpha-value>)',
    mark: 'hsl(var(--logo-mark) / <alpha-value>)',
  },
  avatar: {
    bg: 'hsl(var(--avatar-bg) / <alpha-value>)',
  },
  destructiveTertiary: {
    // color-mix values (bare var) — NOT wrapped in hsl(), and they take no
    // opacity modifier. The ratio differs per theme; see globals.css.
    'bg-hover': 'var(--btn-destructive-tertiary-bg-hover)',
    'bg-press': 'var(--btn-destructive-tertiary-bg-press)',
  },
  btn: {
    'primary-bg': 'hsl(var(--btn-primary-bg) / <alpha-value>)',
    'primary-bg-hover': 'hsl(var(--btn-primary-bg-hover) / <alpha-value>)',
    'primary-bg-press': 'hsl(var(--btn-primary-bg-press) / <alpha-value>)',
    'primary-text': 'hsl(var(--btn-primary-text) / <alpha-value>)',
    // color-mix value — no alpha channel substitution
    'secondary-bg-hover': 'var(--btn-secondary-bg-hover)',
    'secondary-border': 'hsl(var(--btn-secondary-border) / <alpha-value>)',
    'secondary-bg': 'hsl(var(--btn-secondary-bg) / <alpha-value>)',
    'secondary-border-hover':
      'hsl(var(--btn-secondary-border-hover) / <alpha-value>)',
    'outline-bg-hover': 'var(--btn-outline-bg-hover)',
    'outline-bg-press': 'var(--btn-outline-bg-press)',
  },
  outlineDestructive: {
    border: 'hsl(var(--btn-outline-destructive-border) / <alpha-value>)',
    'border-hover':
      'hsl(var(--btn-outline-destructive-border-hover) / <alpha-value>)',
    // color-mix values (bare var) — NOT wrapped in hsl(); they are not HSL
    // triplets, so an hsl() wrapper would produce invalid CSS.
    'bg-hover': 'var(--btn-outline-destructive-bg-hover)',
    'bg-press': 'var(--btn-outline-destructive-bg-press)',
  },
  badge: {
    'primary-bg': 'hsl(var(--badge-primary-bg) / <alpha-value>)',
    'primary-text': 'hsl(var(--badge-primary-text) / <alpha-value>)',
    'secondary-bg': 'hsl(var(--badge-secondary-bg) / <alpha-value>)',
    'secondary-text': 'hsl(var(--badge-secondary-text) / <alpha-value>)',
    'chip-bg': 'hsl(var(--badge-chip-bg) / <alpha-value>)',
    'chip-text': 'hsl(var(--badge-chip-text) / <alpha-value>)',
    // color-mix values (opaque tints) — no alpha channel substitution
    'brand-bg': 'var(--badge-brand-bg)',
    'brand-border': 'var(--badge-brand-border)',
    'brand-text': 'var(--badge-brand-text)',
    'green-bg': 'var(--badge-green-bg)',
    'green-border': 'var(--badge-green-border)',
    'green-text': 'var(--badge-green-text)',
  },
  switch: {
    'off-bg': 'hsl(var(--switch-off-bg) / <alpha-value>)',
    'off-bg-hover': 'hsl(var(--switch-off-bg-hover) / <alpha-value>)',
  },
  // color-mix values (variant-tinted toast surfaces) — no alpha substitution
  toast: {
    'bg-success': 'var(--toast-bg-success)',
    'bg-info': 'var(--toast-bg-info)',
    'bg-warning': 'var(--toast-bg-warning)',
    'bg-error': 'var(--toast-bg-error)',
    'border-success': 'var(--toast-border-success)',
    'border-info': 'var(--toast-border-info)',
    'border-warning': 'var(--toast-border-warning)',
    'border-error': 'var(--toast-border-error)',
  },
  // color-mix value — no alpha channel substitution
  segctrl: {
    'hover-bg': 'var(--segctrl-btn-hover-bg)',
  },
  tbl: {
    'row-hover': 'hsl(var(--tbl-row-hover) / <alpha-value>)',
    'row-pressed': 'hsl(var(--tbl-row-pressed) / <alpha-value>)',
    // color-mix value — no alpha channel substitution
    'row-selected-hover': 'var(--tbl-row-selected-hover)',
  },
  'content-on-solid': 'hsl(var(--content-on-solid) / <alpha-value>)',
  'focus-ring-brand': 'hsl(var(--focus-ring-brand) / <alpha-value>)',
  'input-focus': 'hsl(var(--input-focus) / <alpha-value>)',
  'input-error': 'hsl(var(--input-error) / <alpha-value>)',
  'icon-wrapper-bg': 'var(--icon-wrapper-bg)',
  banner: {
    'grad-text': 'hsl(var(--banner-grad-text) / <alpha-value>)',
    'grad-btn-text': 'hsl(var(--banner-grad-btn-text) / <alpha-value>)',
    'grad-sub': 'var(--banner-grad-sub)',
    'grad-ic-bg': 'var(--banner-grad-ic-bg)',
    'grad-ic-border': 'var(--banner-grad-ic-border)',
    'grad-ic-shadow': 'var(--banner-grad-ic-shadow)',
  },
  // color-mix values — no alpha channel substitution
  'card-border-hover': 'var(--card-border-hover)',
  'card-border-press': 'var(--card-border-press)',
  'card-lift-border': 'var(--card-lift-border)',
  plan: {
    'card-featured-border': 'var(--plan-card-featured-border)',
  },
  dropzone: {
    border: 'hsl(var(--dropzone-border) / <alpha-value>)',
    'border-active': 'var(--dropzone-border-active)',
    'bg-active': 'var(--dropzone-bg-active)',
  },
} as const;
