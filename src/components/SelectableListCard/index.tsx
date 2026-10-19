'use client';

import type { KeyboardEvent, ReactNode } from 'react';
import { onButtonKeyDown } from '../../lib/button-keyboard';
import { cn, focusRing } from '../../lib/utils';
import { Card } from '../Card';
import { Checkbox } from '../Checkbox';
import { RowMenuButton } from '../RowMenuButton';

interface SelectableListCardBaseProps {
  /** Also announced on the item itself, as `aria-selected`. */
  isSelected: boolean;
  checkboxAriaLabel?: string;
  onCheckboxToggle: () => void;
  /** A click on the item, or Enter / Space while the item itself has focus. */
  onCardClick: () => void;
}

interface SelectableListCardCardLayout extends SelectableListCardBaseProps {
  layout?: 'card';
  mobileCheckboxClassName?: string;
  contentClassName?: string;
  cardClassName?: string;
  cardContent: ReactNode;
  rightSlot?: ReactNode;
  selectedClassName?: string;
}

interface SelectableListCardRowLayout extends SelectableListCardBaseProps {
  layout: 'row';
  cardClassName?: string;
  selectedClassName?: string;
  cardContent: ReactNode;
  rightSlot?: ReactNode;
  /**
   * `DropdownMenuItem`s for the row menu — Pin / Select / Rename / Delete.
   * When given, a ⋮ (`RowMenuButton`) sits at the right edge, after
   * `rightSlot`: revealed on hover, on keyboard focus and while open, and
   * always shown below `md` and on touch.
   */
  menu?: ReactNode;
  /** @default 'More actions' */
  menuLabel?: string;
}

type SelectableListCardProps =
  | SelectableListCardCardLayout
  | SelectableListCardRowLayout;

/**
 * A list item that reveals a checkbox once the list enters selection mode.
 *
 * Whether the checkbox shows is not a prop: an ancestor carrying `group/list`
 * (see `AsyncList`) stamps `data-has-selection` when anything is selected, and
 * every card in that list answers it. Passing a flag to each card instead
 * would re-render the whole list on the first selection.
 *
 * The item is a tab stop of its own: Enter and Space do what a click does.
 */
const SelectableListCard = (props: SelectableListCardProps) => {
  const { isSelected, checkboxAriaLabel, onCheckboxToggle, onCardClick } =
    props;

  // Only while the item ITSELF has focus. The controls inside it — the
  // checkbox, a pin, the ⋮, a rename field — answer their own keys, and those
  // keys bubble up through here on their way out.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    onButtonKeyDown<HTMLDivElement>(onCardClick)(event);
  };

  if (props.layout === 'row') {
    const {
      cardClassName,
      selectedClassName,
      cardContent,
      rightSlot,
      menu,
      menuLabel,
    } = props;

    return (
      <Card
        variant="row"
        fullWidth
        tabIndex={0}
        aria-selected={isSelected}
        className={cn(
          cardClassName,
          isSelected && [
            'border-brand-primary bg-state-pressed shadow-sm',
            // No separate selected+hover fill: a selected row keeps its own
            // surface under the pointer, and controls on it composite on top.
            'hover:border-brand-primary hover:bg-state-pressed',
            '[&:has([data-state=open])]:border-brand-primary',
          ],
          isSelected && selectedClassName
        )}
        onClick={onCardClick}
        onKeyDown={onKeyDown}
      >
        <span
          className={cn(
            'hidden flex-none items-center justify-center',
            'group-data-[has-selection]/list:flex',
            isSelected && 'flex'
          )}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={isSelected}
            aria-label={checkboxAriaLabel}
            onCheckedChange={onCheckboxToggle}
          />
        </span>

        {cardContent}

        {rightSlot}

        {menu ? (
          <RowMenuButton
            aria-label={menuLabel}
            // The right edge, whatever the content leaves free. And one text
            // line tall: the 24px trigger gives 4px back as a negative block
            // margin, so a row with a menu is the 44px a one-line row is,
            // level with its neighbours that have none.
            className="-my-0.5 ms-auto"
          >
            {menu}
          </RowMenuButton>
        ) : null}
      </Card>
    );
  }

  const {
    mobileCheckboxClassName,
    contentClassName,
    cardClassName,
    cardContent,
    rightSlot,
    selectedClassName,
  } = props;

  return (
    <div className="group/card relative">
      <div
        className={cn(
          'absolute top-1/2 -left-6 -translate-y-1/2',
          'pointer-events-none opacity-0',
          'transition-opacity delay-200 duration-150',
          'group-data-[has-selection]/list:pointer-events-auto group-data-[has-selection]/list:opacity-100 group-data-[has-selection]/list:delay-0',
          'max-md:hidden',
          'md:group-hover/card:pointer-events-auto md:group-hover/card:opacity-100 md:group-hover/card:delay-0'
        )}
      >
        <Checkbox
          checked={isSelected}
          aria-label={checkboxAriaLabel}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onCheckedChange={onCheckboxToggle}
        />
      </div>

      <Card
        fullWidth
        tabIndex={0}
        aria-selected={isSelected}
        className={cn(
          'cursor-pointer',
          // `secondary` is a surface and draws no focus of its own; as a tab
          // stop it takes the system ring, held off by the page it sits on.
          focusRing,
          'focus-visible:ring-offset-surface-page',
          cardClassName,
          isSelected && selectedClassName
        )}
        variant="secondary"
        onClick={onCardClick}
        onKeyDown={onKeyDown}
      >
        <div className={cn('flex gap-3', contentClassName)}>
          <div
            className={cn(
              'md:!hidden hidden shrink-0 group-data-[has-selection]/list:block',
              mobileCheckboxClassName
            )}
          >
            <Checkbox
              checked={isSelected}
              aria-label={checkboxAriaLabel}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              onCheckedChange={onCheckboxToggle}
            />
          </div>

          {cardContent}
        </div>
      </Card>

      {rightSlot}
    </div>
  );
};

SelectableListCard.displayName = 'SelectableListCard';

export {
  SelectableListCard,
  type SelectableListCardProps,
  type SelectableListCardCardLayout,
  type SelectableListCardRowLayout,
};
