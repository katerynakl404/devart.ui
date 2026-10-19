import { act, renderHook } from '@testing-library/react';
import type { MouseEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useAutocompleteSelection } from '../use-autocomplete-selection';

type Item = { id: string; label: string };

const kyiv: Item = { id: '1', label: 'Kyiv' };
const lviv: Item = { id: '2', label: 'Lviv' };

const click = (modifiers: Partial<MouseEvent> = {}) =>
  ({ ...modifiers }) as MouseEvent;

const setup = <Multiple extends boolean>(
  isMultipleSelect: Multiple,
  value: Multiple extends true ? Item[] : Item | null,
  options: {
    disableCloseOnSelect?: boolean;
    blurOnSelect?: boolean | 'touch' | 'mouse';
  } = {}
) => {
  const setValue = vi.fn();
  const setInputValue = vi.fn();
  const handleClose = vi.fn();
  const blur = vi.fn();
  const inputRef = { current: { blur } as unknown as HTMLInputElement };

  const hook = renderHook(() =>
    // biome-ignore lint/suspicious/noExplicitAny: the hook's Multiple generic is exercised through both branches here
    useAutocompleteSelection<Item, any>({
      value: value as never,
      isMultipleSelect,
      isOptionEqualToValue: (a, b) => a.id === b.id,
      getOptionLabel: (option) => option.label,
      setValue,
      setInputValue,
      handleClose,
      inputRef,
      ...options,
    })
  );

  return { ...hook, setValue, setInputValue, handleClose, blur };
};

describe('useAutocompleteSelection — single select', () => {
  it('replaces the value, mirrors the label into the input and closes', () => {
    const s = setup(false, null);
    const event = click();

    act(() => s.result.current.selectOption(event, kyiv));

    expect(s.setValue).toHaveBeenCalledWith(kyiv, 'selectOption', event, {
      option: kyiv,
    });
    expect(s.setInputValue).toHaveBeenCalledWith('Kyiv', 'reset', event);
    expect(s.handleClose).toHaveBeenCalledWith(event, 'selectOption');
  });

  it('reports selection by identity, not by reference', () => {
    const s = setup(false, { ...kyiv });
    expect(s.result.current.isOptionSelected(kyiv)).toBe(true);
    expect(s.result.current.isOptionSelected(lviv)).toBe(false);
  });

  it('treats an empty value as nothing selected', () => {
    const s = setup(false, null);
    expect(s.result.current.isOptionSelected(kyiv)).toBe(false);
  });
});

describe('useAutocompleteSelection — multiple select', () => {
  it('appends an unselected option and clears the input', () => {
    const s = setup(true, [kyiv]);
    const event = click();

    act(() => s.result.current.selectOption(event, lviv));

    expect(s.setValue).toHaveBeenCalledWith(
      [kyiv, lviv],
      'selectOption',
      event,
      {
        option: lviv,
      }
    );
    expect(s.setInputValue).toHaveBeenCalledWith('', 'reset', event);
  });

  /**
   * Picking an option that is already chosen is a toggle, not a duplicate: the
   * reason flips to `removeOption` so a consumer can tell the two apart.
   */
  it('removes an already selected option and says so', () => {
    const s = setup(true, [kyiv, lviv]);
    const event = click();

    act(() => s.result.current.selectOption(event, kyiv));

    expect(s.setValue).toHaveBeenCalledWith([lviv], 'removeOption', event, {
      option: kyiv,
    });
    expect(s.handleClose).toHaveBeenCalledWith(event, 'removeOption');
  });
});

describe('useAutocompleteSelection — closing and blurring', () => {
  it('stays open when closing on select is disabled', () => {
    const s = setup(false, null, { disableCloseOnSelect: true });
    act(() => s.result.current.selectOption(click(), kyiv));
    expect(s.handleClose).not.toHaveBeenCalled();
  });

  /**
   * Ctrl/Cmd-click is how a user opens a result in a new tab; closing the popup
   * underneath would lose their place in the list.
   */
  it('stays open for a modifier click', () => {
    const ctrl = setup(false, null);
    act(() => ctrl.result.current.selectOption(click({ ctrlKey: true }), kyiv));
    expect(ctrl.handleClose).not.toHaveBeenCalled();

    const meta = setup(false, null);
    act(() => meta.result.current.selectOption(click({ metaKey: true }), kyiv));
    expect(meta.handleClose).not.toHaveBeenCalled();
  });

  it('blurs the input when asked to unconditionally', () => {
    const s = setup(false, null, { blurOnSelect: true });
    act(() => s.result.current.selectOption(click(), kyiv));
    expect(s.blur).toHaveBeenCalledOnce();
  });

  it('blurs on mouse only while the last interaction was not touch', () => {
    const mouse = setup(false, null, { blurOnSelect: 'mouse' });
    act(() => mouse.result.current.selectOption(click(), kyiv));
    expect(mouse.blur).toHaveBeenCalledOnce();

    const touched = setup(false, null, { blurOnSelect: 'mouse' });
    act(() => touched.result.current.setIsTouch(true));
    act(() => touched.result.current.selectOption(click(), kyiv));
    expect(touched.blur).not.toHaveBeenCalled();
  });

  it('blurs on touch only after a touch interaction', () => {
    const untouched = setup(false, null, { blurOnSelect: 'touch' });
    act(() => untouched.result.current.selectOption(click(), kyiv));
    expect(untouched.blur).not.toHaveBeenCalled();

    const touched = setup(false, null, { blurOnSelect: 'touch' });
    act(() => touched.result.current.setIsTouch(true));
    act(() => touched.result.current.selectOption(click(), kyiv));
    expect(touched.blur).toHaveBeenCalledOnce();
  });

  it('leaves focus alone by default', () => {
    const s = setup(false, null);
    act(() => s.result.current.selectOption(click(), kyiv));
    expect(s.blur).not.toHaveBeenCalled();
  });
});
