import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';
import { Card } from '../Card';
import { Typography } from '../Typography';
import { InlineRename } from './index';

/**
 * `InlineRename` turns a title into a field where it stands, and back.
 *
 * It opens focused with the whole title selected. Enter or blur commits the
 * trimmed name; Esc cancels; empty or unchanged is a cancel too. The parent
 * owns whether it is showing — it puts the title back on `onCommit` or
 * `onCancel`, exactly one of which fires.
 */
const meta = {
  title: 'Compositions/InlineRename',
  component: InlineRename,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Chat name',
    defaultValue: 'Q1 revenue commentary',
    onCommit: fn(),
    onCancel: fn(),
  },
  argTypes: {
    onCommit: { control: false },
    onCancel: { control: false },
    ref: { control: false, table: { disable: true } },
  },
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="w-80">
      <InlineRename {...args} />
    </div>
  ),
} satisfies Meta<typeof InlineRename>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Open: focused, the field border on, the whole title selected. */
export const Open: Story = {
  play: async ({ canvas }) => {
    const field = canvas.getByRole('textbox', { name: 'Chat name' });
    await waitFor(() => expect(field).toHaveFocus());
    await expect((field as HTMLInputElement).selectionEnd).toBe(21);
  },
};

/** Enter commits the trimmed name. */
export const Commit: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByRole('textbox', { name: 'Chat name' });
    await waitFor(() => expect(field).toHaveFocus());
    await userEvent.keyboard('  Q2 revenue  {Enter}');
    await expect(args.onCommit).toHaveBeenCalledOnce();
    await expect(args.onCommit).toHaveBeenCalledWith('Q2 revenue');
    await expect(args.onCancel).not.toHaveBeenCalled();
  },
};

/** Esc cancels, and leaves the title as it was. */
export const Cancel: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByRole('textbox', { name: 'Chat name' });
    await waitFor(() => expect(field).toHaveFocus());
    await userEvent.keyboard('Something else{Escape}');
    await expect(args.onCancel).toHaveBeenCalledOnce();
    await expect(args.onCommit).not.toHaveBeenCalled();
  },
};

/** Cleared and committed: a cancel — there is no nameless row. */
export const Empty: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByRole('textbox', { name: 'Chat name' });
    await waitFor(() => expect(field).toHaveFocus());
    await userEvent.keyboard('{Backspace}{Enter}');
    await expect(args.onCancel).toHaveBeenCalledOnce();
    await expect(args.onCommit).not.toHaveBeenCalled();
  },
};

/**
 * In a list row: the title swaps for the field in place, and the row keeps its
 * 44px. A click inside the field places the caret — it does not open the row.
 */
export const InARow: Story = {
  render: function Render(args) {
    const [title, setTitle] = useState('Q1 revenue commentary');
    const [renaming, setRenaming] = useState(true);
    const [opened, setOpened] = useState(0);
    return (
      <div className="flex w-full max-w-xl flex-col gap-2">
        <Card
          variant="row"
          fullWidth
          onClick={() => setOpened((count) => count + 1)}
        >
          <div className="flex min-w-0 flex-1 items-center">
            {renaming ? (
              <InlineRename
                {...args}
                defaultValue={title}
                onCommit={(next) => {
                  setTitle(next);
                  setRenaming(false);
                  args.onCommit(next);
                }}
                onCancel={() => {
                  setRenaming(false);
                  args.onCancel();
                }}
              />
            ) : (
              <Typography
                element="span"
                textStyle="body14"
                textColor="body"
                className="min-w-0 truncate"
                onDoubleClick={() => setRenaming(true)}
              >
                {title}
              </Typography>
            )}
          </div>
          <Typography element="span" textStyle="body12" textColor="secondary">
            2h ago
          </Typography>
        </Card>
        <Typography element="span" textStyle="body12" textColor="secondary">
          Row opened {opened} times · double-click the title to rename
        </Typography>
      </div>
    );
  },
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByRole('textbox', { name: 'Chat name' });
    await waitFor(() => expect(field).toHaveFocus());

    await userEvent.click(field);
    await expect(canvas.getByText(/Row opened 0 times/)).toBeVisible();

    await userEvent.clear(field);
    await userEvent.type(field, 'Q2 revenue{Enter}');
    await expect(args.onCommit).toHaveBeenCalledWith('Q2 revenue');
    await expect(canvas.getByText('Q2 revenue')).toBeVisible();
  },
};
