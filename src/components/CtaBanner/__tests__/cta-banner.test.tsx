import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { cn } from '../../../lib/utils';
import { buttonVariants } from '../../Button';
import { CtaBanner, type CtaBannerProps } from '../index';

const renderBanner = (overrides: Partial<CtaBannerProps> = {}) => {
  const onClick = vi.fn();
  const view = render(
    <CtaBanner
      title="Connect your first data source"
      description="Link a warehouse or file to start building metrics."
      ctaLabel="Connect source"
      onClick={onClick}
      {...overrides}
    />
  );
  const button = screen.getByRole('button', { name: 'Connect source' });
  const action = button.closest('[data-slot="banner-action"]');
  return { ...view, onClick, button, action };
};

describe('CtaBanner', () => {
  it('names the button with ctaLabel and hands its click to onClick', () => {
    const { onClick, button } = renderBanner();

    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders the button in the Banner action slot, primary and small by default', () => {
    const { button, action } = renderBanner();

    expect(action).not.toBeNull();
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveClass(
      ...cn(buttonVariants({ variant: 'primary', size: 'sm' })).split(' ')
    );
  });

  it('keeps the button small whatever actionVariant is', () => {
    const { button } = renderBanner({ actionVariant: 'secondary' });

    expect(button).toHaveAttribute('data-variant', 'secondary');
    expect(button).toHaveClass(
      ...cn(buttonVariants({ variant: 'secondary', size: 'sm' })).split(' ')
    );
  });

  it.each([
    'horizontalWide',
    'diagonalAiry',
  ] as const)('lets Banner repaint the button on %s', (variant) => {
    const { action } = renderBanner({ variant });

    expect(action).toHaveClass('[&_button]:bg-banner-grad-text');
    expect(action).toHaveClass('[&_button]:text-banner-grad-btn-text');
  });

  it.each([
    'default',
    'diagonalFade',
    'horizontalSlab',
  ] as const)('leaves the button its own colours on %s', (variant) => {
    const { action } = renderBanner({ variant });

    expect(action).not.toHaveClass('[&_button]:bg-banner-grad-text');
  });

  it('passes title, description and className through, and ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderBanner({ className: 'custom-banner', ref });

    expect(
      screen.getByText('Connect your first data source')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Link a warehouse or file to start building metrics.')
    ).toBeInTheDocument();
    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current).toHaveClass('custom-banner');
  });
});
