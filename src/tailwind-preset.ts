import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme.js';
import plugin from 'tailwindcss/plugin.js';
import animate from 'tailwindcss-animate';
import { BREAKPOINTS } from './lib/breakpoints';
import { THEME_COLORS } from './lib/constants';

const pressedVariantPlugin = plugin(({ addVariant }) => {
  addVariant('pressed', [
    '&:active',
    '&[aria-expanded="true"]',
    '&[aria-expanded="true"]:hover',
  ]);
});

const breakpointPx = Object.entries(BREAKPOINTS).map(
  ([name, px]) => [name, `${px}px`] as const
);

const breakpointVarsPlugin = plugin(({ addBase }) => {
  addBase({
    ':root': Object.fromEntries(
      breakpointPx.map(([name, px]) => [`--breakpoint-${name}`, px])
    ),
  });
});

/**
 * The two scrollbars the kit draws, copied from it rather than restated.
 *
 * `scrollbar-thin` is `.cl-menu-scroll` / `.cl-mention-list` / `.cp-code-pre`
 * in `Insightis/pages/kit-theme.css`, which carry identical declarations. The
 * 3px transparent border with `background-clip: padding-box` is what makes a
 * 10px track hold a 4px thumb — it is inset, not narrow, so the hit area stays
 * 10px while the thumb reads as a hairline.
 *
 * `scrollbar-none` is `.sbx-chats` / `.chip-row`: the region scrolls and shows
 * nothing. It is for a strip whose overflow is obvious from its content, never
 * for a panel where the bar is the only sign there is more.
 *
 * Both are utilities rather than a base rule on every scroller, because which
 * of the two a region takes is a decision per region — and `globals.css` ships
 * no component-layer CSS (decision 8).
 */
const scrollbarPlugin = plugin(({ addUtilities }) => {
  addUtilities({
    '.scrollbar-thin': {
      'scrollbar-width': 'thin',
      'scrollbar-color': 'hsl(var(--stroke-border)) transparent',
      '&::-webkit-scrollbar': { width: '10px', height: '10px' },
      '&::-webkit-scrollbar-track': { background: 'transparent' },
      '&::-webkit-scrollbar-thumb': {
        background: 'hsl(var(--stroke-border))',
        'border-radius': '99px',
        border: '3px solid transparent',
        'background-clip': 'padding-box',
      },
      '&:hover::-webkit-scrollbar-thumb': {
        background: 'hsl(var(--ink-inactive))',
        'background-clip': 'padding-box',
      },
    },
    '.scrollbar-none': {
      'scrollbar-width': 'none',
      '&::-webkit-scrollbar': { display: 'none' },
    },
  });
});

