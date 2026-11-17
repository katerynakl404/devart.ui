import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Autocomplete } from '../../Autocomplete';
import { TextArea } from '../../TextArea';
import { InputGroup, InputGroupInput } from '../index';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const OPTIONS = [{ id: 'wh', label: 'Sales warehouse' }];

const labelOf = (container: HTMLElement) =>
  container.querySelector('label') as HTMLLabelElement;

const inputGroup = (size: Size) =>
  render(
    <InputGroup inputId="f" label="Host" size={size}>
      <InputGroupInput />
    </InputGroup>
  ).container;

const textArea = (size: Size) =>
  render(<TextArea label="Host" size={size} />).container;

const autocomplete = (size: Size) =>
  render(<Autocomplete label="Host" options={OPTIONS} size={size} />).container;

describe('a field label', () => {
  /* The rung the package has always drawn: 12 at the two small sizes, 14 from
     md. What is new is that all three fields read it from one place. */
  it.each([
    ['xs', 'text-xs'],
    ['sm', 'text-xs'],
    ['md', 'text-sm'],
    ['lg', 'text-sm'],
    ['xl', 'text-sm'],
  ] as const)('steps with the field at %s', (size, expected) => {
    for (const build of [inputGroup, textArea, autocomplete]) {
      expect(labelOf(build(size))).toHaveClass(expected);
    }
  });

  it('carries the same rung in all three fields at one size', () => {
    const rung = (container: HTMLElement) =>
      labelOf(container).className.match(/text-(xs|sm|base)/)?.[0];

    expect(rung(inputGroup('sm'))).toBe(rung(textArea('sm')));
    expect(rung(inputGroup('sm'))).toBe(rung(autocomplete('sm')));
  });
});

describe('Autocomplete required', () => {
  it('marks nothing unless asked', () => {
    const container = autocomplete('md');

    expect(labelOf(container).textContent).toBe('Host');
    expect(labelOf(container).querySelector('span')).toBeNull();
    expect(container.querySelector('input')).not.toHaveAttribute(
      'aria-required'
    );
  });

  it('adds the asterisk and aria-required', () => {
    const container = render(
      <Autocomplete label="Host" options={OPTIONS} required />
    ).container;
    const mark = labelOf(container).querySelector('span');

    expect(labelOf(container).textContent).toBe('Host *');
    expect(mark).toHaveClass('text-fb-red-text');
    expect(mark).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('input')).toHaveAttribute(
      'aria-required',
      'true'
    );
  });
});
