import { describe, expect, it } from 'vitest';
import {
  calculateNextIndex,
  createFilterOptions,
  defaultGetOptionLabel,
  findNextValidIndex,
  stripDiacritics,
} from '../utils';

describe('stripDiacritics', () => {
  it('removes combining marks from Latin text', () => {
    expect(stripDiacritics('café')).toBe('cafe');
    expect(stripDiacritics('naïve')).toBe('naive');
    expect(stripDiacritics('São Paulo')).toBe('Sao Paulo');
    expect(stripDiacritics('Müller')).toBe('Muller');
  });

  it('leaves text without marks untouched', () => {
    expect(stripDiacritics('Kyiv')).toBe('Kyiv');
    expect(stripDiacritics('')).toBe('');
  });

  /**
   * Documents a consequence rather than an intent: Cyrillic «й» and «ё» are
   * canonically a base letter plus a combining mark, so NFD decomposition
   * strips them exactly like a Latin accent. Accent-insensitive filtering
   * therefore treats «й» and «и» as the same letter, which makes «Киів» match
   * «Київ». `Ґ` has no decomposition and survives. Worth knowing before anyone
   * relies on exact Ukrainian matching — pass `ignoreAccents: false` for that.
   */
  it('also decomposes Cyrillic breve and diaeresis', () => {
    expect(stripDiacritics('Київ')).toBe('Киів');
    expect(stripDiacritics('ёлка')).toBe('елка');
    expect(stripDiacritics('Ґанок')).toBe('Ґанок');
  });
});

describe('createFilterOptions', () => {
  const options = ['Café', 'Cafeteria', 'Tea house', 'Coffee'];
  const state = (inputValue: string) => ({
    inputValue,
    getOptionLabel: (option: string) => option,
  });

  it('matches case- and accent-insensitively anywhere in the label by default', () => {
    const filter = createFilterOptions<string>();
    expect(filter(options, state('cafe'))).toEqual(['Café', 'Cafeteria']);
    expect(filter(options, state('FEE'))).toEqual(['Coffee']);
  });

  it('returns every option for empty input', () => {
    const filter = createFilterOptions<string>();
    expect(filter(options, state(''))).toEqual(options);
  });

  it('honours matchType "start"', () => {
    const filter = createFilterOptions<string>({ matchType: 'start' });
    expect(filter(options, state('cafe'))).toEqual(['Café', 'Cafeteria']);
    expect(filter(options, state('fee'))).toEqual([]);
  });

  it('caps the result at limit, including when input is empty', () => {
    const filter = createFilterOptions<string>({ limit: 2 });
    expect(filter(options, state(''))).toEqual(['Café', 'Cafeteria']);
    expect(filter(options, state('e'))).toHaveLength(2);
  });

  it('only trims input when asked to', () => {
    expect(createFilterOptions<string>()(options, state('  cafe  '))).toEqual(
      []
    );
    expect(
      createFilterOptions<string>({ trim: true })(options, state('  cafe  '))
    ).toEqual(['Café', 'Cafeteria']);
  });

  it('can be made case- and accent-sensitive', () => {
    const filter = createFilterOptions<string>({
      ignoreCase: false,
      ignoreAccents: false,
    });
    expect(filter(options, state('cafe'))).toEqual([]);
    expect(filter(options, state('Cafe'))).toEqual(['Cafeteria']);
  });

  it('searches the stringified option instead of the label', () => {
    type Country = { label: string; code: string };
    const countries: Country[] = [
      { label: 'Ukraine', code: 'UA' },
      { label: 'Poland', code: 'PL' },
    ];
    const filter = createFilterOptions<Country>({
      stringifyOption: (option) => `${option.label} ${option.code}`,
    });
    expect(
      filter(countries, {
        inputValue: 'ua',
        getOptionLabel: (option) => option.label,
      })
    ).toEqual([countries[0]]);
  });
});

