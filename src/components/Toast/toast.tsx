'use client';

import type { ReactNode } from 'react';
import { toast as sonnerToast } from 'sonner';
import {
  type ToastAction,
  ToastMessage,
  type ToastVariant,
} from './ToastMessage';
import {
  TOAST_DEFAULT_DURATION,
  TOAST_DEFAULT_POSITION,
} from './ToastMessage/constants';

type Position =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center';

export interface ToastOptions {
  action?: ToastAction;
  description?: string;
  duration?: number;
  id?: string | number;
  icon?: ReactNode;
  position?: Position;
  width?: number | string;
  /** Accessible label for the toast's close button. */
  closeLabel?: string;
}

function createToast(
  variant: ToastVariant,
  message: ReactNode,
  options?: ToastOptions
) {
  const duration = options?.duration ?? TOAST_DEFAULT_DURATION;
  const position = options?.position ?? TOAST_DEFAULT_POSITION;

  return sonnerToast.custom(
    (id) => (
      <ToastMessage
        variant={variant}
        message={message}
        description={options?.description}
        action={options?.action}
        icon={options?.icon}
        duration={duration}
        onClose={() => sonnerToast.dismiss(options?.id || id)}
        closeLabel={options?.closeLabel}
      />
    ),
    {
      duration,
      position,
      ...(options?.id ? { id: options.id } : {}),
      /* One width for every toast, taken from the Toaster’s own `--width`.
         A custom toast is unstyled as far as sonner is concerned, so it fell
         back to fitting its content: three success toasts stacked in a
         corner measured 317, 268 and 296px, and a stack of ragged boxes
         reads as three unrelated things rather than one log. The variable is
         still the Toaster’s to set, and an explicit `width` still wins. */
      style: { width: options?.width ?? 'var(--width)' },
    }
  );
}

export const toast = {
  success: (message: ReactNode, options?: ToastOptions) =>
    createToast('success', message, options),

  info: (message: ReactNode, options?: ToastOptions) =>
    createToast('info', message, options),

  warning: (message: ReactNode, options?: ToastOptions) =>
    createToast('warning', message, options),

  error: (message: ReactNode, options?: ToastOptions) =>
    createToast('error', message, options),

  dismiss: sonnerToast.dismiss,
};
