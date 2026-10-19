import { fireEvent, render, screen } from '@testing-library/react';
import { Database, Flame } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { IconCard, IconCardSkeleton } from '../index';

const baseProps = {
  label: 'HubSpot',
  'aria-label': 'Connect HubSpot',
  actionLabel: 'Connect',
  icon: <Database />,
};

const card = () => screen.getByRole('button', { name: 'Connect HubSpot' });

describe('IconCard', () => {
  /**
   * The overlay caption is a styled span, never a nested button: a second
   * control inside `role="button"` is unreachable for assistive technology and
   * a second tab stop for everyone else.
   */
  it('is a single control named by its aria-label', () => {
    render(<IconCard {...baseProps} />);

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(card()).toHaveAttribute('tabindex', '0');
    expect(card()).toHaveAttribute('aria-disabled', 'false');
  });

  it('hides the hover overlay from assistive technology', () => {
    render(<IconCard {...baseProps} />);

    const caption = screen.getByText('Connect');
    expect(caption.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(caption.closest('button')).toBeNull();
  });

  it('activates on click', () => {
    const onActivate = vi.fn();
    render(<IconCard {...baseProps} onActivate={onActivate} />);

    fireEvent.click(card());
    expect(onActivate).toHaveBeenCalledOnce();
  });

  it.each(['Enter', ' '])('activates on %j', (key) => {
    const onActivate = vi.fn();
    render(<IconCard {...baseProps} onActivate={onActivate} />);

    fireEvent.keyDown(card(), { key });
    expect(onActivate).toHaveBeenCalledOnce();
  });

  /** `role="button"` grants no behaviour, so the card itself has to stop Space scrolling the page. */
  it('prevents the default on Space', () => {
    render(<IconCard {...baseProps} onActivate={vi.fn()} />);

    expect(fireEvent.keyDown(card(), { key: ' ' })).toBe(false);
    expect(fireEvent.keyDown(card(), { key: 'Enter' })).toBe(false);
  });

  it('renders the badge beside the icon', () => {
    render(
      <IconCard
        {...baseProps}
        badge={<Flame role="img" aria-label="Popular" />}
      />
    );

    const badge = screen.getByRole('img', { name: 'Popular' });
    const icon = card().querySelector('svg.lucide-database');
    expect(icon).not.toBeNull();
    expect(badge.closest('div')).toContainElement(icon as SVGElement);
  });

  describe('disabled', () => {
    /** Reachable so a tooltip can explain why — the tab order is untouched. */
    it('stays in the tab order but declares itself disabled', () => {
      render(<IconCard {...baseProps} disabled />);

      expect(card()).toHaveAttribute('aria-disabled', 'true');
      expect(card()).toHaveAttribute('tabindex', '0');
    });

    it('ignores every activation path', () => {
      const onActivate = vi.fn();
      render(<IconCard {...baseProps} disabled onActivate={onActivate} />);

      fireEvent.click(card());
      fireEvent.keyDown(card(), { key: 'Enter' });
      fireEvent.keyDown(card(), { key: ' ' });

      expect(onActivate).not.toHaveBeenCalled();
    });

    it('renders no overlay', () => {
      render(<IconCard {...baseProps} disabled />);

      expect(screen.queryByText('Connect')).toBeNull();
    });

    /** Inert is not absent: a focused disabled card must still keep Space from scrolling. */
    it('still swallows Space', () => {
      render(<IconCard {...baseProps} disabled />);

      expect(fireEvent.keyDown(card(), { key: ' ' })).toBe(false);
    });
  });
});

describe('IconCardSkeleton', () => {
  it('forwards className onto the placeholder card', () => {
    const { container } = render(<IconCardSkeleton className="w-32" />);

    expect(container.firstElementChild).toHaveClass('w-32');
    // The fork keeps the kit's fixed 8rem tile height where upstream draws an
    // `aspect-square` box; the skeleton follows the tile.
    expect(container.firstElementChild).toHaveClass('h-32');
  });
});
