import type { ReactNode } from 'react';
import { Typography } from '../Typography';
import { TextAreaCount } from './TextAreaCount';

export interface TextAreaFooterMessage {
  id: string;
  content: ReactNode;
  tone: 'error' | 'hint';
}

interface TextAreaFooterProps {
  message?: TextAreaFooterMessage;
  countId?: string;
  length: number;
  limit?: number;
  disabled?: boolean;
}

export const TextAreaFooter = ({
  message,
  countId,
  length,
  limit,
  disabled = false,
}: TextAreaFooterProps) => {
  if (!message && !countId) {
    return null;
  }

  const isError = message?.tone === 'error';

  return (
    <div className="flex items-start justify-between gap-4">
      {message && (
        <Typography
          id={message.id}
          variant="span"
          weight={isError ? 'medium' : 'normal'}
          textColor={isError ? 'destructive' : 'secondary'}
          className="min-w-0 flex-1 text-xs"
        >
          {message.content}
        </Typography>
      )}

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
