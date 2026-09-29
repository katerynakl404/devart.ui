/// <reference path="../css-modules.d.ts" />
import {
  DocsContainer,
  type DocsContainerProps,
} from '@storybook/addon-docs/blocks';
import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview, ReactRenderer } from '@storybook/react-vite';
import { type PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { create } from 'storybook/theming';

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

/**
 * What is painting right now — the theme class and the colour pack, as one key.
 *
 * Read off `<html>` rather than off the globals, because those attributes are
 * what actually paint: `withThemeByClassName` sets the class and the decorator
 * above sets `data-palette`, and every token in the system resolves from there.
 * Watching the elements themselves keeps the docs chrome and the components it
 * frames on one source, so they can never disagree about what is showing.
 */
function readThemeKey(): string {
  const root = document.documentElement;
  return `${root.classList.contains('dark')}|${root.dataset.palette ?? ''}`;
}

function useThemeKey(): string {
  // Seeded from the DOM rather than from a default, or a docs page opened
  // straight into dark mode would paint light for a frame first.
  const [key, setKey] = useState(readThemeKey);
  useEffect(() => {
    const read = () => setKey(readThemeKey());
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributeFilter: ['class', 'data-palette'],
    });
    return () => observer.disconnect();
  }, []);
  return key;
}

/** A token as a colour Storybook's theming can take — it wants real colours. */
const token = (name: string) =>
  `hsl(${getComputedStyle(document.documentElement).getPropertyValue(name).trim()})`;

/**
 * Storybook's docs chrome, painted from this system's own tokens.
 *
 * Without it the class on `<html>` re-themed the stories and left the page
 * around them white — a docs page whose swatch labels are white ink on a white
 * card. The chrome is Storybook's, not ours, so it cannot be reached by the
 * cascade: `.sbdocs-wrapper` and `.sbdocs-preview` carry their background from
 * the docs theme object, which is a prop and not CSS. Hence a theme built per
 * flip rather than a stylesheet override — and built from the tokens, so the
 * card a component sits on in docs is the same `--surface-card` it would sit on
 * in the app, instead of Storybook's own grey.
 */
function ThemedDocsContainer({
  children,
  ...props
}: PropsWithChildren<DocsContainerProps>) {
  const themeKey = useThemeKey();
  const theme = useMemo(
    () =>
      create({
        base: themeKey.startsWith('true') ? 'dark' : 'light',
        appBg: token('--surface-page'),
        appContentBg: token('--surface-card'),
        appPreviewBg: token('--surface-card'),
        appBorderColor: token('--stroke-border'),
        barBg: token('--surface-card'),
        barTextColor: token('--ink-secondary'),
        textColor: token('--ink-primary'),
        textMutedColor: token('--ink-secondary'),
        colorSecondary: token('--brand-primary'),
        fontBase: 'var(--font-sans)',
      }),
    [themeKey]
  );
  return (
    <DocsContainer {...props} theme={theme}>
      {children}
    </DocsContainer>
  );
}

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
    docs: { container: ThemedDocsContainer },
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
