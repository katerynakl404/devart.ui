'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { RequiredMark } from '../RequiredMark';
import { Typography } from '../Typography';

type FieldSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * The label's rung for each field size: it steps down with the control, so a
 * `sm` field in a form is not topped by a `md` field's label.
 *
 * Kept here rather than inside one field, because three components draw this
 * label — `InputGroup` (and everything built on it: `Select`, `PasswordInput`,
 * `SearchInput`), `Autocomplete` and `TextArea`. Two of them used to hardcode
 * 14 and only the third stepped, so an Autocomplete beside an Input at `sm`
 * carried a label two pixels larger than its neighbour's.
 *
 * It stops at 14 while the field's own text goes on to 16 at `lg` and `xl` —
 * the ladder as the package has always drawn it (2026-11-17: leave it there).
 */
const fieldLabelSizeClass: Record<FieldSize, string> = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
  xl: 'text-sm',
};

export interface FieldLabelProps
  extends Omit<ComponentPropsWithoutRef<'label'>, 'children'> {
  /** The field's size; picks the label's rung. */
  size?: FieldSize;
  /**
   * The asterisk after the label, and nothing else — the field itself decides
   * what `required` means for its own input. Off unless a form asks for it:
   * one product marks what is required, the other marks what is optional.
   */
  required?: boolean;
  children?: ReactNode;
}

export function FieldLabel({
  size = 'md',
  required = false,
  className,
  children,
  ...props
}: FieldLabelProps) {
  return (
    <Typography
      element="label"
      variant="span"
      textColor="body"
      weight="medium"
      className={cn(fieldLabelSizeClass[size], className)}
      {...props}
    >
      {children}
      {required ? <RequiredMark /> : null}
    </Typography>
  );
}
