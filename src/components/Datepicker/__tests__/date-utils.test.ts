import { describe, expect, it } from 'vitest';
import { formatDateToString, parseStringToDate } from '../date-utils';

describe('formatDateToString', () => {
  it('pads the day and month and fills the placeholders', () => {
    expect(formatDateToString(new Date(2025, 8, 7), 'dd/MM/yyyy')).toBe(
      '07/09/2025'
    );
  });

  it('follows whatever order and separator the format gives', () => {
    const date = new Date(2025, 8, 7);
    expect(formatDateToString(date, 'yyyy-MM-dd')).toBe('2025-09-07');
    expect(formatDateToString(date, 'MM.dd.yyyy')).toBe('09.07.2025');
  });

  it('keeps two-digit values intact', () => {
    expect(formatDateToString(new Date(2025, 10, 23), 'dd/MM/yyyy')).toBe(
      '23/11/2025'
    );
  });
});

describe('parseStringToDate', () => {
  it('round-trips what formatDateToString produced', () => {
    const date = new Date(2025, 8, 7);
    for (const format of ['dd/MM/yyyy', 'yyyy-MM-dd', 'MM.dd.yyyy']) {
      const parsed = parseStringToDate(
        formatDateToString(date, format),
        format
      );
      expect(parsed?.getTime()).toBe(date.getTime());
    }
  });

  it('accepts unpadded numbers', () => {
    expect(parseStringToDate('7/9/2025', 'dd/MM/yyyy')?.getDate()).toBe(7);
  });

  it('rejects a day the month does not have', () => {
    expect(parseStringToDate('32/01/2025', 'dd/MM/yyyy')).toBeNull();
    expect(parseStringToDate('30/02/2025', 'dd/MM/yyyy')).toBeNull();
  });

  it('accepts a leap day in a leap year', () => {
    expect(parseStringToDate('29/02/2024', 'dd/MM/yyyy')?.getMonth()).toBe(1);
  });

  /**
   * A two-digit year is rejected rather than guessed: `new Date(25, …)` means
   * 1925, which no longer matches what was typed, so the round-trip check that
   * catches invalid days catches this too.
   */
  it('rejects a two-digit year', () => {
    expect(parseStringToDate('07/09/25', 'dd/MM/yyyy')).toBeNull();
  });

  it('rejects anything that is not three numeric parts', () => {
    expect(parseStringToDate('07/09', 'dd/MM/yyyy')).toBeNull();
    expect(parseStringToDate('07/09/2025/11', 'dd/MM/yyyy')).toBeNull();
    expect(parseStringToDate('abc/de/fghi', 'dd/MM/yyyy')).toBeNull();
    expect(parseStringToDate('', 'dd/MM/yyyy')).toBeNull();
  });

  /**
   * The separator is read off the format, so a format without one leaves
   * nothing to split on and every input fails — `ddMMyyyy` is unsupported by
   * construction rather than by accident.
   */
  it('rejects every input when the format has no separator', () => {
    expect(parseStringToDate('07092025', 'ddMMyyyy')).toBeNull();
    expect(parseStringToDate('07/09/2025', 'ddMMyyyy')).toBeNull();
  });

  it('tolerates surrounding whitespace on the numbers', () => {
    expect(parseStringToDate(' 07/09/2025', 'dd/MM/yyyy')?.getDate()).toBe(7);
  });
});
