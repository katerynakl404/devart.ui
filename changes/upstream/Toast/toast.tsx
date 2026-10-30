'use client';

/**
 * The developers' `toast`, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/Toast/toast.tsx`, import paths alone changed: the
 * message is their `ToastMessage` (vendored beside it), the constants are this
 * package's, whose position and fallback duration have not moved. The Before
 * half of the Toast page fires this file. Not edited: replace it whole when
 * the base moves.
 */

import type { ReactNode } from 'react';
import { toast as sonnerToast } from 'sonner';
import {
  TOAST_DEFAULT_DURATION,
  TOAST_DEFAULT_POSITION,
} from '../../../src/components/Toast/ToastMessage/constants';
import {
  type ToastAction,
  ToastMessage,
  type ToastVariant,
} from './ToastMessage';

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
      ...(options?.width !== undefined
        ? { style: { width: options.width } }
        : {}),
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
