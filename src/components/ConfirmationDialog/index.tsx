'use client';

import { type ReactNode, useId, useRef } from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { Button, type ButtonProps } from '../Button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '../Modal';
import { Typography } from '../Typography';

const confirmationDialogHeaderVariants = cva('mb-0 px-5 pt-3.5 pb-2', {
  variants: {
    withIcon: {
      true: 'flex-row items-center gap-2',
      false: '',
    },
    // Its close button sits further in than a plain dialog's, so it reserves
    // more than ModalHeader does on its own.
    withCloseButton: {
      true: 'pe-16',
      false: '',
    },
  },
  defaultVariants: {
    withIcon: false,
    withCloseButton: false,
  },
});

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  /**
   * The question's one paragraph. Inline marks are fine — the name it is about
   * in bold — since it renders inside a `<p>`; a second block goes in
   * `bodySlot`.
   */
  description: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  icon?: ReactNode;
  bodySlot?: ReactNode;
  isLoading?: boolean;
  variant?: Extract<
    NonNullable<ButtonProps['variant']>,
    'primary' | 'destructive'
  >;
  isCloseButtonVisible?: boolean;
  className?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
  onError?: (error: unknown) => void;
}

/**
 * A two-button confirmation over `Modal`. The dialog stays open while
 * `isLoading` and after `onConfirm` settles — closing it on success is the
 * consumer's call; a rejection is handed to `onError`.
 */
function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  icon,
  bodySlot,
  isLoading = false,
  variant = 'primary',
  isCloseButtonVisible = false,
  className,
  onOpenChange,
  onConfirm,
  onCancel,
  onError,
}: ConfirmationDialogProps) {
  const descriptionId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

  const handleOpenChange = (next: boolean) => {
    if (!next && isLoading) return;

    onOpenChange(next);
  };

  const handleConfirm = async () => {
    if (isLoading) return;

    try {
      await onConfirm();
    } catch (error) {
      onError?.(error);
    }
  };

  const handleCancel = () => {
    if (isLoading) return;

    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent
        aria-describedby={descriptionId}
        size="sm"
        className={cn('p-0', className)}
        isCloseButtonVisible={isCloseButtonVisible}
        closeButtonProps={{ className: 'top-3.5 right-5' }}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          confirmRef.current?.focus();
        }}
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <ModalHeader
          className={confirmationDialogHeaderVariants({
            withIcon: !!icon,
            withCloseButton: isCloseButtonVisible,
          })}
        >
          {icon}
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>

        {/* `mx-0`: this dialog has no padding of its own (`p-0`), so the
            body has none to reach over; `px-5` is its inset */}
        <ModalBody className="mx-0 px-5 pb-5">
          <Typography id={descriptionId} variant="p" textColor="secondary">
            {description}
          </Typography>
          {bodySlot}
        </ModalBody>

        {/* The divider and the gap are `ModalFooter`'s own; `mx-0` drops its
            bleed through a padding this surface does not have. */}
        <ModalFooter className="mx-0 mt-0 px-5 py-3.5">
          <Button
            variant="secondary"
            size="sm"
            disabled={isLoading}
            onClick={handleCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            ref={confirmRef}
            variant={variant}
            size="sm"
            isLoading={isLoading}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export {
  ConfirmationDialog,
  type ConfirmationDialogProps,
  confirmationDialogHeaderVariants,
};
