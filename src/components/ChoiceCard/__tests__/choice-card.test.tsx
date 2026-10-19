import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChoiceCard, ChoiceGroup } from '../index';

const single = (props: {
  value?: string;
  onValueChange?: (v: string) => void;
  onPick?: (v: string) => void;
}) => (
  <ChoiceGroup aria-label="Role" {...props}>
    <ChoiceCard value="sales" title="Sales" description="Pipeline and deals" />
    <ChoiceCard value="ops" title="Operations" disabled />
    <ChoiceCard value="finance" title="Finance" badge="Popular" />
  </ChoiceGroup>
);

describe('ChoiceGroup type="single"', () => {
  it('is a radiogroup of radio cards with no drawn mark', () => {
    const { container } = render(single({ value: 'finance' }));

    expect(
      screen.getByRole('radiogroup', { name: 'Role' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: /Finance/ })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    expect(screen.getByRole('radio', { name: /Sales/ })).toHaveAttribute(
      'aria-checked',
      'false'
    );
    expect(
      container.querySelector('[data-slot="choice-card-indicator"]')
    ).toBeNull();
  });

  it('puts the tab stop on the chosen card, else on the first enabled one', () => {
    const { rerender } = render(single({}));
    expect(screen.getByRole('radio', { name: /Sales/ })).toHaveAttribute(
      'tabindex',
      '0'
    );
    expect(screen.getByRole('radio', { name: /Finance/ })).toHaveAttribute(
      'tabindex',
      '-1'
    );

    rerender(single({ value: 'finance' }));
    expect(screen.getByRole('radio', { name: /Finance/ })).toHaveAttribute(
      'tabindex',
      '0'
    );
    expect(screen.getByRole('radio', { name: /Sales/ })).toHaveAttribute(
      'tabindex',
      '-1'
    );
  });

  it('reports a clicked card', () => {
    const onValueChange = vi.fn();
    render(single({ onValueChange }));

    fireEvent.click(screen.getByRole('radio', { name: /Finance/ }));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('finance');
  });

  it('moves and chooses with the arrow keys, skipping disabled cards and wrapping', () => {
    const onValueChange = vi.fn();
    render(single({ value: 'sales', onValueChange }));
    const sales = screen.getByRole('radio', { name: /Sales/ });
    const finance = screen.getByRole('radio', { name: /Finance/ });

    sales.focus();
    fireEvent.keyDown(sales, { key: 'ArrowDown' });
    expect(finance).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('finance');

    fireEvent.keyDown(finance, { key: 'ArrowRight' });
    expect(sales).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('sales');

    fireEvent.keyDown(sales, { key: 'ArrowUp' });
    expect(finance).toHaveFocus();
  });

  it('reports a click as a pick', () => {
    const onValueChange = vi.fn();
    const onPick = vi.fn();
    render(single({ onValueChange, onPick }));

    fireEvent.click(screen.getByRole('radio', { name: /Finance/ }));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('finance');
    expect(onPick).toHaveBeenCalledExactlyOnceWith('finance');
  });

  it('arrow keys change value without onPick', () => {
    const onValueChange = vi.fn();
    const onPick = vi.fn();
    render(single({ value: 'sales', onValueChange, onPick }));
    const sales = screen.getByRole('radio', { name: /Sales/ });

    sales.focus();
    fireEvent.keyDown(sales, { key: 'ArrowDown' });
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('finance');
    expect(onPick).not.toHaveBeenCalled();

    // and a pick right after an arrow is still a pick
    fireEvent.click(screen.getByRole('radio', { name: /Finance/ }));
    expect(onPick).toHaveBeenCalledExactlyOnceWith('finance');
  });

  it('does not report a disabled card', () => {
    const onValueChange = vi.fn();
    render(single({ onValueChange }));

    const ops = screen.getByRole('radio', { name: /Operations/ });
    expect(ops).toBeDisabled();
    fireEvent.click(ops);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('draws a radio mark only on request', () => {
    const { container } = render(
      <ChoiceGroup aria-label="Plan" value="a">
        <ChoiceCard value="a" title="A" indicator="radio" />
      </ChoiceGroup>
    );

    expect(
      container.querySelector('[data-slot="choice-card-indicator"]')
    ).toHaveAttribute('data-state', 'checked');
  });
});

describe('ChoiceGroup type="multiple"', () => {
  it('is a group of checkbox cards and toggles values in and out', () => {
    const onValueChange = vi.fn();
    render(
      <ChoiceGroup
        type="multiple"
        aria-label="Goals"
        value={['a']}
        onValueChange={onValueChange}
      >
        <ChoiceCard value="a" title="Track revenue" />
        <ChoiceCard value="b" title="Forecast" />
      </ChoiceGroup>
    );

    expect(screen.getByRole('group', { name: 'Goals' })).toBeInTheDocument();
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes).toHaveLength(2);
    expect(boxes[0]).toBeChecked();

    fireEvent.click(boxes[1] as HTMLElement);
    expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b']);

    fireEvent.click(boxes[0] as HTMLElement);
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });
});

describe('ChoiceCard standalone', () => {
  it('is a toggle button with aria-pressed', () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <ChoiceCard title="Sales" selected={false} onSelect={onSelect} />
    );
    const card = screen.getByRole('button', { name: /Sales/ });
    expect(card).not.toHaveAttribute('aria-pressed');

    fireEvent.click(card);
    expect(onSelect).toHaveBeenCalledExactlyOnceWith(true);

    rerender(<ChoiceCard title="Sales" selected onSelect={onSelect} />);
    expect(card).toHaveAttribute('aria-pressed', 'true');
    expect(card).toHaveAttribute('data-state', 'checked');
  });

  it('wraps a Checkbox with indicator="checkbox"', () => {
    const onSelect = vi.fn();
    render(
      <ChoiceCard
        title="Email me"
        indicator="checkbox"
        selected={false}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByRole('checkbox'));
    expect(onSelect).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('reveals its children inside the card while chosen', () => {
    const { rerender } = render(
      <ChoiceCard title="Other" selected={false} onSelect={vi.fn()}>
        <textarea aria-label="Your answer" />
      </ChoiceCard>
    );
    const head = screen.getByRole('button', { name: /Other/ });
    expect(head).toHaveAttribute('aria-expanded', 'false');
    expect(head).toHaveAttribute('data-slot', 'choice-card-head');
    expect(screen.queryByLabelText('Your answer')).toBeNull();

    rerender(
      <ChoiceCard title="Other" selected onSelect={vi.fn()}>
        <textarea aria-label="Your answer" />
      </ChoiceCard>
    );
    expect(head).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByLabelText('Your answer')).toBeInTheDocument();
  });
});
