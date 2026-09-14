'use client';

import { X } from 'lucide-react';
import { IconButton } from '../IconButton';

interface FileDismissProps {
  onDismiss: () => void;
  /** Accessible name for the control. Names the action, not the file row. */
  label?: string;
}

export const FileDismiss = ({
  onDismiss,
  label = 'Remove file',
}: FileDismissProps) => {
  return (
    <IconButton
      aria-label={label}
      variant="transparent"
      size="sm"
      onClick={onDismiss}
    >
      <X className="size-4 text-ink-secondary" />
    </IconButton>
  );
};
