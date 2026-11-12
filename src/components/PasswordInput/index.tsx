'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import type { ComponentProps, Ref } from 'react';
import { useCallback, useState } from 'react';
import { cva } from '../../lib/cva';
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

// The field's glyph step, as the lock
const passwordToggleVariants = cva('', {
  variants: {
    size: {
      xs: '[&_svg]:size-3.5',
      sm: '[&_svg]:size-4',
      md: '[&_svg]:size-4',
      lg: '[&_svg]:size-5',
      xl: '[&_svg]:size-5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

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
          size="sm"
          type="button"
          variant="transparent"
          {...toggleButtonProps}
          className={cn(
            passwordToggleVariants({ size }),
            toggleButtonProps?.className
          )}
          onClick={onToggleVisible}
        >
          {visible ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
        </IconButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

export type { PasswordToggleButtonProps };
export { PasswordInput, passwordToggleVariants };
