import {
  CheckCircle2,
  Info,
  type LucideIcon,
  TriangleAlert,
  XCircle,
} from 'lucide-react';
import type { ToastVariant } from './index';

/* The fallback, and the only place this number is written in TypeScript. The real value is the
   `--undo-window` token in globals.css: an undo that floats past in a toast and an undo that
   sits in a list have to give the reader the same amount of time, and two numbers in two
   languages drift. This one is used when there is no computed style to read — during server
   rendering, and in tests without a stylesheet. */
export const TOAST_DEFAULT_DURATION = 4000;

/* Read at CALL time, not at module scope: a module can be evaluated before the stylesheet is
   applied, which would freeze the fallback for the life of the page. */
export function getUndoWindow(): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return TOAST_DEFAULT_DURATION;
  }
  const ms = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--undo-window')
  );
  return Number.isFinite(ms) && ms > 0 ? ms : TOAST_DEFAULT_DURATION;
}

export const TOAST_DEFAULT_POSITION = 'top-right';

export const VARIANT_COLOR_MAP: Record<
  ToastVariant,
  { icon: string; progress: string }
> = {
  success: { icon: 'text-fb-green', progress: 'bg-fb-green' },
  info: { icon: 'text-brand-primary', progress: 'bg-brand-primary' },
  warning: { icon: 'text-fb-attention', progress: 'bg-fb-attention' },
  error: { icon: 'text-fb-red-text', progress: 'bg-fb-red-text' },
};

export const VARIANT_ICON_MAP: Record<ToastVariant, LucideIcon> = {
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
  error: XCircle,
};

export const VARIANT_BG_MAP: Record<ToastVariant, string> = {
  success: 'bg-toast-bg-success',
  info: 'bg-toast-bg-info',
  warning: 'bg-toast-bg-warning',
  error: 'bg-toast-bg-error',
};

export const VARIANT_BORDER_MAP: Record<ToastVariant, string> = {
  success: 'border-toast-border-success',
  info: 'border-toast-border-info',
  warning: 'border-toast-border-warning',
  error: 'border-toast-border-error',
};
