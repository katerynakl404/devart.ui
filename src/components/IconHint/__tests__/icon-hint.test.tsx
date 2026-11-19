import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TooltipProvider } from '../../Tooltip';
import { IconHint } from '../index';

const LABEL = 'About Finance warehouse';

const renderHint = () =>
  render(
    <TooltipProvider delayDuration={0}>
      <IconHint label={LABEL} tooltip={LABEL} />
    </TooltipProvider>
  );

const getHint = () => screen.getByRole('img', { name: LABEL });

describe('IconHint', () => {
  /** Not a control: on a desktop nothing here is clickable, and it must not
   *  read or look like it. Focus is the keyboard's hover. */
  it('is a named glyph the keyboard can reach, not a control', () => {
    renderHint();

    expect(getHint().tagName).toBe('SPAN');
    expect(getHint()).toHaveAttribute('tabindex', '0');
  });

  it('hides its glyph from assistive tech — the hint carries the name', () => {
    const { container } = renderHint();

    expect(
      container.querySelector('[data-slot="status-mark"]')
    ).toHaveAttribute('aria-hidden');
  });

  /** Touch is `Tooltip`'s job, not this component's — see
   *  `Tooltip/__tests__/tooltip-touch.test.tsx`. */
  it('carries no rule of its own about the pointer', () => {
    renderHint();

    expect(getHint()).not.toHaveAttribute('onclick');
  });
});
