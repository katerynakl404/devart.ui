import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '../../Tooltip';
import { MetaRow, MetaRowActions, MetaRowCount } from '../index';

// The ✕ sits in a raw Radix tooltip, which throws without a provider.
const renderRow = (ui: ReactNode) =>
  render(<TooltipProvider>{ui}</TooltipProvider>);

describe('MetaRow', () => {
  it('renders its parts with their data-slot markers', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderRow(
      <MetaRow ref={ref}>
        <MetaRowCount>3 selected</MetaRowCount>
        <MetaRowActions>
          <button type="button">Delete</button>
        </MetaRowActions>
      </MetaRow>
    );

    const root = container.querySelector('[data-slot="meta-row"]');
    expect(ref.current).toBe(root);
    expect(screen.getByText('3 selected')).toHaveAttribute(
      'data-slot',
      'meta-row-count'
    );
    expect(screen.getByText('Delete').parentElement).toHaveAttribute(
      'data-slot',
      'meta-row-actions'
    );
  });

  it('renders no ✕ without onClear', () => {
    renderRow(
      <MetaRow>
        <MetaRowCount>5 connections</MetaRowCount>
      </MetaRow>
    );

    expect(
      screen.queryByRole('button', { name: 'Clear selection' })
    ).toBeNull();
  });

  it('renders the ✕ last, labelled, and calls onClear', () => {
    const onClear = vi.fn();
    const { container } = renderRow(
      <MetaRow onClear={onClear} clearLabel="Exit selection">
        <MetaRowCount>3 selected</MetaRowCount>
      </MetaRow>
    );

    const clear = screen.getByRole('button', { name: 'Exit selection' });
    expect(container.querySelector('[data-slot="meta-row"]')?.lastChild).toBe(
      clear
    );
    fireEvent.click(clear);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('sets top only when sticky', () => {
    const { container, rerender } = renderRow(
      <MetaRow stickyOffset="3rem" style={{ color: 'red' }} />
    );
    const root = () =>
      container.querySelector<HTMLElement>('[data-slot="meta-row"]');

    expect(root()?.style.top).toBe('');
    expect(root()?.style.color).toBe('red');

    rerender(
      <TooltipProvider>
        <MetaRow sticky stickyOffset="3rem" style={{ color: 'red' }} />
      </TooltipProvider>
    );
    expect(root()?.style.top).toBe('3rem');
    expect(root()?.style.color).toBe('red');

    rerender(
      <TooltipProvider>
        <MetaRow sticky />
      </TooltipProvider>
    );
    expect(root()?.style.top).toBe('0px');
  });
});
