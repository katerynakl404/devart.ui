import { act, renderHook } from '@testing-library/react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useHoverIntent } from '../use-hover-intent';

const DELAY = 300;
const CLOSE_DELAY = 150;

const pointer = (pointerType: string) =>
  ({ pointerType }) as ReactPointerEvent<HTMLElement>;
const mouse = pointer('mouse');

const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

interface Callbacks {
  onOpen: () => void;
  onClose: () => void;
}

const setup = (options: { enabled?: boolean; isOpen?: boolean } = {}) => {
  const onOpen = vi.fn();
  const onClose = vi.fn();
  const isOpenRef = { current: options.isOpen ?? false };
  const hook = renderHook(
    (callbacks: Callbacks) =>
      useHoverIntent({
        enabled: options.enabled ?? true,
        delay: DELAY,
        closeDelay: CLOSE_DELAY,
        isOpenRef,
        ...callbacks,
      }),
    { initialProps: { onOpen, onClose } as Callbacks }
  );
  return { ...hook, onOpen, onClose, isOpenRef };
};

describe('useHoverIntent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('open', () => {
    it('opens exactly at delay for a mouse, once', () => {
      const { result, onOpen } = setup();

      act(() => result.current.onTriggerPointerEnter(mouse));
      advance(DELAY - 1);
      expect(onOpen).not.toHaveBeenCalled();

      advance(1);
      expect(onOpen).toHaveBeenCalledTimes(1);

      advance(DELAY * 3);
      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it.each(['pen', 'touch'])('never schedules an open for %s', (type) => {
      const { result, onOpen } = setup();

      act(() => result.current.onTriggerPointerEnter(pointer(type)));
      advance(DELAY * 3);

      expect(onOpen).not.toHaveBeenCalled();
    });

    it('cancels the pending open when the trigger is left before delay', () => {
      const { result, onOpen } = setup();

      act(() => result.current.onTriggerPointerEnter(mouse));
      advance(DELAY - 1);
      act(() => result.current.onTriggerPointerLeave(mouse));
      advance(DELAY * 3);

      expect(onOpen).not.toHaveBeenCalled();
    });

    it('does not schedule an open when already open', () => {
      const { result, onOpen } = setup({ isOpen: true });

      act(() => result.current.onTriggerPointerEnter(mouse));
      advance(DELAY * 3);

      expect(onOpen).not.toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('closes exactly at closeDelay after the trigger is left', () => {
      const { result, onClose } = setup({ isOpen: true });

      act(() => result.current.onTriggerPointerLeave(mouse));
      advance(CLOSE_DELAY - 1);
      expect(onClose).not.toHaveBeenCalled();

      advance(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('is cancelled by entering the content within closeDelay', () => {
      const { result, onClose } = setup({ isOpen: true });

      act(() => result.current.onTriggerPointerLeave(mouse));
      advance(CLOSE_DELAY - 1);
      act(() => result.current.onContentPointerEnter());
      advance(CLOSE_DELAY * 3);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('is re-scheduled when the content is left', () => {
      const { result, onClose } = setup({ isOpen: true });

      act(() => result.current.onContentPointerEnter());
      act(() => result.current.onContentPointerLeave(mouse));
      advance(CLOSE_DELAY - 1);
      expect(onClose).not.toHaveBeenCalled();

      advance(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('is cancelled by re-entering the trigger within closeDelay', () => {
      const { result, onClose, onOpen } = setup({ isOpen: true });

      act(() => result.current.onTriggerPointerLeave(mouse));
      advance(CLOSE_DELAY - 1);
      act(() => result.current.onTriggerPointerEnter(mouse));
      advance(CLOSE_DELAY * 3 + DELAY);

      expect(onClose).not.toHaveBeenCalled();
      expect(onOpen).not.toHaveBeenCalled();
    });

    it.each(['pen', 'touch'])('never schedules a close for %s', (type) => {
      const { result, onClose } = setup({ isOpen: true });

      act(() => result.current.onTriggerPointerLeave(pointer(type)));
      advance(CLOSE_DELAY * 3);

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('enabled: false', () => {
    it('schedules no open on hover', () => {
      const { result, onOpen } = setup({ enabled: false });

      act(() => result.current.onTriggerPointerEnter(mouse));

      expect(vi.getTimerCount()).toBe(0);
      advance(DELAY * 3);
      expect(onOpen).not.toHaveBeenCalled();
    });

    it('schedules no close when open', () => {
      const { result, onClose } = setup({ enabled: false, isOpen: true });

      act(() => result.current.onTriggerPointerLeave(mouse));
      act(() => result.current.onContentPointerLeave(mouse));

      expect(vi.getTimerCount()).toBe(0);
      advance(CLOSE_DELAY * 3);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('drops a pending open when hover is switched off', () => {
      const onOpen = vi.fn();
      const { result, rerender } = renderHook(
        ({ enabled }: { enabled: boolean }) =>
          useHoverIntent({
            enabled,
            delay: DELAY,
            closeDelay: CLOSE_DELAY,
            isOpenRef: { current: false },
            onOpen,
            onClose: vi.fn(),
          }),
        { initialProps: { enabled: true } }
      );

      act(() => result.current.onTriggerPointerEnter(mouse));
      rerender({ enabled: false });

      advance(DELAY * 2);
      expect(onOpen).not.toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('clears a pending open timer', () => {
      const { result, onOpen } = setup();

      act(() => result.current.onTriggerPointerEnter(mouse));
      expect(vi.getTimerCount()).toBe(1);
      act(() => result.current.cancel());

      expect(vi.getTimerCount()).toBe(0);
      advance(DELAY * 3);
      expect(onOpen).not.toHaveBeenCalled();
    });

    it('clears a pending close timer', () => {
      const { result, onClose } = setup({ isOpen: true });

      act(() => result.current.onTriggerPointerLeave(mouse));
      expect(vi.getTimerCount()).toBe(1);
      act(() => result.current.cancel());

      expect(vi.getTimerCount()).toBe(0);
      advance(CLOSE_DELAY * 3);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('lifecycle', () => {
    it('clears a pending open on unmount', () => {
      const { result, unmount, onOpen } = setup();

      act(() => result.current.onTriggerPointerEnter(mouse));
      unmount();
      advance(DELAY * 3);

      expect(onOpen).not.toHaveBeenCalled();
    });

    it('clears a pending close on unmount', () => {
      const { result, unmount, onClose } = setup({ isOpen: true });

      act(() => result.current.onTriggerPointerLeave(mouse));
      unmount();
      advance(CLOSE_DELAY * 3);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('calls the latest callbacks, not the ones from scheduling time', () => {
      const { result, rerender, onOpen } = setup();
      const nextOpen = vi.fn();

      act(() => result.current.onTriggerPointerEnter(mouse));
      rerender({ onOpen: nextOpen, onClose: vi.fn() });
      advance(DELAY);

      expect(onOpen).not.toHaveBeenCalled();
      expect(nextOpen).toHaveBeenCalledTimes(1);
    });

    it('calls the latest onClose, not the one from scheduling time', () => {
      const { result, rerender, onClose } = setup({ isOpen: true });
      const nextClose = vi.fn();

      act(() => result.current.onTriggerPointerLeave(mouse));
      rerender({ onOpen: vi.fn(), onClose: nextClose });
      advance(CLOSE_DELAY);

      expect(onClose).not.toHaveBeenCalled();
      expect(nextClose).toHaveBeenCalledTimes(1);
    });
  });
});
