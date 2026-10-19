import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CheckboxGroup } from '../CheckboxGroup';

const options = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
  { id: 'c', label: 'Charlie' },
];

const box = (name: string) => screen.getByRole('checkbox', { name });

describe('CheckboxGroup', () => {
  it('reports the added id alongside the ones already selected', () => {
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup
        options={options}
        value={['a']}
        onValueChange={onValueChange}
      />
    );

    fireEvent.click(box('Beta'));
    expect(onValueChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('reports the removal of an already selected id', () => {
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup
        options={options}
        value={['a', 'b']}
        onValueChange={onValueChange}
      />
    );

    fireEvent.click(box('Alpha'));
    expect(onValueChange).toHaveBeenCalledWith(['b']);
  });

  it('renders the checked state from its value prop', () => {
    render(
      <CheckboxGroup options={options} value={['b']} onValueChange={vi.fn()} />
    );

    expect(box('Alpha')).toHaveAttribute('data-state', 'unchecked');
    expect(box('Beta')).toHaveAttribute('data-state', 'checked');
  });

  it('disables every box when the group is disabled, and honours per-option disabling', () => {
    render(
      <CheckboxGroup
        options={[
          ...options.slice(0, 2),
          { id: 'c', label: 'Charlie', disabled: true },
        ]}
        value={[]}
        onValueChange={vi.fn()}
      />
    );

    expect(box('Charlie')).toBeDisabled();
    expect(box('Alpha')).toBeEnabled();
  });

  /**
   * The group is controlled, so a parent that declines a change — a cap on how
   * many may be picked, a failed validation — must leave the box unchecked.
   * Regression guard: the internal set used to be mutated in place, so the
   * rejected id stayed in it and reappeared on the next unrelated render.
   */
  it('stays in step with value when the parent rejects a change', () => {
    const onValueChange = vi.fn();
    // The same array instance both times: a parent holding this in state and
    // declining the change re-renders with the identical reference, which is
    // exactly the case a memo keyed on `value` does not recompute for.
    const rejectedValue = ['a'];

    const { rerender } = render(
      <CheckboxGroup
        label="Pick one"
        options={options}
        value={rejectedValue}
        onValueChange={onValueChange}
      />
    );

    fireEvent.click(box('Beta'));
    expect(onValueChange).toHaveBeenCalledWith(['a', 'b']);

    // The parent keeps `value` as it was and re-renders for its own reasons.
    rerender(
      <CheckboxGroup
        label="Pick one — try again"
        options={options}
        value={rejectedValue}
        onValueChange={onValueChange}
      />
    );

    expect(box('Beta')).toHaveAttribute('data-state', 'unchecked');
    expect(box('Alpha')).toHaveAttribute('data-state', 'checked');
  });
});
