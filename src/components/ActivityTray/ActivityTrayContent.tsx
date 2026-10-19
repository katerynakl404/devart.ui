'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { CollapsibleContent } from '../Collapsible';
import { ScrollShadow } from '../ScrollShadow';

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
    {/* 14rem cap, the kit's `.upl-list`. `scrollbar-thin` is the fork's
        `UploadTray` list: a 10px track holding a 4px thumb. */}
    <ScrollShadow className={cn('scrollbar-thin max-h-56', contentClassName)}>
      <ul data-slot="activity-tray-list" className="flex flex-col p-1">
        {children}
      </ul>
    </ScrollShadow>
  </CollapsibleContent>
);

ActivityTrayContent.displayName = 'ActivityTrayContent';

export { ActivityTrayContent, type ActivityTrayContentProps };
