import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DataSourceCard } from './index';

/**
 * The connector catalog tile: a mark, a name, and a Connect action revealed on
 * hover rather than sitting on the tile at rest. Connected sources leave the
 * catalog, so the component has no connected state.
 */
const meta = {
  title: 'Components/DataSourceCard',
  component: DataSourceCard,
  tags: ['autodocs'],
  args: {
    connector: 'PostgreSQL',
    isPopular: false,
    connectLabel: 'Connect',
    onConnect: fn(),
  },
  argTypes: {
    variant: { control: 'select', options: ['tile'] },
    name: { control: 'text' },
    connector: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="w-52">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DataSourceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * The reveal is the component's reason to exist. At rest the tile is a mark and
 * a name; on hover a scrim — the card's own surface at 80% — fades in to give
 * the action a ground to sit on, and the button rises 6px into place.
 *
 * Hover the tile, or tab to it: focus reveals it the same way.
 */
export const HoverReveal: Story = {
  args: { connector: 'Snowflake' },
};

/** The flame marks a connector worth trying first. */
export const Popular: Story = {
  args: { connector: 'MySQL', isPopular: true },
};

/** An unknown connector falls back to a monogram — never a broken image. */
export const UnknownConnector: Story = {
  args: { connector: 'Fabrikam', name: 'Fabrikam DB' },
};

/** A name longer than the tile wraps to two lines and then clamps. */
export const LongName: Story = {
  args: {
    connector: 'Salesforce',
    name: 'Salesforce Marketing Cloud Intelligence',
  },
};

export const Disabled: Story = {
  args: { connector: 'Oracle', disabled: true },
};

/**
 * The catalog as a page renders it — a grid of tiles, only one of which can be
 * hovered at a time. This is the story to read when judging tile density and
 * how loudly the popular flame reads in a crowd.
 */
export const CatalogGrid: Story = {
  decorators: [
    (Story) => (
      <div className="w-[640px]">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {(
        [
          ['PostgreSQL', true],
          ['MySQL', true],
          ['Snowflake', false],
          ['BigQuery', false],
          ['Oracle', false],
          ['Redshift', false],
          ['MongoDB', false],
          ['Databricks', false],
        ] as const
      ).map(([connector, isPopular]) => (
        <DataSourceCard
          {...args}
          connector={connector}
          isPopular={isPopular}
          key={connector}
        />
      ))}
    </div>
  ),
};
