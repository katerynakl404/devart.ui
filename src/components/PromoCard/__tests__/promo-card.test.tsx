import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { PromoCard } from '../index';

describe('PromoCard', () => {
  it('points ref at the link when href is given', () => {
    const ref = createRef<HTMLElement>();
    render(<PromoCard ref={ref} title="Upgrade to Pro" href="/plan" />);

    expect(ref.current?.tagName).toBe('A');
    ref.current?.focus();
    expect(ref.current).toHaveFocus();
  });

  it('points ref at the button when there is no href', () => {
    const ref = createRef<HTMLElement>();
    render(<PromoCard ref={ref} title="Upgrade to Pro" />);

    expect(ref.current?.tagName).toBe('BUTTON');
    ref.current?.focus();
    expect(ref.current).toHaveFocus();
  });
});
