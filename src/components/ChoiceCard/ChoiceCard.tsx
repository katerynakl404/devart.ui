'use client';

import { Circle } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import { cva } from '../../lib/cva';
import { cn, focusRing } from '../../lib/utils';
import { Badge } from '../Badge';
import { Checkbox } from '../Checkbox';
import { radioIndicatorVariants, radioVariants } from '../RadioButton';
import { useChoiceGroup } from './ChoiceGroup';

export type ChoiceCardIndicator = 'auto' | 'none' | 'radio' | 'checkbox';

export interface ChoiceCardProps {
  /** The answer's value — required inside a `ChoiceGroup`. */
  value?: string;
  title: ReactNode;
  description?: ReactNode;
  /** A short tag after the title ("Recommended"), drawn as a small primary Badge. */
  badge?: ReactNode;
  /**
   * A leading glyph on a 36px disc. It leads the row top-aligned; the row
   * keeps its padding and the indicator stays on the title line.
   */
  icon?: ReactNode;
  /**
   * The mark on the right. `auto`: a checkbox in a multiple group, none
   * everywhere else — in a single group the card itself shows the choice
   * (border + wash) and still carries `role="radio"` / `aria-checked`.
   * `radio` is an explicit opt-in.
   * @default 'auto'
   */
  indicator?: ChoiceCardIndicator;
  disabled?: boolean;
  /** Standalone only (no group): the chosen state. */
  selected?: boolean;
  /** Standalone only: called with the next chosen state. */
  onSelect?: (selected: boolean) => void;
  /** Standalone checkbox card: the checkbox's form name. */
  name?: string;
  className?: string;
  /**
   * Content revealed INSIDE the card while it is chosen (an "Other" answer's
   * field). The card's head becomes the button, with `aria-expanded`.
   */
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
}

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

const choiceCardHeadVariants = cva(
  cn(
    'flex w-full items-start gap-2.5 px-3 py-2.5',
    'rounded-[inherit] border-0 bg-transparent text-left',
    'cursor-pointer focus-visible:outline-none disabled:cursor-not-allowed'
  )
);

/* The indicator sits on the right, centred on the TITLE line:
   (20px line − 18px control) / 2 = 1px — with or without a leading icon. */
const choiceCardIndicatorVariants = cva('order-1 mt-px flex-none');

const choiceCardIconVariants = cva(
  cn(
    'flex size-9 flex-none items-center justify-center rounded-full',
    'bg-brand-primary/5 text-ink-highlight [&_svg]:size-4'
  )
);

function ChoiceCardBody({
  title,
  badge,
  description,
}: Pick<ChoiceCardProps, 'title' | 'badge' | 'description'>) {
  return (
    <span
      data-slot="choice-card-body"
      className="flex min-w-0 flex-1 flex-col gap-0.5"
    >
      <span
        data-slot="choice-card-title"
        className="inline-flex items-center gap-2 font-medium text-ink-primary text-sm"
      >
        {title}
        {badge ? (
          <Badge variant="primary" size="sm">
            {badge}
          </Badge>
        ) : null}
      </span>
      {description ? (
        <span
          data-slot="choice-card-description"
          className="font-normal text-ink-secondary text-xs"
        >
          {description}
        </span>
      ) : null}
    </span>
  );
}

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
  indicator = 'auto',
  disabled: disabledProp = false,
  selected = false,
  onSelect,
  name,
  className,
  children,
  ref,
}: ChoiceCardProps) {
  const group = useChoiceGroup();
  const on = group ? value != null && group.isOn(value) : selected;
  const disabled = disabledProp || Boolean(group?.disabled);
  const mark: ChoiceCardIndicator =
    indicator !== 'auto'
      ? indicator
      : group?.type === 'multiple'
        ? 'checkbox'
        : 'none';
  const state = on ? 'checked' : 'unchecked';

  const choose = (next?: boolean) => {
    if (disabled) return;
    if (group) {
      if (value != null) group.choose(value);
    } else {
      onSelect?.(next ?? !on);
    }
  };

  const iconNode = icon ? (
    <span
      data-slot="choice-card-icon"
      aria-hidden="true"
      className={cn(choiceCardIconVariants())}
    >
      {icon}
    </span>
  ) : null;
  const body = (
    <ChoiceCardBody title={title} badge={badge} description={description} />
  );
  const indicatorClass = cn(choiceCardIndicatorVariants());

  if (mark === 'checkbox') {
    return (
      // biome-ignore lint/a11y/noLabelWithoutControl: the Checkbox inside is the control — a `<button role="checkbox">`, which a label wraps and activates
      <label
        ref={ref as Ref<HTMLLabelElement>}
        data-slot="choice-card"
        data-state={state}
        data-disabled={disabled ? '' : undefined}
        className={cn(
          choiceCardVariants({
            layout: 'label',
            selected: on,
            disabled,
          }),
          className
        )}
      >
        {iconNode}
        {body}
        <Checkbox
          checked={on}
          disabled={disabled}
          name={group ? group.name : name}
          className={indicatorClass}
          onCheckedChange={(next) => choose(Boolean(next))}
        />
      </label>
    );
  }

  const radioRole = group?.type === 'single';
  const expandable = children != null;
  const radioMark =
    mark === 'radio' ? (
      <span
        data-slot="choice-card-indicator"
        data-state={state}
        aria-hidden="true"
        className={cn(radioVariants(), 'pointer-events-none', indicatorClass)}
      >
        {on ? (
          <span className={cn(radioIndicatorVariants())}>
            <Circle className="fill-current text-current" />
          </span>
        ) : null}
      </span>
    ) : null;

  const buttonProps = {
    type: 'button' as const,
    disabled: disabled || undefined,
    tabIndex:
      radioRole && value != null
        ? group.tabStop(value)
          ? 0
          : -1
        : radioRole
          ? -1
          : undefined,
    role: radioRole ? ('radio' as const) : undefined,
    'aria-checked': radioRole ? on : undefined,
    'aria-pressed': !radioRole && !expandable && on ? true : undefined,
    'aria-expanded': expandable ? on : undefined,
    onClick: () => choose(),
  };

  if (expandable) {
    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        data-slot="choice-card"
        data-state={state}
        data-disabled={disabled ? '' : undefined}
        className={cn(
          choiceCardVariants({
            layout: 'expandable',
            selected: on,
            disabled,
          }),
          className
        )}
      >
        <button
          {...buttonProps}
          data-slot="choice-card-head"
          className={cn(choiceCardHeadVariants())}
        >
          {iconNode}
          {body}
          {radioMark}
        </button>
        {on ? (
          <div
            data-slot="choice-card-content"
            className="flex flex-col gap-2 px-3 pb-3"
          >
            {children}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <button
      {...buttonProps}
      ref={ref as Ref<HTMLButtonElement>}
      data-slot="choice-card"
      data-state={state}
      data-disabled={disabled ? '' : undefined}
      className={cn(
        choiceCardVariants({
          layout: 'button',
          selected: on,
          disabled,
        }),
        className
      )}
    >
      {iconNode}
      {body}
      {radioMark}
    </button>
  );
}

ChoiceCard.displayName = 'ChoiceCard';

export {
  ChoiceCard,
  choiceCardHeadVariants,
  choiceCardIconVariants,
  choiceCardIndicatorVariants,
  choiceCardVariants,
};
