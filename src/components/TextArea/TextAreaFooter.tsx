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
      className="min-w-0 flex-1 font-medium text-fb-red-text text-xs"
    >
      {errorText}
    </Typography>
  );

  const hintElement = !errorElement && hintId && hintText && (
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
