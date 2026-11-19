import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusMark } from '../index';

const mark = (container: HTMLElement) =>
  container.querySelector('[data-slot="status-mark"]') as HTMLElement;

describe('StatusMark', () => {
  /** Decoration, always: the words beside it carry the meaning. */
  it('is hidden from assistive tech and takes no focus', () => {
    const { container } = render(<StatusMark variant="error" />);

    expect(mark(container)).toHaveAttribute('aria-hidden');
    expect(mark(container)).not.toHaveAttribute('tabindex');
  });

  it('paints the tone it is given', () => {
    const { container } = render(<StatusMark variant="warning" />);

    expect(mark(container)).toHaveClass('text-fb-attention');
  });

  /** Only the neutral note steps up, and only inside `IconHint`'s button. */
  it('takes the hover step only when interactive and neutral', () => {
    const { container: standalone } = render(<StatusMark />);
    const { container: inHint } = render(<StatusMark interactive />);
    const { container: state } = render(
      <StatusMark interactive variant="error" />
    );

    expect(mark(standalone)).not.toHaveClass(
      'group-hover/icon-hint:text-ink-icon-hover'
    );
    expect(mark(inHint)).toHaveClass(
      'group-hover/icon-hint:text-ink-icon-hover'
    );
    expect(mark(state)).not.toHaveClass(
      'group-hover/icon-hint:text-ink-icon-hover'
    );
  });
});
