import { act, renderHook } from '@testing-library/react';
import type { SyntheticEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NO_FOCUSED_BADGE } from '../constants';
import { useBadgeNavigation } from '../use-badge-navigation';

type Item = { id: string; label: string };

const badges: Item[] = [
  { id: '1', label: 'Kyiv' },
  { id: '2', label: 'Lviv' },
  { id: '3', label: 'Odesa' },
];

const event = {} as SyntheticEvent;

const setup = (
  overrides: Partial<{
    value: Item[];
    isMultipleSelect: boolean;
    readOnly: boolean;
    inputValue: string;
  }> = {}
) => {
  const setValue = vi.fn();
  const hook = renderHook(() =>
    useBadgeNavigation<Item, true>({
      value: (overrides.value ?? badges) as Item[],
      isMultipleSelect: (overrides.isMultipleSelect ?? true) as true,
      readOnly: overrides.readOnly,
      inputValue: overrides.inputValue ?? '',
      setValue,
    })
  );
  return { ...hook, setValue };
};

describe('useBadgeNavigation', () => {
  it('starts with nothing focused', () => {
    const { result } = setup();
    expect(result.current.focusedBadge).toBe(NO_FOCUSED_BADGE);
    expect(result.current.hasBadges).toBe(true);
    expect(result.current.canNavigate).toBe(true);
  });

  /**
   * Navigation is only offered while the caret has nowhere left to go — with
   * text in the field, Left/Right belong to the text, not to the badges.
   */
  it('refuses to navigate while the input still holds text', () => {
    const { result } = setup({ inputValue: 'ky' });
    expect(result.current.canNavigate).toBe(false);

    act(() => result.current.navigateLeft());
    expect(result.current.focusedBadge).toBe(NO_FOCUSED_BADGE);
  });

  it('walks left from the input onto the last badge, then wraps', () => {
    const { result } = setup();

    act(() => result.current.navigateLeft());
    expect(result.current.focusedBadge).toBe(2);

    act(() => result.current.navigateLeft());
    expect(result.current.focusedBadge).toBe(1);

    act(() => result.current.navigateLeft());
    act(() => result.current.navigateLeft());
    expect(result.current.focusedBadge).toBe(2);
  });

  it('walks right and reports when focus returns to the input', () => {
    const { result } = setup();

    act(() => result.current.setFocusedBadge(1));
    let returnedToInput: boolean | undefined;
    act(() => {
      returnedToInput = result.current.navigateRight();
    });
    expect(result.current.focusedBadge).toBe(2);
    expect(returnedToInput).toBe(false);

    act(() => {
      returnedToInput = result.current.navigateRight();
    });
    expect(result.current.focusedBadge).toBe(NO_FOCUSED_BADGE);
    expect(returnedToInput).toBe(true);
  });

  it('removes a badge by index and clears the focus', () => {
    const { result, setValue } = setup();

    act(() => result.current.setFocusedBadge(1));
    act(() => result.current.remove(1, event));

    expect(setValue).toHaveBeenCalledWith(
      [badges[0], badges[2]],
      'removeOption',
      event,
      { option: badges[1] }
    );
    expect(result.current.focusedBadge).toBe(NO_FOCUSED_BADGE);
  });

  it('removes nothing when read-only or single-select', () => {
    const readOnly = setup({ readOnly: true });
    act(() => readOnly.result.current.remove(0, event));
    expect(readOnly.setValue).not.toHaveBeenCalled();

    const single = setup({ isMultipleSelect: false });
    act(() => single.result.current.remove(0, event));
    expect(single.setValue).not.toHaveBeenCalled();
  });

  it('backspaces the focused badge, or the last one when none is focused', () => {
    const none = setup();
    act(() => none.result.current.removeLastOrFocused(event));
    expect(none.setValue).toHaveBeenCalledWith(
      [badges[0], badges[1]],
      'removeOption',
      event,
      { option: badges[2] }
    );

    const focused = setup();
    act(() => focused.result.current.setFocusedBadge(0));
    act(() => focused.result.current.removeLastOrFocused(event));
    expect(focused.setValue).toHaveBeenCalledWith(
      [badges[1], badges[2]],
      'removeOption',
      event,
      { option: badges[0] }
    );
  });

  it('reports no badges for an empty selection', () => {
    const { result } = setup({ value: [] });
    expect(result.current.hasBadges).toBe(false);
    expect(result.current.canNavigate).toBe(false);
  });
});
