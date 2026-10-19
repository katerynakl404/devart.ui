import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '../../Tooltip';
import { ListSelectionBar, type ListSelectionBarProps } from '../index';

const baseProps: ListSelectionBarProps = {
  title: '24 files',
  selectedText: '3 selected',
  isPending: false,
  selectedCount: 0,
  allSelected: false,
  onClearSelection: () => {},
};

// The exit control sits in a raw Radix tooltip, which throws without a provider.
const renderBar = (overrides: Partial<ListSelectionBarProps> = {}) =>
  render(
    <TooltipProvider>
      <ListSelectionBar {...baseProps} {...overrides} />
    </TooltipProvider>
  );

const linkButton = (name: string) => screen.getByRole('button', { name });
const exitButton = () =>
  screen.queryByRole('button', { name: 'Exit selection' });

describe('ListSelectionBar', () => {
  it('shows the title and offers to select all while nothing is selected', () => {
    const onSelectAll = vi.fn();
    const onClearSelection = vi.fn();
    renderBar({ onSelectAll, onClearSelection });

    expect(screen.getByText('24 files')).toBeInTheDocument();
    expect(screen.queryByText('3 selected')).toBeNull();
    expect(exitButton()).toBeNull();

    fireEvent.click(linkButton('Select all'));

    expect(onSelectAll).toHaveBeenCalledOnce();
    expect(onClearSelection).not.toHaveBeenCalled();
  });

  it('swaps in the selection caption and the exit control once something is selected', () => {
    const onSelectAll = vi.fn();
    const onClearSelection = vi.fn();
    renderBar({ selectedCount: 3, onSelectAll, onClearSelection });

    expect(screen.getByText('3 selected')).toBeInTheDocument();
    expect(screen.queryByText('24 files')).toBeNull();

    fireEvent.click(linkButton('Select all'));
    expect(onSelectAll).toHaveBeenCalledOnce();

    const exit = exitButton();
    expect(exit).not.toBeNull();
    fireEvent.click(exit as HTMLElement);
    expect(onClearSelection).toHaveBeenCalledOnce();
  });

  it('flips the link to deselect all once the whole list is selected', () => {
    const onSelectAll = vi.fn();
    const onClearSelection = vi.fn();
    renderBar({
      selectedCount: 24,
      allSelected: true,
      onSelectAll,
      onClearSelection,
    });

    expect(screen.queryByRole('button', { name: 'Select all' })).toBeNull();

    fireEvent.click(linkButton('Deselect all'));

    expect(onClearSelection).toHaveBeenCalledOnce();
    expect(onSelectAll).not.toHaveBeenCalled();
  });

  /** Zero of zero is "all", yet an empty list must still offer to select. */
  it('ignores allSelected while nothing is selected', () => {
    renderBar({ allSelected: true, isEmpty: true });

    expect(linkButton('Select all')).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Deselect all' })).toBeNull();
  });

  it('disables select-all only when the list is empty and nothing is selected', () => {
    const { unmount } = renderBar({ isEmpty: true });
    expect(linkButton('Select all')).toBeDisabled();
    unmount();

    renderBar({ isEmpty: true, selectedCount: 3 });
    expect(linkButton('Select all')).toBeEnabled();
  });

  it('renders no controls while pending and keeps the caption under the skeleton', () => {
    renderBar({
      isPending: true,
      selectedCount: 3,
      rightSlot: <button type="button">Download</button>,
    });

    expect(screen.queryByRole('button')).toBeNull();
    expect(
      screen.getByText('3 selected').closest('[data-loaded]')
    ).toHaveAttribute('data-loaded', 'false');
  });

  it('renders the caption without a skeleton once loaded', () => {
    renderBar();

    expect(screen.getByText('24 files').closest('[data-loaded]')).toBeNull();
  });

  it('uses the caller’s labels for every control', () => {
    const { rerender } = renderBar({
      selectedCount: 3,
      selectAllLabel: 'Pick all',
      deselectAllLabel: 'Drop all',
      exitSelectionLabel: 'Done',
    });

    expect(linkButton('Pick all')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();

    rerender(
      <TooltipProvider>
        <ListSelectionBar
          {...baseProps}
          selectedCount={24}
          allSelected
          selectAllLabel="Pick all"
          deselectAllLabel="Drop all"
          exitSelectionLabel="Done"
        />
      </TooltipProvider>
    );

    expect(linkButton('Drop all')).toBeInTheDocument();
  });

  describe('sticky', () => {
    const root = (container: HTMLElement) =>
      container.firstChild as HTMLElement;

    it('pins to the top of the scroll container by default', () => {
      const { container } = renderBar({ sticky: true });

      expect(root(container)).toHaveClass('sticky');
      expect(root(container)).toHaveStyle('top: 0');
    });

    it('offsets by the caller’s length', () => {
      const { container } = renderBar({ sticky: true, stickyOffset: '2.5rem' });

      expect(root(container)).toHaveStyle('top: 2.5rem');
    });

    it('sets no offset while not sticky, even when one is passed', () => {
      const { container } = renderBar({ stickyOffset: '2.5rem' });

      expect(root(container)).not.toHaveClass('sticky');
      expect(root(container).style.top).toBe('');
    });
  });

  describe('rightSlot', () => {
    const rightSlot = <button type="button">Download</button>;

    it('shows the slot while nothing is selected', () => {
      renderBar({ rightSlot });

      expect(
        screen.getByRole('button', { name: 'Download' })
      ).toBeInTheDocument();
    });

    it('keeps the slot alongside the exit control while selecting', () => {
      renderBar({ rightSlot, selectedCount: 3 });

      expect(
        screen.getByRole('button', { name: 'Download' })
      ).toBeInTheDocument();
      expect(exitButton()).not.toBeNull();
    });

    it('hides the slot while pending', () => {
      renderBar({ rightSlot, isPending: true });

      expect(screen.queryByRole('button', { name: 'Download' })).toBeNull();
    });
  });
});
