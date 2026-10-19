import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ToastProgress } from '../ToastMessage/ToastProgress';

describe('ToastProgress', () => {
  /**
   * The bar is a CSS transition, not a timer: it must paint at full width
   * first, then be told to go to zero on the next frame. Setting both in the
   * same paint gives the browser nothing to animate from and the bar simply
   * appears empty.
   */
  it('starts full and only then runs down to empty', async () => {
    const { container } = render(
      <ToastProgress progressColor="bg-fb-green" duration={4000} />
    );
    const bar = container.firstElementChild as HTMLElement;

    expect(bar.style.width).toBe('100%');

    await waitFor(() => expect(bar.style.width).toBe('0%'));
  });

  it('runs for exactly the duration it was given', () => {
    const { container } = render(
      <ToastProgress progressColor="bg-fb-green" duration={1500} />
    );
    const bar = container.firstElementChild as HTMLElement;

    expect(bar.style.transition).toBe('width 1500ms linear');
  });

  it('keeps the colour it was handed', () => {
    const { container } = render(
      <ToastProgress progressColor="bg-fb-red" duration={4000} />
    );

    expect(container.firstElementChild).toHaveClass('bg-fb-red');
  });
});
