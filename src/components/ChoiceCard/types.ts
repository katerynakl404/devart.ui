import type { CSSProperties, ReactNode, Ref } from 'react';

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
  /** Standalone checkbox card: the checkbox's form name. */
  name?: string;
  className?: string;
  /**
   * Lands on the card's root in every shape — the button, the checkbox label
   * or the expandable wrapper, never the expandable head. For per-item custom
   * properties such as a stagger index.
   */
  style?: CSSProperties;
  /**
   * Content revealed INSIDE the card while it is chosen (an "Other" answer's
   * field). The card's head becomes the button — `aria-expanded` outside a
   * single group, `role="radio"` inside one.
   */
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
  /** Standalone only: called with the next chosen state. */
  onSelect?: (selected: boolean) => void;
}

interface ChoiceGroupBaseProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** Disables every card in the group. */
  disabled?: boolean;
  /** Form name — reaches the checkboxes of a `multiple` group. */
  name?: string;
  /**
   * Merged after the base `grid grid-cols-1 gap-2` with `cn()`, so a consumer
   * class replaces it: `sm:grid-cols-3 sm:gap-3`, `grid-cols-2`.
   */
  className?: string;
  /** Lands on the group wrapper. */
  style?: CSSProperties;
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
