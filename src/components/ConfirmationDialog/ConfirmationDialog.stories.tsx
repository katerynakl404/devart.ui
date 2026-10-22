import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { expect, fn, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { Typography } from '../Typography';
import { ConfirmationDialog } from './index';

/**
 * `ConfirmationDialog` asks one question and offers two answers. It is
 * controlled: the application owns `open`, closes the dialog itself once
 * `onConfirm` succeeds, and gets a rejected `onConfirm` back through `onError`.
 *
 * While `isLoading`, Esc, the overlay and Cancel leave the dialog open. Focus
 * lands on the confirm button when the dialog opens.
 */
const meta = {
  title: 'Components/ConfirmationDialog',
  component: ConfirmationDialog,
  tags: ['autodocs'],
  parameters: {
    // Radix portals the dialog to document.body.
    layout: 'centered',
  },
  args: {
    open: false,
    title: 'Switch to yearly billing?',
    description:
      'You will be billed once a year from today. The new period starts immediately.',
    confirmLabel: 'Switch',
    cancelLabel: 'Cancel',
    variant: 'primary',
    isLoading: false,
    isCloseButtonVisible: false,
    onOpenChange: fn(),
    onConfirm: fn(),
    onCancel: fn(),
    onError: fn(),
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'destructive'],
    },
    open: { control: false },
    icon: { control: false },
    bodySlot: { control: false },
    onOpenChange: { control: false },
    onConfirm: { control: false },
    onCancel: { control: false },
    onError: { control: false },
  },
  render: (args) => <ControlledConfirmationDialog {...args} />,
} satisfies Meta<typeof ConfirmationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Holds `open` the way an application would, and still reports to the args. */
const ControlledConfirmationDialog = (
  args: ComponentProps<typeof ConfirmationDialog>
) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <ConfirmationDialog
        {...args}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          args.onOpenChange(next);
        }}
        onConfirm={async () => {
          await args.onConfirm();
          setOpen(false);
        }}
      />
    </>
  );
};

type PlayContext = Parameters<NonNullable<Story['play']>>[0];

const page = () => within(document.body);

const openDialog = async ({ canvas, userEvent }: PlayContext) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }));
  return page().findByRole('dialog');
};

const waitForClose = () =>
  waitFor(() => expect(page().queryByRole('dialog')).toBeNull());

/** Focus starts on Switch; Cancel reports and closes; Switch reports through `onConfirm`. */
export const Default: Story = {
  play: async (context) => {
    const { args, userEvent } = context;
    const dialog = await openDialog(context);
    await expect(dialog).toHaveAccessibleName('Switch to yearly billing?');
    await expect(dialog).toHaveAccessibleDescription(
      'You will be billed once a year from today. The new period starts immediately.'
    );
    await expect(
      within(dialog).getByRole('button', { name: 'Switch' })
    ).toHaveFocus();

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Cancel' })
    );
    await expect(args.onCancel).toHaveBeenCalledOnce();
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
    await waitForClose();

    const reopened = await openDialog(context);
    await userEvent.click(
      within(reopened).getByRole('button', { name: 'Switch' })
    );
    await expect(args.onConfirm).toHaveBeenCalledOnce();
    await waitForClose();
  },
};

const deleteError = new Error('The file could not be deleted.');

/** A rejected `onConfirm` reaches `onError`, and the dialog stays open. */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    title: 'Delete file?',
    description:
      "This action can't be undone. The file will be permanently removed.",
    confirmLabel: 'Delete',
    onConfirm: fn(() => Promise.reject(deleteError)),
  },
  play: async (context) => {
    const { args, userEvent } = context;
    const dialog = await openDialog(context);

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Delete' })
    );
    await expect(args.onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(args.onError).toHaveBeenCalledOnce());
    await expect(args.onError).toHaveBeenCalledWith(deleteError);
    await expect(args.onOpenChange).not.toHaveBeenCalled();
    await expect(dialog).toBeVisible();
  },
};

/** An icon leads the title, `bodySlot` follows the description, and the close button dismisses. */
export const WithIcon: Story = {
  args: {
    variant: 'destructive',
    title: 'Cancel subscription?',
    description: 'You keep Pro until the end of the current billing period.',
    confirmLabel: 'Cancel subscription',
    cancelLabel: 'Keep Pro',
    isCloseButtonVisible: true,
    icon: (
      <AlertTriangle
        aria-hidden
        className="size-5 shrink-0 text-fb-attention"
        strokeWidth={1.75}
      />
    ),
    bodySlot: (
      <Typography variant="p" textColor="body">
        After that you lose access to metrics and shared connections.
      </Typography>
    ),
  },
  play: async (context) => {
    const { args, userEvent } = context;
    const dialog = await openDialog(context);
    await expect(dialog).toHaveAccessibleName('Cancel subscription?');
    await expect(
      within(dialog).getByText(
        'After that you lose access to metrics and shared connections.'
      )
    ).toBeInTheDocument();

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Close' })
    );
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
    await expect(args.onCancel).not.toHaveBeenCalled();
    await waitForClose();
  },
};

/** While loading, Esc and an overlay click leave the dialog open; Cancel is disabled. */
export const Loading: Story = {
  args: {
    variant: 'destructive',
    title: 'Delete file?',
    description:
      "This action can't be undone. The file will be permanently removed.",
    confirmLabel: 'Delete',
    isLoading: true,
  },
  play: async (context) => {
    const { args, userEvent } = context;
    const dialog = await openDialog(context);
    const confirm = within(dialog).getByRole('button', { name: 'Delete' });
    await expect(confirm).toHaveFocus();
    await expect(confirm).toHaveAttribute('aria-busy', 'true');
    await expect(
      within(dialog).getByRole('button', { name: 'Cancel' })
    ).toBeDisabled();

    await userEvent.keyboard('{Escape}');
    await expect(dialog).toHaveAttribute('data-state', 'open');

    const overlay = document.querySelector('[data-modal-overlay]');
    await expect(overlay).not.toBeNull();
    await userEvent.click(overlay as Element);
    await expect(dialog).toHaveAttribute('data-state', 'open');

    await expect(args.onOpenChange).not.toHaveBeenCalled();
    await expect(args.onCancel).not.toHaveBeenCalled();
  },
};
