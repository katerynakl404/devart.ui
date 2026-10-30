'use client';

/**
 * The developers' `SelectableListCard`, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/SelectableListCard/index.tsx`, import paths alone
 * changed. The Before half of the SelectableListCard page renders this file,
 * so it is the component the developer storybook ships, not a drawing of it.
 * The `Card` and `Checkbox` it imports are the live package's. Not edited:
 * replace it whole when the base moves.
 */

import type { ReactNode } from 'react';
import { Card } from '../../src/components/Card';
import { Checkbox } from '../../src/components/Checkbox';
import { cn } from '../../src/lib/utils';

interface SelectableListCardBaseProps {
  isSelected: boolean;
  checkboxAriaLabel?: string;
  onCheckboxToggle: () => void;
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
 */
const SelectableListCard = (props: SelectableListCardProps) => {
  const { isSelected, checkboxAriaLabel, onCheckboxToggle, onCardClick } =
    props;

  if (props.layout === 'row') {
    const { cardClassName, selectedClassName, cardContent, rightSlot } = props;

    return (
      <Card
        variant="row"
        fullWidth
        className={cn(
          cardClassName,
          isSelected && [
            'border-brand-primary bg-state-pressed shadow-sm',
            'hover:border-brand-primary hover:bg-tbl-row-selected-hover',
            '[&:has([data-state=open])]:border-brand-primary',
          ],
          isSelected && selectedClassName
        )}
        onClick={onCardClick}
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
        className={cn(
          'cursor-pointer',
          cardClassName,
          isSelected && selectedClassName
        )}
        variant="secondary"
        onClick={onCardClick}
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
