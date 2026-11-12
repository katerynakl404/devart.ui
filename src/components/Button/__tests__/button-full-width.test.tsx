import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../index';

/* `fullWidth` wraps the label in a box of its own, so that it can truncate
   and take an alignment. The box stretches only where that keeps the leading
   icon beside the words — no `leftSlot`, or a left-aligned label. A stretched
   label centred or right-aligned would pin `leftSlot` to the leading edge,
   which is how "+ Add Group or User" came apart on LinkAI's Permissions
   (2026-11-10). The icon always stands beside the text. */
describe('Button — fullWidth and its label box', () => {
  const labelOf = (text: string) => screen.getByText(text);

  it('keeps a leading icon beside the words in a plain centred button', () => {
    render(
      <Button fullWidth leftSlot={<svg data-testid="glyph" />}>
        Add Group or User
      </Button>
    );

    const label = labelOf('Add Group or User');
    expect(label).not.toHaveClass('flex-1');
    expect(label).toHaveClass('min-w-0', 'truncate');
    // The row itself is what centres the pair.
    expect(label.closest('button')).toHaveClass('w-full', 'justify-center');
  });

  it('truncates a long label either way', () => {
    render(<Button fullWidth>A label long enough to need the ellipsis</Button>);

    expect(labelOf('A label long enough to need the ellipsis')).toHaveClass(
      'min-w-0',
      'truncate'
    );
  });

  it('stretches the label when an alignment is asked for', () => {
    render(
      <Button fullWidth align="left" leftSlot={<svg />}>
        Account
      </Button>
    );

    expect(labelOf('Account')).toHaveClass('flex-1', 'text-left');
  });

  it('stretches the label when a rightSlot has to hold the trailing edge', () => {
    render(
      <Button fullWidth rightSlot={<svg data-testid="chevron" />}>
        March 2026
      </Button>
    );

    expect(labelOf('March 2026')).toHaveClass('flex-1');
  });

  it('keeps a leading icon beside centred or right-aligned words', () => {
    render(
      <>
        <Button align="center" fullWidth leftSlot={<svg />}>
          Centred
        </Button>
        <Button align="right" fullWidth leftSlot={<svg />}>
          Right
        </Button>
      </>
    );

    expect(labelOf('Centred')).not.toHaveClass('flex-1');
    expect(labelOf('Right')).not.toHaveClass('flex-1');
  });

  it('keeps a leading icon beside the words next to a rightSlot', () => {
    render(
      <Button fullWidth leftSlot={<svg />} rightSlot={<svg />}>
        Account
      </Button>
    );

    expect(labelOf('Account')).not.toHaveClass('flex-1');
  });

  it('keeps the spinner beside the words while loading', () => {
    render(
      <Button align="center" fullWidth isLoading>
        Saving
      </Button>
    );

    expect(labelOf('Saving')).not.toHaveClass('flex-1');
  });

  it('gives a button that is not fullWidth no label box at all', () => {
    render(
      <Button leftSlot={<svg />}>
        <span data-testid="own-label">Add Group or User</span>
      </Button>
    );

    // The label's only parent is the button: nothing was wrapped around it.
    expect(screen.getByTestId('own-label').parentElement?.tagName).toBe(
      'BUTTON'
    );
  });
});
