import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from '../../Alert';
import { AlertStack } from '../index';

const Unforwarded = () => <Alert variant="error" title="Wrapped" />;

describe('AlertStack', () => {
  it('renders nothing for no notices, and one notice with no control', () => {
    const { container, rerender } = render(<AlertStack>{null}</AlertStack>);
    expect(container).toBeEmptyDOMElement();

    rerender(
      <AlertStack>
        <Alert title="Only" />
      </AlertStack>
    );
    expect(screen.getByText('Only')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('keeps the className on a single notice', () => {
    const { container } = render(
      <AlertStack className="mb-4">
        <Alert title="Only" />
      </AlertStack>
    );
    expect(container.firstChild).toHaveClass('mb-4');
  });

  it('keeps the first notice mounted across open, fold and a second notice arriving', () => {
    const { rerender } = render(
      <AlertStack>
        <Alert title="First" />
      </AlertStack>
    );
    const first = screen.getByText('First');

    rerender(
      <AlertStack>
        <Alert title="First" />
        <Alert title="Second" />
      </AlertStack>
    );
    expect(screen.getByText('First')).toBe(first);

    fireEvent.click(screen.getByRole('button', { name: 'Show 1 more notice' }));
    expect(screen.getByText('First')).toBe(first);

    fireEvent.click(screen.getByRole('button', { name: 'Show Less' }));
    expect(screen.getByText('First')).toBe(first);
  });

  it('puts ref and the rest of the props on the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AlertStack ref={ref} data-testid="stack" aria-label="Notices">
        <Alert title="First" />
        <Alert title="Second" />
      </AlertStack>
    );
    const root = screen.getByTestId('stack');
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('aria-label', 'Notices');
  });

  it('follows a controlled `open` and reports presses through onOpenChange', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <AlertStack open={false} onOpenChange={onOpenChange}>
        <Alert title="First" />
        <Alert title="Second" />
      </AlertStack>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show 1 more notice' }));
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(screen.queryByText('Second')).toBeNull();

    rerender(
      <AlertStack open onOpenChange={onOpenChange}>
        <Alert title="First" />
        <Alert title="Second" />
      </AlertStack>
    );
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('paints a neutral edge for a child that does not pass `variant` on', () => {
    render(
      <AlertStack>
        <Alert variant="warning" title="First" />
        <Unforwarded />
      </AlertStack>
    );
    const edge = screen.getByRole('button', { name: 'Show 1 more notice' });
    expect(edge).toHaveClass('bg-surface-card2');
    expect(edge).not.toHaveClass('bg-alert-bg-error');
  });

  it('counts every notice behind the first, though it draws two edges at most', () => {
    render(
      <AlertStack moreLabel={(n) => `${n} more`}>
        <Alert title="1" />
        <Alert title="2" />
        <Alert title="3" />
        <Alert title="4" />
      </AlertStack>
    );
    expect(screen.getByRole('button', { name: '3 more' })).toBeInTheDocument();
    // The second edge is hidden from the tree; only one button is exposed.
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});
