import { fireEvent, render as rtlRender, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DropdownMenuItem } from '../../DropdownMenu';
import { TooltipProvider } from '../../Tooltip';
import { SelectableListCard } from '../index';

// The row menu's trigger carries a Tooltip, and every Tooltip needs a provider above it.
const render = (
  ui: Parameters<typeof rtlRender>[0],
  options?: Parameters<typeof rtlRender>[1]
) => rtlRender(ui, { wrapper: TooltipProvider, ...options });

const LABEL = 'Select report.pdf';

const checkbox = () => screen.getByRole('checkbox', { name: LABEL });
const checkboxes = () => screen.getAllByRole('checkbox', { name: LABEL });
const content = () => screen.getByText('report.pdf');
const rightSlot = <button type="button">Actions</button>;

const baseProps = {
  isSelected: false,
  checkboxAriaLabel: LABEL,
  cardContent: <span>report.pdf</span>,
};

const handlers = () => ({ onCardClick: vi.fn(), onCheckboxToggle: vi.fn() });

/** The focusable item: the row's Card, or the card layout's Card. */
const rowItem = (container: HTMLElement) =>
  container.querySelector('[tabindex="0"]') as HTMLElement;

describe('SelectableListCard', () => {
  describe('row layout', () => {
    it('opens the card from its content without toggling the selection', () => {
      const { onCardClick, onCheckboxToggle } = handlers();
      render(
        <SelectableListCard
          {...baseProps}
          layout="row"
          onCardClick={onCardClick}
          onCheckboxToggle={onCheckboxToggle}
        />
      );

      fireEvent.click(content());

      expect(onCardClick).toHaveBeenCalledOnce();
      expect(onCheckboxToggle).not.toHaveBeenCalled();
    });

    it('toggles the selection from the checkbox without opening the card', () => {
      const { onCardClick, onCheckboxToggle } = handlers();
      render(
        <SelectableListCard
          {...baseProps}
          layout="row"
          onCardClick={onCardClick}
          onCheckboxToggle={onCheckboxToggle}
        />
      );

      fireEvent.click(checkbox());

      expect(onCheckboxToggle).toHaveBeenCalledOnce();
      expect(onCardClick).not.toHaveBeenCalled();
    });

    it('renders the checked state from isSelected', () => {
      const { rerender } = render(
        <SelectableListCard {...baseProps} {...handlers()} layout="row" />
      );

      expect(checkbox()).toHaveAttribute('data-state', 'unchecked');

      rerender(
        <SelectableListCard
          {...baseProps}
          {...handlers()}
          layout="row"
          isSelected
        />
      );

      expect(checkbox()).toHaveAttribute('data-state', 'checked');
    });

    it('renders the right slot', () => {
      render(
        <SelectableListCard
          {...baseProps}
          {...handlers()}
          layout="row"
          rightSlot={rightSlot}
        />
      );

      expect(
        screen.getByRole('button', { name: 'Actions' })
      ).toBeInTheDocument();
    });

    describe('keyboard', () => {
      it('is a tab stop that Enter and Space open', () => {
        const { onCardClick, onCheckboxToggle } = handlers();
        const { container } = render(
          <SelectableListCard
            {...baseProps}
            layout="row"
            onCardClick={onCardClick}
            onCheckboxToggle={onCheckboxToggle}
          />
        );
        const item = rowItem(container);

        expect(item).toHaveAttribute('tabindex', '0');

        fireEvent.keyDown(item, { key: 'Enter' });
        fireEvent.keyDown(item, { key: ' ' });
        fireEvent.keyDown(item, { key: 'a' });

        expect(onCardClick).toHaveBeenCalledTimes(2);
        expect(onCheckboxToggle).not.toHaveBeenCalled();
      });

      /**
       * The keys of the controls inside — a button in the right slot here, a
       * pin or a rename field elsewhere — bubble through the row on their way
       * out.
       */
      it('ignores keys that belong to a control inside it', () => {
        const { onCardClick } = handlers();
        render(
          <SelectableListCard
            {...baseProps}
            layout="row"
            rightSlot={rightSlot}
            onCardClick={onCardClick}
            onCheckboxToggle={() => {}}
          />
        );

        fireEvent.keyDown(screen.getByRole('button', { name: 'Actions' }), {
          key: 'Enter',
        });

        expect(onCardClick).not.toHaveBeenCalled();
      });

      it('announces the selection on the item itself', () => {
        const { container, rerender } = render(
          <SelectableListCard {...baseProps} {...handlers()} layout="row" />
        );
        expect(rowItem(container)).toHaveAttribute('aria-selected', 'false');

        rerender(
          <SelectableListCard
            {...baseProps}
            {...handlers()}
            layout="row"
            isSelected
          />
        );
        expect(rowItem(container)).toHaveAttribute('aria-selected', 'true');
      });
    });

    describe('menu', () => {
      const menu = <DropdownMenuItem>Rename</DropdownMenuItem>;
      const trigger = (name = 'More actions') => screen.getByLabelText(name);

      it('puts a ⋮ at the end of the row only when given one', () => {
        const { rerender } = render(
          <SelectableListCard {...baseProps} {...handlers()} layout="row" />
        );
        expect(screen.queryByLabelText('More actions')).toBeNull();

        rerender(
          <SelectableListCard
            {...baseProps}
            {...handlers()}
            layout="row"
            rightSlot={rightSlot}
            menu={menu}
            menuLabel="More actions for report.pdf"
          />
        );
        const kebab = trigger('More actions for report.pdf');
        expect(kebab.parentElement?.lastElementChild).toBe(kebab);
      });

      it('opens and runs its items without opening the row', () => {
        const onRename = vi.fn();
        const { onCardClick } = handlers();
        render(
          <SelectableListCard
            {...baseProps}
            layout="row"
            menu={
              <DropdownMenuItem onSelect={onRename}>Rename</DropdownMenuItem>
            }
            onCardClick={onCardClick}
            onCheckboxToggle={() => {}}
          />
        );

        fireEvent.click(trigger());
        fireEvent.keyDown(trigger(), { key: 'Enter' });
        fireEvent.click(screen.getByText('Rename'));

        expect(onRename).toHaveBeenCalledOnce();
        expect(onCardClick).not.toHaveBeenCalled();
      });
    });
  });

  describe('card layout', () => {
    /**
     * `Card variant="secondary"` paints its hover fill from `group-hover/card`
     * and the floating checkbox fades in from the same ancestor. This wrapper
     * is the only `group/card` the two share, so renaming it keeps every gate
     * green and silently kills both hovers.
     */
    it('wraps the card in the group/card ancestor', () => {
      const { container } = render(
        <SelectableListCard {...baseProps} {...handlers()} />
      );

      expect(container.firstElementChild).toHaveClass('group/card');
    });

    /** A faded-out checkbox must not remain a click or focus target. */
    it('keeps the floating checkbox inert while it is hidden', () => {
      render(<SelectableListCard {...baseProps} {...handlers()} />);

      // Rendered ahead of the card, so it comes first in document order.
      const [floatingCheckbox] = checkboxes();

      expect(floatingCheckbox?.parentElement).toHaveClass(
        'pointer-events-none',
        'opacity-0'
      );
    });

    it('toggles the selection from either checkbox without opening the card', () => {
      const { onCardClick, onCheckboxToggle } = handlers();
      render(
        <SelectableListCard
          {...baseProps}
          onCardClick={onCardClick}
          onCheckboxToggle={onCheckboxToggle}
        />
      );

      const boxes = checkboxes();
      expect(boxes).toHaveLength(2);

      for (const box of boxes) {
        fireEvent.click(box);
      }

      expect(onCheckboxToggle).toHaveBeenCalledTimes(2);
      expect(onCardClick).not.toHaveBeenCalled();
    });

    it('opens the card from its content without toggling the selection', () => {
      const { onCardClick, onCheckboxToggle } = handlers();
      render(
        <SelectableListCard
          {...baseProps}
          onCardClick={onCardClick}
          onCheckboxToggle={onCheckboxToggle}
        />
      );

      fireEvent.click(content());

      expect(onCardClick).toHaveBeenCalledOnce();
      expect(onCheckboxToggle).not.toHaveBeenCalled();
    });

    it('is a tab stop that Enter opens, carrying its selection', () => {
      const { onCardClick } = handlers();
      const { container } = render(
        <SelectableListCard
          {...baseProps}
          isSelected
          onCardClick={onCardClick}
          onCheckboxToggle={() => {}}
        />
      );
      const item = rowItem(container);

      expect(item).toHaveAttribute('aria-selected', 'true');

      fireEvent.keyDown(item, { key: 'Enter' });

      expect(onCardClick).toHaveBeenCalledOnce();
    });

    it('renders the right slot', () => {
      render(
        <SelectableListCard
          {...baseProps}
          {...handlers()}
          rightSlot={rightSlot}
        />
      );

      expect(
        screen.getByRole('button', { name: 'Actions' })
      ).toBeInTheDocument();
    });
  });
});
