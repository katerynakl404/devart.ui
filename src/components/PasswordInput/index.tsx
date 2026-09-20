'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import type { ComponentProps, Ref } from 'react';
import { useCallback, useState } from 'react';
import { cn } from '../../lib/utils';
import { IconButton, type IconButtonProps } from '../IconButton';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  type InputGroupProps,
} from '../InputGroup';

type PasswordToggleButtonProps = Pick<
  IconButtonProps,
  'rounded' | 'size' | 'variant' | 'className'
>;

/**
 * The trailing toggle's glyph has to match the leading lock, and the two are
 * sized by different mechanisms: the lock is a direct child of the addon, so
 * `[&>svg]:size-*` reaches it, while the toggle's glyph sits inside an
 * IconButton whose own `[&_svg]:size-*` out-specifies any class written on the
 * icon. Passing the step to the button is what makes both ends of the field
 * agree; writing `size-4` on the icon is what used to make them disagree.
 *
 * The kit is firmer about this: a control docked in a field is a sub-part of
 * the field (`.igrp-act`) carrying the field's glyph step and no surface of its
 * own, not an entry on the IconButton ladder. `variant="transparent"` gets the
 * "no surface" half; this map gets the "field's glyph step" half.
 */
const TOGGLE_SIZE_BY_FIELD_SIZE = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const satisfies Record<string, IconButtonProps['size']>;

interface PasswordInputClassNames {
  startAddonClassName?: string;
  endAddonClassName?: string;
  inputClassName?: string;
}

/**
 * {@link InputGroup} options (`size`, `variant`) plus native input props.
 * `size` is the {@link InputGroup} control size, not the HTML `input` width attribute.
 * Use `className` on the group shell; set `aria-invalid` on the field for error styling.
 */
export interface PasswordInputProps
  extends Omit<ComponentProps<'input'>, 'type' | 'size'> {
  ref?: Ref<HTMLInputElement>;
  toggleHideLabel?: string;
  toggleShowLabel?: string;
  inputGroupProps?: InputGroupProps;
  toggleButtonProps?: PasswordToggleButtonProps;
  classNames?: PasswordInputClassNames;
}

/**
 * Password field using {@link InputGroup} + addons: lock icon, input, visibility toggle.
 * Pass `ref` and field handlers as for a native input (e.g. react-hook-form `register`).
 */
function PasswordInput({
  className,
  ref,
  toggleHideLabel = 'Hide password',
  toggleShowLabel = 'Show password',
  inputGroupProps,
  toggleButtonProps,
  classNames,
  ...inputProps
}: PasswordInputProps) {
  const { size, variant, isInvalid, errorText, label, inputId } =
    inputGroupProps || {};

  const { startAddonClassName, endAddonClassName, inputClassName } =
    classNames || {};

  const [visible, setVisible] = useState(false);

  const onToggleVisible = useCallback(
    () => setVisible((visible) => !visible),
    []
  );

  return (
    <InputGroup
      className={cn('min-w-0', className)}
      size={size}
      variant={variant}
      isInvalid={isInvalid}
      errorText={errorText}
      label={label}
      inputId={inputId}
    >
      <InputGroupAddon align="inline-start" className={startAddonClassName}>
        {/* No size class: the addon is the parent, so its `[&>svg]:size-*` step
            sizes this glyph, and any value written here would lose to it
            anyway. The field decides how big its own icons are. */}
        <Lock aria-hidden className="shrink-0" />
      </InputGroupAddon>

      <InputGroupInput
        ref={ref}
        {...inputProps}
        type={visible ? 'text' : 'password'}
        className={inputClassName}
      />

      <InputGroupAddon align="inline-end" className={endAddonClassName}>
        <IconButton
          aria-label={visible ? toggleHideLabel : toggleShowLabel}
          rounded="sm"
          size={TOGGLE_SIZE_BY_FIELD_SIZE[size ?? 'md']}
          type="button"
          variant="transparent"
          {...toggleButtonProps}
          onClick={onToggleVisible}
        >
          {/* Icon names the action: Eye reveals, EyeOff hides. */}
          {visible ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
        </IconButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

export type { PasswordToggleButtonProps };
export { PasswordInput };
