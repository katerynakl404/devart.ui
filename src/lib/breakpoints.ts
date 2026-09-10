/**
 * Tailwind default breakpoints (px). Single source for
 * `theme.extend.screens`, `--breakpoint-*`, and `use-mobile`.
 * `2xl` omitted — unused; Tailwind stock value stays via extend merge.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
