import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InputGroup, InputGroupInput } from '../index';

const field = (required?: boolean) =>
  render(
    <InputGroup label="Workspace name" required={required} inputId="field">
      <InputGroupInput />
    </InputGroup>
  ).container;

describe('InputGroup required', () => {
  it('marks nothing unless asked', () => {
    const container = field();

    expect(container.querySelector('label')?.textContent).toBe(
      'Workspace name'
    );
    expect(container.querySelector('label')?.querySelector('span')).toBeNull();
    expect(container.querySelector('input')).not.toHaveAttribute(
      'aria-required'
    );
  });

  it('adds the asterisk and aria-required', () => {
    const container = field(true);
    const mark = container.querySelector('label')?.querySelector('span');

    expect(container.querySelector('label')?.textContent).toBe(
      'Workspace name *'
    );
    expect(mark).toHaveClass('text-fb-red-text');
    expect(mark).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('input')).toHaveAttribute(
      'aria-required',
      'true'
    );
  });
});
