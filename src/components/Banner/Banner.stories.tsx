import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link, Plug2, Sun } from 'lucide-react';
import { fn } from 'storybook/test';
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
    onDismiss: { control: false },
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

/**
 * The corner ✕ dismiss trigger from the reference anatomy (`.banner-close`):
 * absolute top-right, neutral hover, and the root reserves right padding so the
 * button clears the CTA. Shown on both surfaces because the hover fill differs.
 */
export const Dismissible: Story = {
  render: (args) => (
    <div className="flex w-full flex-col gap-4">
      <Banner
        {...args}
        action={
          <Button size="sm" variant="secondary">
            Connect source
          </Button>
        }
        icon={<Plug2 />}
        onDismiss={fn()}
        variant="default"
      />
      <Banner
        {...args}
        action={
          <Button size="sm" variant="secondary">
            Explore metrics
          </Button>
        }
        icon={<Sun />}
        onDismiss={fn()}
        variant="diagonalAiry"
      />
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
 * Dark theme — every state the component ships, on one dark surface. Tokens
 * are pure CSS cascade, so a scoped `.dark` re-themes the whole subtree with
 * no provider and no props.
 */
export const DarkTheme = {
  render: (args, ctx) => {
    const cells: [string, Story][] = [
      ['Primary', Primary],
      ['Variants', Variants],
      ['Sizes', Sizes],
      ['Dismissible', Dismissible],
      ['Optional Slots', OptionalSlots],
      ['Rich Description', RichDescription],
    ];
    return (
      <div className="dark grid gap-6 rounded-lg bg-surface-page p-6">
        {cells.map(([name, story]) => (
          <section className="flex flex-col gap-2" key={name}>
            <span className="font-medium text-ink-secondary text-xxs uppercase leading-4 tracking-caps">
              {name}
            </span>
            {story.render ? (
              story.render({ ...args, ...story.args } as never, ctx)
            ) : (
              null
            )}
          </section>
        ))}
      </div>
    );
  },
} as Story;
