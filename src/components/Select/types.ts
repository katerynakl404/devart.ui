import type { ReactNode } from 'react';
import type { VariantProps } from '../../lib/cva';
import type { selectTriggerVariants } from './SelectTrigger';

/** What `Select` reads from an option when no getter is given. */
export interface SelectOptionBase {
  id: string;
  label?: string;
  disabled?: boolean;
}

export interface SelectOption extends SelectOptionBase {
  label: string;
}

export interface SelectProps<T extends SelectOptionBase = SelectOption>
  extends VariantProps<typeof selectTriggerVariants> {
  options: readonly T[];
  /** The chosen option's `id`; `null` shows the placeholder. */
  value?: string | null;
  defaultValue?: string;

  /** The trigger's `id`, which the label points at; generated when omitted. */
  id?: string;
  /** Submits the chosen `id` with a form. */
  name?: string;
  label?: ReactNode;
  'aria-label'?: string;
  placeholder?: string;

  /** Asterisk on the label; the value can't be cleared, even with `clearable`. */
  required?: boolean;
  disabled?: boolean;
  isInvalid?: boolean;
  errorText?: string;

  /** Adds a clear button; Backspace and Delete clear too. */
  clearable?: boolean;
  clearLabel?: string;

  className?: string;

  /** Gets `null` when the value is cleared. */
  onValueChange?: (id: string | null) => void;
  /** Defaults to the option's `label`. */
  getOptionLabel?: (option: T) => string;
  getOptionDisabled?: (option: T) => boolean;
}
