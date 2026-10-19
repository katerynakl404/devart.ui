'use client';

import { ChevronDown, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { CollapsibleTrigger } from '../Collapsible';
import { IconButton, iconButtonVariants } from '../IconButton';
import { Typography } from '../Typography';

interface ActivityTrayHeaderProps {
  title: ReactNode;
  icon?: ReactNode;
  isCollapsible?: boolean;
  dismissLabel: string;
  toggleLabel?: string;
  onDismiss?: () => void;
}

const ActivityTrayHeader = ({
  title,
  icon,
  isCollapsible = true,
  dismissLabel,
  toggleLabel,
  onDismiss,
}: ActivityTrayHeaderProps) => {
  const headerContent = (
    <>
      {icon && (
        <span
          data-slot="activity-tray-icon"
          className="flex size-4 shrink-0 items-center justify-center text-ink-secondary [&_svg]:size-4"
        >
          {icon}
        </span>
      )}

      <Typography
        data-slot="activity-tray-title"
        variant="span"
        className="min-w-0 flex-1 truncate"
      >
        {title}
      </Typography>
    </>
  );

  return (
    <div
      data-slot="activity-tray-header"
      className="flex items-center gap-1 px-2 py-1.5"
    >
      {isCollapsible ? (
        <CollapsibleTrigger
          aria-label={toggleLabel}
          data-slot="activity-tray-trigger"
          className={cn(
            'group/activity-tray',
            'flex min-w-0 flex-1 items-center gap-2.5 pl-1',
            'cursor-pointer rounded-md border-none bg-transparent text-left',
            'font-medium text-ink-primary text-sm',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-inset'
          )}
        >
          {headerContent}

          {/* The kit draws the chevron as its own `.iconbtn.iconbtn-xs.iconbtn-tertiary`
              — 28px box, 14px glyph, `--ink-body`, the tertiary recipe — and
              the tray adds no styling of its own. So the indicator takes the
              IconButton recipe itself rather than a restatement of it. */}
          <span
            aria-hidden="true"
            className={cn(
              iconButtonVariants({ variant: 'tertiary', size: 'xs' }),
              'shrink-0'
            )}
          >
            <ChevronDown className="transition-transform duration-base group-data-[state=closed]/activity-tray:rotate-180" />
          </span>
        </CollapsibleTrigger>
      ) : (
        <div
          data-slot="activity-tray-heading"
          className="flex min-w-0 flex-1 items-center gap-2.5 pl-1 font-medium text-ink-primary text-sm"
        >
          {headerContent}
        </div>
      )}

      {onDismiss && (
        <IconButton
          aria-label={dismissLabel}
          className="shrink-0"
          data-slot="activity-tray-dismiss"
          onClick={onDismiss}
          size="xs"
          variant="tertiary"
        >
          <X aria-hidden="true" />
        </IconButton>
      )}
    </div>
  );
};

ActivityTrayHeader.displayName = 'ActivityTrayHeader';

export { ActivityTrayHeader, type ActivityTrayHeaderProps };
