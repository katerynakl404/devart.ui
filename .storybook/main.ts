import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.tsx',
    // The review section: every change in DESIGN-SYSTEM-CHANGES.md as a
    // Before | After the eye can check. Storybook-only, outside `src`.
    '../changes/**/*.stories.tsx',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-themes',
  ],
  framework: '@storybook/react-vite',
};

export default config;
