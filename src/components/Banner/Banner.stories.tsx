import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link, Plug2, Sun } from 'lucide-react';
import { Button } from '../Button';
import { Banner } from './index';

const meta = {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs'],
  args: {
    title: 'Connect your first data source',
    description: 'Link a warehouse or file to start building metrics.',
    variant: 'horizontalWide',
    size: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'horizontalWide',
        'diagonalAiry',
        'diagonalFade',
        'horizontalSlab',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
    icon: { control: false },
    action: { control: false },
    description: { control: false },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    icon: <Plug2 />,
    action: (
      <Button variant="primary" size="sm">
        Connect source
      </Button>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex w-full flex-col gap-4">
      <Banner
        {...args}
        variant="default"
        icon={<Plug2 />}
        action={
          <Button variant="secondary" size="sm">
            Connect source
          </Button>
        }
      />
      <Banner
        {...args}
        variant="horizontalWide"
        icon={<Plug2 />}
        action={
          <Button variant="primary" size="sm">
            Connect source
          </Button>
        }
      />
      <Banner
        {...args}
        variant="diagonalAiry"
        icon={<Sun />}
        action={
          <Button variant="secondary" size="sm">
            Explore metrics
          </Button>
        }
      />
      <Banner
        {...args}
        variant="diagonalFade"
        icon={<Link />}
        action={
          <Button variant="secondary" size="sm">
            Share workspace
          </Button>
        }
      />
      <Banner
        {...args}
        variant="horizontalSlab"
        icon={<Plug2 />}
        action={
          <Button variant="secondary" size="sm">
            Connect source
          </Button>
        }
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-full flex-col gap-4">
      {(['default', 'sm'] as const).map((size) => (
        <Banner
          {...args}
          key={size}
          size={size}
          icon={<Plug2 />}
          action={
            <Button variant="primary" size="sm">
              Connect source
            </Button>
          }
        />
      ))}
    </div>
  ),
};

export const OptionalSlots: Story = {
  render: (args) => (
    <div className="flex w-full flex-col gap-4">
      <Banner
        {...args}
        description={undefined}
        icon={undefined}
        action={undefined}
      />
      <Banner
        {...args}
        icon={undefined}
        action={
          <Button variant="primary" size="sm">
            Connect source
          </Button>
        }
      />
      <Banner {...args} icon={<Plug2 />} action={undefined} />
      <Banner
        {...args}
        icon={<Plug2 />}
        action={undefined}
        description={undefined}
      />
    </div>
  ),
};

export const RichDescription: Story = {
  args: {
    title: 'Storage limit approaching',
    description: (
      <>
        You have used <b>8.7 GB</b> of your <b>10 GB</b> plan. Upgrade to keep
        uploading files.
      </>
    ),
    variant: 'diagonalAiry',
    icon: <Sun />,
    action: (
      <Button variant="secondary" size="sm">
        Upgrade plan
      </Button>
    ),
  },
};

/**
 * Dark theme. Every token is plain CSS cascade, so a scoped `.dark` re-themes
 * the subtree — no provider, no props, no JS.
 */
export const DarkTheme: Story = {
  ...Primary,
  decorators: [
    (Story) => (
      <div className="dark rounded-lg bg-surface-page p-6">
        <Story />
      </div>
    ),
  ],
};
