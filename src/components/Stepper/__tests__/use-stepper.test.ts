import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useStepper } from '../use-stepper';

describe('useStepper', () => {
  it('starts at the first step and reports its position', () => {
    const { result } = renderHook(() => useStepper({ totalSteps: 3 }));
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(false);
  });

  it('clamps an out-of-range initial step', () => {
    expect(
      renderHook(() => useStepper({ totalSteps: 3, initialStep: 9 })).result
        .current.currentStep
    ).toBe(2);
    expect(
      renderHook(() => useStepper({ totalSteps: 3, initialStep: -4 })).result
        .current.currentStep
    ).toBe(0);
  });

  it('walks forward and back without leaving the range', () => {
    const { result } = renderHook(() => useStepper({ totalSteps: 2 }));

    act(() => result.current.goNext());
    expect(result.current.currentStep).toBe(1);
    expect(result.current.isLast).toBe(true);

    act(() => result.current.goNext());
    expect(result.current.currentStep).toBe(1);

    act(() => result.current.goBack());
    act(() => result.current.goBack());
    expect(result.current.currentStep).toBe(0);
  });

  it('clamps goTo', () => {
    const { result } = renderHook(() => useStepper({ totalSteps: 3 }));
    act(() => result.current.goTo(99));
    expect(result.current.currentStep).toBe(2);
    act(() => result.current.goTo(-1));
    expect(result.current.currentStep).toBe(0);
  });

  it('notifies on a real move only, never on mount or on a no-op', () => {
    const onStepChange = vi.fn();
    const { result } = renderHook(() =>
      useStepper({ totalSteps: 2, onStepChange })
    );
    expect(onStepChange).not.toHaveBeenCalled();

    act(() => result.current.goBack());
    expect(onStepChange).not.toHaveBeenCalled();

    act(() => result.current.goNext());
    expect(onStepChange).toHaveBeenCalledExactlyOnceWith(1);
  });

  it('carries arbitrary data and restores it on reset', () => {
    const { result } = renderHook(() =>
      useStepper<{ email: string }>({
        totalSteps: 3,
        initialStep: 1,
        initialData: { email: '' },
      })
    );

    act(() => result.current.setData({ email: 'a@b.c' }));
    act(() => result.current.goTo(2));
    expect(result.current.data).toEqual({ email: 'a@b.c' });

    act(() => result.current.reset());
    expect(result.current.currentStep).toBe(1);
    expect(result.current.data).toEqual({ email: '' });
  });

  /**
   * Documents a gap rather than a guarantee: the current step is clamped when
   * it is set, not when `totalSteps` changes underneath it. A caller that
   * shortens the list while standing past the new end keeps an index nothing
   * renders at, and `isLast` stays false. Callers must `goTo` after shrinking.
   */
  it('does not re-clamp when the step count shrinks underneath it', () => {
    const { result, rerender } = renderHook(
      ({ totalSteps }) => useStepper({ totalSteps }),
      { initialProps: { totalSteps: 5 } }
    );

    act(() => result.current.goTo(4));
    rerender({ totalSteps: 2 });

    expect(result.current.currentStep).toBe(4);
    expect(result.current.isLast).toBe(false);
  });
});
