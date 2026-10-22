import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  type ComponentProps,
  createRef,
  type ReactNode,
  useState,
} from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '../../Tooltip';
import { SearchInput } from '../index';

type Props = ComponentProps<typeof SearchInput>;

/** Holds the value the way an application would (the stories' harness). */
const Controlled = ({
  value: initial = '',
  onValueChange,
  onClear,
  ...props
}: Partial<Props>) => {
  const [value, setValue] = useState(initial);
  return (
    <SearchInput
      placeholder="Search conversations…"
      {...props}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
      onClear={() => {
        setValue('');
        onClear?.();
      }}
    />
  );
};

const renderWithTooltips = (ui: ReactNode) =>
  render(<TooltipProvider>{ui}</TooltipProvider>);

const clearButton = () =>
  screen.queryByRole('button', { name: 'Clear search' });

describe('SearchInput', () => {
  it('shows no clear button while empty; typing reveals it', () => {
    const onValueChange = vi.fn();
    renderWithTooltips(<Controlled onValueChange={onValueChange} />);

    const field = screen.getByRole('searchbox');
    expect(clearButton()).toBeNull();

    fireEvent.change(field, { target: { value: 'q' } });
    expect(onValueChange).toHaveBeenCalledWith('q');
    expect(clearButton()).toBeInTheDocument();
  });

  it('clears through onClear and hands focus back to the field', () => {
    const onClear = vi.fn();
    renderWithTooltips(<Controlled value="Q3 KPI" onClear={onClear} />);

    const field = screen.getByRole('searchbox');
    const clear = clearButton();
    expect(clear).not.toBeNull();

    fireEvent.click(clear as HTMLElement);
    expect(onClear).toHaveBeenCalledOnce();
    expect(field).toHaveValue('');
    expect(field).toHaveFocus();
    expect(clearButton()).toBeNull();
  });

  it('offers no clear button without onClear', () => {
    renderWithTooltips(
      <SearchInput
        placeholder="Search…"
        value="Q3 KPI"
        onValueChange={vi.fn()}
      />
    );
    expect(clearButton()).toBeNull();
  });

  it('is a search input with the browser’s own clear control hidden', () => {
    renderWithTooltips(<SearchInput placeholder="Search…" />);
    const field = screen.getByRole('searchbox');
    expect(field).toHaveAttribute('type', 'search');
    expect(field.className).toContain(
      '[&::-webkit-search-cancel-button]:hidden'
    );
  });

  it('defaults to lg; className goes to the InputGroup, ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = renderWithTooltips(
      <SearchInput placeholder="Search…" className="w-72" ref={ref} />
    );
    const group = container.querySelector('[data-slot="input-group"]');
    expect(group).toHaveClass('h-10', 'w-72');
    expect(ref.current).toBe(screen.getByRole('searchbox'));
  });

  describe('extensions', () => {
    it('disabled: the field is disabled and offers no clear button', () => {
      renderWithTooltips(<Controlled value="Q3 KPI" disabled />);
      expect(screen.getByRole('searchbox')).toBeDisabled();
      expect(clearButton()).toBeNull();
    });

    it('passes variant and style to the field, id, aria-label and onKeyDown to the input', () => {
      const onKeyDown = vi.fn();
      const { container } = renderWithTooltips(
        <SearchInput
          placeholder="Search…"
          variant="primary"
          style={{ maxWidth: 320 }}
          id="workspace-search"
          aria-label="Search workspaces"
          onKeyDown={onKeyDown}
        />
      );
      const group = container.querySelector('[data-slot="input-group"]');
      expect(group).toHaveClass('bg-surface-page');
      expect(group).toHaveStyle({ maxWidth: '320px' });

      const field = screen.getByRole('searchbox', {
        name: 'Search workspaces',
      });
      expect(field).toHaveAttribute('id', 'workspace-search');

      fireEvent.keyDown(field, { key: 'a' });
      expect(onKeyDown).toHaveBeenCalledOnce();
    });
  });

  describe('with results', () => {
    const PEOPLE = [
      { id: 'p1', label: 'Anna Shevchenko' },
      { id: 'p2', label: 'David Miller' },
      { id: 'p3', label: 'Maria Kovalenko' },
    ];

    const Directory = (props: Partial<Props>) => {
      const [value, setValue] = useState('');
      const results = PEOPLE.filter((p) =>
        p.label.toLowerCase().includes(value.trim().toLowerCase())
      );
      return (
        <SearchInput
          placeholder="Search users…"
          emptyText="No user matches"
          {...props}
          value={value}
          onValueChange={(next) => {
            setValue(next);
            props.onValueChange?.(next);
          }}
          onClear={() => {
            setValue('');
            props.onClear?.();
          }}
          results={results}
        />
      );
    };

    it('opens only once something is typed, with the caller’s matches', () => {
      renderWithTooltips(<Directory />);
      const field = screen.getByRole('combobox');

      fireEvent.focus(field);
      fireEvent.mouseDown(field);
      expect(screen.queryByRole('listbox')).toBeNull();

      fireEvent.change(field, { target: { value: 'ma' } });
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
        'Maria Kovalenko',
      ]);
    });

    it('says emptyText when nothing matches', () => {
      renderWithTooltips(<Directory />);
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'zz' },
      });
      expect(screen.getByRole('option')).toHaveTextContent('No user matches');
    });

    it('picks with the keys: the name fills the field and onSelect is called', () => {
      const onSelect = vi.fn();
      const onValueChange = vi.fn();
      renderWithTooltips(
        <Directory onSelect={onSelect} onValueChange={onValueChange} />
      );
      const field = screen.getByRole('combobox');
      act(() => field.focus());

      fireEvent.change(field, { target: { value: 'da' } });
      act(() => {
        fireEvent.keyDown(field, { key: 'ArrowDown' });
      });
      act(() => {
        fireEvent.keyDown(field, { key: 'Enter' });
      });

      expect(onSelect).toHaveBeenCalledWith(PEOPLE[1]);
      expect(field).toHaveValue('David Miller');
      expect(onValueChange).toHaveBeenLastCalledWith('David Miller');
      expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('clears through onClear, closes the list and hands focus back', () => {
      const onClear = vi.fn();
      renderWithTooltips(<Directory onClear={onClear} />);
      const field = screen.getByRole('combobox');

      fireEvent.change(field, { target: { value: 'ma' } });
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.click(clearButton() as HTMLElement);
      expect(onClear).toHaveBeenCalledOnce();
      expect(field).toHaveValue('');
      expect(field).toHaveFocus();
      expect(screen.queryByRole('listbox')).toBeNull();
      expect(clearButton()).toBeNull();
    });
  });
});
