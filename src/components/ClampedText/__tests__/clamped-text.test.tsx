import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ClampedText } from '../index';

describe('ClampedText', () => {
  it('lets a word longer than the line break, so the clamp can count it', () => {
    const word = '412'.repeat(40);
    render(<ClampedText text={word} />);

    expect(screen.getByText(word)).toHaveClass('[overflow-wrap:anywhere]');
  });

  it('clamps to the number of lines asked for', () => {
    render(<ClampedText text="A description." lines={2} />);

    expect(screen.getByText('A description.')).toHaveClass('line-clamp-2');
  });
});
