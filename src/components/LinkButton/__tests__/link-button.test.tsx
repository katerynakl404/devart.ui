import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { LinkButton } from '../index';

describe('LinkButton', () => {
  it('renders a link and points ref at it when href is given', () => {
    const ref = createRef<HTMLElement>();
    render(
      <LinkButton ref={ref} href="/permissions">
        Permissions
      </LinkButton>
    );

    const link = screen.getByRole('link', { name: 'Permissions' });
    expect(ref.current).toBe(link);
    expect(link).toHaveAttribute('data-slot', 'link-button');
  });

  it('renders a button of type="button" and points ref at it when there is no href', () => {
    const ref = createRef<HTMLElement>();
    render(<LinkButton ref={ref}>Select all</LinkButton>);

    const button = screen.getByRole('button', { name: 'Select all' });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-slot', 'link-button');
  });

  it('does not call onClick on a disabled button', () => {
    const onClick = vi.fn();
    render(
      <LinkButton disabled onClick={onClick}>
        Select all
      </LinkButton>
    );

    const button = screen.getByRole('button', { name: 'Select all' });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('cancels the click on a disabled link and marks it aria-disabled', () => {
    const onClick = vi.fn();
    render(
      <LinkButton disabled href="/permissions" onClick={onClick}>
        Permissions
      </LinkButton>
    );

    const link = screen.getByRole('link', { name: 'Permissions' });
    expect(link).toHaveAttribute('aria-disabled', 'true');

    const event = createEvent.click(link);
    fireEvent(link, event);
    expect(event.defaultPrevented).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders the child element with asChild, keeping slot order', () => {
    const ref = createRef<HTMLElement>();
    render(
      <LinkButton
        asChild
        ref={ref}
        className="extra"
        leftSlot={<i data-testid="left" />}
        rightSlot={<i data-testid="right" />}
      >
        <a href="/scopes">how scopes work</a>
      </LinkButton>
    );

    const link = screen.getByRole('link', { name: 'how scopes work' });
    expect(ref.current).toBe(link);
    expect(link).toHaveAttribute('data-slot', 'link-button');
    expect(link).toHaveClass('extra', 'text-ink-highlight');
    expect(link.firstChild).toBe(screen.getByTestId('left'));
    expect(link.lastChild).toBe(screen.getByTestId('right'));
  });
});