export const preset: Partial<Config> = {
  darkMode: ['class'],
  theme: {
    extend: {
      screens: Object.fromEntries(breakpointPx),
      colors: THEME_COLORS,
      aria: {
        invalid: 'invalid="true"',
      },
      spacing: {
        // The boolean-control box (Checkbox, RadioButton). Named because the
        // two disagreed - 18px vs 20px - and one was an arbitrary value.
        control: '1.125rem',
      },
      opacity: {
        disabled: 'var(--opacity-disabled)',
        // Tint steps. Stock Tailwind has no 6/8/12, and those three were the
        // only reason tints were written as arbitrary values (/[0.06]).
        // With these, every tint uses one notation and sits on one scale.
        6: '0.06',
        8: '0.08',
        12: '0.12',
      },
      maxWidth: {
        'modal-sm': 'var(--modal-w-sm)',
        'modal-md': 'var(--modal-w-md)',
        'modal-lg': 'var(--modal-w-lg)',
        'modal-xl': 'var(--modal-w-xl)',
      },
      maxHeight: {
        /* The cap a dialog may not pass — see `--modal-max-h`. */
        modal: 'var(--modal-max-h)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        rest: 'var(--shadow-rest)',
        modal: 'var(--shadow-modal)',
        'card-hover': 'var(--shadow-card-hover)',
        dropdown: 'var(--shadow-dropdown)',
        'segctrl-hover': 'var(--segctrl-hover-shadow)',
        'segctrl-active': 'var(--segctrl-active-shadow)',
        'lift-hover': 'var(--shadow-lift-hover)',
        'overlay-soft': 'var(--shadow-overlay-soft)',
        menu: 'var(--shadow-menu)',
        'banner-ic': 'var(--banner-ic-shadow)',
        'banner-grad-ic': 'var(--banner-grad-ic-shadow)',
        'plan-card-featured': 'var(--plan-card-featured-shadow)',
        thumb: 'var(--shadow-thumb)',
        'thumb-hover': 'var(--shadow-thumb-hover)',
      },
      fontSize: {
        xxs: 'var(--font-size-xxs)',
        xs: ['var(--font-size-xs)', { lineHeight: 'var(--line-height-xs)' }],
        compact: [
          'var(--font-size-compact)',
          { lineHeight: 'var(--line-height-compact)' },
        ],
        sm: ['var(--font-size-sm)', { lineHeight: 'var(--line-height-sm)' }],
        base: [
          'var(--font-size-base)',
          { lineHeight: 'var(--line-height-base)' },
        ],
        lg: ['var(--font-size-lg)', { lineHeight: 'var(--line-height-lg)' }],
        xl: ['var(--font-size-xl)', { lineHeight: 'var(--line-height-xl)' }],
        '2xl': [
          'var(--font-size-2xl)',
          { lineHeight: 'var(--line-height-2xl)' },
        ],
        '3xl': [
          'var(--font-size-3xl)',
          { lineHeight: 'var(--line-height-3xl)' },
        ],
        '4xl': [
          'var(--font-size-4xl)',
          { lineHeight: 'var(--line-height-4xl)' },
        ],
        display: [
          'var(--font-size-display)',
          { lineHeight: 'var(--line-height-display)' },
        ],
      },
      fontWeight: {
        light: 'var(--font-weight-light)',
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
        extrabold: 'var(--font-weight-extrabold)',
        black: 'var(--font-weight-black)',
      },
      letterSpacing: {
        tight: 'var(--tracking-tight)',
        normal: 'var(--tracking-normal)',
        caps: 'var(--tracking-caps)',
        display: 'var(--tracking-display)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
      },
      transitionDuration: {
        fast: 'var(--motion-fast)',
        base: 'var(--motion-base)',
        slow: 'var(--motion-slow)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
        'skeleton-shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        /* A settled row leaving a list.

           Two movements, not one, and the order is what makes it read as
           smooth: the row FADES first and only then collapses. Fading and
           shrinking together is the version that looks abrupt — the row is
           still legible while the list is already moving under it, so the
           eye is asked to track text that is going away and rows that are
           arriving at the same time.

           So opacity is spent over the first 40%, and the height and its
           padding over the remaining 60%, by which point there is nothing
           left to watch. Height and padding both go, or the row leaves a
           gap the width of its own inset. */
        'row-out': {
          '0%': { opacity: '1', height: 'var(--row-height)' },
          '40%': { opacity: '0', height: 'var(--row-height)' },
          '100%': {
            opacity: '0',
            height: '0',
            'padding-top': '0',
            'padding-bottom': '0',
          },
        },
        /* A panel leaving once it has nothing left to say. */
        'panel-out': {
          from: { opacity: '1', transform: 'translateY(0)' },
          to: { opacity: '0', transform: 'translateY(4px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
        'skeleton-shimmer': 'skeleton-shimmer 1.5s infinite ease-in-out',
        /* `--motion-slow`, not `base`: this is a row leaving a list under
           the reader, not a control answering a press. The curve is
           `ease-in-out` for the same reason — `ease-out` starts at full
           speed, which is what made the collapse snap. */
        'row-out': 'row-out var(--motion-slow) ease-in-out forwards',
        'panel-out': 'panel-out var(--motion-slow) ease-in-out forwards',
      },
      backgroundImage: {
        'skeleton-shimmer':
          'linear-gradient(90deg, transparent 0%, transparent 30%, hsl(var(--brand-primary) / 0.1) 50%, transparent 70%, transparent 100%)',
        'primary-gradient':
          'linear-gradient(90deg, hsl(var(--brand-primary)) 50%, hsl(var(--brand-secondary)) 120.71%)',
        'chat-shell': 'var(--chat-shell-bg)',
        'chat-glow':
          'radial-gradient(ellipse 55vw 45vh at 50% 50%, var(--chat-glow-fill), transparent 65%)',
        'banner-grad-horizontal-wide': 'var(--banner-grad-horizontal-wide)',
        'banner-grad-diagonal-airy': 'var(--banner-grad-diagonal-airy)',
        'banner-grad-diagonal-fade': 'var(--banner-grad-diagonal-fade)',
        'banner-grad-horizontal-slab': 'var(--banner-grad-horizontal-slab)',
        'plan-card-featured': 'var(--plan-card-featured-bg)',
      },
    },
  },
  plugins: [
    pressedVariantPlugin,
    breakpointVarsPlugin,
    scrollbarPlugin,
    animate,
  ],
};

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// fast-glob needs POSIX separators, so normalise on Windows.
const posix = (path: string) => path.replace(/\\/g, '/');

export const contentGlobs: string[] = [
  posix(join(packageDir, 'src/**/*.{ts,tsx}')),
  posix(join(packageDir, 'dist/**/*.js')),
];
