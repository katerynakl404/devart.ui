import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFilteredOptions } from '../use-filtered-options';
import { defaultFilterOptions } from '../utils';

type Item = { id: string; label: string };

const options: Item[] = [
  { id: '1', label: 'Kyiv' },
  { id: '2', label: 'Lviv' },
  { id: '3', label: 'Odesa' },
];

const getOptionLabel = (option: Item) => option.label;
const filterOptions = defaultFilterOptions as unknown as (
  options: Item[],
  state: { inputValue: string; getOptionLabel: (option: Item) => string }
) => Item[];

const run = (
  overrides: Partial<Parameters<typeof useFilteredOptions<Item>>[0]>
) =>
  renderHook(() =>
    useFilteredOptions<Item>({
      options,
      value: null,
      inputValue: '',
      popupOpen: true,
      getOptionLabel,
      filterOptions,
      ...overrides,
    })
  ).result.current.filteredOptions;

describe('useFilteredOptions', () => {
  it('returns nothing while the popup is closed', () => {
    expect(run({ popupOpen: false })).toEqual([]);
  });

  it('filters by the typed input', () => {
    expect(run({ inputValue: 'iv' })).toEqual([options[0], options[1]]);
  });

  it('drops the already selected option when asked to', () => {
    expect(
      run({ value: options[0] as Item, filterSelectedOptions: true })
    ).toEqual([options[1], options[2]]);
  });

  it('drops every selected option in multiple mode', () => {
    expect(
      run({
        value: [options[0] as Item, options[2] as Item],
        isMultipleSelect: true,
        filterSelectedOptions: true,
      })
    ).toEqual([options[1]]);
  });

  /**
   * Reopening a single-select field leaves the chosen label in the input.
   * Treating that text as a query would narrow the list to the one option the
   * user already has, so the query is blanked and the full list is offered.
   */
  it('ignores the input when it still equals the selected label', () => {
    expect(run({ value: options[0] as Item, inputValue: 'Kyiv' })).toEqual(
      options
    );
  });

  it('keeps filtering in multiple mode even when the text matches a selection', () => {
    expect(
      run({
        value: [options[0] as Item],
        isMultipleSelect: true,
        inputValue: 'Kyiv',
      })
    ).toEqual([options[0]]);
  });

  it('delegates to the provided filterOptions', () => {
    const spy = vi.fn(() => [options[2] as Item]);
    expect(run({ filterOptions: spy, inputValue: 'anything' })).toEqual([
      options[2],
    ]);
    expect(spy).toHaveBeenCalledWith(options, {
      inputValue: 'anything',
      getOptionLabel,
    });
  });
});
