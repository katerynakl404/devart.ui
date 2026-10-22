import type { ReactNode } from 'react';
import { Typography } from '../Typography';
import { TextAreaCount } from './TextAreaCount';

interface TextAreaFooterProps {
  errorId?: string;
  errorText?: string;
  hintId?: string;
  hintText?: ReactNode;
  countId?: string;
  length: number;
  limit?: number;
  disabled?: boolean;
}

export const TextAreaFooter = ({
  errorId,
  errorText,
  hintId,
  hintText,
  countId,
  length,
  limit,
  disabled = false,
}: TextAreaFooterProps) => {
  const errorElement = errorId && errorText && (
    <Typography
      id={errorId}
      variant="span"
      textColor="destructive"
      // Helper text is text-xs / medium in Feedback/Red — matches Input.
      className="min-w-0 flex-1 font-medium text-fb-red-text text-xs"
    >
      {errorText}
    </Typography>
  );

  // The hint takes the left half only while there is no error: an error about
  // what you just typed outranks advice about what to type.
  const hintElement = !errorElement && hintId && hintText && (
    // `textStyle="body12"`, not `variant="span"`: the legacy variant is
    // `font-medium text-sm`, so `text-xs` beside it corrected the size and left
    // the weight at 500. A hint is body copy; the named scale says so in one
    // token.
    <Typography
      id={hintId}
      element="span"
      textStyle="body12"
      textColor="secondary"
      className="min-w-0 flex-1"
    >
      {hintText}
    </Typography>
  );

  if (!errorElement && !hintElement && !countId) {
    return null;
  }

  return (
    <div className="flex items-start justify-between gap-4">
      {errorElement || hintElement}

      {countId && (
        <TextAreaCount
          id={countId}
          length={length}
          limit={limit}
          disabled={disabled}
        />
      )}
    </div>
  );
};
