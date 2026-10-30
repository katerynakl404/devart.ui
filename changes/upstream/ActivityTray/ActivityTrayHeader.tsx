'use client';

/**
 * The developers' `ActivityTray` folder, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/ActivityTray/ActivityTrayHeader.tsx`, import paths alone changed.
 * The Before half of the ActivityTray page renders this folder, so it is the
 * tray the developer storybook ships, not a drawing of it. What it imports
 * from outside the folder is the live package's. Not edited: replace the
 * folder whole when the base moves.
 */

import { ChevronDown, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { CollapsibleTrigger } from '../../../src/components/Collapsible';
import { IconButton } from '../../../src/components/IconButton';
import { Typography } from '../../../src/components/Typography';
import { cn } from '../../../src/lib/utils';

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

          <span
            aria-hidden="true"
            className={cn(
              'inline-flex size-7 shrink-0 items-center justify-center rounded pressed:bg-state-pressed text-ink-body transition-all duration-100 hover:bg-state-hover [&_svg]:size-3.5 [&_svg]:stroke-[1.5]'
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
          className="shrink-0 [&_svg]:size-3.5 [&_svg]:stroke-[1.5]"
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
