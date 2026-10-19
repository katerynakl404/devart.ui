import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AsyncList } from '../index';

/** Attribute match, so the slash in `group/list` needs no CSS escaping. */
const listContainer = (root: HTMLElement) =>
  root.querySelector('[class*="group/list"]');

const ITEMS = ['a', 'b', 'c'];

const baseProps = {
  isLoading: false,
  isLoadingNextPage: false,
  loadingContent: <span>loading</span>,
  emptyContent: <span>empty</span>,
  renderItem: (item: string) => <div key={item}>{item}</div>,
};

describe('AsyncList', () => {
  it('renders every item by default', () => {
    render(<AsyncList {...baseProps} items={ITEMS} />);

    expect(screen.getAllByText(/^[abc]$/)).toHaveLength(ITEMS.length);
  });

  it('shows the empty state only once loading has finished', () => {
    const { rerender } = render(
      <AsyncList {...baseProps} items={[]} isLoading />
    );

    expect(screen.getByText('loading')).toBeTruthy();
    expect(screen.queryByText('empty')).toBeNull();

    rerender(<AsyncList {...baseProps} items={[]} />);

    expect(screen.getByText('empty')).toBeTruthy();
  });

  it('prefers the error state over the empty state', () => {
    render(
      <AsyncList
        {...baseProps}
        items={[]}
        isError
        errorContent={<span>error</span>}
      />
    );

    expect(screen.getByText('error')).toBeTruthy();
    expect(screen.queryByText('empty')).toBeNull();
  });

  /** A failed refetch must not throw away rows the user is still reading. */
  it('keeps the items when a populated list reports an error', () => {
    render(
      <AsyncList
        {...baseProps}
        items={ITEMS}
        isError
        errorContent={<span>error</span>}
      />
    );

    expect(screen.queryByText('error')).toBeNull();
    expect(screen.getAllByText(/^[abc]$/)).toHaveLength(ITEMS.length);
  });

  it('appends the loading content while the next page arrives', () => {
    render(<AsyncList {...baseProps} items={ITEMS} isLoadingNextPage />);

    expect(screen.getAllByText(/^[abc]$/)).toHaveLength(ITEMS.length);
    expect(screen.getByText('loading')).toBeTruthy();
  });

  /** Empty and error replace the list, so the group contract is absent there. */
  it('omits the list container in the empty state', () => {
    const { container } = render(<AsyncList {...baseProps} items={[]} />);

    expect(listContainer(container)).toBeNull();
  });

  it('marks the container when the caller reports a selection', () => {
    const { container } = render(
      <AsyncList
        {...baseProps}
        items={ITEMS}
        containerProps={{ 'data-has-selection': 'true' }}
      />
    );

    expect(listContainer(container)?.getAttribute('data-has-selection')).toBe(
      'true'
    );
  });

  describe('renderItems', () => {
    it('hands the caller the items and the row renderer', () => {
      const renderItems = vi.fn(() => <span>custom</span>);

      render(
        <AsyncList {...baseProps} items={ITEMS} renderItems={renderItems} />
      );

      expect(renderItems).toHaveBeenCalledExactlyOnceWith(
        ITEMS,
        baseProps.renderItem
      );
      expect(screen.getByText('custom')).toBeTruthy();
    });

    /** Windowing renders a subset — the states around it must not notice. */
    it('lets the caller render a subset without changing the other states', () => {
      render(
        <AsyncList
          {...baseProps}
          items={ITEMS}
          isLoadingNextPage
          renderItems={(items, renderItem) =>
            items.slice(0, 1).map((item, index) => renderItem(item, index))
          }
        />
      );

      expect(screen.getAllByText(/^[abc]$/)).toHaveLength(1);
      expect(screen.getByText('loading')).toBeTruthy();
    });

    it('is ignored while the list is empty', () => {
      const renderItems = vi.fn(() => <span>custom</span>);

      render(<AsyncList {...baseProps} items={[]} renderItems={renderItems} />);

      expect(renderItems).not.toHaveBeenCalled();
      expect(screen.getByText('empty')).toBeTruthy();
    });
  });
});
