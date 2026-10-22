import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link, Lock, Plug2, Sun } from 'lucide-react';
import { expect, fn } from 'storybook/test';
import { CtaBanner } from './index';

/**
 * `CtaBanner` is a `Banner` with one call-to-action button: `ctaLabel` names
 * the button and `onClick` handles it. The button is always `size="sm"`; on the
 * `horizontalWide` and `diagonalAiry` gradients `Banner` repaints it with the
 * `banner-grad-*` tokens so it stays readable on the gradient.
 */
const meta = {
  title: 'Compositions/CtaBanner',
  component: CtaBanner,
  tags: ['autodocs'],
  args: {
    title: 'Connect your first data source',
    description: 'Link a warehouse or file to start building metrics.',
    ctaLabel: 'Connect source',
    icon: <Plug2 />,
    onClick: fn(),
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
    actionVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'transparent'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
    icon: { control: false },
    description: { control: false },
    onClick: { control: false },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof CtaBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Resolves an HSL-triplet token to the `rgb()` string the browser computes. */
const resolveToken = (host: HTMLElement, token: string) => {
  const probe = document.createElement('span');
  probe.style.color = `hsl(var(${token}))`;
  host.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
};

/** The component defaults: the `horizontalWide` gradient and a primary button. */
export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Connect source' });

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** Both gradients that repaint the button, as the upgrade and empty states use them. */
export const Gradient: Story = {
  render: (args) => (
    <div className="flex w-full flex-col gap-4">
      <CtaBanner {...args} variant="horizontalWide" icon={<Sun />} />
      <CtaBanner
        {...args}
        variant="diagonalAiry"
        title="Upgrade to connect more sources"
        description={
          <>
            Your plan includes <b>1</b> connection. Upgrade to add more.
          </>
        }
        ctaLabel="Upgrade"
        icon={<Lock />}
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const background = resolveToken(canvasElement, '--banner-grad-text');
    const text = resolveToken(canvasElement, '--banner-grad-btn-text');

    for (const name of ['Connect source', 'Upgrade']) {
      const button = canvas.getByRole('button', { name });
      const style = getComputedStyle(button);

      await expect(style.backgroundColor).toBe(background);
      await expect(style.color).toBe(text);
    }
  },
};

/** `size="sm"`: the compact banner used above a filled list. */
export const Small: Story = {
  args: {
    size: 'sm',
    title: 'Add a new metric',
    description: 'Connect another source to build more metrics.',
    ctaLabel: 'Browse catalog',
    icon: <Link />,
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Browse catalog' })
    );
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
