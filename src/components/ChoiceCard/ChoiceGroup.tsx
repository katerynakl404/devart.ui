'use client';

import {
  Children,
  createContext,
  isValidElement,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  useContext,
  useRef,
} from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';

export interface ChoiceGroupContextValue {
  type: 'single' | 'multiple';
  name?: string;
  disabled: boolean;
  isOn: (value: string) => boolean;
  /** Single group: is this card the one Tab lands on (roving tabindex)? */
  tabStop: (value: string) => boolean;
  choose: (value: string) => void;
}

const ChoiceGroupContext = createContext<ChoiceGroupContextValue | null>(null);

export const useChoiceGroup = () => useContext(ChoiceGroupContext);

interface ChoiceGroupBaseProps {
  /** `2` puts the cards side by side from 640px up. @default 1 */
  columns?: 1 | 2;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** Disables every card in the group. */
  disabled?: boolean;
  /** Form name — reaches the checkboxes of a `multiple` group. */
  name?: string;
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export interface ChoiceGroupSingleProps extends ChoiceGroupBaseProps {
  /** One answer: a radiogroup, arrow keys move and choose. @default 'single' */
  type?: 'single';
  value?: string;
  /** Every change of the chosen card — a pick or an arrow key walking the group. */
  onValueChange?: (value: string) => void;
  /**
   * The person PICKED a card — a pointer click, Enter or Space — and not an
   * arrow key moving through the group. The moment a one-answer question is
   * answered and the flow can move on by itself.
   */
  onPick?: (value: string) => void;
}

export interface ChoiceGroupMultipleProps extends ChoiceGroupBaseProps {
  /** Several answers: a group of checkbox cards. */
  type: 'multiple';
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ChoiceGroupProps =
  | ChoiceGroupSingleProps
  | ChoiceGroupMultipleProps;

/* 8px between cards; side by side from `sm` up, 12px apart. */
const choiceGroupVariants = cva('grid grid-cols-1 gap-2', {
  variants: {
    columns: { 1: '', 2: 'sm:grid-cols-2 sm:gap-3' },
  },
  defaultVariants: { columns: 1 },
});

const ARROWS: Record<string, number> = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
};

/* The enabled radio cards of this group — a card that IS the radio, or the
   head of an expandable one. */
const RADIOS =
  '[data-slot="choice-card"][role="radio"]:not(:disabled), [data-slot="choice-card"] > [role="radio"]:not(:disabled)';

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
    columns,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    disabled = false,
    name,
    className,
    children,
    ref,
  } = props;
  const multiple = props.type === 'multiple';
  const single = multiple
    ? ''
    : ((props as ChoiceGroupSingleProps).value ?? '');
  const many = multiple
    ? ((props as ChoiceGroupMultipleProps).value ?? [])
    : [];
  /* set while an arrow key moves the choice, so it is not reported as a pick */
  const arrowing = useRef(false);

  /* the roving tab stop while nothing is chosen: the first enabled card */
  let firstValue: string | null = null;
  for (const child of Children.toArray(children)) {
    if (!isValidElement<{ value?: string; disabled?: boolean }>(child)) {
      continue;
    }
    if (!child.props.disabled && child.props.value != null) {
      firstValue = child.props.value;
      break;
    }
  }

  const context: ChoiceGroupContextValue = {
    type: multiple ? 'multiple' : 'single',
    name,
    disabled,
    isOn: (v) => (multiple ? many.includes(v) : single === v),
    tabStop: (v) =>
      multiple ? true : single ? single === v : v === firstValue,
    choose: (v) => {
      if (!multiple) {
        const { onValueChange, onPick } = props as ChoiceGroupSingleProps;
        onValueChange?.(v);
        if (!arrowing.current) onPick?.(v);
        return;
      }
      (props as ChoiceGroupMultipleProps).onValueChange?.(
        many.includes(v) ? many.filter((x) => x !== v) : [...many, v]
      );
    },
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (multiple) return;
    const step = ARROWS[event.key];
    if (!step) return;
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(RADIOS)
    );
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    event.preventDefault();
    const next = items[(index + step + items.length) % items.length];
    arrowing.current = true;
    try {
      next?.focus();
      next?.click();
    } finally {
      arrowing.current = false;
    }
  };

  return (
    <ChoiceGroupContext.Provider value={context}>
      {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: the role is `group` or `radiogroup`, and both take a name */}
      <div
        ref={ref}
        data-slot="choice-group"
        role={multiple ? 'group' : 'radiogroup'}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-disabled={disabled || undefined}
        onKeyDown={onKeyDown}
        className={cn(choiceGroupVariants({ columns }), className)}
      >
        {children}
      </div>
    </ChoiceGroupContext.Provider>
  );
}

ChoiceGroup.displayName = 'ChoiceGroup';

export { ChoiceGroup, choiceGroupVariants };
