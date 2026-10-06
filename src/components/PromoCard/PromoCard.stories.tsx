import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gift, Sparkles } from 'lucide-react';
import { PromoCard } from './index';

const meta = {
  title: 'Components/PromoCard',
  component: PromoCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A small offer: a glyph, what is on offer, one line of what it gives, and a ' +
          'dismiss. Its first home is a sidebar, directly above the footer, but the offer is ' +
          'not the point of the shape — an upgrade, an invitation or an ending trial all fit ' +
          'it, which is why it is named for the job and not for a plan.',
      },
    },
  },
  args: {
    icon: <Sparkles />,
    title: 'Upgrade to Pro',
    description: 'Unlimited sources and 15,000 credits a month',
    href: '#plan',
  },
  decorators: [
    (Story) => (
      <div className="w-60">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PromoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dismissible: Story = {
  args: { onDismiss: () => undefined },
  parameters: {
    docs: {
      description: {
        story:
          'The dismiss is a **sibling** of the link, never nested inside it: a button inside ' +
          'an anchor is not markup, and the whole card is the link’s hit area.',
      },
    },
  },
};

export const NotAPlan: Story = {
  args: {
    icon: <Gift />,
    title: 'Invite friends',
    description: 'Earn up to 10,100 credits',
    onDismiss: () => undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The same component carrying an offer that has nothing to do with a plan — which is ' +
          'the reason it is not called a plan card.',
      },
    },
  },
};

export const AsButton: Story = {
  args: {
    href: undefined,
    onSelect: () => undefined,
    onDismiss: () => undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Without `href` the surface renders as a button, for an offer that opens a dialog ' +
          'rather than navigating.',
      },
    },
  },
};
