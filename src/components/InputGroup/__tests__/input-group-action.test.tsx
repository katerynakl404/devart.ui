import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { inputGroupActionVariants } from '../InputGroupAction';
import { InputGroup, InputGroupAction, InputGroupInput } from '../index';

describe('InputGroupAction', () => {
  it('is a real button, typed `button`, marked as the group’s action', () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Query" />
        <InputGroupAction aria-label="Clear">✕</InputGroupAction>
      </InputGroup>
    );
    const action = screen.getByRole('button', { name: 'Clear' });
    expect(action).toHaveAttribute('type', 'button');
    expect(action).toHaveAttribute('data-slot', 'input-group-action');
  });

  it('is a 24px box around a 16px glyph from sm up', () => {
    render(
      <InputGroup size="sm">
        <InputGroupInput aria-label="Query" />
        <InputGroupAction aria-label="Clear">✕</InputGroupAction>
      </InputGroup>
    );
    const action = screen.getByRole('button', { name: 'Clear' });
    expect(action).toHaveClass('size-6', '[&>svg]:size-4');
  });

  it('at xs is the field’s 14px glyph itself', () => {
    render(
      <InputGroup size="xs">
        <InputGroupInput aria-label="Query" />
        <InputGroupAction aria-label="Clear">✕</InputGroupAction>
      </InputGroup>
    );
    const action = screen.getByRole('button', { name: 'Clear' });
    expect(action).toHaveClass('size-3.5', '[&>svg]:size-3.5');
    expect(action).not.toHaveClass('size-6');
  });

  it('exports its recipe, which resolves to the 24px box by default', () => {
    expect(inputGroupActionVariants()).toContain('size-6');
  });
});
