import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmationDialog, type ConfirmationDialogProps } from '../index';

/** Holds `open` the way an application would — the stories' harness. */
const Controlled = (props: ConfirmationDialogProps) => {
  const [open, setOpen] = useState(props.open);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      <ConfirmationDialog
        {...props}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          props.onOpenChange(next);
        }}
        onConfirm={async () => {
          await props.onConfirm();
          setOpen(false);
        }}
      />
    </>
  );
};

const renderDialog = (overrides: Partial<ConfirmationDialogProps> = {}) => {
  const props: ConfirmationDialogProps = {
    open: false,
    title: 'Switch to yearly billing?',
    description:
      'You will be billed once a year from today. The new period starts immediately.',
    confirmLabel: 'Switch',
    cancelLabel: 'Cancel',
    onOpenChange: vi.fn(),
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    onError: vi.fn(),
    ...overrides,
  };
  render(<Controlled {...props} />);
  return props;
};

const openDialog = async () => {
  fireEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
  return screen.findByRole('dialog');
};

const waitForClose = () =>
  waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

describe('ConfirmationDialog', () => {
  it('is named by its title, described by its description, and focuses confirm', async () => {
    renderDialog();
    const dialog = await openDialog();

    expect(dialog).toHaveAccessibleName('Switch to yearly billing?');
    expect(dialog).toHaveAccessibleDescription(
      'You will be billed once a year from today. The new period starts immediately.'
    );
    await waitFor(() =>
      expect(
        within(dialog).getByRole('button', { name: 'Switch' })
      ).toHaveFocus()
    );
  });

  it('has no close button unless isCloseButtonVisible', async () => {
    renderDialog();
    const dialog = await openDialog();

    expect(within(dialog).queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('Cancel calls onCancel, then onOpenChange(false)', async () => {
    const props = renderDialog();
    const dialog = await openDialog();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));

    expect(props.onCancel).toHaveBeenCalledOnce();
    expect(props.onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    await waitForClose();
  });

  it('awaits onConfirm, leaving the close to the consumer', async () => {
    const props = renderDialog();
    const dialog = await openDialog();

    await act(async () => {
      fireEvent.click(within(dialog).getByRole('button', { name: 'Switch' }));
    });

    expect(props.onConfirm).toHaveBeenCalledOnce();
    expect(props.onOpenChange).not.toHaveBeenCalled();
    await waitForClose();
  });

  it('hands a rejected onConfirm to onError and stays open', async () => {
    const deleteError = new Error('The file could not be deleted.');
    const props = renderDialog({
      variant: 'destructive',
      title: 'Delete file?',
      description:
        "This action can't be undone. The file will be permanently removed.",
      confirmLabel: 'Delete',
      onConfirm: vi.fn(() => Promise.reject(deleteError)),
    });
    const dialog = await openDialog();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));

    expect(props.onConfirm).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(props.onError).toHaveBeenCalledExactlyOnceWith(deleteError)
    );
    expect(props.onOpenChange).not.toHaveBeenCalled();
    expect(dialog).toBeInTheDocument();
  });

  it('renders icon and bodySlot; the close button dismisses without onCancel', async () => {
    const props = renderDialog({
      isCloseButtonVisible: true,
      icon: <svg data-testid="dialog-icon" />,
      bodySlot: <p>After that you lose access to metrics.</p>,
    });
    const dialog = await openDialog();

    expect(within(dialog).getByTestId('dialog-icon')).toBeInTheDocument();
    expect(
      within(dialog).getByText('After that you lose access to metrics.')
    ).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));

    expect(props.onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(props.onCancel).not.toHaveBeenCalled();
    await waitForClose();
  });

  it('closes on Esc when idle', async () => {
    const props = renderDialog();
    const dialog = await openDialog();

    fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(props.onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    await waitForClose();
  });

  it('while loading, Esc, the overlay, Close and Cancel all leave it open', async () => {
    const props = renderDialog({
      variant: 'destructive',
      confirmLabel: 'Delete',
      isLoading: true,
      isCloseButtonVisible: true,
    });
    const dialog = await openDialog();
    const confirm = within(dialog).getByRole('button', { name: 'Delete' });
    const cancel = within(dialog).getByRole('button', { name: 'Cancel' });

    await waitFor(() => expect(confirm).toHaveFocus());
    expect(confirm).toHaveAttribute('aria-busy', 'true');
    expect(cancel).toBeDisabled();

    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(dialog).toHaveAttribute('data-state', 'open');

    const overlay = document.querySelector('[data-modal-overlay]');
    expect(overlay).not.toBeNull();
    fireEvent.pointerDown(overlay as Element);
    fireEvent.click(overlay as Element);
    expect(dialog).toHaveAttribute('data-state', 'open');

    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    fireEvent.click(cancel);
    fireEvent.click(confirm);

    expect(dialog).toHaveAttribute('data-state', 'open');
    expect(props.onOpenChange).not.toHaveBeenCalled();
    expect(props.onCancel).not.toHaveBeenCalled();
    expect(props.onConfirm).not.toHaveBeenCalled();
  });
});
