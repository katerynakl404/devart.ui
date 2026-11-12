import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { InputGroup, InputGroupInput } from '../index';

function Port() {
  const [value, setValue] = useState('');
  return (
    <InputGroup>
      <InputGroupInput
        aria-label="Port"
        digitsOnly
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </InputGroup>
  );
}

describe('Input digitsOnly', () => {
  it('keeps the digits of what is typed or pasted', () => {
    render(<Port />);
    const field = screen.getByRole('textbox', { name: 'Port' });
    fireEvent.change(field, { target: { value: '3a0s' } });
    expect(field).toHaveValue('30');
    fireEvent.change(field, { target: { value: ' 5 432 ' } });
    expect(field).toHaveValue('5432');
  });

  it('a letter alone leaves the value as it was', () => {
    render(<Port />);
    const field = screen.getByRole('textbox', { name: 'Port' });
    fireEvent.change(field, { target: { value: '30' } });
    fireEvent.change(field, { target: { value: '30e' } });
    expect(field).toHaveValue('30');
  });

  it('turns a letter away before it lands, so a selection typed over stays', () => {
    render(<Port />);
    const field = screen.getByRole('textbox', { name: 'Port' });
    const type = (data: string) =>
      field.dispatchEvent(
        new InputEvent('beforeinput', {
          data,
          inputType: 'insertText',
          cancelable: true,
        })
      );
    expect(type('x')).toBe(false);
    expect(type('7')).toBe(true);
  });

  it('pastes only the digits', () => {
    const original = document.execCommand;
    const insert = vi.fn(() => true);
    document.execCommand = insert;
    render(<Port />);
    const field = screen.getByRole('textbox', { name: 'Port' });
    field.dispatchEvent(
      new InputEvent('beforeinput', {
        data: '30s',
        inputType: 'insertFromPaste',
        cancelable: true,
      })
    );
    expect(insert).toHaveBeenCalledWith('insertText', false, '30');
    document.execCommand = original;
  });

  it('asks the phone for its numeric keypad', () => {
    render(<Port />);
    expect(screen.getByRole('textbox', { name: 'Port' })).toHaveAttribute(
      'inputmode',
      'numeric'
    );
  });
});
