import { fireEvent, render, screen, within } from '@testing-library/react';
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { FilterChips } from '../index';

// jsdom implements neither API: `ScrollShadow` observes its container with a
// `ResizeObserver`, and `ToggleGroupItem` scrolls every clicked chip into view.
beforeAll(() => {
  Element.prototype.scrollIntoView = () => {};
});

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const ITEMS = [
  { value: 'all', label: 'All', count: 0 },
  { value: 'images', label: 'Images', count: 12 },
  { value: 'documents', label: 'Documents' },
];

/** The count is part of the accessible name, so match on the label prefix. */
const chip = (label: string) =>
  screen.getByRole('radio', { name: new RegExp(`^${label}`) });

describe('FilterChips', () => {
  it('renders one radio per item and checks only the active one', () => {
    render(
      <FilterChips items={ITEMS} value="images" onValueChange={vi.fn()} />
    );

    expect(screen.getAllByRole('radio')).toHaveLength(ITEMS.length);
    expect(chip('Images')).toHaveAttribute('aria-checked', 'true');
    expect(chip('Images')).toHaveAttribute('data-state', 'on');
    expect(chip('All')).toHaveAttribute('aria-checked', 'false');
    expect(chip('All')).toHaveAttribute('data-state', 'off');
  });

  it('shows a count of zero and omits a missing count', () => {
    render(<FilterChips items={ITEMS} value="all" onValueChange={vi.fn()} />);

    expect(within(chip('All')).getByText('0')).toBeInTheDocument();
    expect(within(chip('Images')).getByText('12')).toBeInTheDocument();
    expect(chip('Documents')).toHaveTextContent(/^Documents$/);
  });

  it('reports the value of a clicked inactive chip', () => {
    const onValueChange = vi.fn();
    render(
      <FilterChips items={ITEMS} value="all" onValueChange={onValueChange} />
    );

    fireEvent.click(chip('Documents'));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('documents');
  });

  it('reports an empty value when the active chip is clicked again', () => {
    const onValueChange = vi.fn();
    render(
      <FilterChips items={ITEMS} value="all" onValueChange={onValueChange} />
    );

    fireEvent.click(chip('All'));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('');
  });

  it('keeps the checked chip until the caller passes the new value', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <FilterChips items={ITEMS} value="all" onValueChange={onValueChange} />
    );

    fireEvent.click(chip('Documents'));

    expect(onValueChange).toHaveBeenCalledWith('documents');
    expect(chip('All')).toHaveAttribute('aria-checked', 'true');
    expect(chip('Documents')).toHaveAttribute('aria-checked', 'false');

    rerender(
      <FilterChips
        items={ITEMS}
        value="documents"
        onValueChange={onValueChange}
      />
    );

    expect(chip('All')).toHaveAttribute('aria-checked', 'false');
    expect(chip('Documents')).toHaveAttribute('aria-checked', 'true');
  });
});
