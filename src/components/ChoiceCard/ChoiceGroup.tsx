'use client';

import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { ChoiceGroupContext } from './context';
import type { ChoiceGroupProps } from './types';
import { useChoiceGroupState } from './use-choice-group-state';

/* 8px between cards, one column. A consumer `className` is merged last and
   replaces it: `sm:grid-cols-2 sm:gap-3` for two columns from 640px up. */
const choiceGroupVariants = cva('grid grid-cols-1 gap-2');

/**
 * A set of `ChoiceCard`s answering one question.
 *
 * `single` is a radiogroup with a roving tabindex: Tab lands on the chosen
 * card (or the first enabled one while nothing is chosen), and the arrow keys
 * move along the cards and choose as they go, wrapping at the ends — that
 * reports `onValueChange` but not `onPick`, which is kept for a deliberate
 * pick. `multiple` is a plain group of checkbox cards. Controlled either way.
 */
function ChoiceGroup(props: ChoiceGroupProps) {
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    disabled,
    className,
    style,
    children,
    ref,
  } = props;
  const { context, onKeyDown } = useChoiceGroupState(props);

  return (
    <ChoiceGroupContext.Provider value={context}>
      {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: the role is `group` or `radiogroup`, and both take a name */}
      <div
        ref={ref}
        data-slot="choice-group"
        role={context.type === 'multiple' ? 'group' : 'radiogroup'}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-disabled={disabled || undefined}
        onKeyDown={onKeyDown}
        className={cn(choiceGroupVariants(), className)}
        style={style}
      >
        {children}
      </div>
    </ChoiceGroupContext.Provider>
  );
}

ChoiceGroup.displayName = 'ChoiceGroup';

export { ChoiceGroup, choiceGroupVariants };
