import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { StatTile } from './index';

const meta = {
  title: 'Components/StatTile',
  component: StatTile,
  tags: ['autodocs'],
  args: {
    label: 'Connections',
    value: 3,
    description: 'linked to this workspace',
    size: 'md',
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
} satisfies Meta<typeof StatTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A row reads as one object: same size, same order, one number each. */
export const Row: Story = {
  render: () => (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
      <StatTile
        label="Users"
        value={1}
        description="have access to this workspace"
      />
      <StatTile
        label="Connections"
        value={3}
        description="linked to this workspace"
      />
      <StatTile
        label="Queries"
        value="1,608"
        description="in the last 30 days"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <StatTile
        size="sm"
        label="Queries"
        value="1,608"
        description="in the last 30 days"
      />
      <StatTile
        size="md"
        label="Queries"
        value="1,608"
        description="in the last 30 days"
      />
    </div>
  ),
};

/** `rightSlot` qualifies the number without competing with it. */
export const WithBadge: Story = {
  args: {
    rightSlot: (
      <Badge variant="attention" size="xs" rounded="full">
        1 not configured
      </Badge>
    ),
  },
};
