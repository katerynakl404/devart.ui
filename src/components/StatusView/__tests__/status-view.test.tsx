import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusView } from '../index';

const halo = (container: HTMLElement) =>
  container.firstElementChild?.firstElementChild as HTMLElement;

describe('StatusView part sizes', () => {
  it('sizes every part from size when no override is given', () => {
    const { container } = render(<StatusView size="sm" title="Empty" />);

    // This package's `sm` halo is 32px (upstream: `size-10`).
    expect(halo(container)).toHaveClass('size-8');
    expect(screen.getByText('Empty').tagName).toBe('SPAN');
    expect(screen.getByText('Empty').parentElement).toHaveClass('max-w-md');
  });

  it('lets iconSize, titleSize and contentWidth override size per part', () => {
    const { container } = render(
      <StatusView
        size="md"
        iconSize="base"
        titleSize="base"
        contentWidth="sm"
        title="Empty"
      />
    );
    const title = screen.getByText('Empty');

    expect(halo(container)).toHaveClass('size-12', '[&_svg]:size-6');
    // This package's `md` halo is 40px (upstream: `size-14`).
    expect(halo(container)).not.toHaveClass('size-10');
    expect(title.tagName).toBe('SPAN');
    expect(title).toHaveClass('text-base', 'font-semibold');
    expect(title.parentElement).toHaveClass('max-w-sm');
    expect(title.parentElement).not.toHaveClass('max-w-md');
  });

  it('keeps the size-derived title when only the icon is overridden', () => {
    render(<StatusView size="lg" iconSize="sm" title="Empty" />);

    expect(screen.getByText('Empty').tagName).toBe('H3');
  });
});

// This package's extension (DESIGN-SYSTEM-CHANGES §104): the message carries
// a 48ch cap inside the default `md` block, and not inside `sm`, which is
// already that measure.
describe('StatusView message cap', () => {
  it('caps the description at 48ch inside the md block only', () => {
    const { rerender } = render(
      <StatusView title="Empty" description="Nothing here yet." />
    );
    expect(screen.getByText('Nothing here yet.')).toHaveClass('max-w-[48ch]');

    rerender(
      <StatusView
        title="Empty"
        description="Nothing here yet."
        contentWidth="sm"
      />
    );
    expect(screen.getByText('Nothing here yet.')).not.toHaveClass(
      'max-w-[48ch]'
    );
  });
});
