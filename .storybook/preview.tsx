/// <reference path="../css-modules.d.ts" />
import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview, ReactRenderer } from '@storybook/react-vite';

import './tailwind.css';
import '../globals.css';
import '../fonts.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    // The review section sits above the catalog: what changed is what a
    // reviewer opens Storybook for, and the components are always one click
    // away underneath.
    options: {
      storySort: {
        // Alphabetical inside a section, so the numbered review pages sort by
        // their number instead of by the order Vite happened to load them.
        method: 'alphabetical',
        order: ['Proposed changes', 'Foundations', 'Components'],
      },
    },
  },
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
