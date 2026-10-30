'use client';

/**
 * The developers' `ActivityTray` folder, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/ActivityTray/ActivityTrayContent.tsx`, import paths alone changed.
 * The Before half of the ActivityTray page renders this folder, so it is the
 * tray the developer storybook ships, not a drawing of it. What it imports
 * from outside the folder is the live package's. Not edited: replace the
 * folder whole when the base moves.
 */

import type { ReactNode } from 'react';
import { CollapsibleContent } from '../../../src/components/Collapsible';
import { ScrollShadow } from '../../../src/components/ScrollShadow';
import { cn } from '../../../src/lib/utils';

interface ActivityTrayContentProps {
  open: boolean;
  contentClassName?: string;
  children?: ReactNode;
}

const ActivityTrayContent = ({
  open,
  contentClassName,
  children,
}: ActivityTrayContentProps) => (
  <CollapsibleContent
    forceMount
    hidden={!open}
    data-slot="activity-tray-content"
    className={cn('overflow-hidden', 'border-stroke border-t')}
  >
    <ScrollShadow className={cn('max-h-56', contentClassName)}>
      <ul data-slot="activity-tray-list" className="flex flex-col p-1">
        {children}
      </ul>
    </ScrollShadow>
  </CollapsibleContent>
);

ActivityTrayContent.displayName = 'ActivityTrayContent';

export { ActivityTrayContent, type ActivityTrayContentProps };
