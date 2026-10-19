import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useGroupedOptions } from '../use-grouped-options';

type Item = { id: string; label: string; kind: string };

const items: Item[] = [
  { id: '1', label: 'Kyiv', kind: 'City' },
  { id: '2', label: 'Poland', kind: 'Country' },
  { id: '3', label: 'Lviv', kind: 'City' },
];

const grouped = (filteredOptions: Item[], groupBy?: (option: Item) => string) =>
  renderHook(() => useGroupedOptions({ filteredOptions, groupBy })).result
    .current.groupedOptions;

describe('useGroupedOptions', () => {
  it('passes the list through untouched when there is no groupBy', () => {
    expect(grouped(items)).toBe(items);
  });

  it('collects options into groups, keeping first-seen order', () => {
    const result = grouped(items, (option) => option.kind);
    expect(result).toEqual([
      {
        key: 'City',
        index: 0,
        group: 'City',
        options: [items[0], items[2]],
      },
      { key: 'Country', index: 1, group: 'Country', options: [items[1]] },
    ]);
  });

  /**
   * `index` records where the group *started* in the flat list, not how many
   * groups precede it — the popup uses it to keep keyboard position aligned
   * with the unflattened options.
   */
  it('records the flat index of each group first member', () => {
    const result = grouped(
      [items[1] as Item, items[0] as Item, items[2] as Item],
      (option) => option.kind
    );
    expect(result.map((group) => (group as { index: number }).index)).toEqual([
      0, 1,
    ]);
  });

  it('handles an empty list', () => {
    expect(grouped([], (option) => option.kind)).toEqual([]);
  });
});
