import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    reporters: ['default', 'junit'],
    outputFile: { junit: './junit.xml' },
    // `passWithNoTests` keeps the script green until the first test lands;
    // Storybook is still the package's primary verification surface.
    passWithNoTests: true,
  },
});
