'use client';

import { cva } from '../../lib/cva';
import { cn, focusRing } from '../../lib/utils';
import { ChoiceCardBody } from './ChoiceCardBody';
import { ChoiceCardButton } from './ChoiceCardButton';
import { ChoiceCardExpandable } from './ChoiceCardExpandable';
import { ChoiceCardIcon } from './ChoiceCardIcon';
import { ChoiceCardLabel } from './ChoiceCardLabel';
import { ChoiceCardRadioMark } from './ChoiceCardRadioMark';
import type { ChoiceCardProps } from './types';
import { useChoiceCardState } from './use-choice-card-state';

/*
 * The chosen state is one recipe for a ticked box, a picked answer and an open
 * expandable card: the brand border over the 5% brand wash. It is a plain
 * class, not a variant, so `hover:` does not out-rank it — the hover recipe is
 * applied only to a card that is neither chosen nor disabled, which is what
 * keeps a chosen card steady under the pointer. Pressed (`pressed:` /
 * `has-[>button:active]:`) is a variant and out-ranks the wash on purpose.
 */
const choiceCardVariants = cva(
  cn(
    'relative flex w-full items-start gap-2.5 px-3 py-2.5',
    'rounded-lg border border-stroke bg-surface-card text-left',
    'transition-[background-color,border-color] duration-fast'
  ),
  {
    variants: {
      layout: {
        /* the card is the button */
        button: cn('cursor-pointer pressed:bg-state-pressed', focusRing),
        /* the card is a label around a Checkbox; the ring follows its focus */
        label: cn(
          'cursor-pointer',
          'has-[:focus-visible]:outline-none',
          'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2',
          'has-[:focus-visible]:ring-offset-surface-card',
          'has-[:focus-visible]:ring-focus-ring-brand'
        ),
        /* the head is the button, the revealed content sits in the same box */
        expandable: cn(
          'cursor-default flex-col items-stretch gap-0 p-0',
          'has-[>button:active]:bg-state-pressed',
          'has-[>button:focus-visible]:outline-none',
          'has-[>button:focus-visible]:ring-2 has-[>button:focus-visible]:ring-offset-2',
          'has-[>button:focus-visible]:ring-offset-surface-card',
          'has-[>button:focus-visible]:ring-focus-ring-brand'
        ),
      },
      selected: {
        true: 'border-brand-primary bg-brand-primary/5',
        false: '',
      },
      disabled: { true: 'cursor-not-allowed opacity-disabled', false: '' },
    },
    compoundVariants: [
      {
        selected: false,
        disabled: false,
        class: 'hover:border-card-border-hover hover:bg-state-hover',
      },
    ],
    defaultVariants: {
      layout: 'button',
      selected: false,
      disabled: false,
    },
  }
);

/* The indicator sits on the right, centred on the TITLE line:
   (20px line − 18px control) / 2 = 1px — with or without a leading icon. */
const choiceCardIndicatorVariants = cva('order-1 mt-px flex-none');

type ChoiceCardLayout = 'button' | 'label' | 'expandable';

/**
 * A card-sized answer: title, optional description / badge / leading icon,
 * and the chosen state. In a single `ChoiceGroup` the card is the radio
 * (`role="radio"`, no drawn mark by default); in a multiple one it is a label
 * around a Checkbox. Standalone it is a button with `aria-pressed` (or, with
 * `indicator="checkbox"`, a label around a Checkbox).
 */
function ChoiceCard({
  value,
  title,
  description,
  badge,
  icon,
  indicator,
  disabled,
  selected,
  name,
  className,
  style,
  children,
  ref,
  onSelect,
}: ChoiceCardProps) {
  const card = useChoiceCardState({
    value,
    indicator,
    disabled,
    selected,
    name,
    onSelect,
  });
  const state = card.isSelected ? 'checked' : 'unchecked';
  const indicatorClassName = cn(choiceCardIndicatorVariants());
  const frameClassName = (layout: ChoiceCardLayout) =>
    cn(
      choiceCardVariants({
        layout,
        selected: card.isSelected,
        disabled: card.disabled,
      }),
      className
    );

  const triggerProps = {
    tabIndex: card.tabIndex,
    role: card.isRadio ? ('radio' as const) : undefined,
    'aria-checked': card.isRadio ? card.isSelected : undefined,
    onClick: () => card.toggle(),
  };

  const headContent = (
    <>
      {icon ? <ChoiceCardIcon>{icon}</ChoiceCardIcon> : null}

      <ChoiceCardBody title={title} badge={badge} description={description} />

      {card.indicator === 'radio' && (
        <ChoiceCardRadioMark
          isSelected={card.isSelected}
          className={indicatorClassName}
        />
      )}
    </>
  );

  if (card.indicator === 'checkbox') {
    return (
      <ChoiceCardLabel
        ref={ref}
        state={state}
        disabled={card.disabled}
        className={frameClassName('label')}
        style={style}
        checkbox={{
          checked: card.isSelected,
          disabled: card.disabled,
          name: card.name,
          className: indicatorClassName,
          onCheckedChange: (next) => card.toggle(Boolean(next)),
        }}
      >
        {headContent}
      </ChoiceCardLabel>
    );
  }

  if (children != null) {
    return (
      <ChoiceCardExpandable
        ref={ref}
        state={state}
        disabled={card.disabled}
        className={frameClassName('expandable')}
        style={style}
        headProps={{
          ...triggerProps,
          'aria-expanded': card.isRadio ? undefined : card.isSelected,
        }}
        panel={children}
      >
        {headContent}
      </ChoiceCardExpandable>
    );
  }

  return (
    <ChoiceCardButton
      {...triggerProps}
      ref={ref}
      state={state}
      disabled={card.disabled || undefined}
      className={frameClassName('button')}
      style={style}
      aria-pressed={card.isRadio ? undefined : card.isSelected}
    >
      {headContent}
    </ChoiceCardButton>
  );
}

ChoiceCard.displayName = 'ChoiceCard';

export { ChoiceCard, choiceCardIndicatorVariants, choiceCardVariants };
