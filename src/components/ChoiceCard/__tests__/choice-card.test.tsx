import { fireEvent, render, screen } from '@testing-library/react';
import type { CSSProperties } from 'react';
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

  it('exposes the chosen state as aria-pressed when the card draws no checkbox', () => {
    render(
      <ChoiceGroup type="multiple" aria-label="Goals" value={['a']}>
        <ChoiceCard value="a" title="Track revenue" indicator="none" />
        <ChoiceCard value="b" title="Forecast" indicator="none" />
      </ChoiceGroup>
    );

    expect(
      screen.getByRole('button', { name: /Track revenue/ })
    ).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Forecast/ })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });
});

describe('ChoiceGroup className', () => {
  it('lets a consumer className replace the base columns and gap', () => {
    render(
      <ChoiceGroup aria-label="Role" className="grid-cols-3 gap-4">
        <ChoiceCard value="a" title="A" />
      </ChoiceGroup>
    );
    const group = screen.getByRole('radiogroup', { name: 'Role' });

    expect(group).toHaveClass('grid', 'grid-cols-3', 'gap-4');
    expect(group).not.toHaveClass('grid-cols-1');
    expect(group).not.toHaveClass('gap-2');
  });

  it('keeps the base columns under a responsive consumer className', () => {
    render(
      <ChoiceGroup aria-label="Role" className="sm:grid-cols-3 sm:gap-3">
        <ChoiceCard value="a" title="A" />
      </ChoiceGroup>
    );

    expect(screen.getByRole('radiogroup', { name: 'Role' })).toHaveClass(
      'grid-cols-1',
      'gap-2',
      'sm:grid-cols-3',
      'sm:gap-3'
    );
  });
});

describe('ChoiceGroup with an expandable card', () => {
  it('moves the arrow keys onto the head of an expandable card', () => {
    const onValueChange = vi.fn();
    render(
      <ChoiceGroup
        aria-label="Role"
        value="sales"
        onValueChange={onValueChange}
      >
        <ChoiceCard value="sales" title="Sales" />
        <ChoiceCard value="other" title="Other">
          <textarea aria-label="Your answer" />
        </ChoiceCard>
      </ChoiceGroup>
    );
    const sales = screen.getByRole('radio', { name: /Sales/ });
    const other = screen.getByRole('radio', { name: /Other/ });

    expect(other).toHaveAttribute('data-slot', 'choice-card-head');
    expect(other).not.toHaveAttribute('aria-expanded');
    sales.focus();
    fireEvent.keyDown(sales, { key: 'ArrowDown' });
    expect(other).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('other');
  });
});

describe('ChoiceCard standalone', () => {
  it('is a toggle button with aria-pressed', () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <ChoiceCard title="Sales" selected={false} onSelect={onSelect} />
    );
    const card = screen.getByRole('button', { name: /Sales/ });
    expect(card).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(card);
    expect(onSelect).toHaveBeenCalledExactlyOnceWith(true);

    rerender(<ChoiceCard title="Sales" selected onSelect={onSelect} />);
    expect(card).toHaveAttribute('aria-pressed', 'true');
    expect(card).toHaveAttribute('data-state', 'checked');

    fireEvent.click(card);
    expect(onSelect).toHaveBeenLastCalledWith(false);
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

  it('does not report a disabled card', () => {
    const onSelect = vi.fn();
    render(<ChoiceCard title="Sales" disabled onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /Sales/ }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('reveals its children inside the card while chosen', () => {
    const { rerender } = render(
      <ChoiceCard title="Other" selected={false} onSelect={vi.fn()}>
        <textarea aria-label="Your answer" />
      </ChoiceCard>
    );
    const head = screen.getByRole('button', { name: /Other/ });
    expect(head).toHaveAttribute('aria-expanded', 'false');
    expect(head).not.toHaveAttribute('aria-pressed');
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

describe('style', () => {
  const style = { '--choice-index': 2 } as CSSProperties;
  const cardRoot = (container: HTMLElement) =>
    container.querySelector<HTMLElement>('[data-slot="choice-card"]');

  it('lands on the root of a button card', () => {
    const { container } = render(<ChoiceCard title="Sales" style={style} />);
    expect(cardRoot(container)?.tagName).toBe('BUTTON');
    expect(cardRoot(container)?.style.getPropertyValue('--choice-index')).toBe(
      '2'
    );
  });

  it('lands on the root of a checkbox card', () => {
    const { container } = render(
      <ChoiceCard title="Sales" indicator="checkbox" style={style} />
    );
    expect(cardRoot(container)?.tagName).toBe('LABEL');
    expect(cardRoot(container)?.style.getPropertyValue('--choice-index')).toBe(
      '2'
    );
  });

  it('lands on the root of an expandable card, not on its head', () => {
    const { container } = render(
      <ChoiceCard title="Other" style={style}>
        <span>Panel</span>
      </ChoiceCard>
    );
    expect(cardRoot(container)?.tagName).toBe('DIV');
    expect(cardRoot(container)?.style.getPropertyValue('--choice-index')).toBe(
      '2'
    );
    expect(
      container
        .querySelector<HTMLElement>('[data-slot="choice-card-head"]')
        ?.getAttribute('style')
    ).toBeNull();
  });

  it('lands on the group wrapper', () => {
    render(
      <ChoiceGroup aria-label="Role" style={style}>
        <ChoiceCard value="sales" title="Sales" />
      </ChoiceGroup>
    );
    expect(
      screen
        .getByRole('radiogroup', { name: 'Role' })
        .style.getPropertyValue('--choice-index')
    ).toBe('2');
  });
});
