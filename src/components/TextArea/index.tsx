'use client';

import type { ComponentProps, ReactNode, Ref } from 'react';
import { useCallback, useId, useLayoutEffect, useRef } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { FieldLabel } from '../InputGroup/FieldLabel';
import { TextAreaFooter } from './TextAreaFooter';
import { useValueLength } from './use-value-length';

export const textAreaVariants = cva(
  cn(
    'block w-full min-w-0 resize-none',
    'outline-none',

    // Disabled keeps its pointer events, so a tooltip on it still works
    'disabled:cursor-not-allowed',
    'disabled:border-stroke disabled:bg-state-disabled',
    'disabled:text-ink-inactive disabled:placeholder:text-ink-inactive'
  ),
  {
    variants: {
      variant: {
        outline: cn(
          'border border-stroke bg-surface-card',
          'text-ink-primary placeholder:text-ink-inactive',

          //Transition
          'transition-[border-color,color,box-shadow]',

          //Hover state — only while the control is enabled
          'enabled:hover:border-stroke-field-hover',

          //Focus state — neutral border, no outer ring
          'focus-visible:border-input-focus'
        ),
      },
      rounded: {
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '3xl': 'rounded-3xl',
      },
      size: {
        xs: cn('px-2 py-1', 'text-xs placeholder:text-xs'),
        sm: cn('px-3 py-1.5', 'text-sm placeholder:text-sm'),
        md: cn('px-3 py-2', 'text-sm placeholder:text-sm'),
        lg: cn('px-3 py-2', 'text-base placeholder:text-base'),
        xl: cn('px-3 py-2.5', 'text-base placeholder:text-base'),
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
      rounded: 'md',
    },
  }
);

export interface TextAreaProps
  extends ComponentProps<'textarea'>,
    VariantProps<typeof textAreaVariants> {
  maxRowsBeforeScroll?: number;
  ref?: Ref<HTMLTextAreaElement>;
  label?: ReactNode;
  isInvalid?: boolean;
  errorText?: string;
  showCount?: boolean;
  softLimit?: boolean;
  /** Guidance under the field, beside the counter; an error takes its place. */
  hintText?: ReactNode;
  /** Marks the label with an asterisk and makes the field required. */
  required?: boolean;
}

const setRef = <T,>(ref: Ref<T> | undefined, value: T | null) => {
  if (!ref) {
    return;
  }

  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  ref.current = value;
};

const sanitizePositiveRowCount = (
  value: number | undefined,
  fallback: number
): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  const normalizedValue = Math.floor(value);

  return normalizedValue > 0 ? normalizedValue : fallback;
};

export const TextArea = ({
  ref,
  variant,
  size,
  rounded,
  maxRowsBeforeScroll = 15,
  rows = 8,
  value,
  defaultValue,
  className,
  id,
  label,
  isInvalid = false,
  errorText,
  showCount = false,
  softLimit = false,
  maxLength,
  disabled,
  onInput,
  hintText,
  required = false,
  ...props
}: TextAreaProps) => {
  const { 'aria-describedby': ariaDescribedBy, ...restProps } = props;

  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const resolvedId = id ?? (label ? generatedId : undefined);

  const safeMaxRowsBeforeScroll = sanitizePositiveRowCount(
    maxRowsBeforeScroll,
    15
  );

  const [length, syncLength] = useValueLength(innerRef, showCount);

  const errorId = isInvalid && errorText ? `${fieldId}-error` : undefined;
  const hintId = !errorId && hintText ? `${fieldId}-hint` : undefined;
  const countId = showCount ? `${fieldId}-count` : undefined;
  const describedBy =
    [ariaDescribedBy, errorId ?? hintId, countId].filter(Boolean).join(' ') ||
    undefined;

  const handleRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      setRef(ref, node);
    },
    [ref]
  );

  const resizeToContent = useCallback(() => {
    const element = innerRef.current;

    if (!element) {
      return;
    }

    element.style.height = 'auto';

    const computedStyle = window.getComputedStyle(element);
    const lineHeight = Number.parseFloat(computedStyle.lineHeight) || 24;
    const paddingTop = Number.parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = Number.parseFloat(computedStyle.paddingBottom) || 0;
    const borderTopWidth = Number.parseFloat(computedStyle.borderTopWidth) || 0;
    const borderBottomWidth =
      Number.parseFloat(computedStyle.borderBottomWidth) || 0;

    const maxHeight =
      lineHeight * safeMaxRowsBeforeScroll +
      paddingTop +
      paddingBottom +
      borderTopWidth +
      borderBottomWidth;

    const nextHeight = Math.min(element.scrollHeight, maxHeight);

    element.style.height = `${nextHeight}px`;
    element.style.overflowY =
      element.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [safeMaxRowsBeforeScroll]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to resize the textarea when the value changes programatically
  useLayoutEffect(() => {
    resizeToContent();
  }, [resizeToContent, value]);

  const textareaElement = (
    <textarea
      ref={handleRef}
      id={resolvedId}
      rows={rows}
      value={value}
      defaultValue={defaultValue}
      maxLength={softLimit ? undefined : maxLength}
      disabled={disabled}
      required={required}
      aria-invalid={isInvalid || undefined}
      aria-describedby={describedBy}
      onInput={(event) => {
        resizeToContent();
        syncLength();
        onInput?.(event);
      }}
      className={cn(
        textAreaVariants({ variant, size, rounded }),
        //Error — red border in every state, no bg tint, no outer ring
        isInvalid &&
          'border-input-error focus-visible:border-input-error enabled:hover:border-input-error',
        className
      )}
      {...restProps}
    />
  );

  if (!label && !errorText && !showCount && !hintText) {
    return textareaElement;
  }

  return (
    <div className="flex w-full flex-col gap-1">
      {label ? (
        <FieldLabel
          size={size ?? 'md'}
          required={required}
          htmlFor={resolvedId}
        >
          {label}
        </FieldLabel>
      ) : null}

      {textareaElement}

      <TextAreaFooter
        errorId={errorId}
        errorText={errorText}
        hintId={hintId}
        hintText={hintText}
        countId={countId}
        length={length}
        limit={maxLength}
        disabled={disabled}
      />
    </div>
  );
};
