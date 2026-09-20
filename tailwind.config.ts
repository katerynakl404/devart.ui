import type { Config } from 'tailwindcss';
import { preset } from './src/tailwind-preset';

export default {
  presets: [preset],
  // `changes/` is the Storybook-only review section (see changes/README.md).
  // It is not part of the package: `tsconfig.build.json` builds from `src`, and
  // `files` in package.json ships `dist`, so nothing here reaches a consumer.
  content: ['./src/**/*.{ts,tsx}', './changes/**/*.tsx'],
} satisfies Config;
