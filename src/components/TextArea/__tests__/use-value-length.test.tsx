import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';
import { useValueLength } from '../use-value-length';

interface HarnessProps {
  enabled: boolean;
  defaultValue?: string;
}

const Harness = ({ enabled, defaultValue = '' }: HarnessProps) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [length, syncLength] = useValueLength(ref, enabled);

  return (
    <>
      <textarea ref={ref} defaultValue={defaultValue} onInput={syncLength} />
      <span data-testid="length">{length}</span>
    </>
  );
};

const getLength = () => Number(screen.getByTestId('length').textContent);
const getTextArea = () => screen.getByRole<HTMLTextAreaElement>('textbox');

describe('useValueLength', () => {
  it('returns 0 when the field is empty', () => {
    render(<Harness enabled />);

    expect(getLength()).toBe(0);
  });

  it('reads the initial value from the node', () => {
    render(<Harness enabled defaultValue="hello" />);

    expect(getLength()).toBe(5);
  });

  it('updates on input', () => {
    render(<Harness enabled />);

    fireEvent.input(getTextArea(), { target: { value: 'abc' } });

    expect(getLength()).toBe(3);
  });

  it('re-reads a value changed on the node once the host re-renders', () => {
    const { rerender } = render(<Harness enabled defaultValue="hello" />);

    getTextArea().value = '';
    rerender(<Harness enabled defaultValue="hello" />);

    expect(getLength()).toBe(0);
  });

  it('ignores input while disabled', () => {
    render(<Harness enabled={false} defaultValue="hello" />);

    expect(getLength()).toBe(0);

    fireEvent.input(getTextArea(), { target: { value: 'abc' } });

    expect(getLength()).toBe(0);
  });

  it('picks up the current value when enabled later', () => {
    const { rerender } = render(
      <Harness enabled={false} defaultValue="hello" />
    );

    expect(getLength()).toBe(0);

    rerender(<Harness enabled defaultValue="hello" />);

    expect(getLength()).toBe(5);
  });
});
