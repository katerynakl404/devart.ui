import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '../../Tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSegmentedItem,
  type DropdownMenuSegmentedItemProps,
  DropdownMenuTrigger,
} from '../index';

/** An open menu, so the items are in the document from the first render. */
const Menu = ({
  children,
  onOpenChange,
}: {
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
}) => (
  <TooltipProvider>
    <DropdownMenu onOpenChange={onOpenChange} open>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>
  </TooltipProvider>
);

const arrow = (element: HTMLElement) =>
  element.querySelector('[data-slot="dropdown-menu-item-external"]');

describe('DropdownMenuItem', () => {
  it('marks an external row with the arrow and the spoken note', () => {
    render(
      <Menu>
        <DropdownMenuItem isExternal>Resources</DropdownMenuItem>
      </Menu>
    );

    const item = screen.getByRole('menuitem', {
      name: /^Resources\s*\(opens in new tab\)$/,
    });
    expect(arrow(item)).not.toBeNull();
  });

  /** The link carries the target; the row only says where it goes. */
  it('injects the arrow and the note into the caller’s link', () => {
    render(
      <Menu>
        <DropdownMenuItem asChild isExternal>
          <a href="https://example.com" rel="noopener" target="_blank">
            Resources
          </a>
        </DropdownMenuItem>
      </Menu>
    );

    const link = screen.getByRole('menuitem', { name: /^Resources/ });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('target', '_blank');
    expect(arrow(link)).not.toBeNull();
    expect(link).toHaveTextContent('(opens in new tab)');
  });

  it('leaves an ordinary row’s children alone', () => {
    render(
      <Menu>
        <DropdownMenuItem asChild>
          <a href="/settings">Settings</a>
        </DropdownMenuItem>
      </Menu>
    );

    const link = screen.getByRole('menuitem', { name: 'Settings' });
    expect(link.tagName).toBe('A');
    expect(arrow(link)).toBeNull();
  });
});

describe('DropdownMenuSegmentedItem', () => {
  const OPTIONS = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  const setup = (props: Partial<DropdownMenuSegmentedItemProps> = {}) => {
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Menu onOpenChange={onOpenChange}>
        <DropdownMenuSegmentedItem
          defaultValue="light"
          label="Theme"
          onValueChange={onValueChange}
          options={OPTIONS}
          {...props}
        />
      </Menu>
    );
    const item = screen.getByRole('menuitem', { name: /^Theme/ });
    return { item, onValueChange, onOpenChange };
  };

  /** The segments are hidden; the row is what assistive technology reads. */
  it('is one item, named by its label and value, described by its keys', () => {
    const { item } = setup();

    expect(item).toHaveAccessibleName(/^Theme\s*: Light$/);
    expect(item).toHaveAccessibleDescription(
      'Left and right arrows change it.'
    );
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
  });

  it('steps with the arrows and wraps at both ends', () => {
    const { item, onValueChange } = setup();

    fireEvent.keyDown(item, { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenLastCalledWith('dark');
    expect(item).toHaveAccessibleName(/: Dark$/);

    fireEvent.keyDown(item, { key: 'ArrowLeft' });
    fireEvent.keyDown(item, { key: 'ArrowLeft' });
    expect(onValueChange).toHaveBeenLastCalledWith('system');

    fireEvent.keyDown(item, { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenLastCalledWith('light');
  });

  /** A setting is adjusted and watched, not chosen once and dismissed. */
  it('steps on Enter and Space and leaves the menu open', () => {
    const { item, onValueChange, onOpenChange } = setup();

    fireEvent.keyDown(item, { key: 'Enter' });
    expect(onValueChange).toHaveBeenLastCalledWith('dark');
    fireEvent.keyDown(item, { key: ' ' });
    expect(onValueChange).toHaveBeenLastCalledWith('system');

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('menuitem', { name: /^Theme/ })).toBeVisible();
  });

  /**
   * A press on a segment must stop at the control. Let it reach the row and
   * the row takes it as "select the item" and steps once more.
   */
  it('takes a press on a segment as that segment, not as a step', () => {
    const { onValueChange, onOpenChange } = setup();
    const segment = screen.getByRole('tab', { hidden: true, name: 'System' });

    fireEvent.pointerDown(segment, { button: 0 });
    fireEvent.mouseDown(segment, { button: 0 });
    fireEvent.pointerUp(segment, { button: 0 });
    fireEvent.mouseUp(segment, { button: 0 });
    fireEvent.click(segment);

    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith('system');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('changes nothing while disabled', () => {
    const { item, onValueChange } = setup({ disabled: true });

    fireEvent.keyDown(item, { key: 'ArrowRight' });
    fireEvent.mouseDown(
      screen.getByRole('tab', { hidden: true, name: 'Dark' }),
      { button: 0 }
    );
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
