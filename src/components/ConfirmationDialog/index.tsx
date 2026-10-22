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
    // Keeps the title clear of the absolutely positioned close button.
    withCloseButton: {
      true: 'pr-16',
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
  description: string;
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
        // The fork's `IconButton` requires `aria-label`; 'Close' is the label
        // `ModalContent` falls back to anyway.
        closeButtonProps={{
          'aria-label': 'Close',
          className: 'top-3.5 right-5',
        }}
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
          <ModalTitle className="min-w-0 break-words">{title}</ModalTitle>
        </ModalHeader>

        <ModalBody className="mr-0 px-5 pb-5">
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
