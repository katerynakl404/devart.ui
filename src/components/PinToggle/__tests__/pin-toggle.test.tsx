import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '../../Tooltip';
import { PinToggle } from '../index';

// The tooltip is a raw Radix tooltip, which throws without a provider.
const renderWithProvider = (ui: ReactNode) =>
  render(<TooltipProvider>{ui}</TooltipProvider>);

const pin = () => screen.getByRole('button', { name: 'Pin' });

describe('PinToggle', () => {
  it('starts unpinned, and keeps its own state when uncontrolled', () => {
    const onPressedChange = vi.fn();
    renderWithProvider(<PinToggle onPressedChange={onPressedChange} />);

    expect(pin()).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(pin());
    expect(pin()).toHaveAttribute('aria-pressed', 'true');
    expect(onPressedChange).toHaveBeenLastCalledWith(true);

    fireEvent.click(pin());
    expect(pin()).toHaveAttribute('aria-pressed', 'false');
    expect(onPressedChange).toHaveBeenLastCalledWith(false);
  });

  it('follows `pressed` when controlled, and only reports the click', () => {
    const onPressedChange = vi.fn();
    const { rerender } = renderWithProvider(
      <PinToggle pressed={false} onPressedChange={onPressedChange} />
    );

    fireEvent.click(pin());
    expect(onPressedChange).toHaveBeenCalledWith(true);
    // The owner has not said yes yet.
    expect(pin()).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <TooltipProvider>
        <PinToggle pressed onPressedChange={onPressedChange} />
      </TooltipProvider>
    );
    expect(pin()).toHaveAttribute('aria-pressed', 'true');
  });

  /**
   * The name is the control, the pressed state is its value. A name that
   * flipped to "Unpin" would be read as "Unpin, pressed" — a contradiction.
   */
  it('keeps one accessible name in both states', () => {
    renderWithProvider(<PinToggle defaultPressed />);

    expect(pin()).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('button', { name: 'Unpin' })).toBeNull();
  });

  /** The look follows the attribute, so it cannot disagree with it. */
  it('fills and tilts the glyph from aria-pressed, in the brand ink', () => {
    renderWithProvider(<PinToggle defaultPressed />);

    expect(pin()).toHaveClass(
      '[&[aria-pressed=true]_svg]:rotate-[30deg]',
      '[&[aria-pressed=true]_svg]:fill-current'
    );
    expect(pin()).toHaveAttribute('data-variant', 'primaryTertiary');

    fireEvent.click(pin());
    expect(pin()).toHaveAttribute('data-variant', 'tertiary');
  });

  it('stays out of the row it sits in', () => {
    const onRowClick = vi.fn();
    const onRowKeyDown = vi.fn();
    renderWithProvider(
      <div onClick={onRowClick} onKeyDown={onRowKeyDown}>
        <PinToggle />
      </div>
    );

    fireEvent.click(pin());
    fireEvent.keyDown(pin(), { key: 'Enter' });
    fireEvent.keyDown(pin(), { key: ' ' });

    expect(onRowClick).not.toHaveBeenCalled();
    expect(onRowKeyDown).not.toHaveBeenCalled();
  });

  it('does not toggle when the consumer prevents the click', () => {
    const onPressedChange = vi.fn();
    renderWithProvider(
      <PinToggle
        onClick={(event) => event.preventDefault()}
        onPressedChange={onPressedChange}
      />
    );

    fireEvent.click(pin());

    expect(onPressedChange).not.toHaveBeenCalled();
    expect(pin()).toHaveAttribute('aria-pressed', 'false');
  });

  it('takes its labels from the caller', () => {
    renderWithProvider(<PinToggle pinLabel="Pin report" />);

    expect(
      screen.getByRole('button', { name: 'Pin report' })
    ).toBeInTheDocument();
  });
});
