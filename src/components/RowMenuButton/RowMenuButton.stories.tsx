import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pencil, Pin, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { expect, screen } from 'storybook/test';
import { Card } from '../Card';
import { DropdownMenuItem, DropdownMenuSeparator } from '../DropdownMenu';
import { TooltipProvider } from '../Tooltip';
import { Typography } from '../Typography';
import { RowMenuButton } from './index';

const MENU = (
  <>
    <DropdownMenuItem>
      <Pin />
      Pin
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Pencil />
      Rename
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="danger">
      <Trash2 />
      Delete
    </DropdownMenuItem>
  </>
);

/**
 * `RowMenuButton` is the ⋮ at the end of a list row, and the menu it opens.
 *
 * It looks like any row action — `IconButton` `tertiary` `2xs` — and adds the
 * behaviour a row needs: it fades in off the row's `group/row` (hover, keyboard
 * focus, open) and shows at rest below `md` and on touch; its clicks and keys
 * never open the row; and an item that moves focus — Rename — keeps it.
 *
 * Hover the row to reveal the trigger. Narrow the canvas below 768px and it
 * stays.
 */
const meta = {
  title: 'Compositions/RowMenuButton',
  component: RowMenuButton,
  tags: ['autodocs'],
  args: { children: MENU, reveal: true, 'aria-label': 'More actions' },
  argTypes: {
    children: { control: false },
    ref: { control: false, table: { disable: true } },
  },
  parameters: { layout: 'padded' },
  // The trigger names itself in a Tooltip, which needs a provider above it.
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  // A one-line `Card variant="row"`: the `group/row` the trigger answers. The
  // trigger's negative block margin keeps its 24px inside the 20px text line,
  // so the row stays the 44px a one-line row is.
  render: (args) => (
    <Row>
      <RowMenuButton {...args} className="-my-0.5" />
    </Row>
  ),
} satisfies Meta<typeof RowMenuButton>;

export default meta;
type Story = StoryObj<typeof meta>;

function Row({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-xl">
      <Card variant="row" fullWidth>
        <Typography
          element="span"
          textStyle="body14"
          textColor="body"
          className="min-w-0 flex-1 truncate"
        >
          Q1 revenue commentary
        </Typography>
        {children}
      </Card>
    </div>
  );
}

/**
 * At rest the trigger is invisible but keeps its box, so nothing in the row
 * moves when it appears. Hover the row, or Tab into it.
 */
export const InARow: Story = {};

/** Open: the trigger keeps its pressed fill, and stays visible off-hover. */
export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'More actions' });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      await screen.findByRole('menuitem', { name: 'Delete' })
    ).toBeVisible();
  },
};

/** `reveal={false}`: shown at rest, for a surface with nothing to hover. */
export const AlwaysShown: Story = {
  args: { reveal: false },
};

/** Disabled: the inactive glyph, and no menu. */
export const Disabled: Story = {
  args: { reveal: false, disabled: true },
};
