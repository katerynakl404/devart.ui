import {
  act,
  fireEvent,
  render as rtlRender,
  screen,
} from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DropdownMenuItem } from '../../DropdownMenu';
import { TooltipProvider } from '../../Tooltip';
import { RowMenuButton } from '../index';

// The row menu's trigger carries a Tooltip, and every Tooltip needs a provider above it.
const render = (
  ui: Parameters<typeof rtlRender>[0],
  options?: Parameters<typeof rtlRender>[1]
) => rtlRender(ui, { wrapper: TooltipProvider, ...options });

// By label rather than by role: an open modal menu marks everything outside it
// `aria-hidden`, and the trigger has to stay reachable while it is open.
const trigger = (name = 'More actions') => screen.getByLabelText(name);
const item = (name: string) => screen.getByText(name);

/** Enter is the one path that opens a Radix menu without pointer events. */
const openWithKeyboard = () => fireEvent.keyDown(trigger(), { key: 'Enter' });

/** Radix hands focus back after the menu unmounts, on a zero timeout. */
const flushFocusHandBack = () =>
  act(() => new Promise((resolve) => setTimeout(resolve, 0)));

describe('RowMenuButton', () => {
  it('names the trigger "More actions" unless told otherwise', () => {
    const { rerender } = render(
      <RowMenuButton>
        <DropdownMenuItem>Rename</DropdownMenuItem>
      </RowMenuButton>
    );
    expect(trigger().tagName).toBe('BUTTON');

    rerender(
      <RowMenuButton aria-label="More actions for Q1 revenue">
        <DropdownMenuItem>Rename</DropdownMenuItem>
      </RowMenuButton>
    );
    expect(trigger('More actions for Q1 revenue').tagName).toBe('BUTTON');
  });

  /**
   * The reveal is a class contract with the row's `group/row`. The phone and
   * no-hover overrides are what keep the menu reachable without a pointer that
   * hovers, so they are asserted alongside the fade itself.
   */
  it('fades in from the row, and shows at rest where nothing hovers', () => {
    render(
      <RowMenuButton>
        <DropdownMenuItem>Rename</DropdownMenuItem>
      </RowMenuButton>
    );

    expect(trigger()).toHaveClass(
      'opacity-0',
      'group-hover/row:opacity-100',
      'group-focus-within/row:opacity-100',
      'aria-expanded:opacity-100',
      'max-md:opacity-100',
      '[@media(hover:none)]:opacity-100'
    );
  });

  it('shows at rest with reveal={false}', () => {
    render(
      <RowMenuButton reveal={false}>
        <DropdownMenuItem>Rename</DropdownMenuItem>
      </RowMenuButton>
    );

    expect(trigger()).not.toHaveClass('opacity-0');
  });

  it('opens the menu and runs the chosen item', () => {
    const onRename = vi.fn();
    render(
      <RowMenuButton>
        <DropdownMenuItem onSelect={onRename}>Rename</DropdownMenuItem>
      </RowMenuButton>
    );

    openWithKeyboard();
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(item('Rename'));
    expect(onRename).toHaveBeenCalledOnce();
  });

  /**
   * The menu is portalled out of the row in the DOM but not in React, so an
   * item's click would otherwise reach the row's own `onClick`.
   */
  it('keeps its clicks and keys away from the row it sits in', () => {
    const onRowClick = vi.fn();
    const onRowKeyDown = vi.fn();
    render(
      <div onClick={onRowClick} onKeyDown={onRowKeyDown}>
        <RowMenuButton>
          <DropdownMenuItem>Rename</DropdownMenuItem>
        </RowMenuButton>
      </div>
    );

    fireEvent.click(trigger());
    openWithKeyboard();
    fireEvent.keyDown(item('Rename'), { key: 'ArrowDown' });
    fireEvent.click(item('Rename'));

    expect(onRowClick).not.toHaveBeenCalled();
    expect(onRowKeyDown).not.toHaveBeenCalled();
  });

  it('hands focus back to the trigger when the menu closes from the keyboard', async () => {
    render(
      <RowMenuButton>
        <DropdownMenuItem>Rename</DropdownMenuItem>
      </RowMenuButton>
    );

    trigger().focus();
    openWithKeyboard();
    fireEvent.keyDown(item('Rename'), { key: 'Escape' });
    await flushFocusHandBack();

    expect(trigger()).toHaveFocus();
  });

  /**
   * Rename opens a field in the row and focuses it (a tick later, as
   * `InlineRename` does — see there). The hand-back that follows the menu's
   * exit must not pull focus out of it: a field that commits on blur would
   * close the moment it opened.
   */
  it('leaves focus where an item moved it', async () => {
    const Row = () => {
      const field = useRef<HTMLInputElement>(null);
      return (
        <div>
          <input aria-label="Name" ref={field} />
          <RowMenuButton>
            <DropdownMenuItem
              onSelect={() => setTimeout(() => field.current?.focus(), 0)}
            >
              Rename
            </DropdownMenuItem>
          </RowMenuButton>
        </div>
      );
    };
    render(<Row />);

    trigger().focus();
    openWithKeyboard();
    fireEvent.keyDown(item('Rename'), { key: 'Enter' });
    await flushFocusHandBack();

    expect(screen.getByLabelText('Name')).toHaveFocus();
  });
});
