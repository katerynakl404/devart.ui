import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { TextArea } from '../index';

const getTextArea = () => screen.getByRole<HTMLTextAreaElement>('textbox');

const ControlledTextArea = () => {
  const [value, setValue] = useState('abc');

  return (
    <TextArea
      showCount
      maxLength={10}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
    />
  );
};

describe('TextArea', () => {
  it('renders a bare textarea without a counter by default', () => {
    const { container } = render(
      <TextArea maxLength={10} defaultValue="hello" />
    );

    expect(container.firstElementChild?.tagName).toBe('TEXTAREA');
    expect(screen.queryByText('5 / 10')).toBeNull();
  });

  it('counts typed characters against maxLength and keeps the native cap', () => {
    render(<TextArea showCount maxLength={10} />);

    expect(screen.getByText('0 / 10')).toBeTruthy();

    fireEvent.input(getTextArea(), { target: { value: 'hello' } });

    expect(screen.getByText('5 / 10')).toBeTruthy();
    expect(getTextArea().getAttribute('maxlength')).toBe('10');
  });

  it('uses maxLength for the counter only under softLimit', () => {
    render(
      <TextArea
        showCount
        softLimit
        maxLength={10}
        defaultValue={'a'.repeat(12)}
      />
    );

    expect(getTextArea().hasAttribute('maxlength')).toBe(false);
    expect(screen.getByText('12 / 10')).toBeTruthy();
  });

  it('shows the bare count without a maxLength', () => {
    render(<TextArea showCount defaultValue="hello" />);

    expect(screen.getByText('5')).toBeTruthy();
  });

  it('renders the counter without a label or an error', () => {
    render(<TextArea showCount />);

    expect(screen.getByText('0')).toBeTruthy();
  });

  it('follows the value of a controlled field', () => {
    const { rerender } = render(
      <TextArea showCount maxLength={10} value="abc" onChange={() => {}} />
    );

    expect(screen.getByText('3 / 10')).toBeTruthy();

    rerender(
      <TextArea showCount maxLength={10} value="abcdef" onChange={() => {}} />
    );

    expect(screen.getByText('6 / 10')).toBeTruthy();
  });

  /** The count must not pre-empt the consumer's onChange on a controlled field. */
  it('lets a controlled field accept input and counts it', () => {
    render(<ControlledTextArea />);

    fireEvent.input(getTextArea(), { target: { value: 'abcdef' } });

    expect(getTextArea().value).toBe('abcdef');
    expect(screen.getByText('6 / 10')).toBeTruthy();
  });

  it('starts from defaultValue on an uncontrolled field', () => {
    render(<TextArea showCount maxLength={10} defaultValue="abcd" />);

    expect(screen.getByText('4 / 10')).toBeTruthy();
  });

  /** react-hook-form's register() writes the default value from its ref callback. */
  it('picks up a value written by the ref callback', () => {
    render(
      <TextArea
        showCount
        maxLength={10}
        ref={(node) => {
          if (node) {
            node.value = 'abc';
          }
        }}
      />
    );

    expect(screen.getByText('3 / 10')).toBeTruthy();
  });

  /** reset() and setValue() change the node without an input event. */
  it('re-reads a value changed on the node once the field re-renders', () => {
    const { rerender } = render(
      <TextArea showCount maxLength={10} defaultValue="hello" />
    );

    getTextArea().value = '';
    rerender(<TextArea showCount maxLength={10} defaultValue="hello" />);

    expect(screen.getByText('0 / 10')).toBeTruthy();
  });

  it.each([
    [8, 'text-ink-inactive'],
    [10, 'text-ink-inactive'],
    [11, 'text-fb-red-text'],
  ])('colours %i of 10 characters with %s', (length, colorClass) => {
    render(
      <TextArea
        showCount
        softLimit
        maxLength={10}
        defaultValue={'a'.repeat(length)}
      />
    );

    expect(screen.getByText(`${length} / 10`).className).toContain(colorClass);
  });

  it('keeps the counter inactive while the field is disabled', () => {
    render(
      <TextArea
        showCount
        softLimit
        disabled
        maxLength={10}
        defaultValue={'a'.repeat(11)}
      />
    );

    expect(screen.getByText('11 / 10').className).toContain(
      'text-ink-inactive'
    );
  });

  describe('aria-describedby', () => {
    it('is omitted when there is nothing to describe', () => {
      render(<TextArea />);

      expect(getTextArea().hasAttribute('aria-describedby')).toBe(false);
    });

    /** A live counter would be announced on every keystroke. */
    it('points at the counter without a live region', () => {
      render(<TextArea showCount maxLength={10} />);

      const counter = screen.getByText('0 / 10');

      expect(counter.id).not.toBe('');
      expect(getTextArea().getAttribute('aria-describedby')).toBe(counter.id);
      expect(counter.hasAttribute('aria-live')).toBe(false);
    });

    it('points at the error text, not the label', () => {
      render(<TextArea label="Definition" isInvalid errorText="Too long" />);

      const errorText = screen.getByText('Too long');
      const label = screen.getByText('Definition');

      expect(errorText.id).not.toBe('');
      expect(getTextArea().getAttribute('aria-describedby')).toBe(errorText.id);
      expect(label.hasAttribute('id')).toBe(false);
      expect(label.hasAttribute('aria-live')).toBe(false);
    });

    it('points at the error text without a label or an id', () => {
      render(<TextArea isInvalid errorText="Too long" />);

      const describedBy = getTextArea().getAttribute('aria-describedby') ?? '';

      expect(describedBy).not.toContain('undefined');
      expect(document.getElementById(describedBy)?.textContent).toBe(
        'Too long'
      );
    });

    it('joins the error and the counter when both are present', () => {
      render(
        <TextArea showCount maxLength={10} isInvalid errorText="Too long" />
      );

      const errorId = screen.getByText('Too long').id;
      const counterId = screen.getByText('0 / 10').id;

      expect(getTextArea().getAttribute('aria-describedby')).toBe(
        `${errorId} ${counterId}`
      );
    });

    it('keeps a caller-supplied id ahead of its own ids', () => {
      render(
        <TextArea
          showCount
          maxLength={10}
          isInvalid
          errorText="Too long"
          aria-describedby="hint"
        />
      );

      const errorId = screen.getByText('Too long').id;
      const counterId = screen.getByText('0 / 10').id;

      expect(getTextArea().getAttribute('aria-describedby')).toBe(
        `hint ${errorId} ${counterId}`
      );
    });
  });
});
