'use client';

import { RefreshCcw } from 'lucide-react';
import { IconButton } from '../IconButton';

interface FileRetryProps {
  onRetry: () => void;
  /** Accessible name for the control. Names the action, not the file row. */
  label?: string;
}

export const FileRetry = ({
  onRetry,
  label = 'Retry upload',
}: FileRetryProps) => {
  return (
    <IconButton
      aria-label={label}
      variant="transparent"
      size="sm"
      onClick={onRetry}
    >
      <RefreshCcw className="size-4 text-ink-secondary" />
    </IconButton>
  );
};
