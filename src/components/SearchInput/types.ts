import type { CSSProperties, KeyboardEvent, ReactNode, Ref } from 'react';
import type { VariantProps } from '../../lib/cva';
import type { inputGroupVariants } from '../InputGroup';

interface SearchInputProps<T extends { id: string } = { id: string }> {
  placeholder: string;
  value?: string;
  clearLabel?: string;
  size?: VariantProps<typeof inputGroupVariants>['size'];
  className?: string;
  ref?: Ref<HTMLInputElement>;
  onValueChange?: (value: string) => void;
  onClear?: () => void;

  // Extensions — optional, so every call written without them is unchanged.

  /** The field's surface: `outline` (on Surface/Card) or `primary` (on Surface/Page). */
  variant?: VariantProps<typeof inputGroupVariants>['variant'];
  /** Accessible name for the field; without it the placeholder names it. */
  'aria-label'?: string;
  autoFocus?: boolean;
  /** Disables the field; the clear button is not shown while disabled. */
  disabled?: boolean;
  /** On the `<input>`. */
  id?: string;
  /** On the field itself (the `InputGroup`) — for a transition of its height, say. */
  style?: CSSProperties;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;

  /**
   * What matches the query — given by the caller, already matched: the field
   * does not filter. With it the field offers the matches in a list under
   * itself while something is typed; without it the field is a plain search.
   */
  results?: readonly T[];
  /** The name a result is read and announced by; it fills the field when picked. */
  getResultLabel?: (result: T) => string;
  /** The row; the name alone when omitted. */
  renderResult?: (result: T) => ReactNode;
  /** A result was picked; its name is in the field. */
  onSelect?: (result: T) => void;
  /** Said when the query matches nothing. Defaults to `No matches`. */
  emptyText?: ReactNode;
  /** Rows before the list scrolls; a fraction leaves part of the next showing. Defaults to 5.5. */
  maxVisibleResults?: number;
}

export type { SearchInputProps };
