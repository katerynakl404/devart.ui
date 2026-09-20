import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../Card';
import { Typography } from '../Typography';
import { CONNECTOR_LOGOS, ConnectorLogo } from './index';

const meta = {
  title: 'Components/ConnectorLogo',
  component: ConnectorLogo,
  tags: ['autodocs'],
  args: {
    connector: 'PostgreSQL',
    size: 'md',
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    connector: { control: 'text' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof ConnectorLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

const PACK = Object.keys(CONNECTOR_LOGOS);

/**
 * Every mark the package carries today. The pack is deliberately small — it is
 * generated from the app's connector folder by
 * `scripts/gen-connector-logos.mjs`, so widening it is a re-run, not an edit.
 */
export const Pack: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {PACK.map((connector) => (
        <ConnectorLogo {...args} connector={connector} key={connector} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <ConnectorLogo {...args} key={size} size={size} />
      ))}
    </div>
  ),
};

/**
 * A connector outside the pack renders a monogram tile rather than an empty
 * box or a broken image — the row still reads as a row. The same name spelled
 * three ways resolves to the one mark, so a generated page does not have to
 * know the slug.
 */
export const FallbackAndMatching: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      {['PostgreSQL', 'postgresql', 'Postgres', 'Amazon S3', 'Fabrikam'].map(
        (connector) => (
          <span className="flex items-center gap-2" key={connector}>
            <ConnectorLogo {...args} connector={connector} />
            <Typography textColor="secondary" textStyle="body12">
              {connector}
            </Typography>
          </span>
        )
      )}
    </div>
  ),
};

/**
 * The catalog shape the marks exist for: a tile, the connector's name, one line
 * of description. The logo is decorative here — the name is already beside it —
 * so it carries no label and screen readers do not read the name twice.
 */
export const CatalogCards: Story = {
  render: (args) => (
    <div className="grid w-[40rem] grid-cols-3 gap-4">
      {CATALOG.map((item) => (
        <Card
          className="flex flex-col items-center gap-2 p-4 text-center"
          key={item.connector}
        >
          <ConnectorLogo {...args} connector={item.connector} />
          <Typography element="p" textStyle="title14">
            {item.connector}
          </Typography>
          <Typography element="p" textColor="secondary" textStyle="body12">
            {item.description}
          </Typography>
        </Card>
      ))}
    </div>
  ),
};

const CATALOG = [
  { connector: 'PostgreSQL', description: 'Primary analytics warehouse' },
  { connector: 'Salesforce', description: 'CRM contacts and deals' },
  { connector: 'Slack', description: 'Notification and alert channel' },
  { connector: 'Amazon S3', description: 'Raw event archive' },
  { connector: 'HubSpot', description: 'Marketing campaigns' },
  { connector: 'Fabrikam', description: 'No mark in the pack yet' },
];

/**
 * Dark theme — every state the component ships, on one dark surface. Tokens
 * are pure CSS cascade, so a scoped `.dark` re-themes the whole subtree with
 * no provider and no props.
 */
export const DarkTheme = {
  render: (args, ctx) => {
    const cells: [string, Story][] = [
      ['Pack', Pack],
      ['Sizes', Sizes],
      ['Fallback And Matching', FallbackAndMatching],
      ['Catalog Cards', CatalogCards],
    ];
    return (
      <div className="dark grid gap-6 rounded-lg bg-surface-page p-6">
        {cells.map(([name, story]) => (
          <section className="flex flex-col gap-2" key={name}>
            <span className="font-medium text-ink-secondary text-xxs uppercase leading-4 tracking-caps">
              {name}
            </span>
            {story.render
              ? story.render({ ...args, ...story.args } as never, ctx)
              : null}
          </section>
        ))}
      </div>
    );
  },
} as Story;
