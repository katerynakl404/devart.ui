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
 * hovered at a time. This is the story to read when judging tile density.
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
          'PostgreSQL',
          'MySQL',
          'Snowflake',
          'BigQuery',
          'Oracle',
          'Redshift',
          'MongoDB',
          'Databricks',
        ] as const
      ).map((connector) => (
        <DataSourceCard {...args} connector={connector} key={connector} />
      ))}
    </div>
  ),
};
