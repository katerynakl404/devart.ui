'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode, Ref } from 'react';
import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';

export const textAreaVariants = cva(
  cn(
    'block w-full min-w-0 resize-none',
    'outline-none',

    //Disabled — real fill instead of opacity dimming
    'disabled:pointer-events-none disabled:cursor-not-allowed',
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

          //Hover state
          'hover:border-stroke-field-hover',

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
        // Same horizontal ladder as Button and InputGroup.
        // Type ladder: xs 12 / sm 12 / md-xl 14 - 13px is off the scale.
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
  /**
   * Shows the "used / allowed" counter under the field. Needs `maxLength`:
   * a counter without a limit has nothing to count against.
   */
  showCount?: boolean;
  /**
   * Classes for the wrapper holding the label, the field and the counter.
   *
   * Size the field from here, not from `className`: `className` lands on the
   * `textarea` itself, so a width set there shapes the field while the counter
   * stays aligned to the parent — the counter visibly detaches from the box it
   * is counting. The field is `w-full` inside this wrapper, so constraining
   * the wrapper moves the two together.
   */
  wrapperClassName?: string;
  /**
   * Standing guidance under the field — the left half of the same row the
   * counter sits in, and it yields that half to `errorText` when the field is
   * invalid, because an error about what you just typed outranks advice about
   * what to type.
   *
   * It exists because the row already did: without it a field that needs both a
   * hint and a counter has to hide the counter and rebuild the row by hand,
   * which is what every consumer with a character limit and a caveat was doing.
   */
  hintText?: ReactNode;
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
  onInput,
  id,
  label,
  isInvalid = false,
  errorText,
  showCount = false,
  wrapperClassName,
  hintText,
  maxLength,
  ...props
}: TextAreaProps) => {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const generatedId = useId();
  const resolvedId = id ?? (label ? generatedId : undefined);

  const safeMaxRowsBeforeScroll = sanitizePositiveRowCount(
    maxRowsBeforeScroll,
    15
  );

  const errorId = isInvalid && errorText ? `${resolvedId}-error` : undefined;

  // Uncontrolled fields have no value to measure, so the count is tracked here
  // and kept in sync from onInput. Controlled fields read straight off value,
  // so a programmatic change updates the counter too.
  const [uncontrolledCount, setUncontrolledCount] = useState(
    () => String(defaultValue ?? '').length
  );
  const count = value === undefined ? uncontrolledCount : String(value).length;
  const hasCount = showCount && typeof maxLength === 'number';

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
      aria-invalid={isInvalid || undefined}
      aria-describedby={errorId}
      maxLength={maxLength}
      onInput={(event) => {
        resizeToContent();
        setUncontrolledCount(event.currentTarget.value.length);
        onInput?.(event);
      }}
      className={cn(
        textAreaVariants({ variant, size, rounded }),
        //Error — red border in every state, no bg tint, no outer ring
        isInvalid &&
          'border-input-error hover:border-input-error focus-visible:border-input-error',
        className
      )}
      {...props}
    />
  );

  if (!label && !errorText && !hasCount) {
    return textareaElement;
  }

  return (
    <div className={cn('flex w-full flex-col gap-1', wrapperClassName)}>
      {/* Label is Text/Body — see InputGroup: a field label must not sit on the
          same ink step as the hint underneath it. */}
      {label ? (
        <Typography
          id={errorId}
          element="label"
          variant="span"
          textColor="body"
          weight="medium"
          htmlFor={resolvedId}
          aria-live="polite"
          className="text-sm"
        >
          {label}
        </Typography>
      ) : null}

      {textareaElement}

      {/* Error text and counter share one row under the field: both describe the
          same input, and stacking them would push the next field down by a line
          that is usually empty. The counter never wraps — it is short, and it is
          anchored to the field's right edge, not to the error text. */}
      {(isInvalid && errorText) || hasCount || hintText ? (
        <div className="flex items-start justify-between gap-4">
          {isInvalid && errorText ? (
            <Typography
              variant="span"
              textColor="destructive"
              // Helper text is text-xs / medium in Feedback/Red — matches Input.
              className="min-w-0 flex-1 font-medium text-fb-red-text text-xs"
            >
              {errorText}
            </Typography>
          ) : hintText ? (
            <Typography
              variant="span"
              textColor="secondary"
              className="min-w-0 flex-1 text-xs"
            >
              {hintText}
            </Typography>
          ) : null}

          {hasCount ? (
            <Typography
              variant="span"
              textColor="secondary"
              aria-live="polite"
              // Digits only. "0 characters / 4000 max" reads as a sentence and
              // gets re-read on every keystroke; "0/4000" is a readout — the eye
              // catches the changing number without parsing words around it.
              // tabular-nums keeps it from twitching as the width of digits changes.
              className="ms-auto shrink-0 whitespace-nowrap text-xs tabular-nums"
            >
              {count}/{maxLength}
            </Typography>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
