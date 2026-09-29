/// <reference path="../css-modules.d.ts" />
import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview, ReactRenderer } from '@storybook/react-vite';

import './tailwind.css';
import '../globals.css';
// After globals.css, which is the whole mechanism: a pack is `:root[data-palette]`
// (0,2,0) and beats the plain `:root` it overrides. Load it first and nothing
// would change.
import '../palettes.css';
import '../fonts.css';
import './preview.css';

/**
 * The colour packs, as a toolbar switch.
 *
 * A pack redeclares Layer 1 and nothing else, so there is nothing to wrap a
 * story in — the attribute goes on the preview's own `<html>` and every token
 * above the ramps re-resolves. That is also what this control is for: it is the
 * only way to see that a component really does read roles rather than shades,
 * since a component that pinned itself to a ramp step stays teal while the page
 * around it moves.
 */
const PACKS = [
  { value: '', title: 'Teal (default)' },
  { value: 'blue', title: 'Blue' },
] as const;

const preview: Preview = {
  globalTypes: {
    palette: {
      description: 'Colour pack',
      defaultValue: '',
      toolbar: {
        title: 'Palette',
        icon: 'paintbrush',
        items: [...PACKS],
        dynamicTitle: true,
      },
    },
  },
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
    (Story, context) => {
      const pack = context.globals.palette as string;
      if (pack) document.documentElement.dataset.palette = pack;
      else document.documentElement.removeAttribute('data-palette');
      return <Story />;
    },
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
