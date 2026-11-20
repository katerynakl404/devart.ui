'use client';

import { X } from 'lucide-react';
import { IconButton } from '../IconButton';

const DEFAULT_DISMISS_LABEL = 'Dismiss';

interface FileDismissProps {
  onDismiss: () => void;
  label?: string;
}

export const FileDismiss = ({
  onDismiss,
  label = DEFAULT_DISMISS_LABEL,
}: FileDismissProps) => {
  return (
    <IconButton
      variant="transparent"
      size="sm"
      onClick={onDismiss}
      aria-label={label}
    >
      <X className="size-4 text-ink-secondary" />
    </IconButton>
  );
};
