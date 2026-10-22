/**
 * The fork's extensions on top of the developers' TextArea: `hintText` and
 * `wrapperClassName`. Kept apart from `text-area.test.tsx`, which is theirs.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextArea } from '../index';

const getTextArea = () => screen.getByRole<HTMLTextAreaElement>('textbox');

describe('TextArea hintText', () => {
  it('renders the hint without a label, an error or a counter', () => {
    render(<TextArea hintText="No personal data" />);

    const hint = screen.getByText('No personal data');

    expect(getTextArea().getAttribute('aria-describedby')).toBe(hint.id);
  });

  it('shares the row with the counter', () => {
    render(<TextArea hintText="No personal data" showCount maxLength={10} />);

    const hint = screen.getByText('No personal data');
    const counter = screen.getByText('0 / 10');

    expect(hint.parentElement).toBe(counter.parentElement);
    expect(getTextArea().getAttribute('aria-describedby')).toBe(
      `${hint.id} ${counter.id}`
    );
  });

  it('yields its half of the row to the error', () => {
    render(
      <TextArea
        hintText="No personal data"
        isInvalid
        errorText="Too long"
        showCount
        maxLength={10}
      />
    );

    const errorId = screen.getByText('Too long').id;
    const counterId = screen.getByText('0 / 10').id;

    expect(screen.queryByText('No personal data')).toBeNull();
    expect(getTextArea().getAttribute('aria-describedby')).toBe(
      `${errorId} ${counterId}`
    );
  });
});

describe('TextArea wrapperClassName', () => {
  it('lands on the wrapper, not on the field', () => {
    const { container } = render(
      <TextArea label="Notes" wrapperClassName="w-[360px]" />
    );

    expect(container.firstElementChild?.className).toContain('w-[360px]');
    expect(getTextArea().className).not.toContain('w-[360px]');
  });
});
