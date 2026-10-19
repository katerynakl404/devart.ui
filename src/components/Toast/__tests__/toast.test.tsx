import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type ToastRender = (id: string | number) => ReactElement;

// Typed so `mock.calls` carries the argument shape: an untyped `vi.fn()` gives
// an empty tuple and the reads below cannot be indexed.
const custom = vi.fn(
  (_render: ToastRender, _options?: Record<string, unknown>) => 'toast-id'
);
const dismiss = vi.fn();

// Captured at module load by `toast.dismiss`, so the mock has to exist first.
vi.mock('sonner', () => ({ toast: { custom, dismiss } }));

const { toast } = await import('../toast');
const { TOAST_DEFAULT_DURATION, TOAST_DEFAULT_POSITION } = await import(
  '../ToastMessage/constants'
);

/** The options object sonner is handed, i.e. how the toast is scheduled. */
const scheduledWith = () =>
  custom.mock.calls.at(-1)?.[1] as Record<string, unknown>;

/** The element sonner would render, i.e. what the toast looks like. */
const renderedProps = () => {
  const renderToast = custom.mock.calls.at(-1)?.[0] as ToastRender;
  return renderToast('sonner-id').props as Record<string, unknown>;
};

beforeEach(() => {
  custom.mockClear();
  dismiss.mockClear();
});

describe('toast', () => {
  it('carries its variant through to the rendered message', () => {
    for (const variant of ['success', 'info', 'warning', 'error'] as const) {
      toast[variant]('Saved');
      expect(renderedProps().variant).toBe(variant);
      expect(renderedProps().message).toBe('Saved');
    }
  });

  it('schedules with the package defaults', () => {
    toast.success('Saved');
    expect(scheduledWith()).toMatchObject({
      duration: TOAST_DEFAULT_DURATION,
      position: TOAST_DEFAULT_POSITION,
    });
  });

  it('lets duration and position be overridden', () => {
    toast.error('Failed', { duration: 100, position: 'bottom-left' });
    expect(scheduledWith()).toMatchObject({
      duration: 100,
      position: 'bottom-left',
    });
  });

  /**
   * An explicit id is what makes a toast replaceable — reusing it updates the
   * existing toast instead of stacking another one. Passing `undefined` would
   * make sonner mint a fresh id, so the key is omitted entirely when unset.
   */
  it('forwards an id only when one is given', () => {
    toast.info('Progress', { id: 'upload' });
    expect(scheduledWith()).toHaveProperty('id', 'upload');

    toast.info('Progress');
    expect(scheduledWith()).not.toHaveProperty('id');
  });

  /**
   * Every toast takes one width — the Toaster's own `--width` — so a stack of
   * custom toasts does not size each box to its content. An explicit `width`
   * still wins.
   */
  it('turns a width into a style, and falls back to the Toaster width otherwise', () => {
    toast.info('Wide', { width: 420 });
    expect(scheduledWith()).toHaveProperty('style', { width: 420 });

    toast.info('Plain');
    expect(scheduledWith()).toHaveProperty('style', { width: 'var(--width)' });
  });

  it('passes description, icon and action to the message', () => {
    const action = { label: 'Undo', onClick: vi.fn() };
    toast.success('Deleted', { description: 'Item removed', action });

    expect(renderedProps()).toMatchObject({
      description: 'Item removed',
      action,
      duration: TOAST_DEFAULT_DURATION,
    });
  });

  it('dismisses by the caller id when there is one, otherwise by sonner own', () => {
    toast.success('Saved', { id: 'mine' });
    (renderedProps().onClose as () => void)();
    expect(dismiss).toHaveBeenCalledWith('mine');

    toast.success('Saved');
    (renderedProps().onClose as () => void)();
    expect(dismiss).toHaveBeenCalledWith('sonner-id');
  });

  it('exposes sonner dismiss directly', () => {
    toast.dismiss('anything');
    expect(dismiss).toHaveBeenCalledWith('anything');
  });
});
