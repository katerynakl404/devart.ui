import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus } from 'lucide-react';
import { expect, fn } from 'storybook/test';
import { ConnectorLogo } from '../ConnectorLogo';
import { IconCard, IconCardSkeleton } from './index';

/** The three props a connector tile derives from its connector. */
const connectorArgs = (connector: string, name = connector) => ({
  label: name,
  'aria-label': `Connect ${name}`,
  icon: <ConnectorLogo connector={connector} size="md" />,
});

/**
 * `IconCard` is a square icon + caption card with an action revealed on hover —
 * the connector catalog tile: a mark, a name, and a Connect action that is not
 * on the tile at rest. The card itself carries `role="button"`; the overlay is
 * decorative, so it holds a styled `span` rather than a nested button, which
 * would be unreachable for assistive technology.
 *
 * The overlay is a `lg:` affordance: below that breakpoint the card is still
 * fully operable, it simply never reveals one.
 */
const meta = {
  title: 'Compositions/IconCard',
  component: IconCard,
  tags: ['autodocs'],
  args: {
    ...connectorArgs('PostgreSQL'),
    actionLabel: 'Connect',
    actionIcon: <Plus />,
    disabled: false,
    onActivate: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    actionLabel: { control: 'text' },
    disabled: { control: 'boolean' },
    icon: { control: false },
    badge: { control: false },
    actionIcon: { control: false },
    onActivate: { control: false },
    onClick: { control: false },
    onKeyDown: { control: false },
    ref: { control: false, table: { disable: true } },
  },
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div className="w-32">
      <IconCard {...args} />
    </div>
  ),
} satisfies Meta<typeof IconCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * The reveal is the tile's reason to exist. At rest it is a mark and a name; on
 * hover a scrim — the card's own surface, mostly opaque — fades in to give the
 * action a ground to sit on, and the action rises 6px into place.
 *
 * Hover the tile, or tab to it: focus reveals it the same way.
 */
export const HoverReveal: Story = {
  args: connectorArgs('Snowflake'),
};

/** An unknown connector falls back to a monogram — never a broken image. */
export const UnknownConnector: Story = {
  args: connectorArgs('Fabrikam', 'Fabrikam DB'),
};

/** Captions clamp to two lines rather than widening the card. */
export const LongName: Story = {
  args: connectorArgs('Salesforce', 'Salesforce Marketing Cloud Intelligence'),
};

/**
 * Disabled cards stay in the tab order — a keyboard user has to be able to
 * reach one to read whatever tooltip explains why it is unavailable — but they
 * neither activate, lift on hover, nor reveal the overlay.
 */
export const Disabled: Story = {
  args: { ...connectorArgs('Oracle'), disabled: true },
};

/** Placeholder for one card; the grid decides how many to render. */
export const Loading: Story = {
  render: () => (
    <div className="w-32">
      <IconCardSkeleton />
    </div>
  ),
};

/** The kit's catalog grid: a 7rem floor, eight a row at most. */
const CATALOG_COLUMNS =
  'repeat(auto-fill, minmax(max(7rem, (100% - 7 * .75rem) / 8), 1fr))';

/**
 * The catalog as a page renders it — a grid of tiles, only one of which can be
 * hovered at a time, with a placeholder where the next page is loading. This is
 * the story to read when judging tile density.
 *
 * The column floor is the grid's, not the tile's — the kit's catalog grid:
 * `repeat(auto-fill, minmax(max(7rem, (100% - 7 * .75rem) / 8), 1fr))`, never
 * under 7rem and at most eight a row. A fixed `grid-cols-N` lets a column fall
 * under the name, and the name then breaks mid-word.
 */
export const CatalogGrid: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div
      className="grid w-[640px] gap-3"
      style={{ gridTemplateColumns: CATALOG_COLUMNS }}
    >
      {(
        [
          'PostgreSQL',
          'MySQL',
          'Snowflake',
          'BigQuery',
          'Oracle',
          'Redshift',
          'MongoDB',
        ] as const
      ).map((connector) => (
        <IconCard {...args} {...connectorArgs(connector)} key={connector} />
      ))}
      <IconCardSkeleton />
    </div>
  ),
};

/**
 * The card borrows `role="button"`, so it has to answer the keyboard itself.
 * Enter and Space both activate, and Space must not scroll the page.
 */
export const Keyboard: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const card = canvas.getByRole('button', { name: 'Connect PostgreSQL' });

    await userEvent.click(card);
    await expect(args.onActivate).toHaveBeenCalledOnce();

    card.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onActivate).toHaveBeenCalledTimes(2);

    await userEvent.keyboard(' ');
    await expect(args.onActivate).toHaveBeenCalledTimes(3);
  },
};

/** A disabled card is reachable and inert on every activation path. */
export const DisabledIsInert: Story = {
  args: { disabled: true },
  play: async ({ args, canvas, userEvent }) => {
    const card = canvas.getByRole('button', { name: 'Connect PostgreSQL' });

    await expect(card).toHaveAttribute('aria-disabled', 'true');
    await expect(card).toHaveAttribute('tabindex', '0');

    await userEvent.click(card);
    card.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');

    await expect(args.onActivate).not.toHaveBeenCalled();
    await expect(canvas.queryByText('Connect')).not.toBeInTheDocument();
  },
};
