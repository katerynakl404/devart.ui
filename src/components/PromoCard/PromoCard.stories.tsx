import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gift, Sparkles } from 'lucide-react';
import { expect, fn } from 'storybook/test';
import { PromoCard } from './index';

const meta = {
  title: 'Compositions/PromoCard',
  component: PromoCard,
  tags: ['autodocs'],
  args: {
    icon: <Sparkles />,
    title: 'Upgrade to Pro',
    description: 'Unlimited sources and 15,000 credits a month',
    href: '#plan',
    onSelect: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-60">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A small offer: a glyph, what is on offer, one line of what it gives, and a ' +
          'dismiss. Its first home is a sidebar, directly above the footer, but the offer is ' +
          'not the point of the shape — an upgrade, an invitation or an ending trial all fit ' +
          'it, which is why it is named for the job and not for a plan. With `href` the card ' +
          'is a link, without it a button.',
      },
    },
  },
} satisfies Meta<typeof PromoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('link', { name: /Upgrade to Pro/ })
    ).toHaveAttribute('href', '#plan');
    await expect(canvas.queryByRole('button', { name: 'Dismiss' })).toBeNull();
  },
};

export const Dismissible: Story = {
  args: { onDismiss: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const link = canvas.getByRole('link', { name: /Upgrade to Pro/ });
    const dismiss = canvas.getByRole('button', { name: 'Dismiss' });
    await expect(link).not.toContainElement(dismiss);

    await userEvent.click(dismiss);
    await expect(args.onDismiss).toHaveBeenCalledOnce();
    await expect(args.onSelect).not.toHaveBeenCalled();

    dismiss.blur();
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await userEvent.tab();
    await expect(dismiss).toHaveFocus();
  },
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
    onDismiss: fn(),
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
  args: { href: '', onDismiss: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.queryByRole('link')).toBeNull();
    const surface = canvas.getByRole('button', { name: /Upgrade to Pro/ });
    await expect(surface).toHaveAttribute('type', 'button');

    await userEvent.click(surface);
    await expect(args.onSelect).toHaveBeenCalledOnce();
    await expect(args.onDismiss).not.toHaveBeenCalled();
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
