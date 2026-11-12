import type { ReactNode, Ref } from 'react';
import type { VariantProps } from '../../lib/cva';
import type { inputGroupVariants } from '../InputGroup';

interface SearchInputProps<T extends { id: string } = { id: string }> {
  placeholder: string;
  value?: string;
  clearLabel?: string;
  size?: VariantProps<typeof inputGroupVariants>['size'];
  variant?: VariantProps<typeof inputGroupVariants>['variant'];
  className?: string;
  ref?: Ref<HTMLInputElement>;
  'aria-label'?: string;
  autoFocus?: boolean;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  /** The matches, already filtered by the caller; listed while something is typed. */
  results?: readonly T[];
  /** Defaults to the result's `label`. */
  getResultLabel?: (result: T) => string;
  /** The row; the label alone when omitted. */
  renderResult?: (result: T) => ReactNode;
  /** A result was picked; its label is now in the field. */
  onSelect?: (result: T) => void;
  /** Defaults to `No matches`. */
  emptyText?: ReactNode;
}

export type { SearchInputProps };