describe('defaultGetOptionLabel', () => {
  it('reads a string option as its own label', () => {
    expect(defaultGetOptionLabel('Kyiv')).toBe('Kyiv');
  });

  it('prefers the label property on an object', () => {
    expect(defaultGetOptionLabel({ label: 'Kyiv', id: 1 })).toBe('Kyiv');
  });

  it('falls back to String() when there is no label', () => {
    expect(defaultGetOptionLabel({ id: 1 })).toBe('[object Object]');
    expect(defaultGetOptionLabel(42)).toBe('42');
    expect(defaultGetOptionLabel(null)).toBe('null');
  });
});

describe('calculateNextIndex', () => {
  const base = {
    total: 4,
    autoHighlight: false,
    disableListWrap: false,
    includeInputInList: false,
  };

  it('resets to the first option only when autoHighlight is on', () => {
    expect(
      calculateNextIndex({ ...base, diff: 'reset', currentIndex: 2 })
    ).toBe(-1);
    expect(
      calculateNextIndex({
        ...base,
        diff: 'reset',
        currentIndex: 2,
        autoHighlight: true,
      })
    ).toBe(0);
  });

  it('jumps to either end', () => {
    expect(
      calculateNextIndex({ ...base, diff: 'start', currentIndex: 2 })
    ).toBe(0);
    expect(calculateNextIndex({ ...base, diff: 'end', currentIndex: 2 })).toBe(
      3
    );
  });

  it('steps within the list', () => {
    expect(calculateNextIndex({ ...base, diff: 1, currentIndex: 1 })).toBe(2);
    expect(calculateNextIndex({ ...base, diff: -1, currentIndex: 1 })).toBe(0);
  });

  it('wraps around both ends', () => {
    expect(calculateNextIndex({ ...base, diff: -1, currentIndex: 0 })).toBe(3);
    expect(calculateNextIndex({ ...base, diff: 1, currentIndex: 3 })).toBe(0);
  });

  it('clamps instead of wrapping when wrapping is disabled', () => {
    const noWrap = { ...base, disableListWrap: true };
    expect(calculateNextIndex({ ...noWrap, diff: -1, currentIndex: 0 })).toBe(
      0
    );
    expect(calculateNextIndex({ ...noWrap, diff: 1, currentIndex: 3 })).toBe(3);
  });

  it('returns to the input at either edge when the input is part of the list', () => {
    const withInput = { ...base, includeInputInList: true };
    expect(
      calculateNextIndex({ ...withInput, diff: -1, currentIndex: 0 })
    ).toBe(-1);
    expect(calculateNextIndex({ ...withInput, diff: 1, currentIndex: 3 })).toBe(
      -1
    );
  });

  it('clamps a multi-step jump rather than wrapping it', () => {
    expect(calculateNextIndex({ ...base, diff: 5, currentIndex: 0 })).toBe(3);
    expect(calculateNextIndex({ ...base, diff: -5, currentIndex: 3 })).toBe(0);
  });
});

describe('findNextValidIndex', () => {
  const filteredOptions = ['a', 'b', 'c', 'd'];
  const disable =
    (...disabled: string[]) =>
    (option: string) =>
      disabled.includes(option);

  it('returns the index itself when the option is enabled', () => {
    expect(
      findNextValidIndex({ index: 1, direction: 'next', filteredOptions })
    ).toBe(1);
  });

  it('skips over disabled options', () => {
    expect(
      findNextValidIndex({
        index: 1,
        direction: 'next',
        filteredOptions,
        getOptionDisabled: disable('b', 'c'),
      })
    ).toBe(3);
  });

  it('wraps while skipping', () => {
    expect(
      findNextValidIndex({
        index: 3,
        direction: 'next',
        filteredOptions,
        getOptionDisabled: disable('d', 'a'),
      })
    ).toBe(1);
    expect(
      findNextValidIndex({
        index: 0,
        direction: 'previous',
        filteredOptions,
        getOptionDisabled: disable('a', 'd'),
      })
    ).toBe(2);
  });

  it('gives up when every option is disabled', () => {
    expect(
      findNextValidIndex({
        index: 0,
        direction: 'next',
        filteredOptions,
        getOptionDisabled: () => true,
      })
    ).toBe(-1);
  });

  it('passes through the "nothing highlighted" index', () => {
    expect(
      findNextValidIndex({ index: -1, direction: 'next', filteredOptions })
    ).toBe(-1);
  });
});
