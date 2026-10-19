import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CardFooter, cardFooterVariants } from '../index';

describe('CardFooter', () => {
  it('is not sticky by default', () => {
    render(<CardFooter>Actions</CardFooter>);

    expect(screen.getByText('Actions')).not.toHaveClass('sticky');
    expect(cardFooterVariants()).not.toMatch(/\bsticky\b/);
  });

  it('sticks to the bottom of the scroller on the card surface with `sticky`', () => {
    render(<CardFooter sticky>Actions</CardFooter>);

    expect(screen.getByText('Actions')).toHaveClass(
      'sticky',
      'bottom-0',
      'z-10',
      'bg-surface-card'
    );
  });

  it('exposes the variant, so a consumer can tell whether its build has it', () => {
    expect(cardFooterVariants({ sticky: true })).toMatch(/\bsticky\b/);
  });

  it('keeps the actions layout alongside sticky', () => {
    render(
      <CardFooter sticky variant="actions">
        Actions
      </CardFooter>
    );

    expect(screen.getByText('Actions')).toHaveClass('justify-end', 'sticky');
  });
});
