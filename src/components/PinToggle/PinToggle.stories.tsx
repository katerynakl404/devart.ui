import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn } from 'storybook/test';
import { Card } from '../Card';
import { TooltipProvider } from '../Tooltip';
import { Typography } from '../Typography';
import { PinToggle } from './index';

/**
 * `PinToggle` pins a thing to the top of its list.
 *
 * Off: the pin's outline on a `tertiary` IconButton. On: the glyph fills,
 * takes the brand ink and tilts 30°. `aria-pressed` carries the state; the
 * accessible name stays "Pin" in both, and the tooltip says what a click will
 * do — "Pin", or "Unpin".
 */
const meta = {
  title: 'Compositions/PinToggle',
  component: PinToggle,
  tags: ['autodocs'],
  args: { onPressedChange: fn(), disabled: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['3xs', '2xs', 'xs', 'sm'] },
    onPressedChange: { control: false },
    ref: { control: false, table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PinToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Unpinned: the outline, in the neutral ink. Hover for the "Pin" tooltip. */
export const Unpinned: Story = {};

/** Pinned: filled, brand ink, tilted. Hover for the "Unpin" tooltip. */
export const Pinned: Story = {
  args: { defaultPressed: true },
};

/** A click flips it, and reports the new state. */
export const Toggling: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const pin = canvas.getByRole('button', { name: 'Pin' });
    await expect(pin).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(pin);
    await expect(pin).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(true);

    await userEvent.click(pin);
    await expect(pin).toHaveAttribute('aria-pressed', 'false');
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(false);
  },
};

/** Disabled, in both states. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="flex items-center gap-2">
      <PinToggle {...args} />
      <PinToggle {...args} defaultPressed />
    </div>
  ),
};

/**
 * In a list row, beside the title it pins. The row usually shows it only while
 * pinned and offers Pin from its menu. Its click stays its own, so pinning
 * never opens the row; the negative block margin keeps the 24px box inside the
 * 20px text line.
 */
export const InARow: Story = {
  render: function Render(args) {
    const [pinned, setPinned] = useState(true);
    const [opened, setOpened] = useState(0);
    return (
      <div className="flex w-full max-w-xl flex-col gap-2">
        <Card
          variant="row"
          fullWidth
          onClick={() => setOpened((count) => count + 1)}
        >
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <Typography
              element="span"
              textStyle="body14"
              textColor="body"
              className="min-w-0 truncate"
            >
              Q1 revenue commentary
            </Typography>
            <PinToggle
              {...args}
              className="-my-0.5"
              pressed={pinned}
              onPressedChange={(next) => {
                setPinned(next);
                args.onPressedChange?.(next);
              }}
            />
          </div>
          <Typography element="span" textStyle="body12" textColor="secondary">
            2h ago
          </Typography>
        </Card>
        <Typography element="span" textStyle="body12" textColor="secondary">
          Row opened {opened} times
        </Typography>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Pin' }));
    await expect(canvas.getByText('Row opened 0 times')).toBeVisible();
  },
};
