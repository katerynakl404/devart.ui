/**
 * Tailwind config used ONLY by design-sync to compile the utility surface
 * shipped to claude.ai/design.
 *
 * The kit itself ships no stylesheet: components are Tailwind utility classes
 * that the consuming app compiles. A design agent building new screens also
 * writes its own layout glue, so shipping only the classes the components
 * happen to use would leave that glue silently unstyled.
 *
 * It keeps the repo's own preset, so every colour still resolves to the same
 * CSS variables and a colour pack keeps working. Colour utilities come from a
 * generated literal class list (see gen-classlist.mjs): safelist patterns are
 * matched O(pattern x candidate) and a few thousand of them OOMs the compiler,
 * while a content file is scanned linearly.
 */
import type { Config } from 'tailwindcss';
import { preset } from '../src/tailwind-preset';

export default {
  presets: [preset],
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
    './.design-sync/.cache/ds-classlist.txt',
  ],
} satisfies Config;
