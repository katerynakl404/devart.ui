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

describe('TextArea required', () => {
  it('marks nothing unless asked', () => {
    const { container } = render(<TextArea label="Notes" />);

    expect(container.querySelector('label')?.textContent).toBe('Notes');
    expect(getTextArea()).not.toBeRequired();
  });

  it('adds the asterisk and makes the field required', () => {
    const { container } = render(<TextArea label="Notes" required />);
    const mark = container.querySelector('label span');

    expect(container.querySelector('label')?.textContent).toBe('Notes *');
    expect(mark).toHaveAttribute('aria-hidden', 'true');
    expect(getTextArea()).toBeRequired();
  });
});
